import { clienteApi } from './clienteApi';

export type DisenoApi = {
  id: string;
  caso_clinico_id: string;
  ajustes_json: string;
  url_imagen_resultado?: string;
  fecha_creacion: string;
};

export async function guardarDiseno(dto: {
  caso_clinico_id: string;
  ajustes_json: string;
  url_imagen_resultado?: string;
}) {
  return clienteApi<DisenoApi>('/disenos', {
    method: 'POST',
    body: JSON.stringify(dto),
  });
}

export async function obtenerDisenoPorCaso(casoId: string) {
  return clienteApi<DisenoApi | null>(`/disenos/caso/${casoId}`);
}
