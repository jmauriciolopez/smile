import { DatosFaciales } from "../core/types";

/**
 * Motor de Visagismo Clínico — SMILE PRO.
 * Sugiere formas dentales basadas en la morfología facial.
 */
export function sugerirFormaDental(
  cara: DatosFaciales,
): "oval" | "cuadrado" | "triangular" {
  const ratio = cara.altoCara / cara.anchoCara;
  if (ratio > 1.3) return "triangular";
  if (ratio < 1.1) return "cuadrado";
  return "oval";
}
