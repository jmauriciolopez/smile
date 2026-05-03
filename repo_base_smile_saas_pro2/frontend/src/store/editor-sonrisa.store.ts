import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  activarVista,
  deshacer,
  rehacer,
  saltarAVersion,
  crearSnapshotInterno,
  actualizarFotoVista,
  actualizarGuia,
} from "../motor/blueprint-engine/blueprint";
import {
  aplicarPlantilla,
  combinarPlantillas,
  generarVariantes,
  extraerPlantillaDeBlueprint,
  aplicarMaterialCeramico,
} from "../motor/plantilla-engine/engine";
import { TipoCeramica } from "../motor/plantilla-engine/materiales";
import { EstheticAI } from "../motor/ai-engine-pro";
import { ClinicalReportEngine } from "../motor/report-engine";
import { BiomechanicalPhysicsEngine } from "../motor/physics-engine/physics";
import { PLANTILLAS_PREDEFINIDAS } from "../motor/plantilla-engine/seed";
import {
  Blueprint,
  DatosFaciales,
  Diente,
  PlantillaSonrisa,
  Transformacion3D,
} from "../core/types";
import { SmileEngineCore } from "../motor/engine-core";
import * as servicioDisenos from "../servicios/servicioDisenos";

// Re-exportar tipos para compatibilidad
export type { Diente, Blueprint, DatosFaciales, PlantillaSonrisa };

interface EditorStore {
  blueprint: Blueprint | null;
  seleccionadoId: string | null;
  engine: SmileEngineCore | null;
  plantillasPersonalizadas: PlantillaSonrisa[];
  favoritos: string[]; // IDs de plantillas
  modoComparativa: boolean;
  loading: boolean;

  // Colaboración
  colaboradores: any[];
  dientesBloqueados: Record<string, string>; // { dienteId: colaboradorId }

  // ── Getters Proyectados (Compatibilidad Legacy) ─────────────────────────
  dientes: Diente[];
  guias: any[];
  faceData: DatosFaciales | null;
  fotoUrl: string;

  // ── Acciones ────────────────────────────────────────────────────────────
  inicializarEngine: (container: HTMLElement) => void;
  generarDiseno: (cara: DatosFaciales) => void;
  actualizarDiente: (id: string, cambios: Partial<Diente>) => void;
  seleccionarDiente: (id: string | null) => void;
  aplicarPlantilla: (plantilla: PlantillaSonrisa) => void;
  renderizar: () => void;
  setFotoUrl: (url: string) => void;
  actualizarFotoVista: (
    vistaId: string,
    url: string,
    puntos?: DatosFaciales,
  ) => void;
  cambiarVista: (id: string) => void;
  setGuiaValor: (guiaId: string, valor: any) => void;
  alternarGuia: (tipo: string) => void;
  undo: () => void;
  redo: () => void;
  saltarAVersion: (id: string) => void;

  // Plantillas
  aplicarPreset: (id: string) => void;
  mezclarEstilos: (id1: string, id2: string, ratio: number) => void;
  explorarVariantes: (id: string) => void;
  guardarComoPlantilla: (nombre: string) => void;
  recomendarPlantillaIA: () => void;
  seleccionarMaterialCeramico: (tipo: TipoCeramica) => void;
  setModoVisual: (modo: "humedo" | "seco") => void;
  setOpacidadLabios: (valor: number) => void;
  actualizarTransformacion3D: (
    dienteId: string,
    transform: Partial<Transformacion3D>,
  ) => void;
  resetearTransformacion3D: (dienteId: string) => void;
  aplicarEstiloAPieza: (dienteId: string, plantillaId: string) => void;
  alternarFavorito: (plantillaId: string) => void;
  crearSnapshotInterno: (nombre: string) => void;

  // UI
  alternarComparativa: () => void;

  // Reporting
  generarReporteClinico: () => void;

  // AI Engine
  ejecutarOptimizacionIA: () => void;
  ejecutarAutoAlineacion: () => void;
  obtenerDiagnosticoIA: () => void;

