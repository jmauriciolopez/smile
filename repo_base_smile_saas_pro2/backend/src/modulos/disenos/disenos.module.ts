import { Module } from '@nestjs/common';
import { DisenosService } from './disenos.service';
import { DisenosController } from './disenos.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [DisenosController],
  providers: [DisenosService, PrismaService],
})
export class DisenosModule {}
