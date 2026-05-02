import { Controller, Post, Get, Body, Param, UseGuards } from '@nestjs/common';
import { LaboratorioService } from './laboratorio.service';
import { EnviarLaboratorioDto, EstadoEnvioLab } from './dto/enviar_laboratorio.dto';
import { JwtAuthGuard } from '../autenticacion/guards/jwt-auth.guard';
import { IsString, IsNotEmpty } from 'class-validator';

class WebhookLaboratorioDto {
  @IsString() @IsNotEmpty() pedido_id: string;
  @IsString() @IsNotEmpty() nuevo_estado: EstadoEnvioLab;
  @IsString() @IsNotEmpty() nota: string;
}

@Controller('laboratorio')
export class LaboratorioController {
  constructor(private readonly laboratorioService: LaboratorioService) {}

  /**
   * POST /laboratorio/enviar
   * Envía un diseño al laboratorio.
   */
  @UseGuards(JwtAuthGuard)
  @Post('enviar')
  enviar(@Body() dto: EnviarLaboratorioDto) {
    return this.laboratorioService.enviar(dto);
  }

  /**
   * GET /laboratorio/pedidos/:id
   * Obtiene el estado de un pedido.
   */
  @UseGuards(JwtAuthGuard)
  @Get('pedidos/:id')
  obtenerEstado(@Param('id') id: string) {
    return this.laboratorioService.obtenerEstado(id);
  }

  /**
   * GET /laboratorio/caso/:casoId
   * Lista pedidos de un caso.
   */
  @UseGuards(JwtAuthGuard)
  @Get('caso/:casoId')
  listarPorCaso(@Param('casoId') casoId: string) {
    return this.laboratorioService.listarPorCaso(casoId);
  }

  /**
   * POST /laboratorio/webhook
   * Endpoint para recibir actualizaciones del laboratorio.
   * No requiere JWT — usa validación HMAC (TODO Fase E).
   */
  @Post('webhook')
  webhook(@Body() dto: WebhookLaboratorioDto) {
    return this.laboratorioService.actualizarEstadoWebhook(dto.pedido_id, dto.nuevo_estado, dto.nota);
  }
}
