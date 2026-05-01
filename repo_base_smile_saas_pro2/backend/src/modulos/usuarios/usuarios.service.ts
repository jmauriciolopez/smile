import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class UsuariosService {
  constructor(private readonly prisma: PrismaService) {}

  async obtenerPerfil(id: string) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id },
      select: {
        id: true,
        nombre_completo: true,
        email: true,
        rol: true,
        activo: true,
      },
    });

    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado.');
    }

    return usuario;
  }
}
