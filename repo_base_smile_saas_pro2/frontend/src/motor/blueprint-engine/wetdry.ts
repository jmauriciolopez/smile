import { Blueprint } from "../../core/types";
import { guardarEnHistorial } from "./blueprint";

export type ModoVisual = "humedo" | "seco";

/**
 * Configuración de renderizado para los modos Húmedo y Seco.
 */
const CONFIG_RENDER = {
  humedo: {
    reflectividad: 0.9,
    brillo: 0.8,
    saturacion: 0.9,
  },
  seco: {
    reflectividad: 0.2,
    brillo: 0.4,
    saturacion: 0.6,
  },
};

/**
 * Cambia el modo visual del diseño (Húmedo/Seco).
 * Afecta globalmente a la reflectividad, brillo y saturación de todos los dientes.
 */
export function establecerModoVisual(
  blueprint: Blueprint,
  modo: ModoVisual,
): Blueprint {
  const config = CONFIG_RENDER[modo];

  const dientesActualizados = blueprint.dientes.map((d) => ({
    ...d,
    material: {
      ...d.material,
      reflectividad: config.reflectividad,
      brillo: config.brillo,
      saturacion: config.saturacion,
    },
  }));

  return guardarEnHistorial({
    ...blueprint,
    configuracion: { ...blueprint.configuracion, modoVisual: modo },
    dientes: dientesActualizados,
    metadata: {
      ...blueprint.metadata,
      actualizadoEn: new Date().toISOString(),
    },
  });
}
