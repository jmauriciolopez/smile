import { IsInt, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CrearPresupuestoDto {
  @IsString()
  paciente_id!: string;

  @IsOptional()
  @IsString()
  caso_clinico_id?: string;

  @IsNumber()
  monto_total_estimado!: number;

  @IsInt()
  @Min(1)
  cantidad_cuotas!: number;
}
