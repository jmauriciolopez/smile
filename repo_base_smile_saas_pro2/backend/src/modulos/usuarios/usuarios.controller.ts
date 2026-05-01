import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { JwtAuthGuard } from '../autenticacion/guards/jwt-auth.guard';

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @UseGuards(JwtAuthGuard)
  @Get('perfil')
  obtenerPerfil(@Request() req) {
    // El payload del JWT se inyecta en req.user por el JwtAuthGuard
    return this.usuariosService.obtenerPerfil(req.user.sub);
  }
}
