import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { PacientesService } from './pacientes.service';
import { CrearPacienteDto } from './dto/crear_paciente.dto';
import { ActualizarPacienteDto } from './dto/actualizar_paciente.dto';
import { JwtAuthGuard } from '../autenticacion/guards/jwt-auth.guard';

@Controller('pacientes')
@UseGuards(JwtAuthGuard)
export class PacientesController {
  constructor(private readonly pacientesService: PacientesService) {}

  @Get()
  obtenerTodos() {
    return this.pacientesService.obtenerTodos();
  }

  @Get(':id')
  obtenerPorId(@Param('id') id: string) {
    return this.pacientesService.obtenerPorId(id);
  }

  @Post()
  crear(@Body() dto: CrearPacienteDto) {
    return this.pacientesService.crear(dto);
  }

  @Patch(':id')
  actualizar(@Param('id') id: string, @Body() dto: ActualizarPacienteDto) {
    return this.pacientesService.actualizar(id, dto);
  }
}
