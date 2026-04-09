-- CreateEnum
CREATE TYPE "RolUsuario" AS ENUM ('administrador', 'odontologo', 'asistente', 'ventas');

-- CreateEnum
CREATE TYPE "EstadoPaciente" AS ENUM ('nuevo', 'en_evaluacion', 'con_diseno', 'con_presupuesto', 'en_seguimiento', 'cerrado', 'perdido');

-- CreateEnum
CREATE TYPE "EstadoCaso" AS ENUM ('nuevo', 'en_evaluacion', 'con_fotos_cargadas', 'con_diseno_borrador', 'con_diseno_aprobado', 'con_presupuesto_emitido', 'en_negociacion', 'cerrado', 'pausado');

-- CreateEnum
CREATE TYPE "EstadoPresupuesto" AS ENUM ('borrador', 'listo_para_presentar', 'presentado', 'en_seguimiento', 'en_negociacion', 'aprobado', 'rechazado', 'vencido');

-- CreateTable
CREATE TABLE "Usuario" (
    "id" TEXT NOT NULL,
    "nombre_completo" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "contrasena_hash" TEXT NOT NULL,
    "rol" "RolUsuario" NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_actualizacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Paciente" (
    "id" TEXT NOT NULL,
    "nombre_completo" TEXT NOT NULL,
    "telefono" TEXT,
    "email" TEXT,
    "ciudad" TEXT,
    "observaciones_generales" TEXT,
    "estado_paciente" "EstadoPaciente" NOT NULL DEFAULT 'nuevo',
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_actualizacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Paciente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CasoClinico" (
    "id" TEXT NOT NULL,
    "paciente_id" TEXT NOT NULL,
    "usuario_responsable_id" TEXT,
    "titulo" TEXT NOT NULL,
    "motivo_consulta" TEXT,
    "estado_caso" "EstadoCaso" NOT NULL DEFAULT 'nuevo',
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_actualizacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CasoClinico_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Presupuesto" (
    "id" TEXT NOT NULL,
    "paciente_id" TEXT NOT NULL,
    "caso_clinico_id" TEXT,
    "estado_presupuesto" "EstadoPresupuesto" NOT NULL DEFAULT 'borrador',
    "monto_total_estimado" DOUBLE PRECISION NOT NULL,
    "cantidad_cuotas" INTEGER NOT NULL DEFAULT 1,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_actualizacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Presupuesto_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- AddForeignKey
ALTER TABLE "CasoClinico" ADD CONSTRAINT "CasoClinico_paciente_id_fkey" FOREIGN KEY ("paciente_id") REFERENCES "Paciente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CasoClinico" ADD CONSTRAINT "CasoClinico_usuario_responsable_id_fkey" FOREIGN KEY ("usuario_responsable_id") REFERENCES "Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Presupuesto" ADD CONSTRAINT "Presupuesto_paciente_id_fkey" FOREIGN KEY ("paciente_id") REFERENCES "Paciente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Presupuesto" ADD CONSTRAINT "Presupuesto_caso_clinico_id_fkey" FOREIGN KEY ("caso_clinico_id") REFERENCES "CasoClinico"("id") ON DELETE SET NULL ON UPDATE CASCADE;
