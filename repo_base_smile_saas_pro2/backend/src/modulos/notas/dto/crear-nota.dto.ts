import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class CrearNotaDto {
  @IsUUID()
  @IsNotEmpty()
  caso_clinico_id: string;

  @IsString()
  @IsNotEmpty()
  contenido: string;
}
