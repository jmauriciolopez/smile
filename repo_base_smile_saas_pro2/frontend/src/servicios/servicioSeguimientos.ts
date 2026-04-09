import { clienteApi } from './clienteApi';

export type SeguimientoApi = {
  id: string;
  presupuesto_id: string;
  comentario: string;
  proxima_accion?: string;
  fecha_accion?: string;
  fecha_creacion: string;
};

export async function crearSeguimiento(dto: Omit<SeguimientoApi, 'id' | 'fecha_creacion'>) {
  return clienteApi<SeguimientoApi>('/seguimientos', {
    method: 'POST',
    body: JSON.stringify(dto),
  });
}

export async function obtenerSeguimientosPorPresupuesto(presupuestoId: string) {
  return clienteApi<SeguimientoApi[]>(`/seguimientos/presupuesto/${presupuestoId}`);
}

export async function eliminarSeguimiento(id: string) {
  return clienteApi<void>(`/seguimientos/${id}`, {
    method: 'DELETE',
  });
}
