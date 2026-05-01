import React, { useRef, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card } from '../../../componentes/ui/Card';
import { LienzoDiseno } from '../componentes/LienzoDiseno';
import { PanelExportacion } from '../componentes/PanelExportacion';
import { PanelColaboracion } from '../componentes/PanelColaboracion';
import { PanelFirmaDigital } from '../componentes/PanelFirmaDigital';
import { useEditorSonrisa, presetsEditor, type PresetNombre } from '../../../hooks/useEditorSonrisa';
import { useEditorStore } from '../../../store/editor-sonrisa.store';
import { useFaceEngine } from '../../../motor/useFaceEngine';
import { analizarVisagismo, DESCRIPCION_FORMA } from '../../../motor/visagismo';
import { analizarColorMatch } from '../../../motor/color-match';

type PanelTab = 'ajustes' | 'exportar' | 'colaborar' | 'firma';

/* ── Sub-componente: Visagismo + Color Match ─────────────────────────────── */
function VisagismoPanel({ imgRef }: { imgRef: React.RefObject<HTMLImageElement> }) {
  const store = useEditorStore();
  const [resultado, setResultado] = React.useState<ReturnType<typeof analizarVisagismo> | null>(null);
  const [colorMatch, setColorMatch] = React.useState<{ colorSugerido: string; vitaAproximado: string; descripcion: string; temperatura: string } | null>(null);
  const [analizando, setAnalizando] = React.useState(false);

  const analizar = async () => {
    if (!store.faceData) return;
    setAnalizando(true);

    // Visagismo
    const res = analizarVisagismo(store.faceData);
    setResultado(res);

    // Color Match (requiere imagen cargada)
    if (imgRef.current && imgRef.current.complete && store.fotoUrl) {
      try {
        const cm = await analizarColorMatch(imgRef.current, store.faceData, store.canvasSize);
        setColorMatch(cm);
        // Aplicar color sugerido a todos los dientes
        store.dientes.forEach(d => {
          store.actualizarMaterial(d.id, { colorBase: cm.colorSugerido });
        });
      } catch {
        // CORS o imagen no disponible — ignorar color match
      }
    }

    setAnalizando(false);
  };

  return (
    <Card titulo="🧠 Visagismo Digital">
      <div className="space-y-3 text-xs">
        <p className="text-slate-400 leading-relaxed">
          Análisis facial automático para sugerir la morfología dental más armónica.
        </p>

        <button
          onClick={analizar}
          disabled={analizando || !store.faceData}
          className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 py-2 text-xs font-bold text-white hover:opacity-90 disabled:opacity-40 transition"
        >
          {analizando ? (
            <span className="flex items-center justify-center gap-2">
              <span className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Analizando…
            </span>
          ) : '🧠 Analizar rostro'}
        </button>

        {resultado && (
          <div className="space-y-2">
            {/* Forma facial */}
            <div className="rounded-lg bg-violet-50 border border-violet-100 p-2.5 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-violet-700 capitalize">{resultado.formaFacial}</span>
                <span className="rounded-full bg-violet-100 px-2 py-0.5 text-[9px] font-bold text-violet-600">
                  {Math.round(resultado.confianza * 100)}% confianza
                </span>
              </div>
              <p className="text-[10px] text-violet-600 leading-relaxed">{resultado.razonamiento}</p>
            </div>

            {/* Preset sugerido */}
            <div className="flex items-center gap-2 rounded-lg bg-blue-50 border border-blue-100 p-2">
              <span className="text-blue-600 font-bold text-[10px] uppercase tracking-wider">Preset sugerido:</span>
              <span className="rounded-full bg-blue-600 px-2 py-0.5 text-[9px] font-bold text-white capitalize">
                {resultado.presetSugerido}
              </span>
            </div>

            {/* Métricas */}
            <div className="grid grid-cols-2 gap-1.5 font-mono text-[9px] text-slate-500">
              <div className="rounded bg-slate-50 px-2 py-1">
                <span className="font-bold">Índice facial:</span> {resultado.metricas.indiceFacial}
              </div>
              <div className="rounded bg-slate-50 px-2 py-1">
                <span className="font-bold">Mandibular:</span> {resultado.metricas.indiceMandibular}
              </div>
            </div>
          </div>
        )}

        {/* Color Match */}
        {colorMatch && (
          <div className="rounded-lg border border-slate-200 p-2.5 space-y-1.5">
            <p className="font-bold text-[10px] uppercase tracking-wider text-slate-500">🎨 Color Match</p>
            <div className="flex items-center gap-2">
              <div
                className="h-8 w-8 rounded-lg border border-slate-200 flex-shrink-0"
                style={{ backgroundColor: colorMatch.colorSugerido }}
              />
              <div>
                <p className="font-bold text-slate-700">{colorMatch.vitaAproximado} — {colorMatch.temperatura}</p>
                <p className="text-[9px] text-slate-400 leading-relaxed">{colorMatch.descripcion}</p>
              </div>
            </div>
            <p className="text-[9px] text-emerald-600">✓ Color aplicado a todas las piezas</p>
          </div>
        )}
      </div>
    </Card>
  );
}

