import { clienteApi } from "./clienteApi";

export type PacienteApi = {
  id: string;
  nombre_completo: string;
  telefono?: string;
  email?: string;
  ciudad?: string;
  estado_paciente?: string;
  observaciones_generales?: string;
  casos_clinicos?: any[];
  presupuestos?: any[];
};

export type CrearPacienteData = {
  nombre_completo: string;
  telefono?: string;
  email?: string;
  ciudad?: string;
  observaciones_generales?: string;
};

export type ActualizarPacienteData = Partial<CrearPacienteData>;

export async function obtenerPacientes() {
  return clienteApi<PacienteApi[]>("/pacientes");
}

export async function obtenerPacientePorId(id: string) {
  return clienteApi<PacienteApi>(`/pacientes/${id}`);
}

export async function crearPaciente(paciente: CrearPacienteData) {
  return clienteApi<PacienteApi>("/pacientes", {
    method: "POST",
    body: JSON.stringify(paciente),
  });
}

export async function actualizarPaciente(
  id: string,
  paciente: ActualizarPacienteData,
) {
  return clienteApi<PacienteApi>(`/pacientes/${id}`, {
    method: "PATCH",
    body: JSON.stringify(paciente),
  });
}
