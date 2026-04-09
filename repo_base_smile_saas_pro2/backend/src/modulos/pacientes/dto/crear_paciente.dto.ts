import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class CrearPacienteDto {
  @IsString()
  @MinLength(2)
  nombre_completo!: string;

  @IsOptional()
  @IsString()
  telefono?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  ciudad?: string;

  @IsOptional()
  @IsString()
  observaciones_generales?: string;
}
