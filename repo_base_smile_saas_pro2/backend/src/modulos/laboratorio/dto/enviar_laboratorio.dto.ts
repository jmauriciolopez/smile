import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export enum EstadoEnvioLab {
  PENDIENTE = 'pendiente',
  ENVIADO = 'enviado',
  RECIBIDO = 'recibido',
  EN_PROCESO = 'en_proceso',
  COMPLETADO = 'completado',
  RECHAZADO = 'rechazado',
}

export class EnviarLaboratorioDto {
  @IsString()
  @IsNotEmpty()
  diseno_id: string;

  @IsString()
  @IsNotEmpty()
  caso_clinico_id: string;

  @IsString()
  @IsOptional()
  laboratorio_id?: string;

  @IsString()
  @IsOptional()
  observaciones?: string;

  /** URL del archivo .smile generado por el frontend */
  @IsString()
  @IsOptional()
  url_archivo_smile?: string;
}
