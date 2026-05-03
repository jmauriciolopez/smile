import { GeometriaDental } from "../../core/types";

/**
 * Motor Anatómico — SMILE PRO.
 * Centraliza el conocimiento de la nomenclatura dental y morfología.
 */
export class AnatomyEngine {
  /**
   * Retorna el tipo de morfología basado en el número de pieza (ISO/FDI).
   */
  static getTipoMorfologia(pieza: number): GeometriaDental["tipo"] {
    const p = Math.abs(pieza);
    if ([11, 21, 31, 41].includes(p)) return "incisivo_central";
    if ([12, 22, 32, 42].includes(p)) return "incisivo_lateral";
    if ([13, 23, 33, 43].includes(p)) return "canino";
    return "incisivo_central";
  }

  /**
   * Retorna el nombre clínico de la pieza.
   */
  static getNombreClinico(pieza: number): string {
    const tipo = this.getTipoMorfologia(pieza);
    return tipo.replace("_", " ").toUpperCase();
  }
}
