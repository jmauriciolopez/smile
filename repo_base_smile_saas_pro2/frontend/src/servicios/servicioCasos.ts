import { clienteApi } from './clienteApi';

export type CasoClinicoApi = {
  id: string;
  paciente_id: string;
  usuario_responsable_id?: string;
  titulo: string;
  motivo_consulta?: string;
  estado_caso: string;
  fecha_creacion: string;
  paciente?: {
    nombre_completo: string;
  };
};

export async function obtenerCasos() {
  return clienteApi<CasoClinicoApi[]>('/casos');
}

export async function obtenerCasoPorId(id: string) {
  return clienteApi<CasoClinicoApi>(`/casos/${id}`);
}
