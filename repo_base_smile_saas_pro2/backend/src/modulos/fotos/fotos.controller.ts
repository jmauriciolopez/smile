import { Controller, Post, Body, Delete, Param, Get } from '@nestjs/common';
import { FotosService } from './fotos.service';
import { CrearFotoDto } from './dto/crear-foto.dto';

@Controller('fotos')
export class FotosController {
  constructor(private readonly fotosService: FotosService) {}

  @Post()
  registrar(@Body() dto: CrearFotoDto) {
    return this.fotosService.registrar(dto);
  }

  @Get('caso/:id')
  porCaso(@Param('id') id: string) {
    return this.fotosService.porCaso(id);
  }

  @Delete(':id')
  eliminar(@Param('id') id: string) {
    return this.fotosService.eliminar(id);
  }
}
