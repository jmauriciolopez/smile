/**
 * useFaceEngine
 * Hook que conecta MediaPipe FaceLandmarker con el Blueprint del editor.
 *
 * Pipeline:
 *   Imagen → MediaPipe FaceLandmarker → FaceData → store.setFaceData()
 *   → posiciona automáticamente el bloque dental alineado al eje labial
 *
 * La librería @mediapipe/tasks-vision se carga de forma lazy (sólo cuando
 * el doctor activa "Detectar cara") para no inflar el bundle inicial.
 */

import React, { useState, useCallback, useRef } from "react";
import type { FaceData, Landmarks, LipData, Vec2 } from "./tipos-faciales";
import { calcularEjeFacial, normalizar } from "./tipos-faciales";
import { useEditorStore } from "../store/editor-sonrisa.store";
import { BIBLIOTECA_DENTAL } from "./biblioteca-dientes";

interface UseFaceEngineReturn {
  detectando: boolean;
  error: string | null;
  detectar: (imagenEl: HTMLImageElement) => Promise<void>;
  faceData: FaceData | null;
}

/* ── Índices de landmarks de MediaPipe FaceMesh relevantes ─────────────────
   Basado en la malla canónica de 478 puntos de MediaPipe.
   Refs: https://developers.google.com/mediapipe/solutions/vision/face_landmarker
─────────────────────────────────────────────────────────────────────────── */
const MP_IDX = {
  ojo_izq_externo: 33,
  ojo_der_externo: 263,
  nariz_punta: 1,
  boca_izq: 61,
  boca_der: 291,
  boca_centro_sup: 13,
  boca_centro_inf: 14,
  menton: 152,
  // Contorno labio superior (selección de 10 puntos representativos)
  labio_sup: [61, 185, 40, 39, 37, 0, 267, 269, 270, 409, 291],
  // Contorno labio inferior
  labio_inf: [61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291],
} as const;

export function useFaceEngine(): UseFaceEngineReturn {
  const [detectando, setDetectando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const landmarkerRef = useRef<any>(null);
  const store = useEditorStore();

  const inicializarMediaPipe = useCallback(async () => {
    if (landmarkerRef.current) return landmarkerRef.current;

    try {
      // Carga dinámica — el bundle sólo se descarga si el usuario activa la función
      const { FaceLandmarker, FilesetResolver } = await import(
        /* webpackChunkName: "mediapipe" */
        "@mediapipe/tasks-vision"
      );

      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm",
      );

      landmarkerRef.current = await FaceLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath:
            "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
          delegate: "GPU",
        },
        outputFaceBlendshapes: false,
        outputFacialTransformationMatrixes: true,
        runningMode: "IMAGE",
        numFaces: 1,
      });

      return landmarkerRef.current;
    } catch (e) {
      throw new Error(`No se pudo inicializar MediaPipe: ${String(e)}`);
    }
  }, []);

  const detectar = useCallback(
    async (imagenEl: HTMLImageElement) => {
      setDetectando(true);
      setError(null);

      try {
        const landmarker = await inicializarMediaPipe();
        const resultado = landmarker.detect(imagenEl);

        if (!resultado?.faceLandmarks?.length) {
          setError(
            "No se detectó ningún rostro. Intenta con una foto más clara.",
          );
          return;
        }

        const lm = resultado.faceLandmarks[0]; // primer rostro
        const iW = imagenEl.naturalWidth;
        const iH = imagenEl.naturalHeight;
        const canvas = store.canvasSize;

        /* Función auxiliar para convertir landmark normalizado a Vec2 de canvas */
        const toVec2 = (idx: number): Vec2 =>
          normalizar(
            { x: lm[idx].x * iW, y: lm[idx].y * iH },
            { src: "", width: iW, height: iH },
            canvas,
          );

        /* ── Construir Landmarks ─────────────────────────────────────────── */
        const ojIzq = toVec2(MP_IDX.ojo_izq_externo);
        const ojDer = toVec2(MP_IDX.ojo_der_externo);
        const bocaIzq = toVec2(MP_IDX.boca_izq);
        const bocaDer = toVec2(MP_IDX.boca_der);
        const bocaCentro: Vec2 = {
          x: (bocaIzq.x + bocaDer.x) / 2,
          y:
            (toVec2(MP_IDX.boca_centro_sup).y +
              toVec2(MP_IDX.boca_centro_inf).y) /
            2,
        };

        const landmarks: Landmarks = {
          ojos: { izquierdo: ojIzq, derecho: ojDer },
          nariz: toVec2(MP_IDX.nariz_punta),
          boca: { centro: bocaCentro, ancho: Math.abs(bocaDer.x - bocaIzq.x) },
          menton: toVec2(MP_IDX.menton),
        };

        /* ── Construir LipData ───────────────────────────────────────────── */
        const labioSup: Vec2[] = MP_IDX.labio_sup.map(toVec2);
        const labioInf: Vec2[] = [...MP_IDX.labio_inf].reverse().map(toVec2);
        const contornoCompleto = [...labioSup, ...labioInf];

        const xs = contornoCompleto.map((p) => p.x);
        const ys = contornoCompleto.map((p) => p.y);
        const lipBB = {
          x: Math.min(...xs),
          y: Math.min(...ys),
          width: Math.max(...xs) - Math.min(...xs),
          height: Math.max(...ys) - Math.min(...ys),
        };

        const lips: LipData = {
          contornoSuperior: labioSup,
          contornoInferior: labioInf,
          contornoCompleto,
          boundingBox: lipBB,
          ejeLabial: calcularEjeFacial(landmarks),
        };

        /* ── Construir TransformFacial ───────────────────────────────────── */
        const rotation = calcularEjeFacial(landmarks);
        const distInterocular = Math.hypot(
          ojDer.x - ojIzq.x,
          ojDer.y - ojIzq.y,
        );
        const scale = Math.min(distInterocular / 150, 1.5); // normalizar

        const faceData: FaceData = {
          boundingBox: {
            x: ojIzq.x,
            y: ojIzq.y,
            width: Math.abs(ojDer.x - ojIzq.x) * 2,
            height: Math.abs(landmarks.menton.y - ojIzq.y),
          },
          landmarks,
          lips,
          transform: {
            rotation,
            scale,
            translation: bocaCentro,
          },
        };

        /* ── Aplicar al store: reposicionar dientes alineados al eje labial */
        store.setFaceData(faceData);
        alinearDientesAlRostro(faceData, store);

        // ALINEAR GUÍAS CLÍNICAS AUTOMÁTICAMENTE
        store.moverGuia("guia-media", { x: landmarks.boca.centro.x, y: 0 });
        store.moverGuia("guia-bipupilar", {
          x: 0,
          y: (landmarks.ojos.izquierdo.y + landmarks.ojos.derecho.y) / 2,
        });
        store.moverGuia("guia-oclusal", { x: 0, y: landmarks.boca.centro.y });

        // Activar visibilidad de guías clave para el doctor
        store.toggleGuia("guia-media", true);
        store.toggleGuia("guia-bipupilar", true);
      } catch (e: any) {
        setError(e?.message ?? "Error en la detección facial.");
      } finally {
        setDetectando(false);
      }
    },
    [inicializarMediaPipe, store],
  );

  return { detectando, error, detectar, faceData: store.faceData };
}

