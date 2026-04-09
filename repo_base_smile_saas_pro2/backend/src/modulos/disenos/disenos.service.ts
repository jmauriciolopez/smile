import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CrearDisenoDto } from './dto/crear_diseno.dto';

@Injectable()
export class DisenosService {
  constructor(private readonly prisma: PrismaService) {}

  async guardarDiseno(dto: CrearDisenoDto) {
    // Si existe un diseño previo activo para este caso, lo desactivamos
    await this.prisma.disenoSonrisa.updateMany({
      where: {
        caso_clinico_id: dto.caso_clinico_id,
        activo: true,
      },
      data: {
        activo: false,
      },
    });

    return this.prisma.disenoSonrisa.create({
      data: dto,
    });
  }

  async obtenerPorCaso(casoClinicoId: string) {
    const diseno = await this.prisma.disenoSonrisa.findFirst({
      where: {
        caso_clinico_id: casoClinicoId,
        activo: true,
      },
      orderBy: {
        fecha_creacion: 'desc',
      },
    });

    return diseno;
  }
}
