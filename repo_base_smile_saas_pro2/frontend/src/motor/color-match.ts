/**
 * COLOR MATCH — Diferencial Premium
 *
 * Analiza el color de la esclera del ojo en la imagen para sugerir
 * el tono de blanco más natural para el diseño dental.
 *
 * Principio: la esclera sana tiene un blanco ligeramente cálido/neutro.
 * Los dientes deben armonizar con ese tono, no ser más blancos que la esclera.
 *
 * Pipeline:
 *   1. Extraer región de la esclera usando landmarks oculares
 *   2. Muestrear píxeles en esa región (canvas 2D)
 *   3. Calcular color promedio (RGB)
 *   4. Convertir a tono dental sugerido
 *   5. Retornar hex + descripción clínica
 */

import type { FaceData } from "./tipos-faciales";

// ── Tipos ─────────────────────────────────────────────────────────────────────

export interface ResultadoColorMatch {
  /** Color hex sugerido para el material base del diente */
  colorSugerido: string;
  /** Luminosidad de la esclera (0..255) */
  luminosidadEsclera: number;
  /** Temperatura de color: 'cálido' | 'neutro' | 'frío' */
  temperatura: "cálido" | "neutro" | "frío";
  /** Descripción clínica del tono sugerido */
  descripcion: string;
  /** Escala Vita aproximada */
  vitaAproximado: string;
}

// ── Función principal ─────────────────────────────────────────────────────────

/**
 * Analiza el color de la esclera en la imagen y sugiere el tono dental.
 * Requiere la imagen cargada en un HTMLImageElement y FaceData disponible.
 */
export async function analizarColorMatch(
  imagen: HTMLImageElement,
  faceData: FaceData,
  canvasSize: { width: number; height: number },
): Promise<ResultadoColorMatch> {
  // Crear canvas offscreen para muestrear píxeles
  const canvas = document.createElement("canvas");
  canvas.width = imagen.naturalWidth;
  canvas.height = imagen.naturalHeight;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(imagen, 0, 0);

  // Escala de canvas a imagen natural
  const escalaX = imagen.naturalWidth / canvasSize.width;
  const escalaY = imagen.naturalHeight / canvasSize.height;

  // Extraer región de la esclera (zona interna del ojo izquierdo)
  const ojIzq = faceData.landmarks.ojos.izquierdo;
  const ojDer = faceData.landmarks.ojos.derecho;

  // Muestrear ambas esclerras y promediar
  const muestraIzq = muestrearEsclera(
    ctx,
    ojIzq.x * escalaX,
    ojIzq.y * escalaY,
    12 * escalaX,
  );
  const muestraDer = muestrearEsclera(
    ctx,
    ojDer.x * escalaX,
    ojDer.y * escalaY,
    12 * escalaX,
  );

  const r = Math.round((muestraIzq.r + muestraDer.r) / 2);
  const g = Math.round((muestraIzq.g + muestraDer.g) / 2);
  const b = Math.round((muestraIzq.b + muestraDer.b) / 2);

  return calcularSugerencia(r, g, b);
}

// ── Muestreo de píxeles ───────────────────────────────────────────────────────

function muestrearEsclera(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  radio: number,
): { r: number; g: number; b: number } {
  // Muestrear una grilla de puntos en la región de la esclera
  const muestras: number[][] = [];
  const paso = Math.max(1, Math.floor(radio / 3));

  for (let dx = -radio; dx <= radio; dx += paso) {
    for (let dy = -radio; dy <= radio; dy += paso) {
      if (dx * dx + dy * dy > radio * radio) continue;
      const px = Math.round(cx + dx);
      const py = Math.round(cy + dy);
      try {
        const data = ctx.getImageData(px, py, 1, 1).data;
        // Filtrar píxeles muy oscuros (pupila/iris) y muy saturados (piel)
        const luminosidad = (data[0] + data[1] + data[2]) / 3;
        if (luminosidad > 160) {
          muestras.push([data[0], data[1], data[2]]);
        }
      } catch {
        // CORS o fuera de bounds — ignorar
      }
    }
  }

  if (muestras.length === 0) {
    // Fallback: esclera blanca estándar
    return { r: 245, g: 243, b: 238 };
  }

  const r = Math.round(
    muestras.reduce((s, m) => s + m[0], 0) / muestras.length,
  );
  const g = Math.round(
    muestras.reduce((s, m) => s + m[1], 0) / muestras.length,
  );
  const b = Math.round(
    muestras.reduce((s, m) => s + m[2], 0) / muestras.length,
  );

  return { r, g, b };
}

// ── Cálculo de sugerencia dental ──────────────────────────────────────────────

function calcularSugerencia(
  r: number,
  g: number,
  b: number,
): ResultadoColorMatch {
  const luminosidad = Math.round((r + g + b) / 3);

  // Temperatura: comparar canal rojo vs azul
  const temperatura: "cálido" | "neutro" | "frío" =
    r - b > 12 ? "cálido" : b - r > 12 ? "frío" : "neutro";

  // Ajustar el color dental: ligeramente más blanco que la esclera
  // pero respetando la temperatura de color
  const factorBrillo = 1.08; // 8% más brillante que la esclera
  const dr = Math.min(255, Math.round(r * factorBrillo));
  const dg = Math.min(255, Math.round(g * factorBrillo));
  const db = Math.min(255, Math.round(b * factorBrillo));

  const colorHex = rgbAHex(dr, dg, db);

  // Escala Vita aproximada basada en luminosidad
  const vita =
    luminosidad > 230
      ? "B1"
      : luminosidad > 215
        ? "A1"
        : luminosidad > 200
          ? "A2"
          : luminosidad > 185
            ? "B2"
            : luminosidad > 170
              ? "A3"
              : "A3.5";

  const descripcion =
    temperatura === "cálido"
      ? `Esclera con tono cálido (amarillento). Se sugiere blanco cálido ${vita} para máxima armonía.`
      : temperatura === "frío"
        ? `Esclera con tono frío (azulado). Se sugiere blanco neutro-frío ${vita} para no contrastar.`
        : `Esclera con tono neutro. Se sugiere blanco natural ${vita}, el más versátil.`;

  return {
    colorSugerido: colorHex,
    luminosidadEsclera: luminosidad,
    temperatura,
    descripcion,
    vitaAproximado: vita,
  };
}

function rgbAHex(r: number, g: number, b: number): string {
  return "#" + [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("");
}
