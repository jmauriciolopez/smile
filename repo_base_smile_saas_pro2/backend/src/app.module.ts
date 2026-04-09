import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AutenticacionModule } from './modulos/autenticacion/autenticacion.module';
import { PacientesModule } from './modulos/pacientes/pacientes.module';
import { CasosModule } from './modulos/casos/casos.module';
import { PresupuestosModule } from './modulos/presupuestos/presupuestos.module';
import { DisenosModule } from './modulos/disenos/disenos.module';
import { DashboardModule } from './modulos/dashboard/dashboard.module';

@Module({
  imports: [
    PrismaModule,
    AutenticacionModule,
    PacientesModule,
    CasosModule,
    PresupuestosModule,
    DisenosModule,
    DashboardModule,
  ],
})
export class AppModule {}
