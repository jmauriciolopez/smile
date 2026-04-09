import { useState, useEffect } from 'react';
import { guardarDiseno, obtenerDisenoPorCaso, type DisenoApi } from '../servicios/servicioDisenos';

export const presetsEditor = {
  natural: { ancho: 50, alto: 18, posicionX: 0, posicionY: 0, intensidad: 70 },
  premium: { ancho: 58, alto: 20, posicionX: 0, posicionY: -2, intensidad: 85 },
  suave: { ancho: 46, alto: 16, posicionX: 0, posicionY: 1, intensidad: 60 },
};

export type PresetNombre = keyof typeof presetsEditor;

export function useEditorSonrisa(casoId: string | undefined) {
  const [ancho, setAncho] = useState(50);
  const [alto, setAlto] = useState(18);
  const [posicionX, setPosicionX] = useState(0);
  const [posicionY, setPosicionY] = useState(0);
  const [intensidad, setIntensidad] = useState(70);
  const [preset, setPreset] = useState<PresetNombre>('natural');
  
  const [cargando, setCargando] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [caso, setCaso] = useState<any>(null);

  // Cargar diseño y caso
  useEffect(() => {
    if (!casoId) return;

    setCargando(true);
    Promise.all([
      obtenerDisenoPorCaso(casoId),
      import('../servicios/servicioCasos').then(m => m.obtenerCasoPorId(casoId))
    ])
      .then(([diseno, datosCaso]) => {
        setCaso(datosCaso);
        if (diseno) {
          try {
            const ajustes = JSON.parse(diseno.ajustes_json);
            setAncho(ajustes.ancho ?? 50);
            setAlto(ajustes.alto ?? 18);
            setPosicionX(ajustes.posicionX ?? 0);
            setPosicionY(ajustes.posicionY ?? 0);
            setIntensidad(ajustes.intensidad ?? 70);
            if (ajustes.preset) setPreset(ajustes.preset);
          } catch (e) {
            console.error('Error al parsear ajustes guardados', e);
          }
        }
      })
      .catch(() => setError('No se pudo recuperar la información del caso o el diseño previo.'))
      .finally(() => setCargando(false));
  }, [casoId]);

  const aplicarPreset = (nombre: PresetNombre) => {
    setPreset(nombre);
    const p = presetsEditor[nombre];
    setAncho(p.ancho);
    setAlto(p.alto);
    setPosicionX(p.posicionX);
    setPosicionY(p.posicionY);
    setIntensidad(p.intensidad);
  };

  const manejarGuardar = async () => {
    if (!casoId) return;
    
    setGuardando(true);
    setError(null);
    try {
      const ajustes_json = JSON.stringify({
        ancho,
        alto,
        posicionX,
        posicionY,
        intensidad,
        preset
      });
      await guardarDiseno({
        caso_clinico_id: casoId,
        ajustes_json
      });
      return true;
    } catch (err) {
      setError('Error al guardar el diseño.');
      return false;
    } finally {
      setGuardando(false);
    }
  };

  return {
    ajustes: { ancho, alto, posicionX, posicionY, intensidad, preset },
    setAncho,
    setAlto,
    setPosicionX,
    setPosicionY,
    setIntensidad,
    aplicarPreset,
    manejarGuardar,
    caso,
    cargando,
    guardando,
    error
  };
}
