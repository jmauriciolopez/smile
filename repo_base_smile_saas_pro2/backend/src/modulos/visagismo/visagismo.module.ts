import { Module } from '@nestjs/common';
import { VisagismoController } from './visagismo.controller';
import { VisagismoService } from './visagismo.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [VisagismoController],
  providers: [VisagismoService],
  exports: [VisagismoService],
})
export class VisagismoModule {}
