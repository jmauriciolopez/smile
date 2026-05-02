import { useState, useEffect } from "react";
import {
  guardarDiseno,
  obtenerDisenoPorCaso,
} from "../servicios/servicioDisenos";
import { obtenerCasoPorId } from "../servicios/servicioCasos";
import { useEditorStore } from "../store/editor-sonrisa.store";

export const presetsEditor = {
  natural: { scale: 0.8, opacity: 0.8 },
  premium: { scale: 0.9, opacity: 0.95 },
  suave: { scale: 0.75, opacity: 0.7 },
};

export type PresetNombre = keyof typeof presetsEditor;

export function useEditorSonrisa(casoId: string | undefined) {
  const store = useEditorStore();
  const [cargando, setCargando] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [caso, setCaso] = useState<any>(null);
  const [preset, setPreset] = useState<PresetNombre>("natural");

  /* ── Cargar caso + diseño desde backend ─────────────────────────────── */
  useEffect(() => {
    if (!casoId) return;
    setCargando(true);

    Promise.all([obtenerDisenoPorCaso(casoId), obtenerCasoPorId(casoId)])
      .then(([diseno, datosCaso]) => {
        setCaso(datosCaso);

        // Configurar foto de fondo en el store
        const fotos = datosCaso?.fotos ?? [];
        if (fotos.length > 0) {
          const prioritaria =
            fotos.find(
              (f: any) => f.tipo === "frontal" || f.tipo === "sonrisa",
            ) ?? fotos[0];
          store.setFotoUrl(prioritaria.url_foto);
        }

        // Hidratar store con diseño guardado o iniciar defaults
        if (diseno?.ajustes_json) {
          try {
            store.importarDiseno(JSON.parse(diseno.ajustes_json));
          } catch {
            store.resetDientes();
          }
        } else {
          store.resetDientes();
        }
      })
      .catch(() => setError("No se pudo recuperar el caso o diseño previo."))
      .finally(() => setCargando(false));
  }, [casoId]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── Aplicar preset a todas las piezas ──────────────────────────────── */
  const aplicarPreset = (nombre: PresetNombre) => {
    setPreset(nombre);
    const p = presetsEditor[nombre];
    store.dientes.forEach((d) => {
      store.actualizarDiente(d.id, { scaleX: p.scale, scaleY: p.scale });
    });
  };

  /* ── Guardar diseño en backend ───────────────────────────────────────── */
  const manejarGuardar = async (): Promise<boolean> => {
    if (!casoId) return false;
    setGuardando(true);
    setError(null);
    try {
      const exportado = store.exportarDiseno();
      await guardarDiseno({
        caso_clinico_id: casoId,
        ajustes_json: JSON.stringify(exportado),
      });
      return true;
    } catch {
      setError("Error al guardar el diseño.");
      return false;
    } finally {
      setGuardando(false);
    }
  };

  return {
    store,
    preset,
    aplicarPreset,
    manejarGuardar,
    caso,
    cargando,
    guardando,
    error,
  };
}
