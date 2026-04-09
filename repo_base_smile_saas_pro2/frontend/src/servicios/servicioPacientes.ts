import { clienteApi } from './clienteApi';

export type PacienteApi = {
  id: string;
  nombre_completo: string;
  telefono?: string;
  email?: string;
  ciudad?: string;
  estado_paciente?: string;
  casos_clinicos?: any[]; // Podríamos tiparlos más tarde si es necesario
  presupuestos?: any[];
};

export async function obtenerPacientes() {
  return clienteApi<PacienteApi[]>('/pacientes');
}

export async function obtenerPacientePorId(id: string) {
  return clienteApi<PacienteApi>(`/pacientes/${id}`);
}
