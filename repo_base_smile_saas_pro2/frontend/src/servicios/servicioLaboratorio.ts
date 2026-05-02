/**
 * Servicio de Laboratorio — Fase E
 * Envío de diseños a laboratorios con tracking de estado.
 */
import { clienteApi } from "./clienteApi";

export type EstadoEnvioLab =
  | "pendiente"
  | "enviado"
  | "recibido"
  | "en_proceso"
  | "completado"
  | "rechazado";

export interface PedidoLaboratorio {
  id: string;
  diseno_id: string;
  caso_clinico_id: string;
  laboratorio_id: string;
  estado: EstadoEnvioLab;
  numero_pedido: string;
  observaciones: string;
  url_archivo: string;
  fecha_envio: string;
  fecha_estimada: string;
  historial: { estado: string; fecha: string; nota: string }[];
}

/** Envía un diseño al laboratorio */
export async function enviarAlLaboratorio(dto: {
  diseno_id: string;
  caso_clinico_id: string;
  laboratorio_id?: string;
  observaciones?: string;
  url_archivo_smile?: string;
}): Promise<PedidoLaboratorio> {
  return clienteApi<PedidoLaboratorio>("/laboratorio/enviar", {
    method: "POST",
    body: JSON.stringify(dto),
  });
}

/** Obtiene el estado de un pedido */
export async function obtenerEstadoPedido(
  pedidoId: string,
): Promise<PedidoLaboratorio> {
  return clienteApi<PedidoLaboratorio>(`/laboratorio/pedidos/${pedidoId}`);
}

/** Lista pedidos de un caso */
export async function listarPedidosPorCaso(
  casoId: string,
): Promise<PedidoLaboratorio[]> {
  return clienteApi<PedidoLaboratorio[]>(`/laboratorio/caso/${casoId}`);
}
