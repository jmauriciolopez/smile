import React from "react";
import {
  Faders,
  Drop,
  Lightning,
  Diamond,
  Sparkle,
  Ruler,
  Gauge,
} from "@phosphor-icons/react";
import { Blueprint, Diente } from "../../../../core/types";

interface TabPBRProps {
  blueprint: Blueprint | null;
  seleccionadoId: string | null;
  onActualizarDiente: (id: string, cambios: Partial<Diente>) => void;
}

const PBR_SLIDERS = [
  {
    key: "translucidez" as const,
    label: "TRANSLUCIDEZ",
    icon: Drop,
    color: "text-cyan-400",
    accent: "accent-cyan-500",
    desc: "Halo incisal",
  },
  {
    key: "sss" as const,
    label: "SSS",
    icon: Lightning,
    color: "text-amber-400",
    accent: "accent-amber-500",
    desc: "Subsurface scattering",
  },
  {
    key: "fresnel" as const,
    label: "FRESNEL",
    icon: Diamond,
    color: "text-blue-400",
    accent: "accent-blue-500",
    desc: "Reflexión en bordes",
  },
  {
    key: "opalescencia" as const,
    label: "OPALESCENCIA",
    icon: Sparkle,
    color: "text-purple-400",
    accent: "accent-purple-500",
    desc: "Efecto fuego",
  },
  {
    key: "rugosidad" as const,
    label: "RUGOSIDAD",
    icon: Ruler,
    color: "text-slate-400",
    accent: "accent-slate-500",
    desc: "Micro-textura esmalte",
  },
  {
    key: "fluorescencia" as const,
    label: "FLUORESCENCIA",
    icon: Gauge,
    color: "text-green-400",
    accent: "accent-green-500",
    desc: "Respuesta UV",
  },
];

export function TabPBR({ blueprint, seleccionadoId, onActualizarDiente }: TabPBRProps) {
  const diente = blueprint?.dientes.find((d) => d.id === seleccionadoId);

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Faders size={13} weight="duotone" className="text-purple-400" />
        <h3 className="text-[9px] font-black uppercase tracking-widest text-slate-500">
          PBR Material
        </h3>
      </div>

      {!seleccionadoId || !diente ? (
        <div className="flex flex-col items-center justify-center py-10 gap-3">
          <Faders size={32} weight="duotone" className="text-slate-700" />
          <p className="text-[8px] text-slate-600 text-center leading-relaxed">
            Selecciona una pieza dental
            <br />
            para ajustar sus propiedades
            <br />
            ópticas PBR
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[9px] font-black text-white uppercase">
              PBR — Pieza {diente.pieza}
            </span>
            <div
              className="w-4 h-4 rounded-full border border-white/20"
              style={{ backgroundColor: diente.material.colorBase }}
            />
          </div>

          {PBR_SLIDERS.map(({ key, label, icon: Icon, color, accent, desc }) => (
            <div key={key} className="space-y-1">
              <div className="flex justify-between items-center text-[7px] font-bold">
                <span className={`flex items-center gap-1 ${color}`}>
                  <Icon size={9} weight="fill" />
                  {label}
                </span>
                <span className="font-mono text-slate-400">
                  {((diente.material as any)[key] * 100).toFixed(0)}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={(diente.material as any)[key]}
                onChange={(e) =>
                  onActualizarDiente(seleccionadoId, {
                    material: {
                      ...diente.material,
                      [key]: parseFloat(e.target.value),
                    },
                  })
                }
                className={`w-full h-0.5 bg-slate-800 rounded-lg appearance-none cursor-pointer ${accent}`}
              />
              <p className="text-[6px] text-slate-700">{desc}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
