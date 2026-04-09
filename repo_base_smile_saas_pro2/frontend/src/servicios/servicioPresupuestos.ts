import { clienteApi } from './clienteApi';

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
};

export async function obtenerPresupuestos() {
  return clienteApi<PresupuestoApi[]>('/presupuestos');
}

export async function obtenerPresupuestoPorId(id: string) {
  return clienteApi<PresupuestoApi>(`/presupuestos/${id}`);
}
