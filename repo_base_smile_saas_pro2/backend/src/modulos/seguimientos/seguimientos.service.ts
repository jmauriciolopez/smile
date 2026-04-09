import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CrearSeguimientoDto } from './dto/crear-seguimiento.dto';

@Injectable()
export class SeguimientosService {
  constructor(private prisma: PrismaService) {}

  async crear(dto: CrearSeguimientoDto) {
    return this.prisma.seguimientoComercial.create({
      data: {
        presupuesto_id: dto.presupuesto_id,
        comentario: dto.comentario,
        proxima_accion: dto.proxima_accion,
        fecha_accion: dto.fecha_accion ? new Date(dto.fecha_accion) : null,
      },
    });
  }

  async porPresupuesto(presupuestoId: string) {
    return this.prisma.seguimientoComercial.findMany({
      where: { presupuesto_id: presupuestoId },
      orderBy: { fecha_creacion: 'desc' },
    });
  }

  async eliminar(id: string) {
    return this.prisma.seguimientoComercial.delete({
      where: { id },
    });
  }
}
