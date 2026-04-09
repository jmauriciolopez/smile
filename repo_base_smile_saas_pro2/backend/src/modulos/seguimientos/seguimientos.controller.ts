import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { SeguimientosService } from './seguimientos.service';
import { CrearSeguimientoDto } from './dto/crear-seguimiento.dto';

@Controller('seguimientos')
export class SeguimientosController {
  constructor(private readonly seguimientosService: SeguimientosService) {}

  @Post()
  crear(@Body() dto: CrearSeguimientoDto) {
    return this.seguimientosService.crear(dto);
  }

  @Get('presupuesto/:id')
  porPresupuesto(@Param('id') id: string) {
    return this.seguimientosService.porPresupuesto(id);
  }

  @Delete(':id')
  eliminar(@Param('id') id: string) {
    return this.seguimientosService.eliminar(id);
  }
}
