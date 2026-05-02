import { clienteApi } from "./clienteApi";

export type PresupuestoApi = {
  id: string;
  paciente_id: string;
  caso_clinico_id?: string;
  estado_presupuesto: string;
  monto_total_estimado: number;
  cantidad_cuotas: number;
  fecha_creacion: string;
  paciente?: {
    nombre_completo: string;
  };
  caso_clinico?: {
    titulo: string;
  };
  opciones?: Array<{
    id: string;
    titulo: string;
    descripcion?: string;
    monto: number;
    recomendada: boolean;
  }>;
  seguimientos?: any[];
};

export type CrearPresupuestoData = {
  paciente_id: string;
  caso_clinico_id?: string;
  monto_total_estimado: number;
  cantidad_cuotas: number;
};

export type ActualizarPresupuestoData = Partial<CrearPresupuestoData> & {
  estado_presupuesto?: string;
};

export async function obtenerPresupuestos() {
  return clienteApi<PresupuestoApi[]>("/presupuestos");
}

export async function obtenerPresupuestoPorId(id: string) {
  return clienteApi<PresupuestoApi>(`/presupuestos/${id}`);
}

export async function crearPresupuesto(data: CrearPresupuestoData) {
  return clienteApi<PresupuestoApi>("/presupuestos", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function actualizarPresupuesto(
  id: string,
  data: ActualizarPresupuestoData,
) {
  return clienteApi<PresupuestoApi>(`/presupuestos/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}
