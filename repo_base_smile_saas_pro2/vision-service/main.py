import cv2
import numpy as np
import mediapipe as mp
from fastapi import FastAPI, File, UploadFile, HTTPException, Header, Depends
from pydantic import BaseModel
from typing import List, Optional
import os
import base64

app = FastAPI(title="Smile Vision AI Service", version="1.2.0")

# Seguridad: API Key
API_KEY = os.getenv("VISION_API_KEY", "smile_secret_dev_key")

async def verify_api_key(x_api_key: str = Header(...)):
    if x_api_key != API_KEY:
        raise HTTPException(status_code=403, detail="Acceso denegado: API Key inválida")

# Inicializar MediaPipe
mp_face_mesh = mp.solutions.face_mesh
face_mesh = mp_face_mesh.FaceMesh(
    static_image_mode=True,
    max_num_faces=1,
    refine_landmarks=True,
    min_detection_confidence=0.5
)

# --- Esquemas de Datos ---

class FaceData(BaseModel):
    boundingBox: dict
    landmarks: dict
    lips: dict
    color_sugerido: str
    forma_facial: str
    segmentacion_dental: Optional[List[List[dict]]] = None # Lista de polígonos (contornos)

# --- Utilidades de Visión ---

def segmentar_dientes(img, landmarks):
    """
    Algoritmo de segmentación dental basada en color y morfología.
    Aísla la zona de los dientes dentro de la boca detectada.
    """
    h, w, _ = img.shape
    
    # 1. Obtener zona de la boca usando landmarks
    # Indices MediaPipe labios exteriores
    mouth_indices = [61, 185, 40, 39, 37, 0, 267, 269, 270, 409, 291, 375, 321, 405, 314, 17, 84, 181, 91, 146]
    points = []
    for i in mouth_indices:
        p = landmarks.landmark[i]
        points.append([int(p.x * w), int(p.y * h)])
    
    points = np.array(points)
    
    # Crear máscara de la boca
    mask_mouth = np.zeros((h, w), dtype=np.uint8)
    cv2.fillPoly(mask_mouth, [points], 255)
    
    # 2. Segmentación por color (buscar blancos/amarillos claros)
    hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
    
    # Rango para dientes (blanco/marfil) - Ajustable según iluminación
    lower_white = np.array([0, 0, 150]) 
    upper_white = np.array([180, 60, 255])
    
    mask_teeth_color = cv2.inRange(hsv, lower_white, upper_white)
    
    # Combinar: color blanco Y dentro de la boca
    mask_final = cv2.bitwise_and(mask_teeth_color, mask_mouth)
    
    # 3. Limpieza morfológica
    kernel = np.ones((3, 3), np.uint8)
    mask_final = cv2.morphologyEx(mask_final, cv2.MORPH_OPEN, kernel)
    mask_final = cv2.morphologyEx(mask_final, cv2.MORPH_CLOSE, kernel)
    
    # 4. Encontrar contornos de los dientes
    contours, _ = cv2.findContours(mask_final, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    
    poligonos = []
    for cnt in contours:
        # Filtrar contornos muy pequeños (ruido)
        if cv2.contourArea(cnt) > (w * h * 0.0005): 
            # Simplificar contorno para reducir tamaño de JSON
            epsilon = 0.002 * cv2.arcLength(cnt, True)
            approx = cv2.approxPolyDP(cnt, epsilon, True)
            
            puntos = []
            for p in approx:
                puntos.append({"x": float(p[0][0]), "y": float(p[0][1])})
            poligonos.append(puntos)
            
    return poligonos

def get_sclera_color(img, landmarks):
    h, w, _ = img.shape
    p = landmarks.landmark[362] # Ojo Izq
    cx, cy = int(p.x * w), int(p.y * h)
    roi = img[max(0, cy-5):min(h, cy+5), max(0, cx-5):min(w, cx+5)]
    if roi.size == 0: return [255, 255, 255]
    avg_color = np.mean(roi, axis=(0, 1))
    return avg_color[::-1].tolist()

def map_to_vita(rgb):
    brightness = sum(rgb) / 3
    if brightness > 225: return "BL1"
    if brightness > 205: return "BL2"
    if brightness > 185: return "A1"
    return "A2"

@app.post("/analizar", response_model=FaceData, dependencies=[Depends(verify_api_key)])
async def analizar_imagen(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        nparr = np.frombuffer(contents, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if img is None:
            raise HTTPException(status_code=400, detail="Imagen inválida")
            
        h, w, _ = img.shape
        rgb_img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        results = face_mesh.process(rgb_img)
        
        if not results.multi_face_landmarks:
            raise HTTPException(status_code=422, detail="No se detectó rostro")
            
        landmarks = results.multi_face_landmarks[0]
        
        # Bounding Box
        coords_x = [p.x for p in landmarks.landmark]
        coords_y = [p.y for p in landmarks.landmark]
        bbox = {"x": min(coords_x) * w, "y": min(coords_y) * h, "width": (max(coords_x)-min(coords_x))*w, "height": (max(coords_y)-min(coords_y))*h}
        
        # Segmentación Dental (NUEVO)
        segmentacion = segmentar_dientes(img, landmarks)
        
        # Color Match
        sclera_rgb = get_sclera_color(img, landmarks)
        color_vita = map_to_vita(sclera_rgb)
        
        # Forma Facial
        ratio = bbox["height"] / bbox["width"] if bbox["width"] > 0 else 1.0
        forma = "Alargada" if ratio > 1.35 else "Redonda" if ratio < 1.1 else "Ovalada"

        # Landmarks
        p_ojo_izq = landmarks.landmark[33]
        p_ojo_der = landmarks.landmark[263]
        p_nariz = landmarks.landmark[1]
        p_menton = landmarks.landmark[152]
        
        lip_indices = [61, 185, 40, 39, 37, 0, 267, 269, 270, 409, 291, 375, 321, 405, 314, 17, 84, 181, 91, 146]
        lips_contour = [{"x": landmarks.landmark[i].x * w, "y": landmarks.landmark[i].y * h} for i in lip_indices]

        return FaceData(
            boundingBox=bbox,
            forma_facial=forma,
            color_sugerido=color_vita,
            segmentacion_dental=segmentacion,
            landmarks={
                "ojos": {
                    "izquierdo": {"x": p_ojo_izq.x * w, "y": p_ojo_izq.y * h},
                    "derecho": {"x": p_ojo_der.x * w, "y": p_ojo_der.y * h}
                },
                "nariz": {"x": p_nariz.x * w, "y": p_nariz.y * h},
                "menton": {"x": p_menton.x * w, "y": p_menton.y * h}
            },
            lips={
                "contornoCompleto": lips_contour,
                "boundingBox": bbox # Simplificado
            }
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
