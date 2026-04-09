import { IsEmail, IsString, MinLength } from 'class-validator';

export class IniciarSesionDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(6)
  contrasena!: string;
}
