import * as THREE from "three";
import { Blueprint, Diente, Vec2 } from "../../core/types";

// ── Tipos ─────────────────────────────────────────────────────────────────────

export interface GingivalMargin {
  dienteId: string;
  pieza: number;
  zenithX: number; // Punto más alto del festón gingival (px)
  zenithY: number;
  papilaMesial: Vec2; // Papila interdental mesial
  papilaDistal: Vec2; // Papila interdental distal
  profundidadSurco: number; // mm (normalmente 1-3mm)
}

export interface SoftTissueState {
  margenesGingivales: GingivalMargin[];
  curvaPapilasPath: string; // SVG path para renderizar la encía
  deformacionLabio: Vec2[]; // Puntos del labio deformado por presión dental
}

// ── Constantes Biomecánicas de Tejidos Blandos ────────────────────────────────

const PROFUNDIDAD_SURCO_SANO = 2.0; // mm (sulcus)
const PROFUNDIDAD_SURCO_RIESGO = 4.0; // mm (bolsa periodontal)
const ELASTICIDAD_LABIO = 0.35; // Coeficiente de deformación (0-1)
const GROSOR_ENCIA_BASE = 12; // px (altura de la banda de encía)
const PAPILA_RATIO = 0.6; // Proporción de la papila respecto al gap

/**
 * 🩺 SOFT TISSUE ENGINE
 * Simula la encía (gingiva) dinámica y la interacción biomecánica
 * entre labios y dientes. No es decorativo: modela el festón gingival,
 * las papilas interdentales, y la deformación del labio por presión dental.
 */
export class SoftTissueEngine {
  /**
   * Genera el estado completo de los tejidos blandos a partir del Blueprint.
   */
  static calcular(blueprint: Blueprint): SoftTissueState {
    const dientesAnteriores = blueprint.dientes
      .filter((d) => d.pieza >= 13 && d.pieza <= 23 && d.visible)
      .sort((a, b) => a.posicion.x - b.posicion.x);

    const margenes = this.generarMargenesGingivales(dientesAnteriores);
    const curvaSVG = this.generarCurvaGingivalSVG(
      margenes,
      blueprint.canvas.ancho,
    );
    const deformacion = this.calcularDeformacionLabio(blueprint);

    return {
      margenesGingivales: margenes,
      curvaPapilasPath: curvaSVG,
      deformacionLabio: deformacion,
    };
  }

  // ── ENCÍA DINÁMICA ──────────────────────────────────────────────────────────

