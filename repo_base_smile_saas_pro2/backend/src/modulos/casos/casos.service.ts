import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CrearCasoClinicoDto } from './dto/crear_caso_clinico.dto';
import { ActualizarCasoClinicoDto } from './dto/actualizar_caso_clinico.dto';

@Injectable()
export class CasosService {
  constructor(private readonly prisma: PrismaService) {}

  obtenerTodos() {
    return this.prisma.casoClinico.findMany({
      include: { paciente: true },
      orderBy: { fecha_creacion: 'desc' },
    });
  }

  async obtenerPorId(id: string) {
    const caso = await this.prisma.casoClinico.findUnique({
      where: { id },
      include: { paciente: true, presupuestos: true, fotos: true },
    });

    if (!caso) {
      throw new NotFoundException('Caso no encontrado.');
    }

    return caso;
  }

  crear(dto: CrearCasoClinicoDto) {
    return this.prisma.casoClinico.create({
      data: dto,
    });
  }

  async actualizar(id: string, dto: ActualizarCasoClinicoDto) {
    await this.obtenerPorId(id);
    return this.prisma.casoClinico.update({
      where: { id },
      data: dto,
    });
  }
}