/* ── Sub-componente: Calibración métrica ─────────────────────────────────── */
function CalibracionPanel() {
  const store = useEditorStore();
  const [distPx, setDistPx] = React.useState('');
  const [medMm,  setMedMm]  = React.useState('35'); // ancho intercanino típico

  const aplicar = () => {
    const px = parseFloat(distPx);
    const mm = parseFloat(medMm);
    if (!px || !mm || px <= 0 || mm <= 0) return;
    store.setCalibracion({ distanciaPx: px, medidaMm: mm, mmPorPx: mm / px });
  };

  const cal = store.calibracion;

  return (
    <div className="space-y-3 text-xs">
      <p className="text-slate-400 leading-relaxed">
        Ingresá una distancia conocida en px (ej. ancho entre caninos medido en el lienzo) y su valor real en mm para calibrar la ficha técnica.
      </p>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block mb-1 font-bold uppercase tracking-wider text-slate-500">Distancia (px)</label>
          <input
            type="number" min="1" placeholder="ej. 280"
            value={distPx} onChange={e => setDistPx(e.target.value)}
            className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-blue-400"
          />
        </div>
        <div>
          <label className="block mb-1 font-bold uppercase tracking-wider text-slate-500">Medida real (mm)</label>
          <input
            type="number" min="1" placeholder="ej. 35"
            value={medMm} onChange={e => setMedMm(e.target.value)}
            className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-blue-400"
          />
        </div>
      </div>
      <button
        onClick={aplicar}
        className="w-full rounded-xl bg-slate-800 py-1.5 text-xs font-bold text-white hover:bg-slate-700 transition"
      >Aplicar calibración</button>

      {cal && (
        <div className="rounded-lg bg-emerald-50 border border-emerald-100 p-2 font-mono text-[10px] text-emerald-700 space-y-0.5">
          <div>✓ {cal.mmPorPx.toFixed(4)} mm/px</div>
          <div>{cal.distanciaPx}px = {cal.medidaMm}mm</div>
          <button
            onClick={() => store.setCalibracion(null)}
            className="text-[9px] text-emerald-500 underline mt-1"
          >Limpiar</button>
        </div>
      )}
    </div>
  );
}

