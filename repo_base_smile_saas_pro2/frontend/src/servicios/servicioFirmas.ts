/**
 * Servicio de Firmas Digitales — Fase F
 * Firma y aprobación de diseños con Chain of Custody.
 */
import { clienteApi } from "./clienteApi";

export type EstadoFirma = "firmado" | "aprobado" | "revocado";
export type RolFirmante = "odontologo" | "tecnico" | "director";

export interface DocumentoFirma {
  id: string;
  diseno_id: string;
  caso_clinico_id: string;
  firmado_por: string;
  rol_firmante: RolFirmante;
  hash_diseno: string;
  firma_stub: string;
  estado: EstadoFirma;
  observaciones: string;
  aprobado_por: string | null;
  timestamp_firma: string;
  timestamp_aprobacion: string | null;
}

/** Firma un diseño */
export async function firmarDiseno(dto: {
  diseno_id: string;
  caso_clinico_id: string;
  firmado_por: string;
  rol_firmante: RolFirmante;
  hash_diseno: string;
  observaciones?: string;
}): Promise<DocumentoFirma> {
  return clienteApi<DocumentoFirma>("/firmas", {
    method: "POST",
    body: JSON.stringify(dto),
  });
}

/** Aprueba una firma existente */
export async function aprobarFirma(dto: {
  firma_id: string;
  aprobado_por: string;
}): Promise<DocumentoFirma> {
  return clienteApi<DocumentoFirma>("/firmas/aprobar", {
    method: "POST",
    body: JSON.stringify(dto),
  });
}

/** Obtiene la firma de un diseño */
export async function obtenerFirmaPorDiseno(
  disenoId: string,
): Promise<DocumentoFirma | null> {
  return clienteApi<DocumentoFirma | null>(`/firmas/diseno/${disenoId}`);
}

/** Verifica la integridad de una firma */
export async function verificarFirma(
  firmaId: string,
  hashActual: string,
): Promise<{ valida: boolean; motivo: string }> {
  return clienteApi(
    `/firmas/${firmaId}/verificar?hash=${encodeURIComponent(hashActual)}`,
  );
}
