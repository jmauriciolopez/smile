/**
 * FACE & LIP DETECTION ENGINE PRO
 * Tipos TypeScript derivados del spec face_lip.md
 */

export interface Vec2 {
  x: number;
  y: number;
}

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface LipData {
  /** Puntos del contorno superior del labio */
  contornoSuperior: Vec2[];
  /** Puntos del contorno inferior del labio */
  contornoInferior: Vec2[];
  /** Contorno completo unificado (para generar máscara Path2D) */
  contornoCompleto: Vec2[];
  /** Bounding box del área labial */
  boundingBox: Rect;
  /** Eje central horizontal del labio en grados */
  ejeLabial: number;
}

export interface Landmarks {
  ojos: {
    izquierdo: Vec2;
    derecho: Vec2;
  };
  nariz: Vec2;
  boca: {
    centro: Vec2;
    ancho: number;
  };
  menton: Vec2;
}

export interface TransformFacial {
  /** Ángulo de inclinación del eje facial (grados) */
  rotation: number;
  /** Factor de escala relativo al canvas */
  scale: number;
  /** Offset de traslación al canvas */
  translation: Vec2;
}

/** Salida completa del pipeline facial */
export interface FaceData {
  boundingBox: Rect;
  landmarks: Landmarks;
  lips: LipData;
  transform: TransformFacial;
}

export interface InputImagen {
  src: string;
  width: number;
  height: number;
}

/**
 * Expande un bounding box por un factor dado (ej. 1.2 = 20% más grande).
 * Usado para generar la zona de sonrisa a partir del bounding box labial.
 */
export function expandirBoundingBox(bb: Rect, factor: number): Rect {
  const dw = bb.width * (factor - 1);
  const dh = bb.height * (factor - 1);
  return {
    x: bb.x - dw / 2,
    y: bb.y - dh / 2,
    width: bb.width + dw,
    height: bb.height + dh,
  };
}

/** Normaliza un punto desde coordenadas de imagen a coordenadas de canvas */
export function normalizar(
  punto: Vec2,
  imagen: InputImagen,
  canvas: { width: number; height: number },
): Vec2 {
  return {
    x: punto.x * (canvas.width / imagen.width),
    y: punto.y * (canvas.height / imagen.height),
  };
}

/** Genera un Path2D de máscara labial a partir del contorno completo */
export function generarMascaraLabios(lips: LipData): Path2D {
  const path = new Path2D();
  lips.contornoCompleto.forEach((p, i) => {
    if (i === 0) path.moveTo(p.x, p.y);
    else path.lineTo(p.x, p.y);
  });
  path.closePath();
  return path;
}

/**
 * Calcula el eje facial a partir de los landmarks oculares.
 * Devuelve el ángulo en grados que el vector interpupilar forma con la horizontal.
 */
export function calcularEjeFacial(landmarks: Landmarks): number {
  const { ojos } = landmarks;
  const dx = ojos.derecho.x - ojos.izquierdo.x;
  const dy = ojos.derecho.y - ojos.izquierdo.y;
  return Math.atan2(dy, dx) * (180 / Math.PI);
}
