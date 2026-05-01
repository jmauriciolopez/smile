import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AutenticacionModule } from './modulos/autenticacion/autenticacion.module';
import { PacientesModule } from './modulos/pacientes/pacientes.module';
import { CasosModule } from './modulos/casos/casos.module';
import { PresupuestosModule } from './modulos/presupuestos/presupuestos.module';
import { DisenosModule } from './modulos/disenos/disenos.module';
import { DashboardModule } from './modulos/dashboard/dashboard.module';
import { SeguimientosModule } from './modulos/seguimientos/seguimientos.module';
import { NotasModule } from './modulos/notas/notas.module';
import { TareasModule } from './modulos/tareas/tareas.module';
import { FotosModule } from './modulos/fotos/fotos.module';
import { UsuariosModule } from './modulos/usuarios/usuarios.module';

@Module({
  imports: [
    PrismaModule,
    AutenticacionModule,
    UsuariosModule,
    PacientesModule,
    CasosModule,
    PresupuestosModule,
    DisenosModule,
    DashboardModule,
    SeguimientosModule,
    NotasModule,
    TareasModule,
    FotosModule,
  ],
})
export class AppModule {}
