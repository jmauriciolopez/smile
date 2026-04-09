import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { NotasService } from './notas.service';
import { CrearNotaDto } from './dto/crear-nota.dto';

@Controller('notas')
export class NotasController {
  constructor(private readonly notasService: NotasService) {}

  @Post()
  crear(@Body() dto: CrearNotaDto) {
    return this.notasService.crear(dto);
  }

  @Get('caso/:id')
  porCaso(@Param('id') id: string) {
    return this.notasService.porCaso(id);
  }

  @Delete(':id')
  eliminar(@Param('id') id: string) {
    return this.notasService.eliminar(id);
  }
}
