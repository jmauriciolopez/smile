import {
  Blueprint,
  DatosFaciales,
  Diente,
  Capa,
  Vista,
  VersionBlueprint,
  Guia,
} from "../../core/types";
import { v4 as uuidv4 } from "uuid";

/**
 * Crea un Blueprint inicial a partir de los datos faciales (SMILE PRO).
 */
export function crearBlueprint(
  cara: DatosFaciales,
  pacienteId?: string,
): Blueprint {
  const ahora = new Date().toISOString();

  const capasIniciales: Capa[] = [
    { id: "capa-img", tipo: "imagen", visible: true, opacidad: 1, zIndex: 0 },
    {
      id: "capa-labios",
      tipo: "labios",
      visible: true,
      opacidad: 0.5,
      zIndex: 10,
    },
    {
      id: "capa-dientes",
      tipo: "dientes",
      visible: true,
      opacidad: 0.9,
      zIndex: 20,
    },
    {
      id: "capa-guias",
      tipo: "guias",
      visible: true,
      opacidad: 0.7,
      zIndex: 30,
    },
  ];

  const vistasIniciales: Vista[] = [
    {
      id: "vista-frontal",
      tipo: "frontal",
      fotoUrl: "/static/img/ejemplo_paciente_frontal.jpg",
      transformacion: { zoom: 1, pan: { x: 0, y: 0 } },
      capasVisibles: ["capa-img", "capa-labios", "capa-dientes", "capa-guias"],
      activo: true,
      puntosFaciales: cara,
    },
    {
      id: "vista-sonrisa",
      tipo: "sonrisa",
      fotoUrl: "/static/img/ejemplo_paciente_sonrisa.jpg",
      transformacion: { zoom: 1, pan: { x: 0, y: 0 } },
      capasVisibles: ["capa-img", "capa-labios", "capa-dientes", "capa-guias"],
      activo: false,
    },
    {
      id: "vista-reposo",
      tipo: "reposo",
      fotoUrl: "/static/img/ejemplo_paciente_reposo.jpg",
      transformacion: { zoom: 1, pan: { x: 0, y: 0 } },
      capasVisibles: ["capa-img", "capa-labios", "capa-dientes", "capa-guias"],
      activo: false,
    },
    {
      id: "vista-lateral",
      tipo: "lateral",
      fotoUrl: "/static/img/ejemplo_paciente_lateral.jpg",
      transformacion: { zoom: 1, pan: { x: 0, y: 0 } },
      capasVisibles: ["capa-img", "capa-labios", "capa-dientes", "capa-guias"],
      activo: false,
    },
  ];

  const initialBlueprint: Omit<Blueprint, "historial" | "indiceHistorial"> = {
    id: uuidv4(),
    version: 1,
    pacienteId,
    metadata: {
      creadoEn: ahora,
      actualizadoEn: ahora,
      autorId: "sistema",
      estado: "borrador",
      notasClinicas: "",
    },
    canvas: {
      ancho: 1000,
      alto: 1000,
      zoom: 1,
      pan: { x: 0, y: 0 },
      espacioColor: "Display-P3",
    },
    cara,
    vistas: vistasIniciales,
    vistaActivaId: "vista-frontal",
    capas: capasIniciales,
    dientes: [],
    guias: [
      {
        id: "guia-media",
        tipo: "media",
        visible: true,
        valor: { x: cara.lineaMediaX },
      },
      {
        id: "guia-sonrisa",
        tipo: "sonrisa",
        visible: true,
        valor: { curva: 0.5, y: cara.lineaBipupilarY + 150 },
      },
      {
        id: "guia-labio",
        tipo: "labio",
        visible: true,
        valor: { puntos: cara.contornoLabios },
      },
      {
        id: "guia-proporcion",
        tipo: "proporcion",
        visible: false,
        valor: { escala: 1, x: cara.lineaMediaX },
      },
    ],
    proporcionAurea: {
      visible: false,
      intensidad: 0.5,
      posicionX: 500,
    },
    analisisIA: {
      scoreEstetico: 0,
      sugerencias: ["Pendiente de análisis"],
      simetriaFacial: 1,
      desviacionLineaMedia: 0,
      cumplimientoProporcion: 0,
    },
    configuracion: {
      modoVisual: "seco",
      mostrarEncias: true,
      simularSombras: true,
      renderizadoGPU: true,
      unidadMedida: "mm",
      opacidadLabios: 1,
    },
  };

  const firstVersion: VersionBlueprint = {
    id: uuidv4(),
    fecha: ahora,
    etiqueta: "Estado Inicial",
    snapshot: JSON.parse(JSON.stringify(initialBlueprint)),
  };

  return {
    ...initialBlueprint,
    historial: [firstVersion],
    indiceHistorial: 0,
  } as Blueprint;
}

/**
 * 🌳 GESTIÓN DE HISTORIAL NO LINEAL (BRANCHING)
 * Permite guardar nuevos estados sin perder ramas alternativas.
 */
