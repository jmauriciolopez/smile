import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class CrearFotoDto {
  @IsUUID()
  @IsNotEmpty()
  caso_clinico_id: string;

  @IsString()
  @IsNotEmpty()
  url_foto: string;

  @IsString()
  @IsNotEmpty()
  tipo: string; // frontal, lateral, oclusal, etc
}
