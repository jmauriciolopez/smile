import { Blueprint, Transformacion3D } from "../../core/types";
import { actualizarDiente } from "./blueprint";

/**
 * Actualiza la transformación 3D de un diente.
 */
export function actualizarDiente3D(
  blueprint: Blueprint,
  dienteId: string,
  transformacion: Partial<Transformacion3D>,
): Blueprint {
  const diente = blueprint.dientes.find((d) => d.id === dienteId);
  if (!diente) return blueprint;

  return actualizarDiente(blueprint, dienteId, {
    transformacion3D: { ...diente.transformacion3D, ...transformacion },
  });
}

/**
 * Rota un diente en el espacio 3D.
 */
export function rotarDiente3D(
  blueprint: Blueprint,
  dienteId: string,
  rotacion: Partial<{ x: number; y: number; z: number }>,
): Blueprint {
  const diente = blueprint.dientes.find((d) => d.id === dienteId);
  if (!diente) return blueprint;

  return actualizarDiente3D(blueprint, dienteId, {
    rotX: (diente.transformacion3D.rotX || 0) + (rotacion.x || 0),
    rotY: (diente.transformacion3D.rotY || 0) + (rotacion.y || 0),
    rotZ: (diente.transformacion3D.rotZ || 0) + (rotacion.z || 0),
  });
}

/**
 * Mueve un diente en profundidad (Z).
 */
export function moverEnProfundidad(
  blueprint: Blueprint,
  dienteId: string,
  zDelta: number,
): Blueprint {
  const diente = blueprint.dientes.find((d) => d.id === dienteId);
  if (!diente) return blueprint;

  return actualizarDiente3D(blueprint, dienteId, {
    posZ: (diente.transformacion3D.posZ || 0) + zDelta,
  });
}
