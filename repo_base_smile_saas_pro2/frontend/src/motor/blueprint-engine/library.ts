import { Blueprint, PlantillaSonrisa } from "../../core/types";
import { guardarEnHistorial } from "./blueprint";

/**
 * Item de la librería para aplicaciones parciales.
 */
export interface ItemLibreria {
  id: string;
  tipo: "plantilla" | "forma" | "color" | "borde";
  nombre: string;
  parametros: Partial<PlantillaSonrisa["parametros"]>;
}

/**
 * Aplica un item de la librería de forma parcial al blueprint.
 */
export function aplicarItemLibreria(
  blueprint: Blueprint,
  item: ItemLibreria,
): Blueprint {
  let nuevosDientes = [...blueprint.dientes];

  switch (item.tipo) {
    case "color":
      if (item.parametros.color) {
        nuevosDientes = nuevosDientes.map((d) => ({
          ...d,
          material: {
            ...d.material,
            colorBase: item.parametros.color?.blancura
              ? "#FFFFFF"
              : d.material.colorBase, // Simulación
            saturacion:
              item.parametros.color?.saturacion ?? d.material.saturacion,
            translucidez:
              item.parametros.color?.translucidez ?? d.material.translucidez,
          },
        }));
      }
      break;

    case "forma":
      if (item.parametros.forma) {
        nuevosDientes = nuevosDientes.map((d) => ({
          ...d,
          geometria: {
            ...d.geometria,
            // Aquí iría lógica de cambio de path según forma
          },
        }));
      }
      break;
  }

  return guardarEnHistorial({
    ...blueprint,
    dientes: nuevosDientes,
    metadata: {
      ...blueprint.metadata,
      actualizadoEn: new Date().toISOString(),
    },
  });
}
