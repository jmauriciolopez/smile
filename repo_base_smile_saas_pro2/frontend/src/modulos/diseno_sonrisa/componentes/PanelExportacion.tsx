/**
 * PanelExportacion
 * Panel derecho del Editor PRO — Fase C: Render + Exportación
 *
 * Funcionalidades:
 * - Preview del render compuesto (Before/After split)
 * - Descarga PNG/JPG
 * - Opciones de calidad
 * - Botón "Enviar a Laboratorio" (placeholder para Fase E)
 */

import React, { useRef, useState } from 'react';
import { useRenderEngine } from '../../../motor/useRenderEngine';
import { useEditorStore }  from '../../../store/editor-sonrisa.store';

interface Props {
  fotoUrl: string | null;
}

export const PanelExportacion: React.FC<Props> = ({ fotoUrl }) => {
  const store  = useEditorStore();
  const { renderizando, resultado, error, renderizar, limpiar, descargar } = useRenderEngine();

  const [formato,      setFormato]      = useState<'jpg' | 'png'>('jpg');
  const [calidad,      setCalidad]      = useState(93);
  const [incluirGuias, setIncluirGuias] = useState(false);
  const [splitMode,    setSplitMode]    = useState(false);
  const [splitPos,     setSplitPos]     = useState(50);

  const imgRef = useRef<HTMLImageElement>(null);

  const onRenderizar = async () => {
    if (!imgRef.current || !fotoUrl) return;
    limpiar();
    await renderizar(imgRef.current, {
      formato,
      calidad:      calidad / 100,
      incluirGuias,
      factor:       2,
    });
  };

  const onDescargarFicha = () => {
    const ficha = store.exportarFichaTecnica();
    const json  = JSON.stringify(ficha, null, 2);
    const blob  = new Blob([json], { type: 'application/json' });
    const url   = URL.createObjectURL(blob);
    const a     = document.createElement('a');
    a.href      = url;
    a.download  = `ficha-tecnica-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  /**
   * Exporta el archivo .smile — formato de intercambio del spec.
   * Contiene: diseño JSON + metadata + referencia a imagen base.
   * Permite re-edición en cualquier instancia del sistema.
   */
  const onExportarSmile = () => {
    const diseno   = store.exportarDiseno();
    const ficha    = store.exportarFichaTecnica();
    const hashActual = store.history[store.historyIndex]?.hash ?? '';

    const archivoSmile = {
      formato:   'smile-design-pro',
      version:   '2.1',
      timestamp: new Date().toISOString(),
      hash:      hashActual,
      metadata: {
        estado:    'draft',
        createdAt: new Date().toISOString(),
      },
      diseno,
      fichaTecnica: ficha,
      // La imagen base se referencia por URL (no se embebe para mantener el archivo liviano)
      imagenBaseUrl: fotoUrl ?? null,
    };

    const json = JSON.stringify(archivoSmile, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `diseno-${Date.now()}.smile`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const nombreArchivo = `smile-design-${Date.now()}.${formato}`;

  return (
    <div className="flex flex-col gap-4">

      {/* ── Imagen oculta de referencia para el render ──────────────────── */}
      {fotoUrl && (
        <img
          ref={imgRef}
          src={fotoUrl}
          alt="base"
          crossOrigin="anonymous"
          className="hidden"
          onError={() => console.warn('CORS: No se puede renderizar imagen de URL externa')}
        />
      )}

      {/* ── Config del render ────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">⚙️ Render Config</h3>

        {/* Formato */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Formato</label>
          <div className="flex gap-2">
            {(['jpg', 'png'] as const).map((f) => (
              <button key={f}
                onClick={() => setFormato(f)}
                className={`flex-1 rounded-xl border py-1.5 text-xs font-bold uppercase transition-all ${formato === f ? 'border-blue-500 bg-blue-50 text-blue-600' : 'border-slate-100 bg-slate-50 text-slate-400 hover:border-slate-200'}`}
              >{f}</button>
            ))}
          </div>
        </div>

        {/* Calidad (sólo JPG) */}
        {formato === 'jpg' && (
          <div>
            <div className="flex justify-between mb-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Calidad</label>
              <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-mono text-slate-600">{calidad}%</span>
            </div>
            <input
              type="range" min={60} max={100} value={calidad}
              onChange={(e) => setCalidad(Number(e.target.value))}
              className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-blue-600"
            />
          </div>
        )}

        {/* Opciones */}
        <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-600">
          <input type="checkbox" checked={incluirGuias} onChange={(e) => setIncluirGuias(e.target.checked)} className="accent-blue-600" />
          Incluir guías clínicas en el render
        </label>

        {/* Botón principal */}
        <button
          onClick={onRenderizar}
          disabled={renderizando || !fotoUrl}
          className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-500/25 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 transition-all"
        >
          {renderizando ? (
            <span className="flex items-center justify-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Renderizando…
            </span>
          ) : '🖼️ Generar Render PRO'}
        </button>

        {!fotoUrl && (
          <p className="text-center text-[11px] text-amber-500">⚠️ Carga una foto primero para renderizar</p>
        )}
        {error && (
          <p className="text-center text-[11px] text-red-500">⚠️ {error}</p>
        )}
      </div>

      {/* ── Preview del resultado ────────────────────────────────────────── */}
      {resultado && (
        <div className="rounded-2xl border border-emerald-200 bg-white overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2 bg-emerald-50 border-b border-emerald-100">
            <span className="text-xs font-bold text-emerald-700">✓ Render listo — {resultado.ancho}×{resultado.alto}px</span>
            <button
              onClick={() => setSplitMode(v => !v)}
              className="text-[11px] font-bold text-emerald-600 underline"
            >{splitMode ? 'Ocultar Split' : 'Before/After'}</button>
          </div>

          {/* Vista previa */}
          <div
            className="relative overflow-hidden"
            onMouseMove={splitMode ? (e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              setSplitPos(((e.clientX - rect.left) / rect.width) * 100);
            } : undefined}
          >
            <img
              src={resultado.dataUrl}
              alt="Render PRO"
              className="w-full object-cover"
            />

            {/* Split screen Before/After */}
            {splitMode && fotoUrl && (
              <>
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: `url(${fotoUrl})`,
                    backgroundSize:  'cover',
                    backgroundPosition: 'center',
                    clipPath: `inset(0 ${100 - splitPos}% 0 0)`,
                  }}
                />
                <div
                  className="absolute inset-y-0 flex items-center justify-center"
                  style={{ left: `${splitPos}%`, transform: 'translateX(-50%)' }}
                >
                  <div className="h-full w-0.5 bg-white/80 shadow-[0_0_8px_white]" />
                  <div className="absolute rounded-full bg-white px-2 py-0.5 text-[9px] font-black text-slate-700 shadow-lg uppercase tracking-widest">
                    VS
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Acciones */}
          <div className="flex flex-wrap gap-2 p-3">
            <button
              onClick={() => descargar(nombreArchivo)}
              className="flex-1 rounded-xl bg-slate-900 px-3 py-2 text-xs font-bold text-white hover:bg-slate-800 transition"
            >⬇ Descargar</button>
            <button
              onClick={limpiar}
              className="rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-500 hover:bg-slate-50 transition"
            >✕</button>
            <button
              onClick={onExportarSmile}
              title="Exportar archivo .smile (JSON + metadata)"
              className="flex-1 rounded-xl border border-violet-200 bg-violet-50 px-3 py-2 text-xs font-bold text-violet-700 hover:bg-violet-100 transition"
            >💾 Exportar .smile</button>
          </div>

          {/* Ficha técnica para laboratorio */}
          <div className="px-3 pb-3">
            <button
              onClick={onDescargarFicha}
              className="w-full rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700 hover:bg-emerald-100 transition"
            >📋 Descargar Ficha Técnica (JSON Lab)</button>
          </div>
        </div>
      )}

      {/* ── Info técnica ─────────────────────────────────────────────────── */}
      <div className="rounded-xl bg-slate-50 border border-slate-100 p-3 text-[10px] font-mono text-slate-400 space-y-0.5">
        <div>Render: OffscreenCanvas 2x ({store.canvasSize.width * 2}×{store.canvasSize.height * 2}px)</div>
        <div>Blending: source-over + gradient esmalte</div>
        <div>Shadow: lip bajo + incisal</div>
        <div>FaceData: {store.faceData ? '✓ activo' : '— sin detección'}</div>
      </div>
    </div>
  );
};
