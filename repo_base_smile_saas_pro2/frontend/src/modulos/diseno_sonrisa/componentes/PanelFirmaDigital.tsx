/**
 * PanelFirmaDigital — Fase F
 * Conectado a servicioFirmas para firma/aprobación real con backend.
 */

import React, { useState, useEffect } from "react";
import { useEditorStore } from "../../../store/editor-sonrisa.store";
import {
  firmarDiseno,
  aprobarFirma,
  obtenerFirmaPorDiseno,
  verificarFirma,
  type DocumentoFirma,
  type RolFirmante,
} from "../../../servicios/servicioFirmas";

interface Props {
  disenoId?: string;
  casoId?: string;
}

type EstadoFirmaLocal = "sin_firmar" | "firmado" | "aprobado";

export const PanelFirmaDigital: React.FC<Props> = ({ disenoId, casoId }) => {
  const store = useEditorStore();

  const [nombreFirmante, setNombreFirmante] = useState("");
  const [rolFirmante, setRolFirmante] = useState<RolFirmante>("odontologo");
  const [observaciones, setObservaciones] = useState("");
  const [estado, setEstado] = useState<EstadoFirmaLocal>("sin_firmar");
  const [documento, setDocumento] = useState<DocumentoFirma | null>(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [verificacion, setVerificacion] = useState<{
    valida: boolean;
    motivo: string;
  } | null>(null);

  const hashActual = store.history[store.historyIndex]?.hash ?? "";

  // Cargar firma existente si hay disenoId
  useEffect(() => {
    if (!disenoId) return;
    obtenerFirmaPorDiseno(disenoId)
      .then((doc) => {
        if (doc) {
          setDocumento(doc);
          setEstado(doc.estado === "aprobado" ? "aprobado" : "firmado");
        }
      })
      .catch(() => {});
  }, [disenoId]);

  const firmar = async () => {
    if (!nombreFirmante.trim() || !disenoId || !casoId) return;
    setCargando(true);
    setError(null);

    let hashDiseno = hashActual;
    if (!hashDiseno) {
      try {
        const datos = JSON.stringify(store.exportarDiseno());
        const buffer = new TextEncoder().encode(datos);
        const digest = await crypto.subtle.digest("SHA-256", buffer);
        hashDiseno = Array.from(new Uint8Array(digest))
          .map((b) => b.toString(16).padStart(2, "0"))
          .join("");
      } catch {
        hashDiseno = Date.now().toString(36);
      }
    }

    try {
      const doc = await firmarDiseno({
        diseno_id: disenoId,
        caso_clinico_id: casoId,
        firmado_por: nombreFirmante.trim(),
        rol_firmante: rolFirmante,
        hash_diseno: hashDiseno,
        observaciones: observaciones.trim(),
      });
      setDocumento(doc);
      setEstado("firmado");
    } catch (e: any) {
      setError(e?.message ?? "Error al firmar el diseño");
    } finally {
      setCargando(false);
    }
  };

  const aprobar = async () => {
    if (!documento) return;
    setCargando(true);
    setError(null);
    try {
      const doc = await aprobarFirma({
        firma_id: documento.id,
        aprobado_por: nombreFirmante || "Director",
      });
      setDocumento(doc);
      setEstado("aprobado");
    } catch (e: any) {
      setError(e?.message ?? "Error al aprobar");
    } finally {
      setCargando(false);
    }
  };

  const verificar = async () => {
    if (!documento || !hashActual) return;
    setCargando(true);
    try {
      const result = await verificarFirma(documento.id, hashActual);
      setVerificacion(result);
    } catch {
      setVerificacion({ valida: false, motivo: "Error al verificar" });
    } finally {
      setCargando(false);
    }
  };

  const descargarDocumento = () => {
    if (!documento) return;
    const json = JSON.stringify(documento, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `firma-diseno-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const resetear = () => {
    setDocumento(null);
    setEstado("sin_firmar");
    setNombreFirmante("");
    setObservaciones("");
    setVerificacion(null);
    setError(null);
  };

  return (
    <div className="space-y-4 text-xs">
      {/* Info Fase F */}
      <div className="rounded-xl bg-slate-50 border border-slate-100 p-3 flex items-start gap-2">
        <span className="text-slate-400 text-base leading-none mt-0.5">🔒</span>
        <div>
          <p className="font-bold text-slate-600">Firma Digital — Fase F</p>
          <p className="text-slate-400 mt-0.5 leading-relaxed">
            Firma con hash SHA-256 + HMAC. PKI/certificados X.509 en Fase F
            completa.
          </p>
        </div>
      </div>

      {error && (
        <div className="rounded-xl bg-red-50 border border-red-100 p-2 text-red-600 text-[10px]">
          ⚠️ {error}
        </div>
      )}

      {/* Hash del diseño */}
      <div className="rounded-xl border border-slate-200 bg-white p-3 space-y-1">
        <p className="font-bold uppercase tracking-wider text-slate-400 text-[10px]">
          🔐 Hash del diseño
        </p>
        {hashActual ? (
          <code className="block rounded-lg bg-slate-100 px-2 py-1.5 font-mono text-[9px] text-slate-600 break-all">
            {hashActual}
          </code>
        ) : (
          <p className="text-slate-400 italic">
            Realizá un cambio para generar el hash.
          </p>
        )}
      </div>

      {estado === "sin_firmar" && (
        <div className="rounded-xl border border-slate-200 bg-white p-3 space-y-3">
          <p className="font-bold uppercase tracking-wider text-slate-400 text-[10px]">
            ✍️ Firmar diseño
          </p>
          <div>
            <label className="block mb-1 font-bold uppercase tracking-wider text-slate-500">
              Nombre
            </label>
            <input
              type="text"
              placeholder="Dr. Juan García"
              value={nombreFirmante}
              onChange={(e) => setNombreFirmante(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block mb-1 font-bold uppercase tracking-wider text-slate-500">
              Rol
            </label>
            <select
              value={rolFirmante}
              onChange={(e) => setRolFirmante(e.target.value as RolFirmante)}
              className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-400"
            >
              <option value="odontologo">Odontólogo</option>
              <option value="tecnico">Técnico de Laboratorio</option>
              <option value="director">Director Clínico</option>
            </select>
          </div>
          <div>
            <label className="block mb-1 font-bold uppercase tracking-wider text-slate-500">
              Observaciones
            </label>
            <textarea
              placeholder="Diseño aprobado para fabricación…"
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              rows={2}
              className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-xs resize-none focus:outline-none focus:ring-1 focus:ring-blue-400"
            />
          </div>
          <button
            onClick={firmar}
            disabled={cargando || !nombreFirmante.trim() || !disenoId}
            className="w-full rounded-xl bg-slate-800 py-2 text-xs font-bold text-white hover:bg-slate-700 disabled:opacity-40 transition"
          >
            {cargando ? "Firmando…" : "✍️ Firmar diseño"}
          </button>
          {!disenoId && (
            <p className="text-[10px] text-amber-500 text-center">
              Guardá el diseño primero para poder firmarlo.
            </p>
          )}
        </div>
      )}

      {documento && (
        <div
          className={`rounded-xl border p-3 space-y-2 ${estado === "aprobado" ? "border-emerald-200 bg-emerald-50" : "border-blue-100 bg-blue-50"}`}
        >
          <div className="flex items-center justify-between">
            <p
              className={`font-bold text-[10px] uppercase tracking-widest ${estado === "aprobado" ? "text-emerald-700" : "text-blue-700"}`}
            >
              {estado === "aprobado"
                ? "✅ Diseño aprobado"
                : "✍️ Diseño firmado"}
            </p>
            <button
              onClick={resetear}
              className="text-[9px] text-slate-400 underline"
            >
              Resetear
            </button>
          </div>
          <div className="space-y-1 font-mono text-[9px] text-slate-600">
            <div>
              <span className="font-bold">Firmado por:</span>{" "}
              {documento.firmado_por} ({documento.rol_firmante})
            </div>
            <div>
              <span className="font-bold">Timestamp:</span>{" "}
              {new Date(documento.timestamp_firma).toLocaleString()}
            </div>
            <div>
              <span className="font-bold">Hash:</span>{" "}
              {documento.hash_diseno.slice(0, 16)}…
            </div>
            {documento.observaciones && (
              <div>
                <span className="font-bold">Obs:</span>{" "}
                {documento.observaciones}
              </div>
            )}
          </div>

          {verificacion && (
            <div
              className={`rounded-lg p-2 text-[9px] font-mono ${verificacion.valida ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}
            >
              {verificacion.valida ? "✓" : "✗"} {verificacion.motivo}
            </div>
          )}

          <div className="flex flex-wrap gap-2 pt-1">
            {estado === "firmado" && (
              <button
                onClick={aprobar}
                disabled={cargando}
                className="flex-1 rounded-xl bg-emerald-600 py-1.5 text-[10px] font-bold text-white hover:bg-emerald-700 disabled:opacity-40 transition"
              >
                ✅ Aprobar
              </button>
            )}
            <button
              onClick={verificar}
              disabled={cargando || !hashActual}
              className="flex-1 rounded-xl border border-slate-200 bg-white py-1.5 text-[10px] font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-40 transition"
            >
              🔍 Verificar
            </button>
            <button
              onClick={descargarDocumento}
              className="flex-1 rounded-xl border border-slate-200 bg-white py-1.5 text-[10px] font-bold text-slate-600 hover:bg-slate-50 transition"
            >
              ⬇ Descargar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
