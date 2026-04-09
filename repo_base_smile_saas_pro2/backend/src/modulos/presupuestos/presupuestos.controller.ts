import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { PresupuestosService } from './presupuestos.service';
import { CrearPresupuestoDto } from './dto/crear_presupuesto.dto';
import { ActualizarPresupuestoDto } from './dto/actualizar_presupuesto.dto';

@Controller('presupuestos')
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
