import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card } from '../../../componentes/ui/Card';

const presets = {
  natural: { ancho: 50, alto: 18, posicionX: 0, posicionY: 0, intensidad: 70 },
  premium: { ancho: 58, alto: 20, posicionX: 0, posicionY: -2, intensidad: 85 },
  suave: { ancho: 46, alto: 16, posicionX: 0, posicionY: 1, intensidad: 60 },
};

export function EditorSonrisaPage() {
  const navigate = useNavigate();
  const { casoId } = useParams();
  const [preset, setPreset] = useState<keyof typeof presets>('natural');
  const [ancho, setAncho] = useState(50);
  const [alto, setAlto] = useState(18);
  const [posicionX, setPosicionX] = useState(0);
  const [posicionY, setPosicionY] = useState(0);
  const [intensidad, setIntensidad] = useState(70);
  const [modoComparacion, setModoComparacion] = useState(false);

  const estiloOverlay = useMemo(() => ({
    width: `${ancho}%`,
    height: `${alto}%`,
    left: `calc(50% - ${ancho / 2}% + ${posicionX}px)`,
    top: `calc(58% - ${alto / 2}% + ${posicionY}px)`,
    opacity: intensidad / 100,
  }), [ancho, alto, posicionX, posicionY, intensidad]);

  function aplicarPreset(nombre: keyof typeof presets) {
    setPreset(nombre);
    const valores = presets[nombre];
    setAncho(valores.ancho);
    setAlto(valores.alto);
    setPosicionX(valores.posicionX);
    setPosicionY(valores.posicionY);
    setIntensidad(valores.intensidad);
  }

  return (
    <div className="space-y-6">
      <header className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Editor de sonrisa</h1>
          <p className="mt-1 text-textoSecundario">Caso activo: {casoId}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setModoComparacion((v) => !v)} className="rounded-xl border border-slate-200 px-4 py-2 text-sm">
            {modoComparacion ? 'Ver resultado' : 'Comparar before/after'}
          </button>
          <button className="rounded-xl bg-primario px-4 py-2 text-sm font-medium text-white">
            Guardar borrador
          </button>
          <button onClick={() => navigate(-1)} className="rounded-xl border border-slate-200 px-4 py-2 text-sm">
            Volver
          </button>
        </div>
      </header>

      <div className="grid gap-4 lg:grid-cols-[1fr_340px]">
        <Card titulo="Lienzo">
          <div className="relative h-[520px] overflow-hidden rounded-2xl bg-slate-100">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_#f8fafc,_#e2e8f0)]" />
            {!modoComparacion && (
              <div
                className="absolute rounded-full border border-white/60 bg-white shadow-md"
                style={estiloOverlay}
              />
            )}
            {modoComparacion && (
              <>
                <div className="absolute inset-0 bg-slate-200/50" />
                <div className="absolute inset-y-0 left-1/2 w-px bg-white" />
              </>
            )}
            <div className="absolute bottom-4 left-4 rounded-full bg-white/90 px-3 py-1 text-xs">
              preset: {preset}
            </div>
          </div>
        </Card>

        <Card titulo="Controles">
          <div className="space-y-5 text-sm">
            <div>
              <label className="mb-2 block font-medium">Preset</label>
              <div className="grid grid-cols-3 gap-2">
                {Object.keys(presets).map((nombre) => (
                  <button
                    key={nombre}
                    onClick={() => aplicarPreset(nombre as keyof typeof presets)}
                    className={`rounded-xl px-3 py-2 ${preset === nombre ? 'bg-blue-50 text-primario' : 'bg-slate-50 text-textoSecundario'}`}
                  >
                    {nombre}
                  </button>
                ))}
              </div>
            </div>

            {[['Ancho', ancho, setAncho], ['Alto', alto, setAlto], ['Posición X', posicionX, setPosicionX], ['Posición Y', posicionY, setPosicionY], ['Intensidad', intensidad, setIntensidad]].map(([label, value, setter]) => (
              <div key={String(label)}>
                <div className="mb-2 flex items-center justify-between">
                  <label className="font-medium">{label as string}</label>
                  <span className="text-textoSecundario">{String(value)}</span>
                </div>
                <input
                  type="range"
                  min={label === 'Posición X' || label === 'Posición Y' ? -20 : 0}
                  max={label === 'Ancho' ? 80 : label === 'Alto' ? 40 : 100}
                  value={Number(value)}
                  onChange={(e) => (setter as (n: number) => void)(Number(e.target.value))}
                  className="w-full"
                />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
