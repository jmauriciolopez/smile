import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CrearDisenoDto {
  @IsString()
  @IsNotEmpty()
  caso_clinico_id: string;

  @IsString()
  @IsNotEmpty()
  ajustes_json: string;

  @IsString()
  @IsOptional()
  url_imagen_resultado?: string;
}
