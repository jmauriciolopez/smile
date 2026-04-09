import { Controller, Get, Post, Body, Param, Delete, Patch } from '@nestjs/common';
import { TareasService } from './tareas.service';
import { CrearTareaDto, ActualizarTareaDto } from './dto/crear-tarea.dto';

@Controller('tareas')
export class TareasController {
  constructor(private readonly tareasService: TareasService) {}

  @Post()
  crear(@Body() dto: CrearTareaDto) {
    return this.tareasService.crear(dto);
  }

  @Get()
  todos() {
    return this.tareasService.todos();
  }

  @Patch(':id')
  actualizar(@Param('id') id: string, @Body() dto: ActualizarTareaDto) {
    return this.tareasService.actualizar(id, dto);
  }

  @Delete(':id')
  eliminar(@Param('id') id: string) {
    return this.tareasService.eliminar(id);
  }
}