/* ── Función de alineación dental automática ─────────────────────────────── */
function alinearDientesAlRostro(
  face: FaceData,
  store: ReturnType<typeof useEditorStore.getState>,
) {
  const { lips, transform } = face;
  const { dientes } = store;
  if (!dientes.length) return;

  // 1. Calcular el ancho relativo total de la biblioteca (aprox 5.04 para las 6 piezas)
  const anchosRelativos = dientes.map(
    (d) => BIBLIOTECA_DENTAL[d.pieza]?.anchoRelativo ?? 1.0,
  );
  const totalRelativo = anchosRelativos.reduce((a, b) => a + b, 0);

  // 2. Queremos que el bloque dental cubra el 95% del ancho de la boca
  const anchoBocaPx = lips.boundingBox.width;
  const anchoDientesObjetivo = anchoBocaPx * 0.95;

  // 3. Cálculo de escalas independientes para evitar el efecto "diente flaco"
  // Multiplicamos por un factor de corrección para ganar volumen horizontal
  const nuevaEscalaX = (anchoDientesObjetivo / totalRelativo) / 100;
  const nuevaEscalaY = nuevaEscalaX * 1.1; // Un 10% más altos para dar presencia clínica

  // 4. Posicionamiento: Centrado X y ajuste Y
  const centroMouthX = lips.boundingBox.x + lips.boundingBox.width / 2;
  
  // ALINEACIÓN CLÍNICA: Los dientes deben nacer justo en el borde inferior del labio superior.
  // Usamos el 'y' del boundingBox (que es el punto más alto de los labios) + un pequeño margen.
  const centroMouthY = lips.boundingBox.y + (lips.boundingBox.height * 0.15); 

  let cursorX = centroMouthX - anchoDientesObjetivo / 2;

  // 5. Generar el nuevo array de dientes con ARCO DE SONRISA
  const nuevosDientes = dientes.map((d, idx) => {
    const morf = BIBLIOTECA_DENTAL[d.pieza];
    const itemW = (morf?.anchoRelativo ?? 1.0) * nuevaEscalaX * 100;

    const xPos = cursorX;
    cursorX += itemW;

    // CÁLCULO DE ARCO: Los dientes de los extremos (caninos) deben estar más arriba.
    // Usamos una parábola basada en el índice (0..5), centro en 2.5
    const distAlCentro = Math.abs(idx - 2.5); // 0.5 para centrales, 1.5 para laterales, 2.5 para caninos
    const factorArco = (distAlCentro - 0.5) * (nuevaEscalaY * 20); // Ajuste proporcional a la escala
    const yConArco = centroMouthY - factorArco;

    return {
      ...d,
      transform: {
        ...d.transform,
        x: xPos,
        y: yConArco,
        scaleX: nuevaEscalaX,
        scaleY: nuevaEscalaY,
        rotation: transform.rotation,
      },
    };
  });

  // 6. Actualización única y masiva del estado
  useEditorStore.setState({ dientes: nuevosDientes });
}
