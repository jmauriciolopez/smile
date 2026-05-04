/**
 * Servicio de Archivos
 *
 * Sube archivos al backend vía multipart/form-data.
 * El backend decide automáticamente si persiste en disco local (dev) o S3 (prod).
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

/**
 * Sube un File/Blob al backend y devuelve la URL persistida.
 * Funciona tanto con archivos del input[type=file] como con dataURLs convertidos.
 */
export async function subirArchivo(
  archivo: File | Blob,
  tipo: TipoArchivo,
  nombreOriginal?: string,
): Promise<ArchivoSubido> {
  const formData = new FormData();

  if (archivo instanceof File) {
    formData.append("archivo", archivo, archivo.name);
  } else {
    // Blob (ej: captura de cámara convertida desde dataURL)
    const nombre = nombreOriginal || `captura_${Date.now()}.jpg`;
    formData.append("archivo", archivo, nombre);
  }

  // Usamos fetch directamente porque clienteApi fuerza Content-Type: application/json
  const token = localStorage.getItem("token");
  const baseUrl = import.meta.env.VITE_API_URL || "/api";

  const response = await fetch(`${baseUrl}/archivos/subir?tipo=${tipo}`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(error.message || "Error al subir archivo");
  }

  return response.json() as Promise<ArchivoSubido>;
}

/**
 * Convierte un dataURL (base64) a Blob para poder subirlo como archivo.
 */
export function dataUrlABlob(dataUrl: string): Blob {
  const [header, data] = dataUrl.split(",");
  const mimeMatch = header.match(/:(.*?);/);
  const mime = mimeMatch ? mimeMatch[1] : "image/jpeg";
  const binary = atob(data);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new Blob([bytes], { type: mime });
}

/** Elimina un archivo del storage */
export async function eliminarArchivo(
  archivoId: string,
): Promise<{ eliminado: boolean }> {
  return clienteApi(`/archivos/${archivoId}`, { method: "DELETE" });
}
