import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/prisma.service';
import { IniciarSesionDto } from './dto/iniciar_sesion.dto';

@Injectable()
export class AutenticacionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async iniciarSesion(dto: IniciarSesionDto) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { email: dto.email },
    });

    if (!usuario) {
      throw new UnauthorizedException('Credenciales inválidas.');
    }

    const coincide = await bcrypt.compare(dto.contrasena, usuario.contrasena_hash);

    if (!coincide) {
      throw new UnauthorizedException('Credenciales inválidas.');
    }

    const access_token = await this.jwtService.signAsync({
      sub: usuario.id,
      email: usuario.email,
      rol: usuario.rol,
    });

    return {
      access_token,
      usuario: {
        id: usuario.id,
        email: usuario.email,
        rol: usuario.rol,
        nombre_completo: usuario.nombre_completo,
      },
    };
  }
}
