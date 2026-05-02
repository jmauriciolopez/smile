import { IsString, IsNotEmpty, IsEnum } from 'class-validator';

export enum RolParticipante {
  ODONTOLOGO = 'odontologo',
  TECNICO = 'tecnico',
  PACIENTE = 'paciente',
}

export class CrearSesionDto {
  @IsString()
  @IsNotEmpty()
  caso_clinico_id: string;

  @IsString()
  @IsNotEmpty()
  diseno_id: string;
}

export class UnirseASesionDto {
  @IsString()
  @IsNotEmpty()
  codigo_sesion: string;

  @IsString()
  @IsNotEmpty()
  nombre_participante: string;

  @IsEnum(RolParticipante)
  rol: RolParticipante;
}
