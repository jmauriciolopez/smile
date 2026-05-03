import React, { useState } from "react";
import { useCBCTStore } from "../store/cbct.store";
import { Card } from "../../../componentes/ui/Card";

export const CBCTUpload: React.FC = () => {
  const { setFiles, setLoaded, isLoaded } = useCBCTStore();
  const [dragActive, setDragActive] = useState(false);

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    // Filtrar solo archivos .dcm o sin extensión (comunes en DICOM)
    const validFiles = Array.from(files).filter(
      (f) => f.name.toLowerCase().endsWith(".dcm") || !f.name.includes("."),
    );

    if (validFiles.length > 0) {
      setFiles(validFiles);
      setLoaded(true);
    }
  };

  return (
    <Card titulo="📁 Ingesta de Volumetría CBCT">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(e) => {
          e.preventDefault();
          handleFiles(e.dataTransfer.files);
          setDragActive(false);
        }}
        className={`relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 transition-all ${
          dragActive
            ? "border-blue-500 bg-blue-50/50"
            : "border-slate-200 bg-slate-50/50"
        }`}
      >
        <div
          className={`mb-4 flex h-16 w-16 items-center justify-center rounded-full text-3xl transition-transform ${isLoaded ? "bg-emerald-100" : "bg-slate-100"}`}
        >
          {isLoaded ? "✅" : "☢️"}
        </div>

        <div className="text-center">
          <h4 className="text-sm font-bold text-slate-700">
            {isLoaded ? "Serie DICOM Cargada" : "Cargar Tomografía (CBCT)"}
          </h4>
          <p className="mt-1 text-[11px] text-slate-500 max-w-[200px]">
            Arrastra la carpeta DICOM o selecciona los archivos de la serie.
          </p>
        </div>

        <input
          type="file"
          multiple
          onChange={(e) => handleFiles(e.target.files)}
          className="absolute inset-0 cursor-pointer opacity-0"
        />

        {isLoaded && (
          <div className="mt-4 flex flex-col items-center gap-2">
            <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-[10px] font-bold text-emerald-600">
              {useCBCTStore.getState().files.length} Archivos detectados
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                useCBCTStore.getState().reset();
              }}
              className="text-[10px] font-bold text-red-500 hover:underline"
            >
              Eliminar serie
            </button>
          </div>
        )}
      </div>

      <div className="mt-4 rounded-xl bg-blue-50 p-3 border border-blue-100 flex gap-3">
        <span className="text-blue-500 text-lg">ℹ️</span>
        <p className="text-[10px] text-blue-700 leading-relaxed">
          El visor soporta reconstrucción MPR dinámica. Para una visualización
          3D fluida, se recomienda el uso de navegadores con aceleración WebGL
          activa.
        </p>
      </div>
    </Card>
  );
};
