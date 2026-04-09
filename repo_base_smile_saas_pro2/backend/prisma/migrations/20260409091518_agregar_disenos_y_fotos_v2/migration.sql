-- CreateTable
CREATE TABLE "DisenoSonrisa" (
    "id" TEXT NOT NULL,
    "caso_clinico_id" TEXT NOT NULL,
    "ajustes_json" TEXT NOT NULL,
    "url_imagen_resultado" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_actualizacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DisenoSonrisa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FotoClinica" (
    "id" TEXT NOT NULL,
    "caso_clinico_id" TEXT NOT NULL,
    "url_foto" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FotoClinica_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "DisenoSonrisa" ADD CONSTRAINT "DisenoSonrisa_caso_clinico_id_fkey" FOREIGN KEY ("caso_clinico_id") REFERENCES "CasoClinico"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FotoClinica" ADD CONSTRAINT "FotoClinica_caso_clinico_id_fkey" FOREIGN KEY ("caso_clinico_id") REFERENCES "CasoClinico"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
