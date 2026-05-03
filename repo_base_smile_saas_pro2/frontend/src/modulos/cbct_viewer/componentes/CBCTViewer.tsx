import React from "react";
import { useCBCTStore } from "../store/cbct.store";

export const CBCTViewer: React.FC = () => {
  const {
    isLoaded,
    axialIndex,
    sagittalIndex,
    coronalIndex,
    maxSlices,
    setSliceIndex,
    windowWidth,
    windowCenter,
    setWindowing,
  } = useCBCTStore();

  const SliceView = ({
    title,
    index,
    max,
    plane,
  }: {
    title: string;
    index: number;
    max: number;
    plane: "axial" | "sagittal" | "coronal";
  }) => (
    <div className="group relative flex flex-col rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-lg">
      <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
        <span className="rounded-md bg-blue-500/20 px-2 py-0.5 text-[9px] font-bold text-blue-400 border border-blue-400/30 uppercase tracking-widest">
          {title}
        </span>
        <span className="text-[10px] text-slate-500 font-mono">
          {index} / {max}
        </span>
      </div>

      {/* Renderizado de la rebanada (DICOM) */}
      <div className="aspect-square w-full bg-black flex items-center justify-center relative">
        {!isLoaded ? (
          <div className="text-center space-y-2 opacity-20">
            <span className="text-4xl">💀</span>
            <p className="text-[10px] font-bold text-white uppercase tracking-tight">
              Sin Datos CBCT
            </p>
          </div>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-slate-800 to-black animate-pulse flex items-center justify-center">
            <div className="h-4/5 w-4/5 rounded-full border border-white/5 opacity-10" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[10px] font-bold text-blue-400/40 uppercase tracking-widest">
                Rendering Slice...
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Slider de navegación */}
      <div className="p-3 bg-slate-900/80 backdrop-blur-md border-t border-slate-800">
        <input
          type="range"
          min="0"
          max={max}
          value={index}
          onChange={(e) => setSliceIndex(plane, parseInt(e.target.value))}
          className="h-1 w-full appearance-none rounded-full bg-slate-700 accent-blue-500 cursor-pointer"
        />
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-2 gap-4">
      <SliceView
        title="Plano Axial"
        index={axialIndex}
        max={maxSlices.axial}
        plane="axial"
      />
      <SliceView
        title="Plano Coronal"
        index={coronalIndex}
        max={maxSlices.coronal}
        plane="coronal"
      />
      <SliceView
        title="Plano Sagital"
        index={sagittalIndex}
        max={maxSlices.sagittal}
        plane="sagittal"
      />

      {/* Panel de Control de Imagen (Window/Level) */}
      <div className="flex flex-col justify-between rounded-2xl bg-slate-50 border border-slate-100 p-4 shadow-sm">
        <div className="space-y-4">
          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Ajustes Radiológicos
          </h4>

          <div className="space-y-2">
            <div className="flex justify-between text-[10px] font-bold text-slate-600">
              <span>Window Width (Contraste)</span>
              <span>{windowWidth} HU</span>
            </div>
            <input
              type="range"
              min="1"
              max="2000"
              value={windowWidth}
              onChange={(e) =>
                setWindowing(parseInt(e.target.value), windowCenter)
              }
              className="h-1.5 w-full appearance-none rounded-full bg-slate-200 accent-slate-600"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-[10px] font-bold text-slate-600">
              <span>Window Center (Brillo)</span>
              <span>{windowCenter} HU</span>
            </div>
            <input
              type="range"
              min="-1000"
              max="1000"
              value={windowCenter}
              onChange={(e) =>
                setWindowing(windowWidth, parseInt(e.target.value))
              }
              className="h-1.5 w-full appearance-none rounded-full bg-slate-200 accent-slate-600"
            />
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <button className="flex-1 rounded-xl bg-slate-900 py-2 text-[10px] font-bold text-white uppercase hover:bg-slate-800 transition">
            Exportar Captura
          </button>
          <button className="flex-1 rounded-xl border border-slate-200 bg-white py-2 text-[10px] font-bold text-slate-600 uppercase hover:bg-slate-50 transition">
            Resetear Vista
          </button>
        </div>
      </div>
    </div>
  );
};
