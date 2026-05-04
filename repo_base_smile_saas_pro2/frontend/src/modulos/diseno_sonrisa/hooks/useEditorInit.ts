import { useEffect, useRef } from "react";
import { useEditorStore } from "../../../store/editor-sonrisa.store";
import { DatosFaciales } from "../../../core/types";

const DATOS_FACIALES_DEFAULT: DatosFaciales = {
  puntos: [],
  anchoCara: 1000,
  altoCara: 1000,
  lineaMediaX: 500,
  lineaBipupilarY: 400,
  contornoLabios: [],
  labiosExterior: [],
  labiosInterior: [],
};

/**
 * Inicializa el engine 3D y carga/genera el blueprint al montar el editor.
 * Retorna el ref del contenedor donde Three.js monta el canvas.
 */
export function useEditorInit(casoId: string | undefined) {
  const containerRef = useRef<HTMLDivElement>(null);
  const engineInitialized = useRef(false);

  const { inicializarEngine, cargarDisenoPersistente, generarDiseno } =
    useEditorStore();

  useEffect(() => {
    const init = async () => {
      if (!containerRef.current || engineInitialized.current) return;

      inicializarEngine(containerRef.current);
      engineInitialized.current = true;

      if (casoId) {
        try {
          await cargarDisenoPersistente(casoId);
          const { blueprint } = useEditorStore.getState();
          if (!blueprint || !blueprint.vistas?.length) {
            generarDiseno(DATOS_FACIALES_DEFAULT);
          }
        } catch {
          generarDiseno(DATOS_FACIALES_DEFAULT);
        }
      } else {
        generarDiseno(DATOS_FACIALES_DEFAULT);
      }
    };

    init();

    return () => {
      engineInitialized.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [casoId]);

  return containerRef;
}
