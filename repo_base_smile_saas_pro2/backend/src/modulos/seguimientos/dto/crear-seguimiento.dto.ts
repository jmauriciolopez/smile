import { IsString, IsNotEmpty, IsOptional, IsDateString, IsUUID } from 'class-validator';

export class CrearSeguimientoDto {
  @IsUUID()
  @IsNotEmpty()
  presupuesto_id: string;

  @IsString()
  @IsNotEmpty()
  comentario: string;

  @IsString()
  @IsOptional()
  proxima_accion?: string;

  @IsDateString()
  @IsOptional()
  fecha_accion?: string;
}