export function guardarEnHistorial(
  blueprint: Blueprint,
  etiqueta?: string,
): Blueprint {
  const versionActual = blueprint.historial[blueprint.indiceHistorial];
  const {
    historial: _historial,
    indiceHistorial: _indiceHistorial,
    ...snapshot
  } = blueprint;

  // Evitar duplicados inmediatos (deep compare simplificado)
  if (
    versionActual &&
    JSON.stringify(versionActual.snapshot.dientes) ===
      JSON.stringify(snapshot.dientes)
  ) {
    return blueprint;
  }

  const nuevaVersion: VersionBlueprint = {
    id: uuidv4(),
    fecha: new Date().toISOString(),
    etiqueta,
    parentId: versionActual?.id,
    snapshot: JSON.parse(JSON.stringify(snapshot)),
  };

  // En branching PRO, NO cortamos el futuro. Simplemente añadimos al historial.
  // El historial se convierte en un árbol, aunque aquí lo guardamos como lista plana para persistencia.
  const nuevoHistorial = [...blueprint.historial, nuevaVersion];

  return {
    ...blueprint,
    historial: nuevoHistorial,
    indiceHistorial: nuevoHistorial.length - 1,
  };
}

/**
 * Recupera un estado anterior (Undo) siguiendo la rama actual.
 */
export function deshacer(blueprint: Blueprint): Blueprint {
  const versionActual = blueprint.historial[blueprint.indiceHistorial];
  if (!versionActual || !versionActual.parentId) return blueprint;

  const indiceParent = blueprint.historial.findIndex(
    (v) => v.id === versionActual.parentId,
  );
  if (indiceParent === -1) return blueprint;

  const version = blueprint.historial[indiceParent];

  return {
    ...version.snapshot,
    historial: blueprint.historial,
    indiceHistorial: indiceParent,
  } as Blueprint;
}

/**
 * Recupera un estado posterior (Redo) siguiendo la rama más reciente.
 */
export function rehacer(blueprint: Blueprint): Blueprint {
  // Buscamos si hay algún hijo de la versión actual
  const versionActual = blueprint.historial[blueprint.indiceHistorial];
  const hijos = blueprint.historial
    .filter((v) => v.parentId === versionActual.id)
    .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());

  if (hijos.length === 0) return blueprint;

  const proximaVersion = hijos[0];
  const nuevoIndice = blueprint.historial.findIndex(
    (v) => v.id === proximaVersion.id,
  );

  return {
    ...proximaVersion.snapshot,
    historial: blueprint.historial,
    indiceHistorial: nuevoIndice,
  } as Blueprint;
}

/**
 * Salta a una versión específica (Branching navigation).
 */
export function saltarAVersion(
  blueprint: Blueprint,
  versionId: string,
): Blueprint {
  const indice = blueprint.historial.findIndex((v) => v.id === versionId);
  if (indice === -1) return blueprint;

  const version = blueprint.historial[indice];
  return {
    ...version.snapshot,
    historial: blueprint.historial,
    indiceHistorial: indice,
  } as Blueprint;
}

/**
 * Crea un Snapshot Interno (Checkpoint).
 */
export function crearSnapshotInterno(
  blueprint: Blueprint,
  nombre: string,
): Blueprint {
  return guardarEnHistorial(blueprint, `SNAPSHOT: ${nombre}`);
}

/**
 * Helper genérico para aplicar cambios inmutables.
 */
function transformarBlueprint(
  blueprint: Blueprint,
  cambios: Partial<Blueprint>,
  etiqueta?: string,
): Blueprint {
  return guardarEnHistorial(
    {
      ...blueprint,
      ...cambios,
      metadata: {
        ...blueprint.metadata,
        actualizadoEn: new Date().toISOString(),
      },
    },
    etiqueta,
  );
}

export function actualizarDiente(
  blueprint: Blueprint,
  dienteId: string,
  cambios: Partial<Diente>,
): Blueprint {
  const nuevosDientes = blueprint.dientes.map((d) =>
    d.id === dienteId ? { ...d, ...cambios } : d,
  );
  return transformarBlueprint(
    blueprint,
    { dientes: nuevosDientes },
    "Ajuste Diente",
  );
}

export function alternarCapa(blueprint: Blueprint, capaId: string): Blueprint {
  const nuevasCapas = blueprint.capas.map((c) =>
    c.id === capaId ? { ...c, visible: !c.visible } : c,
  );
  return transformarBlueprint(
    blueprint,
    { capas: nuevasCapas },
    "Alternar Capa",
  );
}

export function activarVista(blueprint: Blueprint, vistaId: string): Blueprint {
  const nuevasVistas = blueprint.vistas.map((v) => ({
    ...v,
    activo: v.id === vistaId,
  }));
  const vistaActiva = nuevasVistas.find((v) => v.id === vistaId);
  if (!vistaActiva) return blueprint;

  return {
    ...blueprint,
    vistas: nuevasVistas,
    vistaActivaId: vistaId,
    cara: vistaActiva.puntosFaciales || blueprint.cara, // Sincronizar landmarks si existen para esta vista
    canvas: {
      ...blueprint.canvas,
      zoom: vistaActiva.transformacion.zoom,
      pan: vistaActiva.transformacion.pan,
    },
  };
}

export function actualizarFotoVista(
  blueprint: Blueprint,
  vistaId: string,
  url: string,
  puntos?: DatosFaciales,
): Blueprint {
  const nuevasVistas = blueprint.vistas.map((v) =>
    v.id === vistaId
      ? { ...v, fotoUrl: url, puntosFaciales: puntos || v.puntosFaciales }
      : v,
  );
  return { ...blueprint, vistas: nuevasVistas };
}

export function actualizarGuia(
  blueprint: Blueprint,
  guiaId: string,
  cambios: Partial<Guia>,
): Blueprint {
  const nuevasGuias = blueprint.guias.map((g) =>
    g.id === guiaId ? { ...g, ...cambios } : g,
  );
  return { ...blueprint, guias: nuevasGuias };
}
