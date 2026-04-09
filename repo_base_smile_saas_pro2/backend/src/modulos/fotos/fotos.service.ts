import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CrearFotoDto } from './dto/crear-foto.dto';

@Injectable()
export class FotosService {
  constructor(private prisma: PrismaService) {}

  async registrar(dto: CrearFotoDto) {
    return this.prisma.fotoClinica.create({
      data: dto,
    });
  }

  async eliminar(id: string) {
    return this.prisma.fotoClinica.delete({
      where: { id },
    });
  }

  async porCaso(casoId: string) {
    return this.prisma.fotoClinica.findMany({
      where: { caso_clinico_id: casoId },
    });
  }
}
