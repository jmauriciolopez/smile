import { clienteApi } from "./clienteApi";

export type FotoApi = {
  id: string;
  caso_clinico_id: string;
  url_foto: string;
  tipo: string;
  fecha_creacion: string;
};

export async function registrarFoto(
  dto: Omit<FotoApi, "id" | "fecha_creacion">,
) {
  return clienteApi<FotoApi>("/fotos", {
    method: "POST",
    body: JSON.stringify(dto),
  });
}

export async function eliminarFoto(id: string) {
  return clienteApi<void>(`/fotos/${id}`, {
    method: "DELETE",
  });
}

export async function obtenerFotosPorCaso(casoId: string) {
  return clienteApi<FotoApi[]>(`/fotos/caso/${casoId}`);
}
