/**
 * Servicio de Visagismo — Fase D
 * Análisis morfológico facial para sugerencia de preset dental.
 */
import { clienteApi } from "./clienteApi";

export type FormaFacial =
  | "oval"
  | "cuadrada"
  | "triangular"
  | "redonda"
  | "indeterminada";

export interface ResultadoVisagismoApi {
  caso_clinico_id: string;
  forma_facial: FormaFacial;
  preset_sugerido: string;
  morfologia: "oval" | "cuadrado";
  confianza: number;
  razonamiento: string;
  color_sugerido: string;
  vita_aproximado: string;
  fecha_analisis: string;
}

/** Envía el FaceData al backend para análisis y persistencia */
export async function analizarVisagismo(dto: {
  caso_clinico_id: string;
  face_data_json: string;
  diseno_id?: string;
}): Promise<ResultadoVisagismoApi> {
  return clienteApi<ResultadoVisagismoApi>("/visagismo/analizar", {
    method: "POST",
    body: JSON.stringify(dto),
  });
}

/** Obtiene el último análisis de visagismo para un caso */
export async function obtenerVisagismoPorCaso(
  casoId: string,
): Promise<ResultadoVisagismoApi | null> {
  return clienteApi<ResultadoVisagismoApi | null>(`/visagismo/caso/${casoId}`);
}
