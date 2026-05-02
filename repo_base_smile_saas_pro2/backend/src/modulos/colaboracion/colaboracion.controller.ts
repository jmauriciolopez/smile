import { Controller, Post, Get, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ColaboracionService } from './colaboracion.service';
import { CrearSesionDto, UnirseASesionDto } from './dto/crear_sesion.dto';
import { JwtAuthGuard } from '../autenticacion/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('colaboracion')
export class ColaboracionController {
  constructor(private readonly colaboracionService: ColaboracionService) {}

  /**
   * POST /colaboracion/sesiones
   * Crea una nueva sesión de diseño colaborativo.
   */
  @Post('sesiones')
  crearSesion(@Body() dto: CrearSesionDto, @Request() req: any) {
    return this.colaboracionService.crearSesion(dto, req.user?.id ?? 'anonimo');
  }

  /**
   * POST /colaboracion/sesiones/unirse
   * Une a un participante a una sesión existente por código.
   */
  @Post('sesiones/unirse')
  unirseASesion(@Body() dto: UnirseASesionDto) {
    return this.colaboracionService.unirseASesion(dto);
  }

  /**
   * GET /colaboracion/sesiones/:codigo
   * Obtiene el estado actual de una sesión.
   */
  @Get('sesiones/:codigo')
  obtenerSesion(@Param('codigo') codigo: string) {
    return this.colaboracionService.obtenerSesion(codigo);
  }

  /**
   * GET /colaboracion/caso/:casoId
   * Lista sesiones activas para un caso.
   */
  @Get('caso/:casoId')
  listarPorCaso(@Param('casoId') casoId: string) {
    return this.colaboracionService.listarPorCaso(casoId);
  }

  /**
   * DELETE /colaboracion/sesiones/:codigo
   * Cierra una sesión de colaboración.
   */
  @Delete('sesiones/:codigo')
  cerrarSesion(@Param('codigo') codigo: string) {
    return this.colaboracionService.cerrarSesion(codigo);
  }
}
