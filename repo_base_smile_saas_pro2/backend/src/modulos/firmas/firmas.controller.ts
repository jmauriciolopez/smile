import { Controller, Post, Get, Body, Param, Query, UseGuards } from '@nestjs/common';
import { FirmasService } from './firmas.service';
import { CrearFirmaDto, AprobarFirmaDto } from './dto/crear_firma.dto';
import { JwtAuthGuard } from '../autenticacion/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('firmas')
export class FirmasController {
  constructor(private readonly firmasService: FirmasService) {}

  /**
   * POST /firmas
   * Firma un diseño y genera el documento de firma.
   */
  @Post()
  firmar(@Body() dto: CrearFirmaDto) {
    return this.firmasService.firmar(dto);
  }

  /**
   * POST /firmas/aprobar
   * Aprueba una firma existente.
   */
  @Post('aprobar')
  aprobar(@Body() dto: AprobarFirmaDto) {
    return this.firmasService.aprobar(dto);
  }

  /**
   * GET /firmas/diseno/:disenoId
   * Obtiene la firma de un diseño.
   */
  @Get('diseno/:disenoId')
  obtenerPorDiseno(@Param('disenoId') disenoId: string) {
    return this.firmasService.obtenerPorDiseno(disenoId);
  }

  /**
   * GET /firmas/:id/verificar?hash=...
   * Verifica la integridad de una firma comparando el hash actual.
   */
  @Get(':id/verificar')
  verificar(@Param('id') id: string, @Query('hash') hash: string) {
    return this.firmasService.verificar(id, hash);
  }
}
