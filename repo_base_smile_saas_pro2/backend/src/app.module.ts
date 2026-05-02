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
// ── Fase D ────────────────────────────────────────────────────────────────────
import { ArchivosModule } from './modulos/archivos/archivos.module';
import { VisagismoModule } from './modulos/visagismo/visagismo.module';
// ── Fase E ────────────────────────────────────────────────────────────────────
import { ColaboracionModule } from './modulos/colaboracion/colaboracion.module';
import { LaboratorioModule } from './modulos/laboratorio/laboratorio.module';
// ── Fase F ────────────────────────────────────────────────────────────────────
import { FirmasModule } from './modulos/firmas/firmas.module';
import { AuditModule } from './modulos/audit/audit.module';

@Module({
  imports: [
    PrismaModule,
    // Core MVP (Fases 1-20)
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
    // Fase D — Inteligencia y Automatización
    ArchivosModule,
    VisagismoModule,
    // Fase E — Ecosistema y Colaboración
    ColaboracionModule,
    LaboratorioModule,
    // Fase F — Legal y Compliance (AuditModule es @Global)
    AuditModule,
    FirmasModule,
  ],
})
export class AppModule {}
