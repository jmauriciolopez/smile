import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card } from '../../../componentes/ui/Card';
import { useEditorSonrisa, presetsEditor, type PresetNombre } from '../../../hooks/useEditorSonrisa';

export function EditorSonrisaPage() {
  const navigate = useNavigate();
  const { casoId } = useParams();
  const { 
    ajustes, 
    setAncho, 
    setAlto, 
    setPosicionX, 
    setPosicionY, 
    setIntensidad, 
    aplicarPreset, 
    manejarGuardar,
    cargando,
    guardando,
    error 
  } = useEditorSonrisa(casoId);

  const [modoComparacion, setModoComparacion] = useState(false);
  const [mensajeExito, setMensajeExito] = useState(false);

  const estiloOverlay = useMemo(() => ({
    width: `${ajustes.ancho}%`,
    height: `${ajustes.alto}%`,
    left: `calc(50% - ${ajustes.ancho / 2}% + ${ajustes.posicionX}px)`,
    top: `calc(58% - ${ajustes.alto / 2}% + ${ajustes.posicionY}px)`,
    opacity: ajustes.intensidad / 100,
    filter: 'blur(0.5px) brightness(1.1)', // Simulación de integración visual
  }), [ajustes]);

  const onGuardar = async () => {
    const ok = await manejarGuardar();
    if (ok) {
      setMensajeExito(true);
      setTimeout(() => setMensajeExito(false), 3000);
    }
  };

  if (cargando) {
    return (
      <div className="flex min-h-[500px] flex-col items-center justify-center space-y-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primario border-t-transparent"></div>
        <p className="italic text-textoSecundario font-medium">Recuperando sesión de diseño...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Diseño Digital de Sonrisa</h1>
          <p className="mt-1 text-sm text-textoSecundario">
            Carpeta: <span className="font-bold text-slate-700">{casoId}</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          {mensajeExito && (
            <span className="text-sm font-bold text-emerald-600 animate-bounce">
              ✓ Diseño guardado
            </span>
          )}
          <button 
            disabled={guardando}
            onClick={() => setModoComparacion((v) => !v)} 
            className={`rounded-xl border px-4 py-2 text-sm font-medium transition-all ${modoComparacion ? 'bg-slate-900 text-white border-slate-900' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
          >
            {modoComparacion ? 'Ver Actual' : 'Comparar Before/After'}
          </button>
          <button 
            onClick={onGuardar}
            disabled={guardando}
            className="rounded-xl bg-primario px-6 py-2 text-sm font-bold text-white shadow-lg shadow-primario/25 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 transition-all"
          >
            {guardando ? 'Guardando...' : 'Guardar Borrador'}
          </button>
          <button onClick={() => navigate(-1)} className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-500 hover:bg-slate-50 transition-colors">
            Cerrar
          </button>
        </div>
      </header>

      {error && (
        <div className="rounded-xl bg-red-50 p-4 text-sm font-medium text-red-600 border border-red-100">
          ⚠️ {error}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <Card titulo="Lienzo de Trabajo">
          <div className="relative aspect-video max-h-[600px] w-full overflow-hidden rounded-2xl bg-slate-900 shadow-inner">
            {/* Simulación de foto base */}
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1000')] bg-cover bg-center grayscale-[0.3] brightness-75" />
            
            {!modoComparacion && (
              <div
                className="absolute shadow-[0_0_40px_rgba(255,255,255,0.4)] transition-all duration-300"
                style={{
                  ...estiloOverlay,
                  backgroundImage: 'radial-gradient(ellipse at center, #ffffff 0%, #f8fafc 100%)',
                  borderRadius: '100% 100% 80% 80%',
                  border: '1px solid rgba(255,255,255,0.8)'
                }}
              />
            )}
            
            {modoComparacion && (
              <>
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute inset-y-0 left-1/2 w-0.5 bg-white/80 shadow-[0_0_10px_white]">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white p-1 text-[10px] font-bold uppercase text-slate-900 shadow-lg">Vs</div>
                </div>
              </>
            )}

            <div className="absolute bottom-4 left-4 flex gap-2">
               <div className="rounded-lg bg-black/60 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-md">
                 PRESET: {ajustes.preset}
               </div>
               <div className="rounded-lg bg-primario px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-md">
                 HD PREVIEW
               </div>
            </div>
          </div>
        </Card>

        <Card titulo="Consola de Ajustes">
          <div className="space-y-6 text-sm">
            <div>
              <label className="mb-3 block font-bold text-slate-700 uppercase text-[10px] tracking-widest">Presets de Sonrisa</label>
              <div className="grid grid-cols-3 gap-2">
                {(Object.keys(presetsEditor) as PresetNombre[]).map((nombre) => (
                  <button
                    key={nombre}
                    onClick={() => aplicarPreset(nombre)}
                    className={`rounded-xl border py-2 text-xs font-bold capitalize transition-all ${ajustes.preset === nombre ? 'border-primario bg-primario/[0.05] text-primario' : 'border-slate-100 bg-slate-50 text-slate-400 hover:border-slate-200'}`}
                  >
                    {nombre}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-5 border-t border-slate-100 pt-6">
              {[
                { label: 'Ancho', value: ajustes.ancho, setter: setAncho, min: 20, max: 80 },
                { label: 'Alto', value: ajustes.alto, setter: setAlto, min: 5, max: 40 },
                { label: 'Posición X', value: ajustes.posicionX, setter: setPosicionX, min: -50, max: 50 },
                { label: 'Posición Y', value: ajustes.posicionY, setter: setPosicionY, min: -50, max: 50 },
                { label: 'Intensidad', value: ajustes.intensidad, setter: setIntensidad, min: 0, max: 100 }
              ].map((item) => (
                <div key={item.label}>
                  <div className="mb-2 flex items-center justify-between">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">{item.label}</label>
                    <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">{item.value}</span>
                  </div>
                  <input
                    type="range"
                    min={item.min}
                    max={item.max}
                    value={item.value}
                    onChange={(e) => item.setter(Number(e.target.value))}
                    className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-primario"
                  />
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
