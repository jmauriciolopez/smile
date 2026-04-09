import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CrearPacienteDto } from './dto/crear_paciente.dto';
import { ActualizarPacienteDto } from './dto/actualizar_paciente.dto';

@Injectable()
export class PacientesService {
  constructor(private readonly prisma: PrismaService) {}

  obtenerTodos() {
    return this.prisma.paciente.findMany({
      orderBy: { fecha_creacion: 'desc' },
    });
  }

  async obtenerPorId(id: string) {
    const paciente = await this.prisma.paciente.findUnique({
      where: { id },
      include: {
        casos_clinicos: true,
        presupuestos: true,
      },
    });
    if (!paciente) {
      throw new NotFoundException('Paciente no encontrado.');
    }
    return paciente;
  }

  crear(dto: CrearPacienteDto) {
    return this.prisma.paciente.create({ data: dto });
  }

  async actualizar(id: string, dto: ActualizarPacienteDto) {
    await this.obtenerPorId(id);
    return this.prisma.paciente.update({
      where: { id },
      data: dto,
    });
  }
}
