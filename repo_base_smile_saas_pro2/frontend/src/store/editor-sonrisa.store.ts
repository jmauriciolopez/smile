import { create } from "zustand";
import {
  BIBLIOTECA_DENTAL,
  PIEZAS_FRONTALES,
  generarPosicionesIniciales,
} from "../motor/biblioteca-dientes";
import type { FaceData } from "../motor/tipos-faciales";

export interface Punto {
  x: number;
  y: number;
}

export interface Transform {
  x: number;
  y: number;
  rotation: number;
  scaleX: number;
  scaleY: number;
}

/** Material del diente — spec v2.0 */
export interface MaterialDiente {
  colorBase: string;
  translucidez: number; // 0..1
  reflectividad: number; // 0..1
}

export interface Diente {
  id: string;
  pieza: number;
  svgPath: string;
  transform: Transform;
  visible: boolean;
  opacity: number;
  material: MaterialDiente;
}

export interface Guia {
  id: string;
  tipo: "horizontal" | "vertical" | "curva";
  posicion: Punto;
  visible: boolean;
}

/** Snapshot inmutable para historial Undo/Redo */
export interface BlueprintVersion {
  timestamp: string;
  /** Hash SHA-256 del contenido del snapshot para Chain of Custody */
  hash: string;
  dientes: Omit<Diente, "svgPath">[];
  guias: Guia[];
}

/** Medida real en mm para calibración del lienzo */
export interface CalibracionMetrica {
  /** Distancia en px entre los dos puntos de referencia marcados */
  distanciaPx: number;
  /** Medida real conocida en mm (ej. ancho intercanino = 35mm) */
  medidaMm: number;
  /** Factor de conversión calculado: mm por px */
  mmPorPx: number;
}

const MATERIAL_DEFAULT: MaterialDiente = {
  colorBase: "#FFFFFF",
  translucidez: 0.12,
  reflectividad: 0.08,
};

interface EditorStore {
  // ── Estado ──────────────────────────────────────────────────────────────
  canvasSize: { width: number; height: number };
  fotoUrl: string | null;
  dientes: Diente[];
  guias: Guia[];
  seleccionadoId: string | null;
  faceData: FaceData | null;
  calibracion: CalibracionMetrica | null;

  // ── Historial Undo/Redo ─────────────────────────────────────────────────
  history: BlueprintVersion[];
  historyIndex: number;

  // ── Acciones básicas ────────────────────────────────────────────────────
  setFotoUrl: (url: string) => void;
  setCanvasSize: (width: number, height: number) => void;
  setSeleccionado: (id: string | null) => void;
  setFaceData: (data: FaceData | null) => void;
  setCalibracion: (cal: CalibracionMetrica | null) => void;

  // ── Manipulación dental ─────────────────────────────────────────────────
  actualizarDiente: (id: string, cambios: Partial<Transform>) => void;
  actualizarOpacidad: (id: string, opacity: number) => void;
  actualizarMaterial: (id: string, cambios: Partial<MaterialDiente>) => void;
  toggleVisibilidad: (id: string) => void;
  resetDientes: () => void;

  // ── Guías ───────────────────────────────────────────────────────────────
  toggleGuia: (id: string, visible: boolean) => void;
  moverGuia: (id: string, posicion: Punto) => void;

  // ── Historial ───────────────────────────────────────────────────────────
  guardarSnapshot: () => void;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;

  // ── Import / Export ─────────────────────────────────────────────────────
  importarDiseno: (json: any) => void;
  exportarDiseno: () => any;
  exportarFichaTecnica: () => FichaTecnica;
}

/** Ficha técnica para laboratorio — spec output */
export interface MedidaPieza {
  pieza: number;
  nombre: string;
  anchoPx: number;
  altoPx: number;
  anchoMm?: number; // si hay calibración métrica
  altoMm?: number;
}

export interface FichaTecnica {
  version: string;
  fecha: string;
  piezas: MedidaPieza[];
  escalaBase: number;
  calibracion?: CalibracionMetrica;
}

