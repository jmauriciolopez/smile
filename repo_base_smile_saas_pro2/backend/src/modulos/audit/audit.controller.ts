import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuditService, TipoAccionAudit } from './audit.service';
import { JwtAuthGuard } from '../autenticacion/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('audit')
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  /**
   * GET /audit/logs
   * Consulta el audit log con filtros opcionales.
   * Solo accesible por administradores (TODO: RolesGuard en Fase F).
   */
  @Get('logs')
  consultar(
    @Query('usuario_id') usuarioId?: string,
    @Query('entidad_tipo') entidadTipo?: string,
    @Query('entidad_id') entidadId?: string,
    @Query('tipo_accion') tipoAccion?: TipoAccionAudit,
    @Query('desde') desde?: string,
    @Query('hasta') hasta?: string,
    @Query('limite') limite?: string,
  ) {
    return this.auditService.consultar({
      usuario_id: usuarioId,
      entidad_tipo: entidadTipo,
      entidad_id: entidadId,
      tipo_accion: tipoAccion,
      desde,
      hasta,
      limite: limite ? parseInt(limite, 10) : undefined,
    });
  }

  /**
   * GET /audit/exportar
   * Exporta el audit log en formato HIPAA-compliant.
   */
  @Get('exportar')
  exportar(@Query('entidad_id') entidadId?: string) {
    return this.auditService.exportar(entidadId);
  }
}
