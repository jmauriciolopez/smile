/**
 * Servicio de Archivos — Fase D
 * Gestión de archivos pesados con Object Storage (S3/GCS stub).
 */
import { clienteApi } from "./clienteApi";

export type TipoArchivo =
  | "imagen_diseno"
  | "foto_clinica"
  | "archivo_smile"
  | "ficha_tecnica"
  | "documento_firma";

export interface ArchivoSubido {
  id: string;
  url: string;
  url_cdn: string;
  nombre: string;
  tipo: TipoArchivo;
  tamano_bytes: number;
  fecha: string;
}

export interface UrlSubida {
  url_subida: string;
  archivo_id: string;
}

/** Solicita una URL presignada para subida directa al storage */
export async function generarUrlSubida(dto: {
  nombre_original: string;
  tipo: TipoArchivo;
  caso_clinico_id?: string;
  diseno_id?: string;
}): Promise<UrlSubida> {
  return clienteApi<UrlSubida>("/archivos/url-subida", {
    method: "POST",
    body: JSON.stringify(dto),
  });
}

/** Confirma que el archivo fue subido y registra su metadata */
export async function confirmarSubida(
  archivoId: string,
  dto: { nombre_original: string; tipo: TipoArchivo },
): Promise<ArchivoSubido> {
  return clienteApi<ArchivoSubido>(`/archivos/${archivoId}/confirmar`, {
    method: "POST",
    body: JSON.stringify(dto),
  });
}

/** Obtiene la URL CDN de un archivo */
export async function obtenerUrlArchivo(
  archivoId: string,
): Promise<{ url: string; url_cdn: string }> {
  return clienteApi(`/archivos/${archivoId}/url`);
}

/** Elimina un archivo del storage */
export async function eliminarArchivo(
  archivoId: string,
): Promise<{ eliminado: boolean }> {
  return clienteApi(`/archivos/${archivoId}`, { method: "DELETE" });
}