/* ── Sub-componente: Snapshot Diff ───────────────────────────────────────── */
function SnapshotDiffPanel() {
  const store = useEditorStore();
  const { history, historyIndex } = store;

  // Mostrar los últimos 8 snapshots
  const visibles = history.slice(-8).reverse();

  return (
    <div className="space-y-1.5 text-[10px]">
      <p className="text-slate-400 mb-2">
        {history.length} versión{history.length !== 1 ? 'es' : ''} · posición actual: {historyIndex + 1}
      </p>
      {visibles.map((v, i) => {
        const idx = history.length - 1 - i;
        const esActual = idx === historyIndex;
        return (
          <button
            key={v.timestamp}
            onClick={() => {
              // Navegar al snapshot: aplicar undo/redo hasta llegar
              const delta = idx - historyIndex;
              if (delta < 0) {
                for (let j = 0; j < Math.abs(delta); j++) store.undo();
              } else {
                for (let j = 0; j < delta; j++) store.redo();
              }
            }}
            className={`w-full text-left rounded-lg px-2 py-1.5 font-mono transition-all ${
              esActual
                ? 'bg-blue-50 border border-blue-200 text-blue-700'
                : 'bg-slate-50 border border-slate-100 text-slate-500 hover:border-slate-200'
            }`}
          >
            <span className="font-bold">{esActual ? '▶ ' : '  '}</span>
            v{idx + 1} · {new Date(v.timestamp).toLocaleTimeString()} ·{' '}
            {v.dientes.length} piezas
            {v.hash ? (
              <span className="ml-1 text-[9px] text-slate-300">#{v.hash.slice(0, 6)}</span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
export function EditorSonrisaPage() {
  const navigate    = useNavigate();
  const { casoId }  = useParams();

  const { store, preset, aplicarPreset, manejarGuardar, caso, cargando, guardando, error } =
    useEditorSonrisa(casoId);
  const { detectando, error: errorFace, detectar } = useFaceEngine();

  const seleccionado = store.dientes.find(d => d.id === store.seleccionadoId);
  const [mensajeOk, setMensajeOk] = useState(false);
  const [tab,       setTab]       = useState<PanelTab>('ajustes');

  /* ── Keyboard shortcuts Undo/Redo ──────────────────────────────────── */
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        store.undo();
      }
      if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        store.redo();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [store]);

  /* ── Guardar con feedback ──────────────────────────────────────────── */
  const onGuardar = async () => {
    const ok = await manejarGuardar();
    if (ok) { setMensajeOk(true); setTimeout(() => setMensajeOk(false), 3000); }
  };

  /* ── Carga de foto local ────────────────────────────────────────────── */
  const inputFileRef = useRef<HTMLInputElement>(null);
  const imgOcultoRef = useRef<HTMLImageElement>(null);

  const onFotoSeleccionada = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    store.setFotoUrl(url);
    store.resetDientes();
  }, [store]);

  /* ── Detectar cara en foto ──────────────────────────────────────────── */
  const onDetectarCara = async () => {
    if (!imgOcultoRef.current || !store.fotoUrl) return;
    // Esperar que la imagen esté cargada
    if (!imgOcultoRef.current.complete) {
      await new Promise<void>(res => {
        imgOcultoRef.current!.onload = () => res();
      });
    }
    await detectar(imgOcultoRef.current);
  };

  /* ── Slider por pieza seleccionada ─────────────────────────────────── */
  const onTransformSlider = (key: string, raw: number) => {
    if (!store.seleccionadoId) return;
    if (key === 'opacity') {
      store.actualizarOpacidad(store.seleccionadoId, raw / 100);
    } else {
      store.actualizarDiente(store.seleccionadoId, { [key]: raw } as any);
    }
  };

  /* ── Loading ────────────────────────────────────────────────────────── */
  if (cargando) return (
    <div className="flex min-h-[500px] flex-col items-center justify-center gap-4">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      <p className="text-sm text-slate-500 italic">Cargando sesión de diseño…</p>
    </div>
  );

  return (
    <div className="space-y-5 animate-in fade-in duration-500">

      {/* ── HEADER ───────────────────────────────────────────────────────── */}
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            ✦ Diseño Digital de Sonrisa
            <span className="ml-2 text-xs font-semibold text-blue-600 bg-blue-50 rounded px-2 py-0.5">PRO v2.1</span>
          </h1>
          <p className="mt-0.5 text-xs text-slate-400">Caso: {caso?.titulo ?? casoId}</p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {mensajeOk && <span className="text-xs font-bold text-emerald-600 animate-bounce">✓ Guardado</span>}

          {/* Cargar foto */}
          <input ref={inputFileRef} type="file" accept="image/*" className="hidden" onChange={onFotoSeleccionada} />
          <button
            onClick={() => inputFileRef.current?.click()}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 transition"
          >📷 Foto</button>

          {/* Detectar cara (FaceEngine) */}
          <button
            onClick={onDetectarCara}
            disabled={detectando || !store.fotoUrl}
            className="rounded-xl border border-violet-200 bg-violet-50 px-4 py-2 text-sm font-medium text-violet-700 hover:bg-violet-100 disabled:opacity-40 transition"
          >
            {detectando
              ? <><span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-violet-600 border-t-transparent mr-1" />Detectando…</>
              : '🎯 Detectar Cara'
            }
          </button>

          {/* Guardar */}
          <button
            onClick={onGuardar} disabled={guardando}
            className="rounded-xl bg-blue-600 px-5 py-2 text-sm font-bold text-white shadow-lg shadow-blue-500/25 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 transition-all"
          >{guardando ? 'Guardando…' : 'Guardar Diseño'}</button>

          {/* Undo / Redo */}
          <button
            onClick={() => store.undo()}
            disabled={!store.canUndo()}
            title="Deshacer (Ctrl+Z)"
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-500 hover:bg-slate-50 disabled:opacity-30 transition"
          >↩</button>
          <button
            onClick={() => store.redo()}
            disabled={!store.canRedo()}
            title="Rehacer (Ctrl+Y)"
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-500 hover:bg-slate-50 disabled:opacity-30 transition"
          >↪</button>

          <button
            onClick={() => navigate(-1)}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-500 hover:bg-slate-50 transition"
          >Cerrar</button>
        </div>
      </header>

      {/* ── Errores ──────────────────────────────────────────────────────── */}
      {(error || errorFace) && (
        <div className="rounded-xl bg-red-50 p-3 text-sm font-medium text-red-600 border border-red-100">
          ⚠️ {error ?? errorFace}
        </div>
      )}

      {/* Imagen oculta para FaceEngine y render */}
      {store.fotoUrl && (
        <img ref={imgOcultoRef} src={store.fotoUrl} alt="" crossOrigin="anonymous" className="hidden" />
      )}

      {/* ── LAYOUT PRINCIPAL ─────────────────────────────────────────────── */}
      <div className="grid gap-5 lg:grid-cols-[1fr_340px]">

        {/* LIENZO */}
        <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
          {/* Chrome bar */}
          <div className="bg-slate-800 px-4 py-2 flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
            <span className="ml-2 text-[11px] text-slate-400 font-mono">
              smile-canvas v2.1 · {store.dientes.length} piezas · {store.fotoUrl ? 'foto activa' : 'sin foto'}
              {store.faceData ? ' · 🎯 face detectado' : ''}
            </span>
          </div>
          <LienzoDiseno width={860} height={580} />
        </div>

        {/* PANEL DERECHO con tabs */}
        <div className="flex flex-col gap-0">

          {/* Tabs */}
          <div className="flex border-b border-slate-200 mb-4">
            {([
              { id: 'ajustes',   label: '🎨 Ajustes'   },
              { id: 'exportar',  label: '🖼️ Exportar'  },
              { id: 'colaborar', label: '👥 Colaborar' },
              { id: 'firma',     label: '🔒 Firma'     },
            ] as const).map(t => (
              <button key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex-1 py-2 text-[10px] font-bold transition-all border-b-2 ${
                  tab === t.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
              >{t.label}</button>
            ))}
          </div>

          {/* ── TAB: AJUSTES ───────────────────────────────────────────── */}
          {tab === 'ajustes' && (
            <div className="flex flex-col gap-4">

              {/* Presets globales */}
              <Card titulo="🎨 Presets de Sonrisa">
                <div className="grid grid-cols-3 gap-2">
                  {(Object.keys(presetsEditor) as PresetNombre[]).map((n) => (
                    <button key={n}
                      onClick={() => aplicarPreset(n)}
                      className={`rounded-xl border py-2 text-xs font-bold capitalize transition-all ${
                        preset === n
                          ? 'border-blue-500 bg-blue-50 text-blue-600'
                          : 'border-slate-100 bg-slate-50 text-slate-400 hover:border-slate-200'
                      }`}
                    >{n}</button>
                  ))}
                </div>
              </Card>

              {/* Pieza seleccionada */}
              {seleccionado ? (
                <Card titulo={`🦷 Pieza ${seleccionado.pieza}`}>
                  <div className="space-y-3.5 text-xs">
                    {[
                      { label: 'Rotación', key: 'rotation', min: -45,  max: 45,  value: Math.round(seleccionado.transform.rotation), unit: '°' },
                      { label: 'Escala X',  key: 'scaleX',  min:  30,  max: 150, value: Math.round(seleccionado.transform.scaleX * 100), unit: '%' },
                      { label: 'Escala Y',  key: 'scaleY',  min:  30,  max: 150, value: Math.round(seleccionado.transform.scaleY * 100), unit: '%' },
                      { label: 'Opacidad', key: 'opacity', min:  20,  max: 100, value: Math.round(seleccionado.opacity * 100), unit: '%' },
                    ].map(({ label, key, min, max, value, unit }) => (
                      <div key={key}>
                        <div className="mb-1 flex justify-between">
                          <span className="font-bold uppercase tracking-wider text-slate-500">{label}</span>
                          <span className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-slate-600">{value}{unit}</span>
                        </div>
                        <input type="range" min={min} max={max} value={value}
                          onChange={(e) => onTransformSlider(key, Number(e.target.value))}
                          className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-blue-600"
                        />
                      </div>
                    ))}

                    {/* Material PRO — translucidez + reflectividad */}
                    <div className="pt-1 border-t border-slate-100">
                      <p className="mb-2 font-bold uppercase tracking-wider text-slate-400 text-[10px]">💎 Material</p>
                      {[
                        { label: 'Translucidez', matKey: 'translucidez', value: Math.round(seleccionado.material.translucidez * 100) },
                        { label: 'Reflectividad', matKey: 'reflectividad', value: Math.round(seleccionado.material.reflectividad * 100) },
                      ].map(({ label, matKey, value }) => (
                        <div key={matKey} className="mb-2">
                          <div className="mb-1 flex justify-between">
                            <span className="font-bold uppercase tracking-wider text-slate-500">{label}</span>
                            <span className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-slate-600">{value}%</span>
                          </div>
                          <input type="range" min={0} max={100} value={value}
                            onChange={(e) =>
                              store.actualizarMaterial(seleccionado.id, { [matKey]: Number(e.target.value) / 100 })
                            }
                            className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-violet-600"
                          />
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() => store.toggleVisibilidad(seleccionado.id)}
                      className="w-full rounded-xl border border-slate-200 py-1.5 text-xs text-slate-500 hover:bg-slate-50 transition"
                    >{seleccionado.visible ? '👁 Ocultar pieza' : '👁 Mostrar pieza'}</button>
                  </div>
                </Card>
              ) : (
                <Card titulo="🦷 Piezas Dentales">
                  <p className="text-xs text-slate-400 mb-3">Haz clic en una pieza en el lienzo para seleccionarla.</p>
                  <div className="flex flex-wrap gap-1.5">
                    {store.dientes.map(d => (
                      <button key={d.id}
                        onClick={() => store.setSeleccionado(d.id)}
                        className="rounded-lg border border-slate-200 px-2 py-1 text-xs font-bold text-slate-500 hover:border-blue-400 hover:text-blue-600 transition"
                      >{d.pieza}</button>
                    ))}
                  </div>
                </Card>
              )}

              {/* Guías */}
              <Card titulo="📐 Guías Clínicas">
                <div className="space-y-2">
                  {store.guias.map(g => (
                    <label key={g.id} className="flex items-center gap-2 cursor-pointer text-xs text-slate-600">
                      <input type="checkbox" defaultChecked={g.visible} className="accent-blue-600"
                        onChange={(e) => store.toggleGuia(g.id, e.target.checked)}
                      />
                      <span className="capitalize">{g.id.replace('guia-', '')}</span>
                    </label>
                  ))}
                </div>
              </Card>

              {/* Calibración métrica */}
              <Card titulo="📏 Calibración (mm)">
                <CalibracionPanel />
              </Card>

              {/* Snapshot Diff — historial de versiones */}
              {store.history.length > 1 && (
                <Card titulo="🕐 Historial">
                  <SnapshotDiffPanel />
                </Card>
              )}

              {/* Info face */}
              {store.faceData && (
                <div className="rounded-xl bg-violet-50 border border-violet-100 p-3 space-y-1">
                  <p className="text-[10px] font-bold text-violet-600 uppercase tracking-widest">🎯 Face Engine activo</p>
                  <p className="text-[10px] text-violet-500">
                    Eje facial: {store.faceData.transform.rotation.toFixed(1)}° ·
                    Boca: {Math.round(store.faceData.landmarks.boca.ancho)}px ·
                    {store.faceData.lips.contornoCompleto.length} puntos de labio
                  </p>
                </div>
              )}

              {/* Visagismo + Color Match */}
              {store.faceData && (
                <VisagismoPanel imgRef={imgOcultoRef} />
              )}
            </div>
          )}

          {/* ── TAB: EXPORTAR ─────────────────────────────────────────── */}
          {tab === 'exportar' && (
            <PanelExportacion fotoUrl={store.fotoUrl} />
          )}

          {/* ── TAB: COLABORAR ────────────────────────────────────────── */}
          {tab === 'colaborar' && (
            <PanelColaboracion />
          )}

          {/* ── TAB: FIRMA ────────────────────────────────────────────── */}
          {tab === 'firma' && (
            <PanelFirmaDigital />
          )}
        </div>
      </div>
    </div>
  );
}
