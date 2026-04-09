import { PartialType } from '@nestjs/mapped-types';
import { CrearCasoClinicoDto } from './crear_caso_clinico.dto';

export class ActualizarCasoClinicoDto extends PartialType(CrearCasoClinicoDto) {}
