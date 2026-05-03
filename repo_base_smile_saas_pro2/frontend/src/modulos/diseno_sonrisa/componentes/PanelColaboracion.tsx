/**
 * PanelColaboracion — Fase E (Live Design Room)
 * Conectado a servicioColaboracion para crear/unirse a sesiones reales.
 */

import React, { useState } from "react";
import {
  crearSesion,
  unirseASesion,
  cerrarSesion,
  type SesionColaboracion,
  type RolParticipante,
} from "../../../servicios/servicioColaboracion";

const ROL_LABEL: Record<string, string> = {
  odontologo: "Odontólogo",
  tecnico: "Técnico Lab",
  paciente: "Paciente",
};

const ROL_COLOR: Record<string, string> = {
  odontologo: "#3b82f6",
  tecnico: "#8b5cf6",
  paciente: "#10b981",
};

interface Props {
  casoId?: string;
  disenoId?: string;
}

export const PanelColaboracion: React.FC<Props> = ({ casoId, disenoId }) => {
  // useEditorStore() no se usa actualmente en este componente
  // const store = useEditorStore();

  const [sesion, setSesion] = useState<SesionColaboracion | null>(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [codigoUnirse, setCodigoUnirse] = useState("");
  const [nombreUnirse, setNombreUnirse] = useState("");
  const [rolUnirse, setRolUnirse] = useState<RolParticipante>("tecnico");
  const [copiado, setCopiado] = useState(false);
  const [modoUnirse, setModoUnirse] = useState(false);

  const onCrearSesion = async () => {
    if (!casoId || !disenoId) {
      setError("Se requiere un caso y diseño activo para crear una sesión.");
      return;
    }
    setCargando(true);
    setError(null);
    try {
      const nueva = await crearSesion({
        caso_clinico_id: casoId,
        diseno_id: disenoId,
      });
      setSesion(nueva);
    } catch (e: any) {
      setError(e?.message ?? "Error al crear la sesión");
    } finally {
      setCargando(false);
    }
  };

  const onUnirse = async () => {
    if (!codigoUnirse.trim() || !nombreUnirse.trim()) return;
    setCargando(true);
    setError(null);
    try {
      const actualizada = await unirseASesion({
        codigo_sesion: codigoUnirse.trim().toUpperCase(),
        nombre_participante: nombreUnirse.trim(),
        rol: rolUnirse,
      });
      setSesion(actualizada);
      setModoUnirse(false);
    } catch (e: any) {
      setError(e?.message ?? "Código de sesión no encontrado");
    } finally {
      setCargando(false);
    }
  };

  const onCerrar = async () => {
    if (!sesion) return;
    setCargando(true);
    try {
      await cerrarSesion(sesion.codigo_sesion);
      setSesion(null);
    } catch {
      setSesion(null);
    } finally {
      setCargando(false);
    }
  };

  const copiarCodigo = () => {
    if (!sesion) return;
    navigator.clipboard.writeText(sesion.codigo_sesion).catch(() => {});
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  return (
    <div className="space-y-4 text-xs">
      {/* Info Fase E */}
      <div className="rounded-xl bg-amber-50 border border-amber-100 p-3 flex items-start gap-2">
        <span className="text-amber-500 text-base leading-none mt-0.5">⚡</span>
        <div>
          <p className="font-bold text-amber-700">
            Fase E — Colaboración en tiempo real
          </p>
          <p className="text-amber-600 mt-0.5 leading-relaxed">
            Sesiones REST activas. WebSockets en tiempo real se activan en Fase
            E completa.
          </p>
        </div>
      </div>

      {error && (
        <div className="rounded-xl bg-red-50 border border-red-100 p-2 text-red-600 text-[10px]">
          ⚠️ {error}
        </div>
      )}

      {!sesion ? (
        <div className="space-y-3">
          {!modoUnirse ? (
            <>
              <button
                onClick={onCrearSesion}
                disabled={cargando || !casoId}
                className="w-full rounded-xl bg-blue-600 py-2 text-xs font-bold text-white hover:bg-blue-700 disabled:opacity-40 transition"
              >
                {cargando ? "Creando…" : "+ Crear sesión de colaboración"}
              </button>
              <button
                onClick={() => setModoUnirse(true)}
                className="w-full rounded-xl border border-slate-200 py-2 text-xs text-slate-500 hover:bg-slate-50 transition"
              >
                Unirse con código
              </button>
            </>
          ) : (
            <div className="space-y-2">
              <input
                placeholder="Código (ej. SMILE-AB12CD)"
                value={codigoUnirse}
                onChange={(e) => setCodigoUnirse(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-xs font-mono uppercase focus:outline-none focus:ring-1 focus:ring-blue-400"
              />
              <input
                placeholder="Tu nombre"
                value={nombreUnirse}
                onChange={(e) => setNombreUnirse(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-400"
              />
              <select
                value={rolUnirse}
                onChange={(e) =>
                  setRolUnirse(e.target.value as RolParticipante)
                }
                className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-400"
              >
                <option value="tecnico">Técnico Lab</option>
                <option value="odontologo">Odontólogo</option>
                <option value="paciente">Paciente</option>
              </select>
              <div className="flex gap-2">
                <button
                  onClick={onUnirse}
                  disabled={
                    cargando || !codigoUnirse.trim() || !nombreUnirse.trim()
                  }
                  className="flex-1 rounded-xl bg-blue-600 py-1.5 text-xs font-bold text-white disabled:opacity-40 transition"
                >
                  {cargando ? "Uniéndose…" : "Unirse"}
                </button>
                <button
                  onClick={() => setModoUnirse(false)}
                  className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs text-slate-500 hover:bg-slate-50 transition"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {/* Código de sesión */}
          <div className="rounded-xl border border-slate-200 bg-white p-3 space-y-2">
            <p className="font-bold uppercase tracking-wider text-slate-400 text-[10px]">
              🔗 Sesión activa
            </p>
            <div className="flex items-center gap-2">
              <code className="flex-1 rounded-lg bg-slate-100 px-3 py-2 font-mono text-sm font-bold text-slate-700 tracking-widest">
                {sesion.codigo_sesion}
              </code>
              <button
                onClick={copiarCodigo}
                className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-500 hover:bg-slate-50 transition"
              >
                {copiado ? "✓" : "📋"}
              </button>
            </div>
          </div>

          {/* Participantes */}
          <div className="rounded-xl border border-slate-200 bg-white p-3 space-y-2">
            <p className="font-bold uppercase tracking-wider text-slate-400 text-[10px]">
              👥 Participantes ({sesion.participantes.length})
            </p>
            {sesion.participantes.length === 0 ? (
              <p className="text-slate-400 italic text-[10px]">
                Esperando participantes…
              </p>
            ) : (
              sesion.participantes.map((p) => (
                <div key={p.id} className="flex items-center gap-2.5">
                  <div
                    className="h-7 w-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0"
                    style={{ backgroundColor: ROL_COLOR[p.rol] ?? "#94a3b8" }}
                  >
                    {p.nombre.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-700 truncate">
                      {p.nombre}
                    </p>
                    <p className="text-[10px] text-slate-400">
                      {ROL_LABEL[p.rol] ?? p.rol}
                    </p>
                  </div>
                  <span
                    className={`h-2 w-2 rounded-full flex-shrink-0 ${p.activo ? "bg-emerald-400" : "bg-slate-200"}`}
                  />
                </div>
              ))
            )}
          </div>

          <button
            onClick={onCerrar}
            disabled={cargando}
            className="w-full rounded-xl border border-red-100 bg-red-50 py-1.5 text-xs font-bold text-red-600 hover:bg-red-100 disabled:opacity-40 transition"
          >
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
};
