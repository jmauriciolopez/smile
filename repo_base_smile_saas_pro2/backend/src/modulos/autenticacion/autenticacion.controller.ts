import { Body, Controller, Post } from '@nestjs/common';
import { AutenticacionService } from './autenticacion.service';
import { IniciarSesionDto } from './dto/iniciar_sesion.dto';

@Controller('autenticacion')
export class AutenticacionController {
  constructor(private readonly autenticacionService: AutenticacionService) {}

  @Post('login')
  iniciarSesion(@Body() dto: IniciarSesionDto) {
    return this.autenticacionService.iniciarSesion(dto);
  }
}
