import { clienteApi } from "./clienteApi";

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
  fotos?: Array<{
    id: string;
    url_foto: string;
    tipo: string;
    fecha_creacion: string;
  }>;
  notas?: Array<{
    id: string;
    contenido: string;
    fecha_creacion: string;
  }>;
  presupuestos?: any[];
};

export type CrearCasoData = {
  paciente_id: string;
  titulo: string;
  motivo_consulta?: string;
  usuario_responsable_id?: string;
};

export type ActualizarCasoData = Partial<CrearCasoData> & {
  estado_caso?: string;
};

export async function obtenerCasos() {
  return clienteApi<CasoClinicoApi[]>("/casos");
}

export async function obtenerCasoPorId(id: string) {
  return clienteApi<CasoClinicoApi>(`/casos/${id}`);
}

export async function crearCaso(caso: CrearCasoData) {
  return clienteApi<CasoClinicoApi>("/casos", {
    method: "POST",
    body: JSON.stringify(caso),
  });
}

export async function actualizarCaso(id: string, caso: ActualizarCasoData) {
  return clienteApi<CasoClinicoApi>(`/casos/${id}`, {
    method: "PATCH",
    body: JSON.stringify(caso),
  });
}
