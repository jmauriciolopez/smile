import React from "react";
import { motion } from "framer-motion";
import { Palette, Cube, Faders, Stethoscope, Brain, Crosshair, Diamond, CheckCircle, FileText } from "@phosphor-icons/react";
import { Blueprint, Diente, Transformacion3D } from "../../../core/types";
import { ResultadoAuditoria } from "../../../motor/clinical-audit-engine";
import { TabVistas } from "./tabs/TabVistas";
import { TabGizmos } from "./tabs/TabGizmos";
import { TabPBR } from "./tabs/TabPBR";
import { TabAuditoria } from "./tabs/TabAuditoria";

type TabKey = "vistas" | "gizmos" | "pbr" | "auditoria";

const TABS = [
  { key: "vistas" as const, icon: Palette, label: "Vistas" },
  { key: "gizmos" as const, icon: Cube, label: "3D" },
  { key: "pbr" as const, icon: Faders, label: "PBR" },
  { key: "auditoria" as const, icon: Stethoscope, label: "Audit" },
];

interface PanelDerechoEditorProps {
  blueprint: Blueprint | null;
  auditoria: ResultadoAuditoria | null;
  seleccionadoId: string | null;
  tabActivo: TabKey;
  goldenMode: boolean;
  casoId: string | undefined;
  onCambiarTab: (tab: TabKey) => void;
  onCambiarVista: (id: string) => void;
  onAlternarGuia: (tipo: string) => void;
  onSetGuiaValor: (id: string, valor: any) => void;
  onToggleGoldenMode: () => void;
  onActualizarTransformacion3D: (id: string, t: Partial<Transformacion3D>) => void;
  onResetearTransformacion3D: (id: string) => void;
  onAplicarEstiloAPieza: (dienteId: string, plantillaId: string) => void;
  onActualizarDiente: (id: string, cambios: Partial<Diente>) => void;
  onEjecutarAuditoria: () => void;
  onObtenerDiagnosticoIA: () => void;
  onGuardarDiseno: () => void;
  onGenerarReporte: () => void;
}

