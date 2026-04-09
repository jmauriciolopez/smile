import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CrearPresupuestoDto } from './dto/crear_presupuesto.dto';
import { ActualizarPresupuestoDto } from './dto/actualizar_presupuesto.dto';

@Injectable()
export class PresupuestosService {
  constructor(private readonly prisma: PrismaService) {}

  obtenerTodos() {
    return this.prisma.presupuesto.findMany({
      include: { paciente: true, caso_clinico: true },
      orderBy: { fecha_creacion: 'desc' },
    });
  }

  async obtenerPorId(id: string) {
    const presupuesto = await this.prisma.presupuesto.findUnique({
      where: { id },
      include: { 
        paciente: true, 
        caso_clinico: true,
        opciones: true,
        seguimientos: {
          orderBy: { fecha_creacion: 'desc' },
        },
      },
    });

    if (!presupuesto) {
      throw new NotFoundException('Presupuesto no encontrado.');
    }

    return presupuesto;
  }

  crear(dto: CrearPresupuestoDto) {
    return this.prisma.presupuesto.create({
      data: dto,
    });
  }

  async actualizar(id: string, dto: ActualizarPresupuestoDto) {
    await this.obtenerPorId(id);
    return this.prisma.presupuesto.update({
      where: { id },
      data: dto,
    });
  }
}
