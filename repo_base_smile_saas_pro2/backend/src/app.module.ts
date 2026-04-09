import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AutenticacionModule } from './modulos/autenticacion/autenticacion.module';
import { PacientesModule } from './modulos/pacientes/pacientes.module';
import { CasosModule } from './modulos/casos/casos.module';
import { PresupuestosModule } from './modulos/presupuestos/presupuestos.module';

@Module({
  imports: [
    PrismaModule,
    AutenticacionModule,
    PacientesModule,
    CasosModule,
    PresupuestosModule,
  ],
})
export class AppModule {}