export function PanelDerechoEditor({
  blueprint,
  auditoria,
  seleccionadoId,
  tabActivo,
  goldenMode,
  casoId,
  onCambiarTab,
  onCambiarVista,
  onAlternarGuia,
  onSetGuiaValor,
  onToggleGoldenMode,
  onActualizarTransformacion3D,
  onResetearTransformacion3D,
  onAplicarEstiloAPieza,
  onActualizarDiente,
  onEjecutarAuditoria,
  onObtenerDiagnosticoIA,
  onGuardarDiseno,
  onGenerarReporte,
}: PanelDerechoEditorProps) {
  return (
    <motion.aside
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="w-72 h-full bg-slate-900 border-l border-white/5 z-20 flex flex-col overflow-hidden select-none"
    >
      {/* Score IA */}
      {blueprint?.analisisIA && (
        <div className="px-4 pt-4 pb-2 border-b border-white/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain size={13} weight="duotone" className="text-purple-400" />
              <span className="text-[8px] font-black uppercase tracking-widest text-slate-500">
                Score Estético
              </span>
            </div>
            <button
              onClick={onObtenerDiagnosticoIA}
              className="text-[7px] font-black text-slate-600 hover:text-purple-400 transition-colors uppercase"
            >
              Actualizar
            </button>
          </div>
          <div className="mt-2 flex items-end gap-2">
            <span
              className={`text-2xl font-black font-mono ${
                blueprint.analisisIA.scoreEstetico >= 80
                  ? "text-emerald-400"
                  : blueprint.analisisIA.scoreEstetico >= 60
                    ? "text-amber-400"
                    : "text-red-400"
              }`}
            >
              {blueprint.analisisIA.scoreEstetico}
            </span>
            <span className="text-[8px] text-slate-600 mb-1">/100</span>
            <div className="flex-1 h-1 bg-slate-800 rounded-full overflow-hidden ml-1 mb-1.5">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  blueprint.analisisIA.scoreEstetico >= 80
                    ? "bg-emerald-500"
                    : blueprint.analisisIA.scoreEstetico >= 60
                      ? "bg-amber-500"
                      : "bg-red-500"
                }`}
                style={{ width: `${blueprint.analisisIA.scoreEstetico}%` }}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-1 mt-1">
            <div className="flex items-center gap-1">
              <Crosshair size={9} className="text-slate-600" />
              <span className="text-[7px] text-slate-600">
                Sim{" "}
                <span className="text-slate-400 font-mono">
                  {(blueprint.analisisIA.simetriaFacial * 100).toFixed(0)}%
                </span>
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Diamond size={9} className="text-slate-600" />
              <span className="text-[7px] text-slate-600">
                Áurea{" "}
                <span className="text-slate-400 font-mono">
                  {(blueprint.analisisIA.cumplimientoProporcion * 100).toFixed(0)}%
                </span>
              </span>
            </div>
          </div>
          {blueprint.analisisIA.sugerencias.length > 0 && (
            <div className="mt-2 p-1.5 bg-purple-500/5 border border-purple-500/10 rounded-lg">
              <p className="text-[7px] text-purple-300 leading-relaxed">
                {blueprint.analisisIA.sugerencias[
                  blueprint.analisisIA.sugerencias.length - 1
                ].replace("💡 Sugerencia IA: ", "")}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-white/5 px-2 pt-2">
        {TABS.map(({ key, icon: Icon, label }) => (
          <button
            key={key}
            onClick={() => onCambiarTab(key)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-[8px] font-black uppercase tracking-widest border-b-2 transition-all ${
              tabActivo === key
                ? "border-blue-500 text-white"
                : "border-transparent text-slate-600 hover:text-slate-400"
            }`}
          >
            <Icon size={12} weight="duotone" />
            {label}
          </button>
        ))}
      </div>

      {/* Contenido del tab activo */}
      <div className="flex-1 overflow-y-auto scrollbar-hide p-4 space-y-4">
        {tabActivo === "vistas" && (
          <TabVistas
            blueprint={blueprint}
            goldenMode={goldenMode}
            onCambiarVista={onCambiarVista}
            onAlternarGuia={onAlternarGuia}
            onSetGuiaValor={onSetGuiaValor}
            onToggleGoldenMode={onToggleGoldenMode}
          />
        )}
        {tabActivo === "gizmos" && (
          <TabGizmos
            blueprint={blueprint}
            seleccionadoId={seleccionadoId}
            onActualizarTransformacion3D={onActualizarTransformacion3D}
            onResetearTransformacion3D={onResetearTransformacion3D}
            onAplicarEstiloAPieza={onAplicarEstiloAPieza}
          />
        )}
        {tabActivo === "pbr" && (
          <TabPBR
            blueprint={blueprint}
            seleccionadoId={seleccionadoId}
            onActualizarDiente={onActualizarDiente}
          />
        )}
        {tabActivo === "auditoria" && (
          <TabAuditoria
            auditoria={auditoria}
            onEjecutarAuditoria={onEjecutarAuditoria}
          />
        )}
      </div>

      {/* Acciones finales */}
      <div className="p-4 border-t border-white/5 flex flex-col gap-2">
        <button
          onClick={onGuardarDiseno}
          disabled={!casoId}
          className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white text-xs font-black rounded-2xl shadow-xl shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
        >
          <CheckCircle size={16} weight="fill" />
          CONFIRMAR DISEÑO
        </button>
        <button
          onClick={onGenerarReporte}
          className="w-full py-2.5 bg-white/5 border border-white/10 text-slate-400 text-[10px] font-bold rounded-2xl transition-all flex items-center justify-center gap-2 hover:border-white/20"
        >
          <FileText size={14} />
          GENERAR REPORTE PDF
        </button>
      </div>
    </motion.aside>
  );
}
