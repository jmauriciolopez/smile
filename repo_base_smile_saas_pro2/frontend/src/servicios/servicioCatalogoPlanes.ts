import { clienteApi } from "./clienteApi";

export type CatalogoPlanData = {
  id: string;
  titulo: string;
  descripcion: string | null;
  monto_base: number;
  recomendada: boolean;
  activo: boolean;
};

export async function obtenerCatalogoPlanes() {
  return clienteApi<CatalogoPlanData[]>("/catalogo-planes");
}

export async function crearCatalogoPlan(data: Omit<CatalogoPlanData, "id" | "activo">) {
  return clienteApi<CatalogoPlanData>("/catalogo-planes", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function actualizarCatalogoPlan(id: string, data: Partial<CatalogoPlanData>) {
  return clienteApi<CatalogoPlanData>(`/catalogo-planes/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function eliminarCatalogoPlan(id: string) {
  return clienteApi<{ success: boolean }>(`/catalogo-planes/${id}`, {
    method: "DELETE",
  });
}
