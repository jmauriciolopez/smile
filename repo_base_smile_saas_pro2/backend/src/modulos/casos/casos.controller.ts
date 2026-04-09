import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { CasosService } from './casos.service';
import { CrearCasoClinicoDto } from './dto/crear_caso_clinico.dto';
import { ActualizarCasoClinicoDto } from './dto/actualizar_caso_clinico.dto';
import { JwtAuthGuard } from '../autenticacion/guards/jwt-auth.guard';

@Controller('casos')
@UseGuards(JwtAuthGuard)
export class CasosController {
  constructor(private readonly casosService: CasosService) {}

  @Get()
  obtenerTodos() {
    return this.casosService.obtenerTodos();
  }

  @Get(':id')
  obtenerPorId(@Param('id') id: string) {
    return this.casosService.obtenerPorId(id);
  }

  @Post()
  crear(@Body() dto: CrearCasoClinicoDto) {
    return this.casosService.crear(dto);
  }

  @Patch(':id')
  actualizar(@Param('id') id: string, @Body() dto: ActualizarCasoClinicoDto) {
    return this.casosService.actualizar(id, dto);
  }
}
