import React from "react";
import { AssetsPanel } from "../componentes/AssetsPanel";
import { SignatureCanvas } from "../componentes/SignatureCanvas";
import { SignatureControls } from "../componentes/SignatureControls";
import { LipSegmenter } from "../componentes/LipSegmenter";
import { useSignatureStore } from "../store/signature-design.store";

const SignatureDesignPage: React.FC = () => {
  const { portrait } = useSignatureStore();

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
            Smilecloud Signature Design
          </h1>
          <p className="text-sm text-slate-500">
            Módulo de superposición 3D y validación estética premium
          </p>
        </div>
        <div className="flex gap-3">
          <button className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-600 shadow-sm hover:bg-slate-50">
            💾 Guardar Borrador
          </button>
          <button className="rounded-xl bg-slate-900 px-6 py-2 text-sm font-bold text-white shadow-lg hover:bg-slate-800">
            ✅ Finalizar Diseño
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Panel Izquierdo: Assets e Ingesta */}
        <div className="col-span-3 space-y-6">
          <AssetsPanel />
        </div>

        {/* Panel Central: Canvas 3D + Segmentación */}
        <div className="col-span-6">
          <div className="relative group">
            <SignatureCanvas />
            {/* El Segmenter solo se activa si hay retrato */}
            {portrait && <LipSegmenter width={800} height={600} />}

            {/* Badge de Estado */}
            <div className="absolute top-4 left-4 z-30 flex items-center gap-2 rounded-full bg-slate-900/40 px-3 py-1.5 text-[10px] font-bold text-white backdrop-blur-md border border-white/10">
              <span className="h-2 w-2 rounded-full bg-blue-400 animate-pulse" />
              WEBGL RENDERER ACTIVE
            </div>
          </div>

          {/* Tips de Usuario */}
          <div className="mt-4 flex gap-4">
            <div className="flex-1 rounded-2xl bg-white p-4 border border-slate-100 shadow-sm">
              <h5 className="text-[10px] font-bold text-slate-400 uppercase mb-2">
                💡 Tip de Alineación
              </h5>
              <p className="text-xs text-slate-600">
                Usa el mouse para rotar el modelo. Si el wax-up fue exportado
                sobre el modelo original, la alineación será automática.
              </p>
            </div>
            <div className="flex-1 rounded-2xl bg-white p-4 border border-slate-100 shadow-sm">
              <h5 className="text-[10px] font-bold text-slate-400 uppercase mb-2">
                👄 Tip de Labios
              </h5>
              <p className="text-xs text-slate-600">
                Asegúrate de que la máscara cubra solo los dientes visibles.
                Esto garantiza el realismo del renderizado final.
              </p>
            </div>
          </div>
        </div>

        {/* Panel Derecho: Controles y Revisión */}
        <div className="col-span-3 space-y-6">
          <SignatureControls />
        </div>
      </div>
    </div>
  );
};

export default SignatureDesignPage;
