import React from "react";
import { CBCTUpload } from "../componentes/CBCTUpload";
import { CBCTViewer } from "../componentes/CBCTViewer";
import { useCBCTStore } from "../store/cbct.store";

const CBCTViewerPage: React.FC = () => {
  const { isLoaded } = useCBCTStore();

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-2xl shadow-lg shadow-slate-200">
            ☢️
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
              Estudio Tomográfico CBCT
            </h1>
            <p className="text-sm text-slate-500">
              Visualización multi-planar y diagnóstico volumétrico
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <button className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-600 shadow-sm hover:bg-slate-50 transition">
            📋 Notas Radiológicas
          </button>
          <button className="rounded-xl bg-slate-900 px-6 py-2 text-sm font-bold text-white shadow-lg hover:bg-slate-800 transition">
            💾 Guardar Estudio
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Panel Lateral: Carga e Info */}
        <div className="col-span-3 space-y-6">
          <CBCTUpload />

          <div className="rounded-2xl bg-white p-5 border border-slate-100 shadow-sm">
            <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">
              Metadatos del Estudio
            </h5>
            {isLoaded ? (
              <div className="space-y-3">
                <div className="flex justify-between border-b border-slate-50 pb-2">
                  <span className="text-[11px] text-slate-400">Modalidad</span>
                  <span className="text-[11px] font-bold text-slate-700">
                    CT (CBCT)
                  </span>
                </div>
                <div className="flex justify-between border-b border-slate-50 pb-2">
                  <span className="text-[11px] text-slate-400">
                    Espesor de Corte
                  </span>
                  <span className="text-[11px] font-bold text-slate-700">
                    0.25 mm
                  </span>
                </div>
                <div className="flex justify-between border-b border-slate-50 pb-2">
                  <span className="text-[11px] text-slate-400">
                    Dimensión Matrix
                  </span>
                  <span className="text-[11px] font-bold text-slate-700">
                    512 x 512
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-[11px] text-slate-400 italic">
                Carga un estudio para visualizar metadatos clínicos.
              </p>
            )}
          </div>
        </div>

        {/* Panel Central: MPR Viewer */}
        <div className="col-span-9">
          <div className="rounded-3xl bg-white p-1 border border-slate-100 shadow-xl overflow-hidden">
            <CBCTViewer />
          </div>

          {/* Timeline / Thumbnails Placeholder */}
          <div className="mt-6 grid grid-cols-6 gap-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="aspect-video rounded-xl bg-slate-200 animate-pulse border border-slate-300/30"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CBCTViewerPage;
