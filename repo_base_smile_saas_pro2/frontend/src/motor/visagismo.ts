/**
 * VISAGISMO DIGITAL — Fase D
 *
 * Analiza los landmarks faciales para sugerir el preset morfológico ideal.
 * Basado en principios de Visagismo: la forma del rostro determina la
 * morfología dental más armónica.
 *
 * Formas faciales reconocidas:
 *   - Oval     → incisivos centrales amplios, laterales redondeados
 *   - Cuadrada → dientes más rectos, bordes incisales planos
 *   - Triangular → dientes más estrechos en cervical
 *   - Redonda  → dientes más alargados para estilizar
 *
 * Algoritmo:
 *   1. Calcular índice facial (ancho/alto del rostro)
 *   2. Calcular índice mandibular (ancho mandíbula / ancho pómulos)
 *   3. Calcular ángulo facial (inclinación del eje)
 *   4. Mapear a forma facial → preset sugerido
 */

import type { FaceData } from "./tipos-faciales";

// ── Tipos ─────────────────────────────────────────────────────────────────────

export type FormaFacial =
  | "oval"
  | "cuadrada"
  | "triangular"
  | "redonda"
  | "indeterminada";

export type PresetVisagismo = "natural" | "premium" | "suave";

export interface ResultadoVisagismo {
  formaFacial: FormaFacial;
  presetSugerido: PresetVisagismo;
  morfologiaDiente: "oval" | "cuadrado";
  confianza: number; // 0..1
  razonamiento: string;
  metricas: {
    indiceFacial: number; // ancho/alto
    indiceMandibular: number; // mandíbula/pómulos
    anguloFacial: number; // grados
    anchoBoca: number; // px
  };
}

// ── Análisis principal ────────────────────────────────────────────────────────

/**
 * Analiza los landmarks faciales y retorna una sugerencia morfológica.
 * Requiere que FaceData esté disponible (post-detección MediaPipe).
 */
export function analizarVisagismo(faceData: FaceData): ResultadoVisagismo {
  const { landmarks, boundingBox } = faceData;

  // ── 1. Métricas faciales ──────────────────────────────────────────────
  const anchoPomulos = boundingBox.width;
  const altoRostro = boundingBox.height;
  const anchoMandibula = Math.abs(
    landmarks.boca.ancho * 1.4, // estimación: mandíbula ≈ 1.4× ancho de boca
  );
  const anchoBoca = landmarks.boca.ancho;

  const indiceFacial = anchoPomulos > 0 ? altoRostro / anchoPomulos : 1.3;
  const indiceMandibular =
    anchoPomulos > 0 ? anchoMandibula / anchoPomulos : 0.8;
  const anguloFacial = Math.abs(faceData.transform.rotation);

  // ── 2. Clasificación de forma facial ─────────────────────────────────
  const forma = clasificarFormaFacial(indiceFacial, indiceMandibular);

  // ── 3. Mapeo a preset y morfología ───────────────────────────────────
  const { preset, morfologia, razonamiento, confianza } = mapearPreset(
    forma,
    indiceFacial,
    indiceMandibular,
    anguloFacial,
  );

  return {
    formaFacial: forma,
    presetSugerido: preset,
    morfologiaDiente: morfologia,
    confianza,
    razonamiento,
    metricas: {
      indiceFacial: +indiceFacial.toFixed(3),
      indiceMandibular: +indiceMandibular.toFixed(3),
      anguloFacial: +anguloFacial.toFixed(1),
      anchoBoca: Math.round(anchoBoca),
    },
  };
}

// ── Clasificador de forma facial ──────────────────────────────────────────────

function clasificarFormaFacial(
  indiceFacial: number,
  indiceMandibular: number,
): FormaFacial {
  // Índice facial: < 1.1 = redondo, 1.1-1.3 = oval, 1.3-1.5 = cuadrado, > 1.5 = triangular
  // Índice mandibular: > 0.85 = cuadrado, < 0.70 = triangular

  if (indiceFacial < 1.05) return "redonda";
  if (indiceFacial > 1.45) return "triangular";
  if (indiceMandibular > 0.88) return "cuadrada";
  if (indiceFacial >= 1.1 && indiceFacial <= 1.35) return "oval";
  return "indeterminada";
}

// ── Mapeo forma → preset ──────────────────────────────────────────────────────

function mapearPreset(
  forma: FormaFacial,
  indiceFacial: number,
  indiceMandibular: number,
  anguloFacial: number,
): {
  preset: PresetVisagismo;
  morfologia: "oval" | "cuadrado";
  razonamiento: string;
  confianza: number;
} {
  // Penalizar confianza si el ángulo facial es muy pronunciado (foto inclinada)
  const penalizacionAngulo = anguloFacial > 8 ? 0.15 : 0;

  switch (forma) {
    case "oval":
      return {
        preset: "premium",
        morfologia: "oval",
        razonamiento:
          "Rostro oval: morfología ideal para dientes amplios y redondeados. Preset Premium maximiza la armonía.",
        confianza: Math.max(0.1, 0.92 - penalizacionAngulo),
      };

    case "cuadrada":
      return {
        preset: "natural",
        morfologia: "cuadrado",
        razonamiento:
          "Rostro cuadrado: dientes con bordes incisales más planos y forma cuadrada equilibran la mandíbula prominente.",
        confianza: Math.max(0.1, 0.85 - penalizacionAngulo),
      };

    case "triangular":
      return {
        preset: "suave",
        morfologia: "oval",
        razonamiento:
          "Rostro triangular: dientes más estrechos y suaves en cervical para no acentuar el mentón.",
        confianza: Math.max(0.1, 0.78 - penalizacionAngulo),
      };

    case "redonda":
      return {
        preset: "premium",
        morfologia: "oval",
        razonamiento:
          "Rostro redondo: dientes más alargados y estilizados (preset Premium) para dar verticalidad al perfil.",
        confianza: Math.max(0.1, 0.8 - penalizacionAngulo),
      };

    default:
      return {
        preset: "natural",
        morfologia: "oval",
        razonamiento:
          "Forma facial no determinada con certeza. Se sugiere preset Natural como punto de partida neutro.",
        confianza: Math.max(0.1, 0.45 - penalizacionAngulo),
      };
  }
}

// ── Descripción legible de la forma facial ────────────────────────────────────

export const DESCRIPCION_FORMA: Record<FormaFacial, string> = {
  oval: "Oval — la forma más armónica, versátil para cualquier morfología dental",
  cuadrada:
    "Cuadrada — mandíbula prominente, favorece dientes con bordes planos",
  triangular:
    "Triangular — frente ancha y mentón estrecho, favorece dientes suaves",
  redonda:
    "Redonda — proporciones similares en ancho y alto, favorece dientes alargados",
  indeterminada: "No determinada — se requiere foto más clara o frontal",
};
