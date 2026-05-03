import React from "react";
import { useSignatureStore } from "../store/signature-design.store";
import { Card } from "../../../componentes/ui/Card";

export const SignatureControls: React.FC = () => {
  const {
    opacityPortrait,
    opacityScan,
    opacityWaxup,
    setOpacity,
    alignment,
    setAlignment,
    resetAlignment,
    showMask,
    toggleMask,
  } = useSignatureStore();

  const ControlGroup = ({
    title,
    children,
  }: {
    title: string;
    children: React.ReactNode;
  }) => (
    <div className="space-y-2 py-2">
      <h5 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
        {title}
      </h5>
      {children}
    </div>
  );

  const Slider = ({
    label,
    value,
    onChange,
  }: {
    label: string;
    value: number;
    onChange: (v: number) => void;
  }) => (
    <div className="flex items-center justify-between gap-4">
      <span className="text-[11px] text-slate-600 w-24">{label}</span>
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="h-1.5 flex-1 appearance-none rounded-full bg-slate-200 accent-blue-500"
      />
      <span className="text-[10px] font-mono text-slate-400 w-8 text-right">
        {Math.round(value * 100)}%
      </span>
    </div>
  );

  return (
    <div className="space-y-4">
      <Card titulo="🎛️ Herramientas de Revisión">
        <ControlGroup title="Opacidad de Capas">
          <Slider
            label="Retrato"
            value={opacityPortrait}
            onChange={(v) => setOpacity("portrait", v)}
          />
          <Slider
            label="Escaneo Inicial"
            value={opacityScan}
            onChange={(v) => setOpacity("scan", v)}
          />
          <Slider
            label="Wax-up / Diseño"
            value={opacityWaxup}
            onChange={(v) => setOpacity("waxup", v)}
          />
        </ControlGroup>

        <div className="h-px bg-slate-100 my-2" />

        <ControlGroup title="Visualización">
          <div className="flex gap-2">
            <button
              onClick={() => toggleMask(!showMask)}
              className={`flex-1 rounded-xl px-3 py-2 text-[10px] font-bold transition-all ${showMask ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-500"}`}
            >
              Máscara Labial: {showMask ? "ON" : "OFF"}
            </button>
            <button className="flex-1 rounded-xl bg-slate-100 px-3 py-2 text-[10px] font-bold text-slate-500 hover:bg-red-50 hover:text-red-600">
              🔥 Heatmap (Distancia)
            </button>
          </div>
        </ControlGroup>
      </Card>

      <Card titulo="📐 Alineación Manual">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-[9px] font-bold text-slate-400">
              POSICIÓN X/Y
            </label>
            <div className="flex gap-1">
              <button
                onClick={() => setAlignment({ x: alignment.x - 0.1 })}
                className="flex-1 rounded-lg bg-slate-100 py-1 text-xs"
              >
                ←
              </button>
              <button
                onClick={() => setAlignment({ x: alignment.x + 0.1 })}
                className="flex-1 rounded-lg bg-slate-100 py-1 text-xs"
              >
                →
              </button>
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => setAlignment({ y: alignment.y - 0.1 })}
                className="flex-1 rounded-lg bg-slate-100 py-1 text-xs"
              >
                ↓
              </button>
              <button
                onClick={() => setAlignment({ y: alignment.y + 0.1 })}
                className="flex-1 rounded-lg bg-slate-100 py-1 text-xs"
              >
                ↑
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[9px] font-bold text-slate-400">
              ESCALA / Z
            </label>
            <div className="flex gap-1">
              <button
                onClick={() => setAlignment({ scale: alignment.scale * 1.05 })}
                className="flex-1 rounded-lg bg-slate-100 py-1 text-xs"
              >
                +
              </button>
              <button
                onClick={() => setAlignment({ scale: alignment.scale * 0.95 })}
                className="flex-1 rounded-lg bg-slate-100 py-1 text-xs"
              >
                -
              </button>
            </div>
            <button
              onClick={resetAlignment}
              className="w-full rounded-lg border border-slate-200 py-1 text-[9px] font-bold text-slate-500 hover:bg-slate-50 mt-1"
            >
              RESETEAR
            </button>
          </div>
        </div>
      </Card>

      <button className="group relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-white shadow-lg transition-all hover:scale-[1.02] active:scale-95">
        <div className="relative z-10 flex items-center justify-center gap-3">
          <span className="text-xl">📹</span>
          <div className="text-left">
            <p className="text-xs font-bold uppercase tracking-widest">
              Generar Video Signature
            </p>
            <p className="text-[10px] opacity-70">
              Exportar slider Antes/Después (MP4)
            </p>
          </div>
        </div>
        <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
      </button>
    </div>
  );
};
