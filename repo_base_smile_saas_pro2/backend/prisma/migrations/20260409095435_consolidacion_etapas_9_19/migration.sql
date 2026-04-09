-- CreateTable
CREATE TABLE "OpcionTratamiento" (
    "id" TEXT NOT NULL,
    "presupuesto_id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descripcion" TEXT,
    "monto" DOUBLE PRECISION NOT NULL,
    "recomendada" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "OpcionTratamiento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SeguimientoComercial" (
    "id" TEXT NOT NULL,
    "presupuesto_id" TEXT NOT NULL,
    "comentario" TEXT NOT NULL,
    "proxima_accion" TEXT,
    "fecha_accion" TIMESTAMP(3),
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SeguimientoComercial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NotaClinica" (
    "id" TEXT NOT NULL,
    "caso_clinico_id" TEXT NOT NULL,
    "contenido" TEXT NOT NULL,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NotaClinica_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TareaInterna" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descripcion" TEXT,
    "completada" BOOLEAN NOT NULL DEFAULT false,
    "fecha_vencimiento" TIMESTAMP(3),
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TareaInterna_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "OpcionTratamiento" ADD CONSTRAINT "OpcionTratamiento_presupuesto_id_fkey" FOREIGN KEY ("presupuesto_id") REFERENCES "Presupuesto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SeguimientoComercial" ADD CONSTRAINT "SeguimientoComercial_presupuesto_id_fkey" FOREIGN KEY ("presupuesto_id") REFERENCES "Presupuesto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotaClinica" ADD CONSTRAINT "NotaClinica_caso_clinico_id_fkey" FOREIGN KEY ("caso_clinico_id") REFERENCES "CasoClinico"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