  /**
   * Calcula el margen gingival (festón) para cada diente.
   * El zenith gingival (punto más alto de la encía) varía según el tipo de pieza:
   * - Incisivos centrales/caninos: zenith distalizado
   * - Incisivos laterales: zenith centrado
   */
  private static generarMargenesGingivales(
    dientes: Diente[],
  ): GingivalMargin[] {
    return dientes.map((diente, i) => {
      const { x, y } = diente.posicion;
      const { ancho, alto } = diente.dimensiones;
      const escala = diente.transformacion.escala;
      const tipo = diente.pieza % 10;

      // El zenith se desplaza distalmente en centrales y caninos (anatomía real)
      const zenithOffset = tipo === 1 || tipo === 3 ? ancho * 0.08 : 0;
      const zenithX = x + zenithOffset;
      const zenithY = y - alto * escala * 0.5 - GROSOR_ENCIA_BASE;

      // Profundidad del surco gingival (varía por escala; piezas sobredimensionadas = más surco)
      const profundidadSurco = Math.min(
        PROFUNDIDAD_SURCO_RIESGO,
        PROFUNDIDAD_SURCO_SANO + Math.max(0, (escala - 1.0) * 3),
      );

      // Papilas interdentales: ocupan el espacio entre dientes contiguos
      const siguiente = dientes[i + 1];
      const anterior = dientes[i - 1];

      const bordeDerechoActual = x + (ancho * escala) / 2;
      const bordeIzquierdoSig = siguiente
        ? siguiente.posicion.x -
          (siguiente.dimensiones.ancho * siguiente.transformacion.escala) / 2
        : bordeDerechoActual + 5;

      const bordeIzquierdoActual = x - (ancho * escala) / 2;
      const bordeDerechoAnt = anterior
        ? anterior.posicion.x +
          (anterior.dimensiones.ancho * anterior.transformacion.escala) / 2
        : bordeIzquierdoActual - 5;

      // Papila distal (entre este diente y el siguiente)
      const gapDistal = bordeIzquierdoSig - bordeDerechoActual;
      const altPapilaDistal = Math.max(
        0,
        GROSOR_ENCIA_BASE *
          PAPILA_RATIO *
          Math.min(1, 8 / (Math.abs(gapDistal) + 1)),
      );
      const papilaDistal: Vec2 = {
        x: bordeDerechoActual + gapDistal / 2,
        y: zenithY + GROSOR_ENCIA_BASE - altPapilaDistal,
      };

      // Papila mesial (entre este diente y el anterior)
      const gapMesial = bordeIzquierdoActual - bordeDerechoAnt;
      const altPapilaMesial = Math.max(
        0,
        GROSOR_ENCIA_BASE *
          PAPILA_RATIO *
          Math.min(1, 8 / (Math.abs(gapMesial) + 1)),
      );
      const papilaMesial: Vec2 = {
        x: bordeDerechoAnt + gapMesial / 2,
        y: zenithY + GROSOR_ENCIA_BASE - altPapilaMesial,
      };

      return {
        dienteId: diente.id,
        pieza: diente.pieza,
        zenithX,
        zenithY,
        papilaMesial,
        papilaDistal,
        profundidadSurco,
      };
    });
  }

  /**
   * Genera un SVG path suave (curvas cuadráticas) que representa
   * el festón gingival completo con papilas interdentales.
   */
  private static generarCurvaGingivalSVG(
    margenes: GingivalMargin[],
    canvasAncho: number,
  ): string {
    if (margenes.length === 0) return "";

    const parts: string[] = [];

    // Inicio: desde el borde izquierdo del canvas, a la altura de la encía
    const primerMargen = margenes[0];
    const margenSuperior = primerMargen.zenithY;
    parts.push(`M 0 ${margenSuperior - 20}`);
    parts.push(
      `L ${primerMargen.papilaMesial.x} ${primerMargen.papilaMesial.y}`,
    );

    for (let i = 0; i < margenes.length; i++) {
      const m = margenes[i];

      // Curva: papila mesial → zenith (arco del festón)
      parts.push(`Q ${m.zenithX - 10} ${m.zenithY}, ${m.zenithX} ${m.zenithY}`);

      // Curva: zenith → papila distal (bajada del festón)
      parts.push(
        `Q ${m.zenithX + 10} ${m.zenithY}, ${m.papilaDistal.x} ${m.papilaDistal.y}`,
      );

      // Si hay siguiente diente, subir a su papila mesial (triángulo de papila)
      if (i < margenes.length - 1) {
        const sig = margenes[i + 1];
        parts.push(
          `Q ${(m.papilaDistal.x + sig.papilaMesial.x) / 2} ${Math.min(m.papilaDistal.y, sig.papilaMesial.y) - 3}, ${sig.papilaMesial.x} ${sig.papilaMesial.y}`,
        );
      }
    }

    // Cerrar: borde derecho y vuelta arriba
    const ultimoMargen = margenes[margenes.length - 1];
    parts.push(`L ${canvasAncho} ${ultimoMargen.zenithY - 20}`);
    parts.push(`L ${canvasAncho} 0`);
    parts.push(`L 0 0 Z`);

    return parts.join(" ");
  }

  // ── INTERACCIÓN LABIO-DIENTE (BIOMECÁNICA) ──────────────────────────────────

