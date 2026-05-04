import { useEditorStore } from "../../../store/editor-sonrisa.store";
import * as servicioDisenos from "../../../servicios/servicioDisenos";

/**
 * Encapsula la lógica de guardar una foto en el blueprint y persistirla en la DB.
 * Retorna la función `guardarFoto(vistaId, url)`.
 */
export function useGuardarFoto(casoId: string | undefined) {
  const { actualizarFotoVista, cambiarVista, generarDiseno } = useEditorStore();

  const guardarFoto = async (vistaId: string, url: string) => {
    // Si no hay blueprint, generar uno primero
    if (!useEditorStore.getState().blueprint) {
      await new Promise<void>((resolve) => {
        generarDiseno({
          puntos: [],
          anchoCara: 1000,
          altoCara: 1000,
          lineaMediaX: 500,
          lineaBipupilarY: 400,
          contornoLabios: [],
          labiosExterior: [],
          labiosInterior: [],
        });
        // Esperar a que el store se actualice
        setTimeout(resolve, 100);
      });
    }

    // 1. Actualizar la foto en el store (síncrono)
    actualizarFotoVista(vistaId, url);
    // 2. Activar la vista recién fotografiada
    cambiarVista(vistaId);

    // 3. Persistir en DB con el blueprint más reciente
    if (casoId) {
      const blueprintActualizado = useEditorStore.getState().blueprint;
      if (blueprintActualizado) {
        try {
          await servicioDisenos.guardarDiseno({
            caso_clinico_id: casoId,
            ajustes_json: JSON.stringify(blueprintActualizado),
          });
        } catch (e) {
          console.error("❌ Error guardando blueprint con foto:", e);
        }
      }
    }
  };

  return { guardarFoto };
}
