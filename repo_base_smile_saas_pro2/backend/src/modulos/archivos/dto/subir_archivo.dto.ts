import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';

export enum TipoArchivo {
  IMAGEN_DISENO = 'imagen_diseno',
  FOTO_CLINICA = 'foto_clinica',
  ARCHIVO_SMILE = 'archivo_smile',
  FICHA_TECNICA = 'ficha_tecnica',
  DOCUMENTO_FIRMA = 'documento_firma',
}

export class SubirArchivoDto {
  @IsString()
  @IsNotEmpty()
  nombre_original: string;

  @IsEnum(TipoArchivo)
  tipo: TipoArchivo;

  @IsString()
  @IsOptional()
  caso_clinico_id?: string;

  @IsString()
  @IsOptional()
  diseno_id?: string;
}
