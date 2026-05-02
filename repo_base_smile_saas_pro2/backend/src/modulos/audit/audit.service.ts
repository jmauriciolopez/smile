/**
 * AUDIT SERVICE — Stub Fase F
 *
 * Registro detallado de acciones técnicas/clínicas para HIPAA/GDPR.
 * Stub preparado para almacenamiento inmutable en DB + exportación.
 *
 * Implementación real (Fase F):
 *   - Tabla audit_logs con índices por usuario, entidad, fecha
 *   - Logs inmutables (sin UPDATE/DELETE permitido)
 *   - Exportación en formato HIPAA-compliant (JSON/CSV)
 *   - Retención configurable (mínimo 6 años HIPAA)
 *   - Alertas automáticas por accesos inusuales
 *
 * Estado actual: stub que registra en memoria y log de consola.
 */

import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export enum TipoAccionAudit {
  // Autenticación
  LOGIN_EXITOSO = 'LOGIN_EXITOSO',
  LOGIN_FALLIDO = 'LOGIN_FALLIDO',
  LOGOUT = 'LOGOUT',
  // Datos clínicos
  ACCESO_PACIENTE = 'ACCESO_PACIENTE',
  ACCESO_CASO = 'ACCESO_CASO',
  ACCESO_DISENO = 'ACCESO_DISENO',
  MODIFICACION_DISENO = 'MODIFICACION_DISENO',
  EXPORTACION_DISENO = 'EXPORTACION_DISENO',
  // Firma digital
  FIRMA_DISENO = 'FIRMA_DISENO',
  APROBACION_DISENO = 'APROBACION_DISENO',
  // Laboratorio
  ENVIO_LABORATORIO = 'ENVIO_LABORATORIO',
  // Administración
  CREACION_USUARIO = 'CREACION_USUARIO',
  CAMBIO_ROL = 'CAMBIO_ROL',
}

export interface EntradaAudit {
  id: string;
  tipo_accion: TipoAccionAudit;
  usuario_id: string;
  entidad_tipo: string;
  entidad_id: string;
  descripcion: string;
  ip_origen: string;
  metadata: Record<string, any>;
  timestamp: string;
}

// Eliminado: registrosAudit en memoria

@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Registra una acción en el audit log.
   * Diseñado para ser llamado desde cualquier servicio.
   */
  async registrar(
    tipoAccion: TipoAccionAudit,
    datos: {
      usuario_id: string;
      entidad_tipo: string;
      entidad_id: string;
      descripcion: string;
      ip_origen?: string;
      metadata?: Record<string, any>;
    },
  ): Promise<any> {
    const entrada = await this.prisma.auditLog.create({
      data: {
        tipo_accion: tipoAccion,
        usuario_id: datos.usuario_id,
        entidad_tipo: datos.entidad_tipo,
        entidad_id: datos.entidad_id,
        descripcion: datos.descripcion,
        ip_origen: datos.ip_origen ?? 'desconocida',
        metadata: datos.metadata ? JSON.stringify(datos.metadata) : null,
      },
    });

    this.logger.log(
      `[AUDIT] ${entrada.tipo_accion} | usuario:${entrada.usuario_id} | ${entrada.entidad_tipo}:${entrada.entidad_id} | ${entrada.descripcion}`,
    );

    return entrada;
  }

  /**
   * Consulta el audit log con filtros.
   * En Fase F real: query paginada a DB con índices.
   */
  async consultar(filtros: {
    usuario_id?: string;
    entidad_tipo?: string;
    entidad_id?: string;
    tipo_accion?: TipoAccionAudit;
    desde?: string;
    hasta?: string;
    limite?: number;
  }): Promise<any[]> {
    return this.prisma.auditLog.findMany({
      where: {
        usuario_id: filtros.usuario_id,
        entidad_tipo: filtros.entidad_tipo,
        entidad_id: filtros.entidad_id,
        tipo_accion: filtros.tipo_accion,
        fecha_creacion: {
          gte: filtros.desde ? new Date(filtros.desde) : undefined,
          lte: filtros.hasta ? new Date(filtros.hasta) : undefined,
        },
      },
      orderBy: { fecha_creacion: 'desc' },
      take: filtros.limite ?? 100,
    });
  }

  /**
   * Exporta el audit log en formato JSON para cumplimiento HIPAA.
   */
  async exportar(entidadId?: string): Promise<{ registros: any[]; total: number; exportado_en: string }> {
    const registros = await this.prisma.auditLog.findMany({
      where: entidadId ? { entidad_id: entidadId } : {},
      orderBy: { fecha_creacion: 'desc' },
    });

    return {
      registros,
      total: registros.length,
      exportado_en: new Date().toISOString(),
    };
  }
}
