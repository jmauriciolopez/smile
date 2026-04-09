import { PartialType } from '@nestjs/mapped-types';
import { CrearPresupuestoDto } from './crear_presupuesto.dto';

export class ActualizarPresupuestoDto extends PartialType(CrearPresupuestoDto) {}
