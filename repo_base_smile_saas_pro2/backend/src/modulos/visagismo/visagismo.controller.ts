import { Controller, Post, Get, Body, Param, UseGuards } from '@nestjs/common';
import { VisagismoService } from './visagismo.service';
import { AnalizarVisagismoDto } from './dto/analizar_visagismo.dto';
import { JwtAuthGuard } from '../autenticacion/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('visagismo')
export class VisagismoController {
  constructor(private readonly visagismoService: VisagismoService) {}

  /**
   * POST /visagismo/analizar
   * Analiza el FaceData y retorna sugerencia morfológica.
   */
  @Post('analizar')
  analizar(@Body() dto: AnalizarVisagismoDto) {
    return this.visagismoService.analizar(dto);
  }

  /**
   * GET /visagismo/caso/:casoId
   * Obtiene el último análisis de visagismo para un caso.
   */
  @Get('caso/:casoId')
  obtenerPorCaso(@Param('casoId') casoId: string) {
    return this.visagismoService.obtenerPorCaso(casoId);
  }
}
