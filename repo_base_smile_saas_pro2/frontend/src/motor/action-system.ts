/**
 * ACTION SYSTEM — spec v2.0
 *
 * Implementa el patrón applyAction(blueprint, action) → blueprint
 * Todas las transformaciones son INMUTABLES: retornan un nuevo estado
 * sin mutar el original.
 *
 * Acciones disponibles:
 *   MOVE_TOOTH   — mover una pieza (x, y)
 *   RESIZE_TOOTH — escalar una pieza (scaleX, scaleY)
 *   ROTATE_TOOTH — rotar una pieza (rotation en grados)
 *   UPDATE_MATERIAL — cambiar material (translucidez, reflectividad)
 *   TOGGLE_VISIBILITY — mostrar/ocultar pieza
 *   MOVE_GUIDE   — mover una guía clínica
 *   TOGGLE_GUIDE — mostrar/ocultar guía
 */

import type {
  Diente,
  Guia,
  MaterialDiente,
  Transform,
} from "../store/editor-sonrisa.store";

// ── Tipos de acciones ─────────────────────────────────────────────────────────

export type AccionDiente =
  | { type: "MOVE_TOOTH"; id: string; payload: Pick<Transform, "x" | "y"> }
  | {
      type: "RESIZE_TOOTH";
      id: string;
      payload: Pick<Transform, "scaleX" | "scaleY">;
    }
  | { type: "ROTATE_TOOTH"; id: string; payload: Pick<Transform, "rotation"> }
  | { type: "UPDATE_MATERIAL"; id: string; payload: Partial<MaterialDiente> }
  | { type: "UPDATE_OPACITY"; id: string; payload: { opacity: number } }
  | { type: "TOGGLE_VISIBILITY"; id: string };

export type AccionGuia =
  | { type: "MOVE_GUIDE"; id: string; payload: { x: number; y: number } }
  | { type: "TOGGLE_GUIDE"; id: string; payload: { visible: boolean } };

export type Accion = AccionDiente | AccionGuia;

// ── Estado mínimo del Blueprint para applyAction ──────────────────────────────

export interface BlueprintState {
  dientes: Diente[];
  guias: Guia[];
}

// ── Función pura principal ────────────────────────────────────────────────────

/**
 * Aplica una acción al estado del Blueprint de forma inmutable.
 * Retorna un nuevo BlueprintState sin mutar el original.
 *
 * @example
 * const nuevo = applyAction(estado, { type: 'MOVE_TOOTH', id: 'diente-11', payload: { x: 200, y: 300 } })
 */
export function applyAction(
  estado: BlueprintState,
  accion: Accion,
): BlueprintState {
  switch (accion.type) {
    case "MOVE_TOOTH":
      return {
        ...estado,
        dientes: estado.dientes.map((d) =>
          d.id === accion.id
            ? {
                ...d,
                transform: {
                  ...d.transform,
                  x: accion.payload.x,
                  y: accion.payload.y,
                },
              }
            : d,
        ),
      };

    case "RESIZE_TOOTH":
      return {
        ...estado,
        dientes: estado.dientes.map((d) =>
          d.id === accion.id
            ? {
                ...d,
                transform: {
                  ...d.transform,
                  scaleX: accion.payload.scaleX,
                  scaleY: accion.payload.scaleY,
                },
              }
            : d,
        ),
      };

    case "ROTATE_TOOTH":
      return {
        ...estado,
        dientes: estado.dientes.map((d) =>
          d.id === accion.id
            ? {
                ...d,
                transform: {
                  ...d.transform,
                  rotation: accion.payload.rotation,
                },
              }
            : d,
        ),
      };

    case "UPDATE_MATERIAL":
      return {
        ...estado,
        dientes: estado.dientes.map((d) =>
          d.id === accion.id
            ? { ...d, material: { ...d.material, ...accion.payload } }
            : d,
        ),
      };

    case "UPDATE_OPACITY":
      return {
        ...estado,
        dientes: estado.dientes.map((d) =>
          d.id === accion.id ? { ...d, opacity: accion.payload.opacity } : d,
        ),
      };

    case "TOGGLE_VISIBILITY":
      return {
        ...estado,
        dientes: estado.dientes.map((d) =>
          d.id === accion.id ? { ...d, visible: !d.visible } : d,
        ),
      };

    case "MOVE_GUIDE":
      return {
        ...estado,
        guias: estado.guias.map((g) =>
          g.id === accion.id
            ? { ...g, posicion: { x: accion.payload.x, y: accion.payload.y } }
            : g,
        ),
      };

    case "TOGGLE_GUIDE":
      return {
        ...estado,
        guias: estado.guias.map((g) =>
          g.id === accion.id ? { ...g, visible: accion.payload.visible } : g,
        ),
      };

    default:
      // Acción desconocida — retornar estado sin cambios (seguro)
      return estado;
  }
}

/**
 * Aplica una secuencia de acciones en orden, acumulando el resultado.
 * Útil para replay de historial o batch de operaciones.
 */
export function applyActions(
  estado: BlueprintState,
  acciones: Accion[],
): BlueprintState {
  return acciones.reduce((est, accion) => applyAction(est, accion), estado);
}

/**
 * Valida que una acción no produzca valores inválidos (NaN, Infinity, etc.)
 * Retorna true si la acción es segura para aplicar.
 */
export function validarAccion(accion: Accion): boolean {
  switch (accion.type) {
    case "MOVE_TOOTH":
      return isFinite(accion.payload.x) && isFinite(accion.payload.y);
    case "RESIZE_TOOTH":
      return (
        isFinite(accion.payload.scaleX) &&
        accion.payload.scaleX > 0 &&
        isFinite(accion.payload.scaleY) &&
        accion.payload.scaleY > 0
      );
    case "ROTATE_TOOTH":
      return isFinite(accion.payload.rotation);
    case "UPDATE_MATERIAL":
      return Object.values(accion.payload).every(
        (v) => typeof v !== "number" || isFinite(v),
      );
    case "UPDATE_OPACITY":
      return accion.payload.opacity >= 0 && accion.payload.opacity <= 1;
    default:
      return true;
  }
}
