/**
 * COLABORACION SERVICE — Stub Fase E
 *
 * Gestión de sesiones de diseño colaborativo en tiempo real.
 * Stub preparado para WebSockets (Socket.io) + Redis pub/sub.
 *
 * Implementación real (Fase E):
 *   - Instalar @nestjs/websockets, @nestjs/platform-socket.io, socket.io
 *   - Instalar ioredis para pub/sub entre instancias
 *   - Crear ColaboracionGateway (WebSocket gateway)
 *   - Persistir sesiones activas en Redis con TTL
 *   - Emitir eventos: 'diseno_actualizado', 'participante_unido', 'mensaje_chat'
 *
 * Estado actual: stub REST que simula sesiones y retorna respuestas válidas.
 */

import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CrearSesionDto, UnirseASesionDto } from './dto/crear_sesion.dto';

export interface SesionColaboracion {
  id: string;
  codigo_sesion: string;
  caso_clinico_id: string;
  diseno_id: string;
  activa: boolean;
  participantes: Participante[];
  fecha_creacion: string;
  // TODO Fase E: websocket_room_id, redis_channel
}

export interface Participante {
  id: string;
  nombre: string;
  rol: string;
  activo: boolean;
}

// Almacenamiento en memoria (stub) — en Fase E: Redis
const sesionesActivas = new Map<string, SesionColaboracion>();

@Injectable()
export class ColaboracionService {
  private readonly logger = new Logger(ColaboracionService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * STUB: Crea una nueva sesión de colaboración.
   * En Fase E real: crear room en Socket.io + canal Redis.
   */
  async crearSesion(dto: CrearSesionDto, _usuarioId: string): Promise<SesionColaboracion> {
    this.logger.log(`[STUB] Creando sesión de colaboración para caso: ${dto.caso_clinico_id}`);

    // Verificar que el caso existe
    const caso = await this.prisma.casoClinico.findUnique({
      where: { id: dto.caso_clinico_id },
    });
    if (!caso) throw new NotFoundException('Caso clínico no encontrado');

    const codigoSesion = `SMILE-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    const sesionId = `ses_${Date.now()}`;

    const sesion: SesionColaboracion = {
      id: sesionId,
      codigo_sesion: codigoSesion,
      caso_clinico_id: dto.caso_clinico_id,
      diseno_id: dto.diseno_id,
      activa: true,
      participantes: [],
      fecha_creacion: new Date().toISOString(),
    };

    sesionesActivas.set(codigoSesion, sesion);

    // TODO Fase E: await redisClient.set(`sesion:${codigoSesion}`, JSON.stringify(sesion), 'EX', 3600)
    // TODO Fase E: socketServer.to(codigoSesion).emit('sesion_creada', sesion)

    return sesion;
  }

  /**
   * STUB: Une a un participante a una sesión existente.
   * En Fase E real: emitir evento WebSocket 'participante_unido'.
   */
  async unirseASesion(dto: UnirseASesionDto): Promise<SesionColaboracion> {
    this.logger.log(`[STUB] Uniéndose a sesión: ${dto.codigo_sesion}`);

    const sesion = sesionesActivas.get(dto.codigo_sesion);
    if (!sesion) throw new NotFoundException(`Sesión ${dto.codigo_sesion} no encontrada o expirada`);

    const participante: Participante = {
      id: `part_${Date.now()}`,
      nombre: dto.nombre_participante,
      rol: dto.rol,
      activo: true,
    };

    sesion.participantes.push(participante);

    // TODO Fase E: socketServer.to(dto.codigo_sesion).emit('participante_unido', participante)

    return sesion;
  }

  /**
   * STUB: Obtiene el estado actual de una sesión.
   */
  async obtenerSesion(codigoSesion: string): Promise<SesionColaboracion> {
    const sesion = sesionesActivas.get(codigoSesion);
    if (!sesion) throw new NotFoundException(`Sesión ${codigoSesion} no encontrada`);
    return sesion;
  }

  /**
   * STUB: Cierra una sesión de colaboración.
   * En Fase E real: emitir 'sesion_cerrada' y limpiar Redis.
   */
  async cerrarSesion(codigoSesion: string): Promise<{ cerrada: boolean }> {
    this.logger.log(`[STUB] Cerrando sesión: ${codigoSesion}`);

    const sesion = sesionesActivas.get(codigoSesion);
    if (sesion) {
      sesion.activa = false;
      sesionesActivas.delete(codigoSesion);
    }

    // TODO Fase E: await redisClient.del(`sesion:${codigoSesion}`)
    // TODO Fase E: socketServer.to(codigoSesion).emit('sesion_cerrada')

    return { cerrada: true };
  }

  /**
   * STUB: Lista sesiones activas para un caso.
   */
  async listarPorCaso(casoClinicoId: string): Promise<SesionColaboracion[]> {
    return Array.from(sesionesActivas.values()).filter((s) => s.caso_clinico_id === casoClinicoId && s.activa);
  }
}
