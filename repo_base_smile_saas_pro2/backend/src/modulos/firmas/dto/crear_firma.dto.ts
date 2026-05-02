import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';

export enum EstadoFirma {
  FIRMADO = 'firmado',
  APROBADO = 'aprobado',
  REVOCADO = 'revocado',
}

export enum RolFirmante {
  ODONTOLOGO = 'odontologo',
  TECNICO = 'tecnico',
  DIRECTOR = 'director',
}

export class CrearFirmaDto {
  @IsString()
  @IsNotEmpty()
  diseno_id: string;

  @IsString()
  @IsNotEmpty()
  caso_clinico_id: string;

  @IsString()
  @IsNotEmpty()
  firmado_por: string;

  @IsEnum(RolFirmante)
  rol_firmante: RolFirmante;

  /** Hash SHA-256 del diseño al momento de la firma */
  @IsString()
  @IsNotEmpty()
  hash_diseno: string;

  @IsString()
  @IsOptional()
  observaciones?: string;
}

export class AprobarFirmaDto {
  @IsString()
  @IsNotEmpty()
  firma_id: string;

  @IsString()
  @IsNotEmpty()
  aprobado_por: string;
}
