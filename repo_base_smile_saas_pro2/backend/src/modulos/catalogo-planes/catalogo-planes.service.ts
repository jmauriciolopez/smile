import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CatalogoPlanesService {
  constructor(private readonly prisma: PrismaService) {}

  create(data: { titulo: string; descripcion?: string; monto_base: number; recomendada?: boolean }) {
    return this.prisma.catalogoPlanTratamiento.create({
      data,
    });
  }

  findAll() {
    return this.prisma.catalogoPlanTratamiento.findMany({
      where: { activo: true },
      orderBy: { fecha_creacion: 'asc' },
    });
  }

  async findOne(id: string) {
    const plan = await this.prisma.catalogoPlanTratamiento.findUnique({
      where: { id },
    });
    if (!plan) throw new NotFoundException('Plan no encontrado');
    return plan;
  }

  update(id: string, data: Partial<{ titulo: string; descripcion?: string; monto_base: number; recomendada?: boolean }>) {
    return this.prisma.catalogoPlanTratamiento.update({
      where: { id },
      data,
    });
  }

  remove(id: string) {
    // Soft delete
    return this.prisma.catalogoPlanTratamiento.update({
      where: { id },
      data: { activo: false },
    });
  }
}
