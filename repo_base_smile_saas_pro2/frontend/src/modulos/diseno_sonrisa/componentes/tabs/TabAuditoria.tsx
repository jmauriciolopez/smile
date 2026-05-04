import React from "react";
import {
  Stethoscope,
  FirstAid,
  ShieldCheck,
  ShieldWarning,
  WarningOctagon,
  ListChecks,
} from "@phosphor-icons/react";
import { ResultadoAuditoria } from "../../../../motor/clinical-audit-engine";

interface TabAuditoriaProps {
  auditoria: ResultadoAuditoria | null;
  onEjecutarAuditoria: () => void;
}

export function TabAuditoria({ auditoria, onEjecutarAuditoria }: TabAuditoriaProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Stethoscope size={13} weight="duotone" className="text-rose-400" />
          <h3 className="text-[9px] font-black uppercase tracking-widest text-slate-500">
            Auditoría Clínica
          </h3>
        </div>
        <button
          onClick={onEjecutarAuditoria}
          className="flex items-center gap-1.5 px-2.5 py-1 bg-rose-600/20 hover:bg-rose-600/40 border border-rose-500/30 rounded-lg text-[8px] font-black text-rose-300 transition-all uppercase"
        >
          <FirstAid size={10} weight="fill" />
          Auditar
        </button>
      </div>

      {!auditoria ? (
        <div className="flex flex-col items-center justify-center py-10 gap-3">
          <Stethoscope size={32} weight="duotone" className="text-slate-700" />
          <p className="text-[8px] text-slate-600 text-center leading-relaxed">
            Ejecuta la auditoría para
            <br />
            validar el diseño contra
            <br />
            criterios clínicos
          </p>
        </div>
      ) : (
        <>
          {/* Score clínico */}
          <div
            className={`p-3 rounded-xl border ${
              auditoria.aprobado
                ? "bg-emerald-500/5 border-emerald-500/20"
                : "bg-red-500/5 border-red-500/20"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {auditoria.aprobado ? (
                  <ShieldCheck size={16} weight="fill" className="text-emerald-400" />
                ) : (
                  <ShieldWarning size={16} weight="fill" className="text-red-400" />
                )}
                <span
                  className={`text-[9px] font-black uppercase ${
                    auditoria.aprobado ? "text-emerald-400" : "text-red-400"
                  }`}
                >
                  {auditoria.aprobado ? "Aprobado" : "Requiere revisión"}
                </span>
              </div>
              <div className="flex items-end gap-1">
                <span
                  className={`text-xl font-black font-mono ${
                    auditoria.scoreClinico >= 80
                      ? "text-emerald-400"
                      : auditoria.scoreClinico >= 60
                        ? "text-amber-400"
                        : "text-red-400"
                  }`}
                >
                  {auditoria.scoreClinico}
                </span>
                <span className="text-[8px] text-slate-600 mb-0.5">/100</span>
              </div>
            </div>
            <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  auditoria.scoreClinico >= 80
                    ? "bg-emerald-500"
                    : auditoria.scoreClinico >= 60
                      ? "bg-amber-500"
                      : "bg-red-500"
                }`}
                style={{ width: `${auditoria.scoreClinico}%` }}
              />
            </div>
            <p className="text-[7px] text-slate-500 mt-2 leading-relaxed">
              {auditoria.resumen.replace("✅ ", "").replace("🚨 ", "")}
            </p>
            <p className="text-[6px] text-slate-700 mt-1">
              {new Date(auditoria.timestamp).toLocaleTimeString()}
            </p>
          </div>

          {/* Resumen por severidad */}
          {auditoria.alertas.length > 0 && (
            <div className="flex gap-1.5">
              {(
                [
                  { sev: "critico", label: "Críticas", color: "text-red-400", bg: "bg-red-500/10 border-red-500/20" },
                  { sev: "advertencia", label: "Advertencias", color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20" },
                  { sev: "info", label: "Info", color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20" },
                ] as const
              ).map(({ sev, label, color, bg }) => {
                const count = auditoria.alertas.filter((a) => a.severidad === sev).length;
                if (count === 0) return null;
                return (
                  <div key={sev} className={`flex-1 flex flex-col items-center py-1.5 rounded-lg border ${bg}`}>
                    <span className={`text-base font-black font-mono ${color}`}>{count}</span>
                    <span className={`text-[6px] font-bold ${color}`}>{label}</span>
                  </div>
                );
              })}
            </div>
          )}

          {/* Lista de alertas */}
          <div className="space-y-2">
            {auditoria.alertas.length === 0 ? (
              <div className="flex items-center gap-2 p-2.5 bg-emerald-500/5 border border-emerald-500/10 rounded-xl">
                <ListChecks size={14} weight="fill" className="text-emerald-400 shrink-0" />
                <p className="text-[8px] text-emerald-400 font-bold">
                  Sin alertas. Diseño clínicamente óptimo.
                </p>
              </div>
            ) : (
              auditoria.alertas.map((alerta) => {
                const IconoAlerta =
                  alerta.severidad === "critico"
                    ? WarningOctagon
                    : alerta.severidad === "advertencia"
                      ? ShieldWarning
                      : FirstAid;
                const colorBorde =
                  alerta.severidad === "critico"
                    ? "border-red-500/20 bg-red-500/5"
                    : alerta.severidad === "advertencia"
                      ? "border-amber-500/20 bg-amber-500/5"
                      : "border-blue-500/20 bg-blue-500/5";
                const colorIcono =
                  alerta.severidad === "critico"
                    ? "text-red-400"
                    : alerta.severidad === "advertencia"
                      ? "text-amber-400"
                      : "text-blue-400";
                return (
                  <div key={alerta.id} className={`p-2.5 rounded-xl border ${colorBorde} space-y-1`}>
                    <div className="flex items-start gap-2">
                      <IconoAlerta size={12} weight="fill" className={`${colorIcono} shrink-0 mt-0.5`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-[8px] font-black text-white leading-tight">{alerta.mensaje}</p>
                        {alerta.pieza && (
                          <span className="text-[6px] font-mono text-slate-600">FDI {alerta.pieza}</span>
                        )}
                      </div>
                    </div>
                    <p className="text-[7px] text-slate-500 leading-relaxed pl-5">{alerta.recomendacion}</p>
                    <details className="pl-5">
                      <summary className="text-[6px] text-slate-700 cursor-pointer hover:text-slate-500 transition-colors">
                        Detalle técnico
                      </summary>
                      <p className="text-[6px] text-slate-700 mt-1 font-mono leading-relaxed">
                        {alerta.detalleTecnico}
                      </p>
                    </details>
                  </div>
                );
              })
            )}
          </div>
        </>
      )}
    </div>
  );
}
