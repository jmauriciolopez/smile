import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { DisenosService } from './disenos.service';
import { CrearDisenoDto } from './dto/crear_diseno.dto';

@Controller('disenos')
export class DisenosController {
  constructor(private readonly disenosService: DisenosService) {}

  @Post()
  guardar(@Body() dto: CrearDisenoDto) {
    return this.disenosService.guardarDiseno(dto);
  }

  @Get('caso/:casoId')
  obtenerPorCaso(@Param('casoId') casoId: string) {
    return this.disenosService.obtenerPorCaso(casoId);
  }
}
