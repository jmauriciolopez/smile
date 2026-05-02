import { Module } from '@nestjs/common';
import { ColaboracionController } from './colaboracion.controller';
import { ColaboracionService } from './colaboracion.service';
import { ColaboracionGateway } from './colaboracion.gateway';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ColaboracionController],
  providers: [ColaboracionService, ColaboracionGateway],
  exports: [ColaboracionService],
})
export class ColaboracionModule {}
