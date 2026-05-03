/**
 * 🧠 TIPOS GLOBALES — SMILE DESIGN SYSTEM PRO
 * Archivo central de definiciones de tipos en español.
 */

/** Coordenadas 2D básicas */
export interface Vec2 {
  x: number;
  y: number;
}

/** Transformación 3D para renderizado WebGL */
export interface Transformacion3D {
  rotX: number;
  rotY: number;
  rotZ: number;
  posZ: number;
  escala: number;
}

/** Datos de landmarks faciales obtenidos por IA (MediaPipe) */
export interface DatosFaciales {
  puntos: Vec2[];
  anchoCara: number;
  altoCara: number;
  lineaMediaX: number;
  lineaBipupilarY: number;
  contornoLabios: Vec2[]; // General (Legacy)
  labiosExterior: Vec2[]; // Perímetro total
  labiosInterior: Vec2[]; // Apertura bucal (Hole)
  formaFacial?: string; // e.g., "Alargada", "Redonda", "Ovalada"
  colorSugerido?: string; // e.g., "Vita A1"
  segmentacionDental?: Vec2[][]; // Polígonos de dientes detectados
  mascaraLabiosUrl?: string; // Máscara binaria (Alpha Matte) generada por CNN (Pixel-Level)
}

/** Geometría de la pieza dental (SVG o Malla 3D) */
export interface GeometriaDental {
  tipo:
    | "incisivo_central"
    | "incisivo_lateral"
    | "canino"
    | "premolar"
    | "molar";
  pathSVG: string;
  puntosWebGL?: number[];
}

/** Propiedades ópticas del material dental */
export interface MaterialDental {
  colorBase: string;
  translucidez: number; // 0..1 (Incizal halo)
  reflectividad: number; // 0..1 (Brillo especular)
  brillo: number; // 0..1 (Valor)
  saturacion: number; // 0..1 (Chroma)
  opalescencia: number; // 0..1 (Efecto fuego)
  fluorescencia: number; // 0..1 (Respuesta UV)
  rugosidad: number; // 0..1 (Textura micro)
  fresnel: number; // 0..1 (Grazing reflection)
  sss: number; // 0..1 (Fake Subsurface Scattering)
  capaEsmalte: number; // 0..1 (Grosor translúcido)
  capaDentina: number; // 0..1 (Núcleo opaco)
}

/** Representación de una pieza dental individual */
export interface Diente {
  id: string;
  pieza: number; // ISO/FDI (e.g., 11, 21)
  posicion: Vec2;
  dimensiones: {
    ancho: number;
    alto: number;
  };
  transformacion: {
    rotacion: number;
    escala: number;
  };
  transformacion3D: Transformacion3D;
  material: MaterialDental;
  geometria: GeometriaDental;
  visible: boolean;
}

/** Tipos de guías clínicas */
export type TipoGuia = "media" | "sonrisa" | "labio" | "proporcion";

/** Guía visual para el odontólogo */
export interface Guia {
  id: string;
  tipo: TipoGuia;
  visible: boolean;
  valor: any; // e.g., posición X para media, curva para sonrisa
}

/** Capa del sistema de renderizado (Stack) */
export interface Capa {
  id: string;
  tipo: "imagen" | "labios" | "dientes" | "guias";
  visible: boolean;
  opacidad: number;
  zIndex: number;
}

/** Configuración de una vista específica (Escenario Clínico) */
export interface Vista {
  id: string;
  tipo: "frontal" | "lateral" | "sonrisa" | "reposo";
  fotoUrl?: string; // Imagen específica para este escenario
  puntosFaciales?: DatosFaciales; // Landmarks detectados en esta foto específica
  transformacion: {
    zoom: number;
    pan: Vec2;
  };
  capasVisibles: string[];
  activo: boolean;
}

/** Snapshot de versión para historial Undo/Redo y Auditoría */
export interface VersionBlueprint {
  id: string;
  fecha: string;
  etiqueta?: string; // e.g., "Post-IA", "Ajuste Manual"
  parentId?: string; // Para branching
  snapshot: Omit<Blueprint, "historial" | "indiceHistorial">;
}

/** 👑 BLUEPRINT: El estado maestro del diseño (PRO) */
export interface Blueprint {
  id: string;
  version: number;
  pacienteId?: string;

  /** Datos administrativos y de trazabilidad */
  metadata: {
    creadoEn: string;
    actualizadoEn: string;
    autorId: string;
    estado: "borrador" | "revision" | "aprobado" | "final";
    notasClinicas?: string;
  };

  /** Estado del visualizador y viewport */
  canvas: {
    ancho: number;
    alto: number;
    zoom: number;
    pan: Vec2;
    espacioColor: "sRGB" | "Display-P3";
  };

  /** Insumos anatómicos detectados */
  cara: DatosFaciales;

  /** Gestión de escenas y perspectivas (Multi-View) */
  vistas: Vista[];
  vistaActivaId: string;
  capas: Capa[];

  /** Entidades del diseño (Los Dientes) */
  dientes: Diente[];

  /** Sistema de guías clínicas y oclusión */
  guias: Guia[];
  proporcionAurea: {
    visible: boolean;
    intensidad: number;
    posicionX: number;
  };

  /** Inteligencia Artificial y Diagnóstico Estético */
  analisisIA: {
    scoreEstetico: number; // 0..100
    sugerencias: string[];
    simetriaFacial: number;
    desviacionLineaMedia: number; // en mm o px
    cumplimientoProporcion: number;
  };

  /** Configuración global de renderizado y presets */
  configuracion: {
    modoVisual: "humedo" | "seco";
    mostrarEncias: boolean;
    simularSombras: boolean;
    renderizadoGPU: boolean;
    unidadMedida: "px" | "mm";
    opacidadLabios: number; // 0..1
  };

  /** Historial de estados inmutables (Undo/Redo) */
  historial: VersionBlueprint[];
  indiceHistorial: number;
}

/** Plantilla de diseño predefinida */
export interface PlantillaSonrisa {
  id: string;
  nombre: string;
  categoria: string;
  parametros: {
    proporciones: {
      incisivoCentral: number;
      incisivoLateral: number;
      canino: number;
    };
    forma: {
      tipo: "cuadrado" | "oval" | "triangular";
      suavidadBordes: number;
    };
    curvaSonrisa: number;
    exposicionDental: number;
    simetria: number;
    color: {
      blancura: number;
      translucidez: number;
      saturacion: number;
      opalescencia: number;
      rugosidad: number;
    };
  };
}
