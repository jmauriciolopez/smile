import { Module } from '@nestjs/common';
import { CatalogoPlanesService } from './catalogo-planes.service';
import { CatalogoPlanesController } from './catalogo-planes.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [CatalogoPlanesController],
  providers: [CatalogoPlanesService],
})
export class CatalogoPlanesModule {}
