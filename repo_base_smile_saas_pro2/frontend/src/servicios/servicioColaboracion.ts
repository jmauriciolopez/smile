/**
 * Servicio de Colaboración — Fase E
 * Gestión de sesiones de diseño colaborativo en tiempo real.
 */
import { clienteApi } from "./clienteApi";

export type RolParticipante = "odontologo" | "tecnico" | "paciente";

export interface Participante {
  id: string;
  nombre: string;
  rol: RolParticipante;
  activo: boolean;
}

export interface SesionColaboracion {
  id: string;
  codigo_sesion: string;
  caso_clinico_id: string;
  diseno_id: string;
  activa: boolean;
  participantes: Participante[];
  fecha_creacion: string;
}

/** Crea una nueva sesión de colaboración */
export async function crearSesion(dto: {
  caso_clinico_id: string;
  diseno_id: string;
}): Promise<SesionColaboracion> {
  return clienteApi<SesionColaboracion>("/colaboracion/sesiones", {
    method: "POST",
    body: JSON.stringify(dto),
  });
}

/** Une a un participante a una sesión por código */
export async function unirseASesion(dto: {
  codigo_sesion: string;
  nombre_participante: string;
  rol: RolParticipante;
}): Promise<SesionColaboracion> {
  return clienteApi<SesionColaboracion>("/colaboracion/sesiones/unirse", {
    method: "POST",
    body: JSON.stringify(dto),
  });
}

/** Obtiene el estado de una sesión por código */
export async function obtenerSesion(
  codigoSesion: string,
): Promise<SesionColaboracion> {
  return clienteApi<SesionColaboracion>(
    `/colaboracion/sesiones/${codigoSesion}`,
  );
}

/** Lista sesiones activas para un caso */
export async function listarSesionesPorCaso(
  casoId: string,
): Promise<SesionColaboracion[]> {
  return clienteApi<SesionColaboracion[]>(`/colaboracion/caso/${casoId}`);
}

/** Cierra una sesión de colaboración */
export async function cerrarSesion(
  codigoSesion: string,
): Promise<{ cerrada: boolean }> {
  return clienteApi(`/colaboracion/sesiones/${codigoSesion}`, {
    method: "DELETE",
  });
}
