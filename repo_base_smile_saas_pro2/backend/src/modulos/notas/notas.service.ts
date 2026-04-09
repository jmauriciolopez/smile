import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CrearNotaDto } from './dto/crear-nota.dto';

@Injectable()
export class NotasService {
  constructor(private prisma: PrismaService) {}

  async crear(dto: CrearNotaDto) {
    return this.prisma.notaClinica.create({
      data: {
        caso_clinico_id: dto.caso_clinico_id,
        contenido: dto.contenido,
      },
    });
  }

  async porCaso(casoId: string) {
    return this.prisma.notaClinica.findMany({
      where: { caso_clinico_id: casoId },
      orderBy: { fecha_creacion: 'desc' },
    });
  }

  async eliminar(id: string) {
    return this.prisma.notaClinica.delete({
      where: { id },
    });
  }
}