  /**
   * Calcula la deformación del labio inferior causada por la presión
   * de los bordes incisales de los dientes anteriores superiores.
   *
   * Modelo simplificado: cada diente "empuja" el contorno del labio
   * proporcionalmente a su protrusión (posZ) y escala.
   */
  private static calcularDeformacionLabio(blueprint: Blueprint): Vec2[] {
    const labioInferior = blueprint.cara.labiosInterior;
    if (!labioInferior || labioInferior.length === 0) return [];

    const dientesAnteriores = blueprint.dientes.filter(
      (d) => d.pieza >= 11 && d.pieza <= 23 && d.visible,
    );

    // Clonar los puntos del labio para no mutar el original
    const labioDeformado: Vec2[] = labioInferior.map((p) => ({ ...p }));

    for (const diente of dientesAnteriores) {
      const escala = diente.transformacion.escala;
      const protrusionZ = diente.transformacion3D.posZ;

      // Borde incisal del diente (punto más bajo)
      const incisalY =
        diente.posicion.y + (diente.dimensiones.alto * escala) / 2;
      const incisalX = diente.posicion.x;
      const radioInfluencia = diente.dimensiones.ancho * escala * 0.7;

      for (const punto of labioDeformado) {
        const distX = Math.abs(punto.x - incisalX);

        if (distX < radioInfluencia) {
          // Factor de proximidad (1.0 = encima del diente, 0.0 = fuera de influencia)
          const proximidad = 1.0 - distX / radioInfluencia;

          // Solo empujar si el diente está cerca o por debajo del labio
          const penetracion = incisalY - punto.y;

          if (penetracion > -5) {
            // Desplazar el punto del labio hacia abajo y hacia afuera
            const fuerzaY =
              proximidad *
              ELASTICIDAD_LABIO *
              (1 + protrusionZ * 0.5) *
              Math.max(0, penetracion + 5) *
              0.1;
            const fuerzaX =
              proximidad *
              ELASTICIDAD_LABIO *
              protrusionZ *
              0.05 *
              Math.sign(punto.x - incisalX);

            punto.y += fuerzaY;
            punto.x += fuerzaX;
          }
        }
      }
    }

    return labioDeformado;
  }

  // ── UTILIDADES DE RENDERIZADO THREE.JS ──────────────────────────────────────

  /**
   * Genera un Mesh de encía (Three.js) a partir de los márgenes gingivales.
   * Color rosa paramétrico basado en la salud periodontal simulada.
   */
  static generarMeshGingival(state: SoftTissueState): THREE.Mesh | null {
    if (state.margenesGingivales.length === 0) return null;

    const shape = new THREE.Shape();
    const margenes = state.margenesGingivales;

    // Construir la forma de la encía a partir de los zenith y papilas
    const primer = margenes[0];
    shape.moveTo(primer.papilaMesial.x / 100, -primer.papilaMesial.y / 100);

    for (const m of margenes) {
      shape.quadraticCurveTo(
        m.zenithX / 100,
        -m.zenithY / 100,
        m.papilaDistal.x / 100,
        -m.papilaDistal.y / 100,
      );
    }

    // Cerrar por arriba (fuera de vista)
    const ultimo = margenes[margenes.length - 1];
    shape.lineTo(ultimo.papilaDistal.x / 100, -(ultimo.zenithY - 30) / 100);
    shape.lineTo(primer.papilaMesial.x / 100, -(primer.zenithY - 30) / 100);
    shape.closePath();

    const geometry = new THREE.ShapeGeometry(shape);

    // Color gingival: rosa sano con variación según profundidad promedio del surco
    const profPromedio =
      margenes.reduce((s, m) => s + m.profundidadSurco, 0) / margenes.length;
    const saludColor =
      profPromedio <= PROFUNDIDAD_SURCO_SANO
        ? new THREE.Color(0xf5a0a0) // Rosa sano
        : new THREE.Color(0xd06060); // Rojo inflamado

    const material = new THREE.MeshBasicMaterial({
      color: saludColor,
      transparent: true,
      opacity: 0.85,
      side: THREE.DoubleSide,
      depthWrite: false,
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.renderOrder = 5; // Entre el fondo y los dientes
    mesh.userData.tipo = "encia";
    return mesh;
  }
}
