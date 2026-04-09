import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { PresupuestosService } from './presupuestos.service';
import { CrearPresupuestoDto } from './dto/crear_presupuesto.dto';
import { ActualizarPresupuestoDto } from './dto/actualizar_presupuesto.dto';
import { JwtAuthGuard } from '../autenticacion/guards/jwt-auth.guard';

@Controller('presupuestos')
@UseGuards(JwtAuthGuard)
export class PresupuestosController {
  constructor(private readonly presupuestosService: PresupuestosService) {}

  @Get()
  obtenerTodos() {
    return this.presupuestosService.obtenerTodos();
  }

  @Get(':id')
  obtenerPorId(@Param('id') id: string) {
    return this.presupuestosService.obtenerPorId(id);
  }

  @Post()
  crear(@Body() dto: CrearPresupuestoDto) {
    return this.presupuestosService.crear(dto);
  }

  @Patch(':id')
  actualizar(@Param('id') id: string, @Body() dto: ActualizarPresupuestoDto) {
    return this.presupuestosService.actualizar(id, dto);
  }
}
