import React from "react";
import { Cube, Crosshair } from "@phosphor-icons/react";
import { Blueprint, Diente, Transformacion3D } from "../../../../core/types";
import { PLANTILLAS_PREDEFINIDAS } from "../../../../motor/plantilla-engine/seed";

interface TabGizmosProps {
  blueprint: Blueprint | null;
  seleccionadoId: string | null;
  onActualizarTransformacion3D: (
    id: string,
    t: Partial<Transformacion3D>,
  ) => void;
  onResetearTransformacion3D: (id: string) => void;
  onAplicarEstiloAPieza: (dienteId: string, plantillaId: string) => void;
}

const SLIDERS_3D = [
  {
    key: "rotX" as const,
    label: "ROT X — Vestibular",
    min: -30,
    max: 30,
    step: 0.5,
    accent: "accent-blue-500",
    color: "text-blue-400",
    unit: "°",
  },
  {
    key: "rotY" as const,
    label: "ROT Y — Mesio-Distal",
    min: -30,
    max: 30,
    step: 0.5,
    accent: "accent-emerald-500",
    color: "text-emerald-400",
    unit: "°",
  },
  {
    key: "rotZ" as const,
    label: "ROT Z — Axial",
    min: -30,
    max: 30,
    step: 0.5,
    accent: "accent-purple-500",
    color: "text-purple-400",
    unit: "°",
  },
  {
    key: "posZ" as const,
    label: "POS Z — Overjet",
    min: -10,
    max: 10,
    step: 0.1,
    accent: "accent-amber-500",
    color: "text-amber-400",
    unit: "°",
  },
  {
    key: "escala" as const,
    label: "ESCALA",
    min: 0.6,
    max: 1.5,
    step: 0.01,
    accent: "accent-rose-500",
    color: "text-rose-400",
    unit: "x",
  },
];

export function TabGizmos({
  blueprint,
  seleccionadoId,
  onActualizarTransformacion3D,
  onResetearTransformacion3D,
  onAplicarEstiloAPieza,
}: TabGizmosProps) {
  const diente = blueprint?.dientes.find((d) => d.id === seleccionadoId);

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Cube size={13} weight="duotone" className="text-blue-400" />
        <h3 className="text-[9px] font-black uppercase tracking-widest text-slate-500">
          3D Gizmos
        </h3>
      </div>

      {!seleccionadoId || !diente ? (
        <div className="flex flex-col items-center justify-center py-10 gap-3">
          <Cube size={32} weight="duotone" className="text-slate-700" />
          <p className="text-[8px] text-slate-600 text-center leading-relaxed">
            Selecciona una pieza dental
            <br />
            en el canvas para editar
            <br />
            sus transformaciones 3D
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[9px] font-black text-white uppercase">
              Pieza FDI {diente.pieza}
            </span>
            <button
              onClick={() => onResetearTransformacion3D(seleccionadoId)}
              className="text-[7px] font-black text-slate-600 hover:text-red-400 transition-colors uppercase"
            >
              Reset
            </button>
          </div>

          {SLIDERS_3D.map(({ key, label, min, max, step, accent, color, unit }) => (
            <div key={key} className="space-y-1">
              <div className="flex justify-between text-[7px] font-bold">
                <span className={color}>{label}</span>
                <span className="font-mono text-slate-400">
                  {diente.transformacion3D[key].toFixed(key === "escala" ? 2 : 1)}
                  {unit}
                </span>
              </div>
              <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={diente.transformacion3D[key]}
                onChange={(e) =>
                  onActualizarTransformacion3D(seleccionadoId, {
                    [key]: parseFloat(e.target.value),
                  })
                }
                className={`w-full h-0.5 bg-slate-800 rounded-lg appearance-none cursor-pointer ${accent}`}
              />
            </div>
          ))}

          <div className="pt-3 border-t border-white/5 mt-2">
            <p className="text-[7px] text-slate-600 mb-2 font-bold uppercase">
              Aplicar estilo a esta pieza
            </p>
            <div className="grid grid-cols-2 gap-1">
              {PLANTILLAS_PREDEFINIDAS.slice(0, 4).map((p) => (
                <button
                  key={p.id}
                  onClick={() => onAplicarEstiloAPieza(seleccionadoId, p.id)}
                  className="py-1 text-[7px] font-black bg-white/5 border border-white/5 rounded-lg hover:border-blue-500/40 text-slate-500 hover:text-white transition-all uppercase"
                >
                  {p.nombre}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
