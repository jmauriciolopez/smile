import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CrearTareaDto, ActualizarTareaDto } from './dto/crear-tarea.dto';

@Injectable()
export class TareasService {
  constructor(private prisma: PrismaService) {}

  async crear(dto: CrearTareaDto) {
    return this.prisma.tareaInterna.create({
      data: {
        titulo: dto.titulo,
        descripcion: dto.descripcion,
        fecha_vencimiento: dto.fecha_vencimiento ? new Date(dto.fecha_vencimiento) : null,
      },
    });
  }

  async todos() {
    return this.prisma.tareaInterna.findMany({
      orderBy: { fecha_creacion: 'desc' },
    });
  }

  async actualizar(id: string, dto: ActualizarTareaDto) {
    return this.prisma.tareaInterna.update({
      where: { id },
      data: {
        ...dto,
        fecha_vencimiento: dto.fecha_vencimiento ? new Date(dto.fecha_vencimiento) : undefined,
      },
    });
  }

  async eliminar(id: string) {
    return this.prisma.tareaInterna.delete({
      where: { id },
    });
  }
}
