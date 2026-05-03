import { useEditorStore } from "../store/editor-sonrisa.store";
import { DatosFaciales, PlantillaSonrisa } from "../core/types";

/**
 * Hook Maestro de Interfaz — SMILE PRO.
 * Provee las acciones y estado necesarios para los componentes de la UI.
 */
export const useEditorSonrisa = () => {
  const {
    blueprint,
    seleccionadoId,
    actualizarDiente,
    seleccionarDiente,
    aplicarPlantilla,
    generarDiseno,
  } = useEditorStore();

  return {
    // Estado
    blueprint,
    dientes: blueprint?.dientes || [],
    seleccionadoId,
    dienteSeleccionado: blueprint?.dientes.find((d) => d.id === seleccionadoId),

    // Acciones Core
    inicializarDiseno: (cara: DatosFaciales) => generarDiseno(cara),
    seleccionarDiente,

    moverDiente: (id: string, x: number, y: number) => {
      actualizarDiente(id, { posicion: { x, y } });
    },

    escalarDiente: (id: string, escala: number) => {
      actualizarDiente(id, { transformacion: { rotacion: 0, escala } });
    },

    aplicarPreset: (plantilla: PlantillaSonrisa) => {
      aplicarPlantilla(plantilla);
    },

    // Getters clínicos
    estaListo: !!blueprint,
  };
};
