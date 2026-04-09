import { PartialType } from '@nestjs/mapped-types';
import { CrearPacienteDto } from './crear_paciente.dto';

export class ActualizarPacienteDto extends PartialType(CrearPacienteDto) {}
