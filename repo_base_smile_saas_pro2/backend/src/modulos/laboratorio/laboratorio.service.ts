/**
 * LABORATORIO SERVICE — Stub Fase E
 *
 * Envío de diseños a laboratorios certificados con tracking de estado.
 * Stub preparado para integración con API de proveedores CAD/CAM.
 *
 * Implementación real (Fase E):
 *   - Integrar con API del laboratorio (REST o EDI)
 *   - Subir archivo .smile a S3 y enviar URL firmada al lab
 *   - Webhook del laboratorio para actualizar estado del pedido
 *   - Notificaciones push al doctor cuando el lab confirma recepción
 *
 * Estado actual: stub que simula el flujo completo con IDs de tracking.
 */

import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { EnviarLaboratorioDto, EstadoEnvioLab } from './dto/enviar_laboratorio.dto';

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

// Almacenamiento en memoria (stub) — en Fase E: tabla pedidos_laboratorio en DB
const pedidosActivos = new Map<string, PedidoLaboratorio>();

@Injectable()
export class LaboratorioService {
  private readonly logger = new Logger(LaboratorioService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * STUB: Envía un diseño al laboratorio.
   * En Fase E real: POST a API del laboratorio + guardar en DB.
   */
  async enviar(dto: EnviarLaboratorioDto): Promise<PedidoLaboratorio> {
    this.logger.log(`[STUB] Enviando diseño ${dto.diseno_id} al laboratorio`);

    // Verificar que el diseño existe
    const diseno = await this.prisma.disenoSonrisa.findUnique({
      where: { id: dto.diseno_id },
    });
    if (!diseno) throw new NotFoundException('Diseño no encontrado');

    const pedidoId = `ped_${Date.now()}`;
    const numeroPedido = `LAB-${new Date().getFullYear()}-${Math.floor(Math.random() * 9000 + 1000)}`;

    // Fecha estimada: 5 días hábiles
    const fechaEstimada = new Date();
    fechaEstimada.setDate(fechaEstimada.getDate() + 7);

    const pedido: PedidoLaboratorio = {
      id: pedidoId,
      diseno_id: dto.diseno_id,
      caso_clinico_id: dto.caso_clinico_id,
      laboratorio_id: dto.laboratorio_id ?? 'lab_default',
      estado: EstadoEnvioLab.ENVIADO,
      numero_pedido: numeroPedido,
      observaciones: dto.observaciones ?? '',
      url_archivo: dto.url_archivo_smile ?? '',
      fecha_envio: new Date().toISOString(),
      fecha_estimada: fechaEstimada.toISOString(),
      historial: [
        { estado: EstadoEnvioLab.ENVIADO, fecha: new Date().toISOString(), nota: 'Pedido enviado al laboratorio' },
      ],
    };

    pedidosActivos.set(pedidoId, pedido);

    // TODO Fase E: await laboratorioApiClient.post('/pedidos', { diseno, archivo_smile_url })
    // TODO Fase E: await this.prisma.pedidoLaboratorio.create({ data: pedido })
    // TODO Fase E: await notificacionesService.enviar(doctor, 'Pedido enviado al laboratorio')

    return pedido;
  }

  /**
   * STUB: Obtiene el estado de un pedido.
   */
  async obtenerEstado(pedidoId: string): Promise<PedidoLaboratorio> {
    const pedido = pedidosActivos.get(pedidoId);
    if (!pedido) throw new NotFoundException(`Pedido ${pedidoId} no encontrado`);
    return pedido;
  }

  /**
   * STUB: Lista pedidos de un caso.
   */
  async listarPorCaso(casoClinicoId: string): Promise<PedidoLaboratorio[]> {
    return Array.from(pedidosActivos.values()).filter((p) => p.caso_clinico_id === casoClinicoId);
  }

  /**
   * STUB: Webhook del laboratorio para actualizar estado.
   * En Fase E real: validar firma HMAC del webhook antes de procesar.
   */
  async actualizarEstadoWebhook(
    pedidoId: string,
    nuevoEstado: EstadoEnvioLab,
    nota: string,
  ): Promise<PedidoLaboratorio> {
    this.logger.log(`[STUB] Webhook laboratorio: pedido ${pedidoId} → ${nuevoEstado}`);

    const pedido = pedidosActivos.get(pedidoId);
    if (!pedido) throw new NotFoundException(`Pedido ${pedidoId} no encontrado`);

    pedido.estado = nuevoEstado;
    pedido.historial.push({ estado: nuevoEstado, fecha: new Date().toISOString(), nota });

    // TODO Fase E: await notificacionesService.enviar(doctor, `Pedido actualizado: ${nuevoEstado}`)

    return pedido;
  }
}