  // Persistencia
  guardarDisenoPersistente: (casoId: string) => Promise<void>;
  cargarDisenoPersistente: (casoId: string) => Promise<void>;

  // Colaboración API
  setColaboradores: (colaboradores: any[]) => void;
  bloquearDiente: (dienteId: string, usuarioId: string) => void;
  desbloquearDiente: (dienteId: string) => void;
  actualizarDesdeColaborador: (blueprint: Blueprint) => void;
}

export const useEditorStore = create<EditorStore>()(
  persist(
    (set, get) => ({
      blueprint: null,
      seleccionadoId: null,
      engine: null,
      plantillasPersonalizadas: [],
      favoritos: [],
      modoComparativa: false,
      loading: false,
      colaboradores: [],
      dientesBloqueados: {},

      // Getters computados
      get dientes() {
        return get().blueprint?.dientes || [];
      },
      get guias() {
        return get().blueprint?.guias || [];
      },
      get faceData() {
        return get().blueprint?.cara || null;
      },
      get fotoUrl() {
        return "";
      },

      inicializarEngine: (container) => {
        const engine = new SmileEngineCore(container);
        set({ engine });
      },

      generarDiseno: (cara) => {
        const { engine } = get();
        if (!engine) return;
        const blueprint = engine.generarDisenoCompleto(cara);
        set({ blueprint });
        engine.renderizar();
      },

      actualizarDiente: (id, cambios) => {
        const { blueprint, engine, dientesBloqueados } = get();
        if (!blueprint || !engine) return;

        // Validar Lock Pesimista
        if (dientesBloqueados[id]) return; // Protegido contra edición concurrente

        let nuevosDientes = blueprint.dientes.map((d) =>
          d.id === id ? { ...d, ...cambios } : d,
        );

        // ⚛️ Ejecutar Physics Engine dinámico (Resuelve colisiones de inmediato)
        nuevosDientes =
          BiomechanicalPhysicsEngine.simulateOclusalContact(nuevosDientes);

        const nuevoBlueprint = { ...blueprint, dientes: nuevosDientes };
        set({ blueprint: nuevoBlueprint });
        engine.actualizarYRenderizar(nuevoBlueprint);
      },

      seleccionarDiente: (id) => set({ seleccionadoId: id }),

      aplicarPlantilla: (_plantilla) => {
        const { blueprint, engine } = get();
        if (!blueprint || !engine) return;
        // ...
      },

      ejecutarAutoAlineacion: () => {
        const { blueprint, engine } = get();
        if (!blueprint || !engine) return;
        const nuevoBlueprint = EstheticAI.autoAlinear(blueprint);
        set({ blueprint: nuevoBlueprint });
        engine.actualizarYRenderizar(nuevoBlueprint);
      },

      renderizar: () => {
        const { engine } = get();
        engine?.renderizar();
      },

      actualizarFotoVista: (vistaId: string, url: string, puntos?) => {
        const { blueprint, engine } = get();
        if (!blueprint || !engine) return;
        const nuevoBlueprint = actualizarFotoVista(
          blueprint,
          vistaId,
          url,
          puntos,
        );
        set({ blueprint: nuevoBlueprint });
        engine.actualizarYRenderizar(nuevoBlueprint);
      },

      cambiarVista: (id: string) => {
        const { blueprint, engine } = get();
        if (!blueprint || !engine) return;
        const nuevoBlueprint = activarVista(blueprint, id);
        set({ blueprint: nuevoBlueprint });
        engine.actualizarYRenderizar(nuevoBlueprint);
      },

      setGuiaValor: (guiaId: string, valor: any) => {
        const { blueprint, engine } = get();
        if (!blueprint || !engine) return;
        const nuevoBlueprint = actualizarGuia(blueprint, guiaId, { valor });
        set({ blueprint: nuevoBlueprint });
        engine.actualizarYRenderizar(nuevoBlueprint);
      },

      alternarGuia: (tipo: string) => {
        const { blueprint, engine } = get();
        if (!blueprint || !engine) return;

        const nuevasGuias = blueprint.guias.map((g) =>
          g.tipo === tipo ? { ...g, visible: !g.visible } : g,
        );

        const nuevoBlueprint = { ...blueprint, guias: nuevasGuias };
        set({ blueprint: nuevoBlueprint });
        engine.actualizarYRenderizar(nuevoBlueprint);
      },

      setModoVisual: (modo) => {
        const { blueprint, engine } = get();
        if (!blueprint || !engine) return;

        const nuevoBlueprint = {
          ...blueprint,
          configuracion: { ...blueprint.configuracion, modoVisual: modo },
        };
        set({ blueprint: nuevoBlueprint });
        engine.actualizarYRenderizar(nuevoBlueprint);
      },

      setOpacidadLabios: (valor) => {
        const { blueprint, engine } = get();
        if (!blueprint || !engine) return;

        const nuevoBlueprint = {
          ...blueprint,
          configuracion: { ...blueprint.configuracion, opacidadLabios: valor },
        };
        set({ blueprint: nuevoBlueprint });
        engine.actualizarYRenderizar(nuevoBlueprint);
      },

      actualizarTransformacion3D: (dienteId, transform) => {
        const { blueprint, engine } = get();
        if (!blueprint || !engine) return;

        let nuevosDientes = blueprint.dientes.map((d) =>
          d.id === dienteId
            ? {
                ...d,
                transformacion3D: { ...d.transformacion3D, ...transform },
              }
            : d,
        );

        // ⚛️ Physics Engine (Cambiar rotaciones/profundidad también empuja piezas)
        nuevosDientes =
          BiomechanicalPhysicsEngine.simulateOclusalContact(nuevosDientes);

        const nuevoBlueprint = { ...blueprint, dientes: nuevosDientes };
        set({ blueprint: nuevoBlueprint });
        engine.actualizarYRenderizar(nuevoBlueprint);
      },

      resetearTransformacion3D: (dienteId) => {
        const { blueprint, engine } = get();
        if (!blueprint || !engine) return;

        const nuevosDientes = blueprint.dientes.map((d) =>
          d.id === dienteId
            ? {
                ...d,
                transformacion3D: {
                  rotX: 0,
                  rotY: 0,
                  rotZ: 0,
                  posZ: 0,
                  escala: 1,
                },
              }
            : d,
        );

        const nuevoBlueprint = { ...blueprint, dientes: nuevosDientes };
        set({ blueprint: nuevoBlueprint });
        engine.actualizarYRenderizar(nuevoBlueprint);
      },

      aplicarEstiloAPieza: (dienteId, plantillaId) => {
        const { blueprint, engine } = get();
        if (!blueprint || !engine) return;

        const plantilla = PLANTILLAS_PREDEFINIDAS.find(
          (p) => p.id === plantillaId,
        );
        if (!plantilla) return;

        const nuevosDientes = blueprint.dientes.map((d) => {
          if (d.id !== dienteId) return d;

          let escalaX = 1;
          if (d.pieza === 11 || d.pieza === 21)
            escalaX = plantilla.parametros.proporciones.incisivoCentral;
          if (d.pieza === 12 || d.pieza === 22)
            escalaX = plantilla.parametros.proporciones.incisivoLateral;
          if (d.pieza === 13 || d.pieza === 23)
            escalaX = plantilla.parametros.proporciones.canino;

          return {
            ...d,
            transformacion: { ...d.transformacion, escala: escalaX },
            material: {
              ...d.material,
              translucidez: plantilla.parametros.color.translucidez,
              opalescencia: plantilla.parametros.color.opalescencia,
              rugosidad: plantilla.parametros.color.rugosidad,
            },
          };
        });

        const nuevoBlueprint = { ...blueprint, dientes: nuevosDientes };
        set({ blueprint: nuevoBlueprint });
        engine.actualizarYRenderizar(nuevoBlueprint);
      },

      alternarFavorito: (plantillaId) => {
        const { favoritos } = get();
        const nuevosFavoritos = favoritos.includes(plantillaId)
          ? favoritos.filter((id) => id !== plantillaId)
          : [...favoritos, plantillaId];

        set({ favoritos: nuevosFavoritos });
      },

      crearSnapshotInterno: (nombre) => {
        const { blueprint, engine } = get();
        if (!blueprint || !engine) return;

        const nuevoBlueprint = crearSnapshotInterno(blueprint, nombre);
        set({ blueprint: nuevoBlueprint });
        engine.actualizarYRenderizar(nuevoBlueprint);
      },

      undo: () => {
        const { blueprint, engine } = get();
        if (!blueprint || !engine) return;
        const anterior = deshacer(blueprint);
        set({ blueprint: anterior });
        engine.actualizarYRenderizar(anterior);
      },

      redo: () => {
        const { blueprint, engine } = get();
        if (!blueprint || !engine) return;
        const siguiente = rehacer(blueprint);
        set({ blueprint: siguiente });
        engine.actualizarYRenderizar(siguiente);
      },

      saltarAVersion: (id: string) => {
        const { blueprint, engine } = get();
        if (!blueprint || !engine) return;
        const version = saltarAVersion(blueprint, id);
        set({ blueprint: version });
        engine.actualizarYRenderizar(version);
      },

      aplicarPreset: (id) => {
        const { blueprint, engine, plantillasPersonalizadas } = get();
        // Buscar en predefinidas o personalizadas
        const plantilla =
          PLANTILLAS_PREDEFINIDAS.find((p) => p.id === id) ||
          plantillasPersonalizadas.find((p) => p.id === id);
        if (!blueprint || !engine || !plantilla) return;

        const nuevoBlueprint = aplicarPlantilla(blueprint, plantilla);
        set({ blueprint: nuevoBlueprint });
        engine.actualizarYRenderizar(nuevoBlueprint);
      },

      mezclarEstilos: (id1, id2, ratio) => {
        const { blueprint, engine } = get();
        const p1 = PLANTILLAS_PREDEFINIDAS.find((p) => p.id === id1);
        const p2 = PLANTILLAS_PREDEFINIDAS.find((p) => p.id === id2);
        if (!blueprint || !engine || !p1 || !p2) return;

        const mezcla = combinarPlantillas(p1, p2, ratio);
        const nuevoBlueprint = aplicarPlantilla(blueprint, mezcla);
        set({ blueprint: nuevoBlueprint });
        engine.actualizarYRenderizar(nuevoBlueprint);
      },

      explorarVariantes: (id) => {
        const { blueprint, engine } = get();
        const base = PLANTILLAS_PREDEFINIDAS.find((p) => p.id === id);
        if (!blueprint || !engine || !base) return;

        const variantes = generarVariantes(base, 1);
        const nuevoBlueprint = aplicarPlantilla(blueprint, variantes[0]);
        set({ blueprint: nuevoBlueprint });
        engine.actualizarYRenderizar(nuevoBlueprint);
      },

      guardarComoPlantilla: (nombre) => {
        const { blueprint, plantillasPersonalizadas } = get();
        if (!blueprint) return;

        // Lógica de Versionado de Presets
        const existentes = plantillasPersonalizadas.filter((p) =>
          p.nombre.startsWith(nombre),
        );
        const version = existentes.length > 0 ? existentes.length + 1 : 1;
        const nombreVersionado = version > 1 ? `${nombre} v${version}` : nombre;

        const nueva = extraerPlantillaDeBlueprint(blueprint, nombreVersionado);
        set({
          plantillasPersonalizadas: [...plantillasPersonalizadas, nueva],
        });
      },

      alternarComparativa: () =>
        set({ modoComparativa: !get().modoComparativa }),

      recomendarPlantillaIA: () => {
        const { blueprint, plantillasPersonalizadas } = get();
        if (!blueprint) return;

        const todas = [...PLANTILLAS_PREDEFINIDAS, ...plantillasPersonalizadas];
        const recomendada = EstheticAI.seleccionarPlantillaIdeal(
          blueprint,
          todas,
        );

        if (recomendada) {
          const nuevoBlueprint = {
            ...blueprint,
            analisisIA: {
              ...blueprint.analisisIA,
              sugerencias: [
                ...blueprint.analisisIA.sugerencias,
                `💡 Sugerencia IA: El estilo "${recomendada.nombre}" armoniza mejor con esta fisonomía.`,
              ],
            },
          };
          set({ blueprint: nuevoBlueprint });
        }
      },

      seleccionarMaterialCeramico: (tipo) => {
        const { blueprint, engine } = get();
        if (!blueprint || !engine) return;

        const nuevoBlueprint = aplicarMaterialCeramico(blueprint, tipo);
        set({ blueprint: nuevoBlueprint });
        engine.actualizarYRenderizar(nuevoBlueprint);
      },

      ejecutarOptimizacionIA: () => {
        const { blueprint, engine } = get();
        if (!blueprint || !engine) return;

        const nuevoBlueprint = EstheticAI.optimizar(blueprint);
        set({ blueprint: nuevoBlueprint });
        engine.actualizarYRenderizar(nuevoBlueprint);
      },

      obtenerDiagnosticoIA: () => {
        const { blueprint } = get();
        if (!blueprint) return;

        const diagnostico = EstheticAI.evaluar(blueprint);
        const nuevoBlueprint = {
          ...blueprint,
          analisisIA: {
            ...blueprint.analisisIA,
            scoreEstetico: diagnostico.scoreTotal,
            sugerencias: diagnostico.sugerencias,
            simetriaFacial: diagnostico.metricas.simetria,
            cumplimientoProporcion: diagnostico.metricas.proporcionAurea,
          },
        };
        set({ blueprint: nuevoBlueprint });
      },

      generarReporteClinico: () => {
        const { blueprint } = get();
        if (!blueprint) return;
        ClinicalReportEngine.imprimir(blueprint);
      },

      setFotoUrl: (_url) => {
        // ...
      },

      guardarDisenoPersistente: async (casoId: string) => {
        const { blueprint } = get();
        if (!blueprint) return;

        try {
          await servicioDisenos.guardarDiseno({
            caso_clinico_id: casoId,
            ajustes_json: JSON.stringify(blueprint),
          });
          console.log("✅ Diseño guardado en DB");
        } catch (error) {
          console.error("❌ Error al guardar diseño:", error);
        }
      },

      cargarDisenoPersistente: async (casoId: string) => {
        try {
          const diseno = await servicioDisenos.obtenerDisenoPorCaso(casoId);
          if (diseno && diseno.ajustes_json) {
            const blueprint = JSON.parse(diseno.ajustes_json) as Blueprint;
            set({ blueprint });
            get().engine?.actualizarYRenderizar(blueprint);
          }
        } catch (error) {
          console.error("❌ Error al cargar diseño:", error);
        }
      },

      setColaboradores: (colaboradores) => set({ colaboradores }),

      bloquearDiente: (dienteId, usuarioId) =>
        set((state) => ({
          dientesBloqueados: {
            ...state.dientesBloqueados,
            [dienteId]: usuarioId,
          },
        })),

      desbloquearDiente: (dienteId) =>
        set((state) => {
          const nuevosLocks = { ...state.dientesBloqueados };
          delete nuevosLocks[dienteId];
          return { dientesBloqueados: nuevosLocks };
        }),

      actualizarDesdeColaborador: (nuevoBlueprint) => {
        set({ blueprint: nuevoBlueprint });
        get().engine?.actualizarYRenderizar(nuevoBlueprint);
      },
    }),
    {
      name: "smile-design-library-storage",
      // Solo persistir el catálogo de plantillas y favoritos (UX escalable)
      partialize: (state) => ({
        plantillasPersonalizadas: state.plantillasPersonalizadas,
        favoritos: state.favoritos,
      }),
    },
  ),
);
