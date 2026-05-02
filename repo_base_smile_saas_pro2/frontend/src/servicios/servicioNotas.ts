import { clienteApi } from "./clienteApi";

export type NotaApi = {
  id: string;
  caso_clinico_id: string;
  contenido: string;
  fecha_creacion: string;
};

export async function crearNota(dto: Omit<NotaApi, "id" | "fecha_creacion">) {
  return clienteApi<NotaApi>("/notas", {
    method: "POST",
    body: JSON.stringify(dto),
  });
}

export async function eliminarNota(id: string) {
  return clienteApi<void>(`/notas/${id}`, {
    method: "DELETE",
  });
}

export async function obtenerNotasPorCaso(casoId: string) {
  return clienteApi<NotaApi[]>(`/notas/caso/${casoId}`);
}
