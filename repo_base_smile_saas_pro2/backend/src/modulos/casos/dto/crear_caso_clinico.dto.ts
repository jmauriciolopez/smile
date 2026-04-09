import { IsOptional, IsString, MinLength } from 'class-validator';

export class CrearCasoClinicoDto {
  @IsString()
  paciente_id!: string;

  @IsString()
  @MinLength(2)
  titulo!: string;

  @IsOptional()
  @IsString()
  motivo_consulta?: string;

  @IsOptional()
  @IsString()
  usuario_responsable_id?: string;
}
