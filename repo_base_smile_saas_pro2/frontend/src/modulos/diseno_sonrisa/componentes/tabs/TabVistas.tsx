import React from "react";
import { Eye, EyeSlash, Palette, Sparkle } from "@phosphor-icons/react";
import { Blueprint } from "../../../../core/types";

interface TabVistasProps {
  blueprint: Blueprint | null;
  goldenMode: boolean;
  onCambiarVista: (id: string) => void;
  onAlternarGuia: (tipo: string) => void;
  onSetGuiaValor: (id: string, valor: any) => void;
  onToggleGoldenMode: () => void;
}

export function TabVistas({
  blueprint,
  goldenMode,
  onCambiarVista,
  onAlternarGuia,
  onSetGuiaValor,
  onToggleGoldenMode,
}: TabVistasProps) {
  return (
    <>
      {/* Escenarios & Vistas */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Palette size={14} weight="duotone" className="text-slate-400" />
          <h3 className="text-[9px] font-black uppercase tracking-widest text-slate-500">
            Escenarios & Vistas
          </h3>
        </div>

        <div className="grid grid-cols-2 gap-1.5 mb-3">
          {blueprint?.vistas.map((vista) => (
            <button
              key={vista.id}
              onClick={() => onCambiarVista(vista.id)}
              className={`py-1.5 text-[8px] font-black rounded-lg border transition-all ${
                vista.id === blueprint.vistaActivaId
                  ? "bg-white text-slate-900 border-white shadow-lg"
                  : "bg-white/5 border-white/10 text-slate-500 hover:text-white"
              }`}
            >
              {vista.tipo.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Capas */}
        <div className="space-y-1.5">
          {blueprint?.capas.map((capa: any) => (
            <div
              key={capa.id}
              className="flex justify-between items-center p-2.5 bg-white/5 rounded-xl border border-white/5"
            >
              <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">
                {capa.tipo}
              </span>
              <button
                onClick={() => onAlternarGuia(capa.tipo)}
                className="text-slate-500 hover:text-white transition-colors"
              >
                {capa.visible ? <Eye size={14} /> : <EyeSlash size={14} />}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Guías Clínicas PRO */}
      <div className="pt-4 border-t border-white/5">
        <h3 className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-3">
          Guías Clínicas PRO
        </h3>

        {/* Aura Áurea */}
        <div className="mb-4 p-2.5 bg-emerald-500/5 border border-emerald-500/10 rounded-xl flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Sparkle size={14} weight="fill" className="text-emerald-500" />
            <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">
              Aura Áurea
            </span>
          </div>
          <button
            onClick={onToggleGoldenMode}
            className={`px-2 py-0.5 text-[7px] font-black rounded-full border transition-all ${
              goldenMode
                ? "bg-emerald-500 border-emerald-400 text-white"
                : "bg-white/5 border-white/10 text-slate-500 hover:text-white"
            }`}
          >
            {goldenMode ? "ACTIVA" : "ACTIVAR"}
          </button>
        </div>

        {/* Guías individuales */}
        <div className="space-y-3">
          {blueprint?.guias.map((guia: any) => (
            <div key={guia.id} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[8px] font-bold text-slate-500 uppercase">
                  {guia.tipo.replace("-", " ")}
                </span>
                <button
                  onClick={() => onAlternarGuia(guia.tipo)}
                  className={`text-[7px] px-2 py-0.5 rounded-full transition-all font-black uppercase ${
                    guia.visible
                      ? "bg-blue-600 text-white"
                      : "bg-white/5 text-slate-600"
                  }`}
                >
                  {guia.visible ? "Visible" : "Oculta"}
                </button>
              </div>

              {guia.visible && (
                <div className="pl-2 border-l border-white/5 space-y-3">
                  {guia.tipo === "media" && (
                    <div>
                      <div className="flex justify-between text-[7px] text-slate-600 mb-1 font-bold">
                        <span>POSICIÓN X</span>
                        <span>{guia.valor.x}px</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="1000"
                        step="1"
                        value={guia.valor.x}
                        onChange={(e) =>
                          onSetGuiaValor(guia.id, {
                            x: parseInt(e.target.value),
                          })
                        }
                        className="w-full h-0.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-red-500"
                      />
                    </div>
                  )}
                  {guia.tipo === "sonrisa" && (
                    <div>
                      <div className="flex justify-between text-[7px] text-slate-600 mb-1 font-bold">
                        <span>CURVATURA</span>
                        <span>{guia.valor.curva.toFixed(2)}</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="2"
                        step="0.01"
                        value={guia.valor.curva}
                        onChange={(e) =>
                          onSetGuiaValor(guia.id, {
                            curva: parseFloat(e.target.value),
                          })
                        }
                        className="w-full h-0.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-yellow-500"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
