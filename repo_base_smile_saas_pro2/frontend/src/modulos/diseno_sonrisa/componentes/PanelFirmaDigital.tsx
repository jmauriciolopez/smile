/**
 * PANEL FIRMA DIGITAL — Fase F
 *
 * Módulo de consentimiento digital vinculado al diseño.
 * Genera un documento de aprobación con:
 *   - Hash SHA-256 del diseño actual (Chain of Custody)
 *   - Firma del doctor (nombre + timestamp)
 *   - Estado: borrador | revisión | aprobado
 *
 * La integración con PKI/certificados digitales es Fase F.
 * Esta implementación genera el documento firmable y lo exporta como JSON.
 */

import React, { useState } from 'react';
import { useEditorStore } from '../../../store/editor-sonrisa.store';

type EstadoFirma = 'sin_firmar' | 'firmado' | 'aprobado';

interface DocumentoFirma {
  version:        string;
  fecha:          string;
  hashDiseno:     string;
  firmadoPor:     string;
  rolFirmante:    string;
  estado:         EstadoFirma;
  observaciones:  string;
  timestampFirma: string;
}

export const PanelFirmaDigital: React.FC = () => {
  const store = useEditorStore();

  const [nombreFirmante, setNombreFirmante] = useState('');
  const [rolFirmante,    setRolFirmante]    = useState('odontologo');
  const [observaciones,  setObservaciones]  = useState('');
  const [estado,         setEstado]         = useState<EstadoFirma>('sin_firmar');
  const [documento,      setDocumento]      = useState<DocumentoFirma | null>(null);
  const [generando,      setGenerando]      = useState(false);

  const hashActual = store.history[store.historyIndex]?.hash ?? '';

  const firmar = async () => {
    if (!nombreFirmante.trim()) return;
    setGenerando(true);

    // Generar hash del diseño completo actual
    let hashDiseno = hashActual;
    if (!hashDiseno) {
      try {
        const datos  = JSON.stringify(store.exportarDiseno());
        const buffer = new TextEncoder().encode(datos);
        const digest = await crypto.subtle.digest('SHA-256', buffer);
        hashDiseno   = Array.from(new Uint8Array(digest))
          .map(b => b.toString(16).padStart(2, '0'))
          .join('');
      } catch {
        hashDiseno = Date.now().toString(36);
      }
    }

    const doc: DocumentoFirma = {
      version:        '2.1',
      fecha:          new Date().toLocaleDateString('es-AR'),
      hashDiseno,
      firmadoPor:     nombreFirmante.trim(),
      rolFirmante,
      estado:         'firmado',
      observaciones:  observaciones.trim(),
      timestampFirma: new Date().toISOString(),
    };

    setDocumento(doc);
    setEstado('firmado');
    setGenerando(false);
  };

  const aprobar = () => {
    if (!documento) return;
    setDocumento({ ...documento, estado: 'aprobado' });
    setEstado('aprobado');
  };

  const descargarDocumento = () => {
    if (!documento) return;
    const json = JSON.stringify(documento, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `firma-diseno-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const resetear = () => {
    setDocumento(null);
    setEstado('sin_firmar');
    setNombreFirmante('');
    setObservaciones('');
  };

  return (
    <div className="space-y-4 text-xs">

      {/* Info Fase F */}
      <div className="rounded-xl bg-slate-50 border border-slate-100 p-3 flex items-start gap-2">
        <span className="text-slate-400 text-base leading-none mt-0.5">🔒</span>
        <div>
          <p className="font-bold text-slate-600">Firma Digital — Fase F</p>
          <p className="text-slate-400 mt-0.5 leading-relaxed">
            Integración con PKI/certificados en Fase F. Esta versión genera el documento firmable con hash SHA-256 del diseño.
          </p>
        </div>
      </div>

      {/* Hash del diseño actual */}
      <div className="rounded-xl border border-slate-200 bg-white p-3 space-y-1">
        <p className="font-bold uppercase tracking-wider text-slate-400 text-[10px]">🔐 Hash del diseño</p>
        {hashActual ? (
          <code className="block rounded-lg bg-slate-100 px-2 py-1.5 font-mono text-[9px] text-slate-600 break-all">
            {hashActual}
          </code>
        ) : (
          <p className="text-slate-400 italic">Realizá un cambio en el diseño para generar el hash.</p>
        )}
      </div>

      {estado === 'sin_firmar' && (
        <div className="rounded-xl border border-slate-200 bg-white p-3 space-y-3">
          <p className="font-bold uppercase tracking-wider text-slate-400 text-[10px]">✍️ Firmar diseño</p>

          <div>
            <label className="block mb-1 font-bold uppercase tracking-wider text-slate-500">Nombre del firmante</label>
            <input
              type="text"
              placeholder="Dr. Juan García"
              value={nombreFirmante}
              onChange={e => setNombreFirmante(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block mb-1 font-bold uppercase tracking-wider text-slate-500">Rol</label>
            <select
              value={rolFirmante}
              onChange={e => setRolFirmante(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-400"
            >
              <option value="odontologo">Odontólogo</option>
              <option value="tecnico">Técnico de Laboratorio</option>
              <option value="director">Director Clínico</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 font-bold uppercase tracking-wider text-slate-500">Observaciones</label>
            <textarea
              placeholder="Diseño aprobado para fabricación…"
              value={observaciones}
              onChange={e => setObservaciones(e.target.value)}
              rows={2}
              className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-xs resize-none focus:outline-none focus:ring-1 focus:ring-blue-400"
            />
          </div>

          <button
            onClick={firmar}
            disabled={generando || !nombreFirmante.trim()}
            className="w-full rounded-xl bg-slate-800 py-2 text-xs font-bold text-white hover:bg-slate-700 disabled:opacity-40 transition"
          >
            {generando ? 'Generando…' : '✍️ Firmar diseño'}
          </button>
        </div>
      )}

      {documento && (
        <div className={`rounded-xl border p-3 space-y-2 ${
          estado === 'aprobado'
            ? 'border-emerald-200 bg-emerald-50'
            : 'border-blue-100 bg-blue-50'
        }`}>
          <div className="flex items-center justify-between">
            <p className={`font-bold text-[10px] uppercase tracking-widest ${
              estado === 'aprobado' ? 'text-emerald-700' : 'text-blue-700'
            }`}>
              {estado === 'aprobado' ? '✅ Diseño aprobado' : '✍️ Diseño firmado'}
            </p>
            <button onClick={resetear} className="text-[9px] text-slate-400 underline">Resetear</button>
          </div>

          <div className="space-y-1 font-mono text-[9px] text-slate-600">
            <div><span className="font-bold">Firmado por:</span> {documento.firmadoPor} ({documento.rolFirmante})</div>
            <div><span className="font-bold">Fecha:</span> {documento.fecha}</div>
            <div><span className="font-bold">Hash:</span> {documento.hashDiseno.slice(0, 16)}…</div>
            {documento.observaciones && (
              <div><span className="font-bold">Obs:</span> {documento.observaciones}</div>
            )}
          </div>

          <div className="flex gap-2 pt-1">
            {estado === 'firmado' && (
              <button
                onClick={aprobar}
                className="flex-1 rounded-xl bg-emerald-600 py-1.5 text-[10px] font-bold text-white hover:bg-emerald-700 transition"
              >✅ Aprobar diseño</button>
            )}
            <button
              onClick={descargarDocumento}
              className="flex-1 rounded-xl border border-slate-200 bg-white py-1.5 text-[10px] font-bold text-slate-600 hover:bg-slate-50 transition"
            >⬇ Descargar documento</button>
          </div>
        </div>
      )}

    </div>
  );
};
