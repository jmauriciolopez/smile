-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "tipo_accion" TEXT NOT NULL,
    "usuario_id" TEXT,
    "entidad_tipo" TEXT,
    "entidad_id" TEXT,
    "descripcion" TEXT NOT NULL,
    "ip_origen" TEXT,
    "metadata" TEXT,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlantillaSonrisa" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "categoria" TEXT NOT NULL,
    "parametros" JSONB NOT NULL,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PlantillaSonrisa_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AuditLog_usuario_id_idx" ON "AuditLog"("usuario_id");

-- CreateIndex
CREATE INDEX "AuditLog_entidad_id_idx" ON "AuditLog"("entidad_id");

-- CreateIndex
CREATE INDEX "AuditLog_fecha_creacion_idx" ON "AuditLog"("fecha_creacion");