/** Genera un hash SHA-256 del contenido del snapshot (Chain of Custody) */
async function generarHash(data: object): Promise<string> {
  try {
    const texto = JSON.stringify(data);
    const buffer = new TextEncoder().encode(texto);
    const digest = await crypto.subtle.digest("SHA-256", buffer);
    return Array.from(new Uint8Array(digest))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  } catch {
    // Fallback si crypto.subtle no está disponible (HTTP sin TLS)
    return Date.now().toString(36);
  }
}

/** Crea un snapshot del estado actual (sin svgPath para ahorrar espacio) */
function crearSnapshot(dientes: Diente[], guias: Guia[]): BlueprintVersion {
  const dientesSnap = dientes.map((d) => {
    const { svgPath: _svgPath, ...rest } = d;
    return rest;
  });
  return {
    timestamp: new Date().toISOString(),
    hash: "", // se rellena de forma asíncrona en guardarSnapshot
    dientes: dientesSnap,
    guias: [...guias],
  };
}

export const useEditorStore = create<EditorStore>((set, get) => ({
  canvasSize: { width: 860, height: 580 },
  fotoUrl: null,
  dientes: [],
  faceData: null,
  calibracion: null,
  seleccionadoId: null,
  history: [],
  historyIndex: -1,

  guias: [
    {
      id: "guia-media",
      tipo: "vertical",
      posicion: { x: 430, y: 0 },
      visible: true,
    },
    {
      id: "guia-oclusal",
      tipo: "horizontal",
      posicion: { x: 0, y: 290 },
      visible: true,
    },
    {
      id: "guia-bipupilar",
      tipo: "horizontal",
      posicion: { x: 0, y: 160 },
      visible: false,
    },
  ],

  setFotoUrl: (url) => set({ fotoUrl: url }),
  setCanvasSize: (width, height) => set({ canvasSize: { width, height } }),
  setSeleccionado: (id) => set({ seleccionadoId: id }),
  setFaceData: (data) => set({ faceData: data }),
  setCalibracion: (cal) => set({ calibracion: cal }),

  actualizarDiente: (id, cambios) => {
    get().guardarSnapshot();
    set((s) => ({
      dientes: s.dientes.map((d) =>
        d.id === id ? { ...d, transform: { ...d.transform, ...cambios } } : d,
      ),
    }));
  },

  actualizarOpacidad: (id, opacity) => {
    get().guardarSnapshot();
    set((s) => ({
      dientes: s.dientes.map((d) => (d.id === id ? { ...d, opacity } : d)),
    }));
  },

  actualizarMaterial: (id, cambios) => {
    get().guardarSnapshot();
    set((s) => ({
      dientes: s.dientes.map((d) =>
        d.id === id ? { ...d, material: { ...d.material, ...cambios } } : d,
      ),
    }));
  },

  toggleVisibilidad: (id) => {
    get().guardarSnapshot();
    set((s) => ({
      dientes: s.dientes.map((d) =>
        d.id === id ? { ...d, visible: !d.visible } : d,
      ),
    }));
  },

  /* ── Inicializar con paths anatómicos reales ─────────────────────────── */
  resetDientes: () => {
    const { canvasSize } = get();
    const posiciones = generarPosicionesIniciales(
      canvasSize.width,
      canvasSize.height,
    );

    const iniciales: Diente[] = PIEZAS_FRONTALES.map((pieza) => {
      const morf = BIBLIOTECA_DENTAL[pieza];
      const pos = posiciones.find((p) => p.pieza === pieza)!;
      return {
        id: `diente-${pieza}`,
        pieza,
        svgPath: morf.svgPath,
        visible: true,
        opacity: 0.88,
        material: { ...MATERIAL_DEFAULT },
        transform: {
          x: pos.x,
          y: pos.y,
          rotation: 0,
          scaleX: pos.scaleX,
          scaleY: pos.scaleY,
        },
      };
    });

    set({
      dientes: iniciales,
      seleccionadoId: null,
      history: [],
      historyIndex: -1,
    });
  },

  toggleGuia: (id, visible) =>
    set((s) => ({
      guias: s.guias.map((g) => (g.id === id ? { ...g, visible } : g)),
    })),

  moverGuia: (id, posicion) =>
    set((s) => ({
      guias: s.guias.map((g) => (g.id === id ? { ...g, posicion } : g)),
    })),

  /* ── Historial ───────────────────────────────────────────────────────── */
  guardarSnapshot: () => {
    const { dientes, guias, history, historyIndex } = get();
    const snapshot = crearSnapshot(dientes, guias);
    const nuevaHistory = [
      ...history.slice(0, historyIndex + 1),
      snapshot,
    ].slice(-50);
    set({ history: nuevaHistory, historyIndex: nuevaHistory.length - 1 });

    // Calcular hash SHA-256 de forma asíncrona y actualizar el snapshot
    generarHash({ dientes: snapshot.dientes, guias: snapshot.guias }).then(
      (hash) => {
        set((s) => ({
          history: s.history.map((v, i) =>
            i === s.historyIndex ? { ...v, hash } : v,
          ),
        }));
      },
    );
  },

  undo: () => {
    const { history, historyIndex } = get();
    if (historyIndex <= 0) return;
    const prev = history[historyIndex - 1];
    const dientesRestaurados: Diente[] = prev.dientes.map((d: any) => ({
      ...d,
      svgPath: BIBLIOTECA_DENTAL[d.pieza]?.svgPath ?? "",
      material: d.material ?? { ...MATERIAL_DEFAULT },
    }));
    set({
      dientes: dientesRestaurados,
      guias: prev.guias,
      historyIndex: historyIndex - 1,
    });
  },

  redo: () => {
    const { history, historyIndex } = get();
    if (historyIndex >= history.length - 1) return;
    const next = history[historyIndex + 1];
    const dientesRestaurados: Diente[] = next.dientes.map((d: any) => ({
      ...d,
      svgPath: BIBLIOTECA_DENTAL[d.pieza]?.svgPath ?? "",
      material: d.material ?? { ...MATERIAL_DEFAULT },
    }));
    set({
      dientes: dientesRestaurados,
      guias: next.guias,
      historyIndex: historyIndex + 1,
    });
  },

  canUndo: () => get().historyIndex > 0,
  canRedo: () => get().historyIndex < get().history.length - 1,

  importarDiseno: (json) => {
    if (!json) return;
    const dientes: Diente[] = (json.dientes ?? []).map((d: any) => ({
      ...d,
      svgPath: BIBLIOTECA_DENTAL[d.pieza]?.svgPath ?? d.svgPath ?? "",
      material: d.material ?? { ...MATERIAL_DEFAULT },
    }));
    set({
      dientes,
      guias: json.guias ?? get().guias,
      history: [],
      historyIndex: -1,
    });
  },

  exportarDiseno: () => {
    const { dientes, guias } = get();
    const dientesExport = dientes.map((d) => {
      const { svgPath: _svgPath, ...rest } = d;
      return rest;
    });
    return { dientes: dientesExport, guias, version: "2.1-fase-b" };
  },

  exportarFichaTecnica: (): FichaTecnica => {
    const { dientes, calibracion } = get();
    const piezas: MedidaPieza[] = dientes.map((d) => {
      const anchoPx = Math.round(100 * d.transform.scaleX);
      const altoPx = Math.round(160 * d.transform.scaleY);
      const anchoMm = calibracion
        ? +(anchoPx * calibracion.mmPorPx).toFixed(2)
        : undefined;
      const altoMm = calibracion
        ? +(altoPx * calibracion.mmPorPx).toFixed(2)
        : undefined;
      return {
        pieza: d.pieza,
        nombre: BIBLIOTECA_DENTAL[d.pieza]?.nombre ?? `Pieza ${d.pieza}`,
        anchoPx,
        altoPx,
        anchoMm,
        altoMm,
      };
    });
    return {
      version: "2.1",
      fecha: new Date().toISOString(),
      piezas,
      escalaBase: dientes[0]?.transform.scaleX ?? 0.55,
      calibracion: calibracion ?? undefined,
    };
  },
}));
