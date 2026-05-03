import { PlantillaSonrisa } from "../../core/types";

/**
 * 🎨 CATÁLOGO DE PLANTILLAS CLÍNICAS (PRESETS)
 * Definiciones estéticas maestras para el Smile Engine Pro.
 */
export const PLANTILLAS_PREDEFINIDAS: PlantillaSonrisa[] = [
  {
    id: "preset-hollywood",
    nombre: "Hollywood Smile",
    categoria: "Estética",
    parametros: {
      proporciones: {
        incisivoCentral: 1.1,
        incisivoLateral: 0.85,
        canino: 0.95,
      },
      forma: {
        tipo: "cuadrado",
        suavidadBordes: 0.2,
      },
      curvaSonrisa: 0.8,
      exposicionDental: 0.9,
      simetria: 1.0,
      color: {
        blancura: 1.0, // BL1
        translucidez: 0.2,
        saturacion: 0.1,
        opalescencia: 0.4,
        rugosidad: 0.1,
      },
    },
  },
  {
    id: "preset-natural",
    nombre: "Natural Soft",
    categoria: "Estética",
    parametros: {
      proporciones: {
        incisivoCentral: 1.0,
        incisivoLateral: 0.8,
        canino: 0.9,
      },
      forma: {
        tipo: "oval",
        suavidadBordes: 0.8,
      },
      curvaSonrisa: 0.6,
      exposicionDental: 0.7,
      simetria: 0.9,
      color: {
        blancura: 0.8, // A1
        translucidez: 0.5,
        saturacion: 0.3,
        opalescencia: 0.7,
        rugosidad: 0.4,
      },
    },
  },
  {
    id: "preset-juvenil",
    nombre: "Juvenil",
    categoria: "Edad",
    parametros: {
      proporciones: {
        incisivoCentral: 1.2,
        incisivoLateral: 0.75,
        canino: 0.85,
      },
      forma: {
        tipo: "triangular",
        suavidadBordes: 0.5,
      },
      curvaSonrisa: 0.9,
      exposicionDental: 1.0,
      simetria: 0.8,
      color: {
        blancura: 0.9,
        translucidez: 0.6,
        saturacion: 0.2,
        opalescencia: 0.8,
        rugosidad: 0.2,
      },
    },
  },
  {
    id: "preset-madurez",
    nombre: "Madurez Elegante",
    categoria: "Edad",
    parametros: {
      proporciones: {
        incisivoCentral: 0.95,
        incisivoLateral: 0.85,
        canino: 1.0,
      },
      forma: {
        tipo: "cuadrado",
        suavidadBordes: 0.3,
      },
      curvaSonrisa: 0.4,
      exposicionDental: 0.5,
      simetria: 0.95,
      color: {
        blancura: 0.7, // A2/A3
        translucidez: 0.3,
        saturacion: 0.5,
        opalescencia: 0.3,
        rugosidad: 0.6,
      },
    },
  },
  {
    id: "preset-agresivo",
    nombre: "Agresivo / Dominante",
    categoria: "Personalidad",
    parametros: {
      proporciones: {
        incisivoCentral: 1.1,
        incisivoLateral: 0.8,
        canino: 1.1, // Caninos prominentes
      },
      forma: {
        tipo: "triangular",
        suavidadBordes: 0.1,
      },
      curvaSonrisa: 0.7,
      exposicionDental: 0.8,
      simetria: 1.0,
      color: {
        blancura: 0.85,
        translucidez: 0.4,
        saturacion: 0.3,
        opalescencia: 0.5,
        rugosidad: 0.3,
      },
    },
  },
];
