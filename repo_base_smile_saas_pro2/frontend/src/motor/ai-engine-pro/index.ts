import { Blueprint, Diente, DatosFaciales } from "../../core/types";
import { guardarEnHistorial } from "../blueprint-engine/blueprint";

const _generateId = () => Math.random().toString(36).substring(2, 11);

/**
 * 🧠 AI ENGINE PRO — MOTOR DE INTELIGENCIA ESTÉTICA AVANZADA
 * Encargado de feature extraction, scoring comparativo y auto-optimización.
 */
export interface DiagnosticoIA {
  scoreTotal: number;
  metricas: {
    simetria: number;
    proporcionAurea: number;
    lineaMedia: number;
    armoniaGingival: number;
  };
  extraccion: {
    formaFacial: string;
    ratioVertical: number;
    ejeInterpupilar: number;
  };
  sugerencias: string[];
}

export class EstheticAI {
  /**
   * 1. FEATURE EXTRACTION: Extrae métricas clínicas del rostro
   */
  static extraerFeatures(cara: DatosFaciales): DiagnosticoIA["extraccion"] {
    const ratio = cara.altoCara / cara.anchoCara;

    let forma = "Ovalada";
    if (ratio > 1.3) forma = "Alargada";
    if (ratio < 1.1) forma = "Redonda";

    // Cálculo del eje interpupilar (ángulo de inclinación facial)
    let ejeInterpupilar = 0;
    if (cara.puntos && cara.puntos.length > 263) {
      const p33 = cara.puntos[33]; // Ojo Izquierdo (MediaPipe Index)
      const p263 = cara.puntos[263]; // Ojo Derecho (MediaPipe Index)
      const dy = p263.y - p33.y;
      const dx = p263.x - p33.x;
      ejeInterpupilar = (Math.atan2(dy, dx) * 180) / Math.PI;
    }

    return {
      formaFacial: cara.formaFacial || forma,
      ratioVertical: ratio,
      ejeInterpupilar,
    };
  }

  /**
   * 2. SCORING ESTÉTICO: Evaluación cuantitativa del diseño
   */
  static evaluar(blueprint: Blueprint): DiagnosticoIA {
    const dientes = blueprint.dientes;
    const cara = blueprint.cara;

    // Simetría (Comparación de homólogos)
    const simetria = this.calcularSimetria(dientes);

    // Proporción Áurea (1.618 : 1 : 0.618)
    const proporcion = this.calcularProporcionAurea(dientes);

    // Alineación Línea Media
    const lineaMedia = this.calcularAlineacionMedia(blueprint);

    const sugerencias: string[] = [];
    if (simetria < 0.85)
      sugerencias.push("Ajustar simetría entre laterales (12 vs 22)");
    if (proporcion < 0.7)
      sugerencias.push(
        "Incisivos centrales muy estrechos respecto a laterales",
      );
    if (lineaMedia < 0.9)
      sugerencias.push("Desviación detectada respecto a línea media facial");

    const scoreTotal = simetria * 0.4 + proporcion * 0.4 + lineaMedia * 0.2;

    return {
      scoreTotal: Math.round(scoreTotal * 100),
      metricas: {
        simetria,
        proporcionAurea: proporcion,
        lineaMedia,
        armoniaGingival: 0.85,
      },
      extraccion: this.extraerFeatures(cara),
      sugerencias,
    };
  }

  /**
   * 3. SELECCIÓN AUTOMÁTICA DE PLANTILLA (Visagismo IA)
   */
  static seleccionarPlantillaIdeal(blueprint: Blueprint, catalogo: any[]): any {
    const features = this.extraerFeatures(blueprint.cara);

    // Reglas de Visagismo:
    // Alargada -> Natural (Bordes suaves para suavizar la cara)
    // Redonda -> Hollywood (Bordes angulares para dar estructura)
    // Ovalada -> Juvenil (Alta exposición)

    if (features.formaFacial === "Alargada")
      return catalogo.find((p) => p.id === "preset-natural") || catalogo[0];
    if (features.formaFacial === "Redonda")
      return catalogo.find((p) => p.id === "preset-hollywood") || catalogo[0];

    return catalogo.find((p) => p.id === "preset-juvenil") || catalogo[0];
  }

  /**
   * 4. OPTIMIZACIÓN ITERATIVA MULTI-VARIABLE (Nivel 2)
   * Utiliza un algoritmo de Hill Climbing estocástico para explorar el espacio
   * de parámetros (escala, posición X/Y) buscando maximizar el Score Estético.
   */
  static optimizar(blueprint: Blueprint): Blueprint {
    let mejorBlueprint = {
      ...blueprint,
      dientes: blueprint.dientes.map((d) => ({
        ...d,
        posicion: { ...d.posicion },
        transformacion: { ...d.transformacion },
      })),
    };
    let mejorScore = this.evaluar(mejorBlueprint).scoreTotal;

    const MAX_ITERATIONS = 50;
    const LEARNING_RATE = 0.05; // Ajuste máximo por iteración (5%)

    for (let i = 0; i < MAX_ITERATIONS; i++) {
      // 1. Crear una permutación (mutar levemente los dientes)
      const testBlueprint = {
        ...mejorBlueprint,
        dientes: mejorBlueprint.dientes.map((d) => {
          // No mutamos piezas posteriores para no romper oclusión posterior base
          if (d.pieza > 14 && d.pieza < 21) return d;
          if (d.pieza > 24) return d;

          return {
            ...d,
            posicion: {
              x: d.posicion.x + (Math.random() - 0.5) * LEARNING_RATE * 5, // -0.125 a +0.125
              y: d.posicion.y + (Math.random() - 0.5) * LEARNING_RATE * 2,
            },
            transformacion: {
              ...d.transformacion,
              escala:
                d.transformacion.escala + (Math.random() - 0.5) * LEARNING_RATE, // -0.025 a +0.025
            },
          };
        }),
      };

      // 2. Evaluar Función de Coste (Score Estético)
      const testScore = this.evaluar(testBlueprint).scoreTotal;

      // 3. Hill Climbing: Si es mejor, nos quedamos con esta permutación
      if (testScore > mejorScore) {
        mejorScore = testScore;
        mejorBlueprint = testBlueprint;
      }
    }

    // Forzar línea media si o si para el "Wow Effect" clínico (Anclaje central)
    const centroIdialX = blueprint.cara.lineaMediaX;
    mejorBlueprint.dientes.forEach((d) => {
      if (d.pieza === 11)
        d.posicion.x =
          centroIdialX - (d.dimensiones.ancho * d.transformacion.escala) / 2;
      if (d.pieza === 21)
        d.posicion.x =
          centroIdialX + (d.dimensiones.ancho * d.transformacion.escala) / 2;
    });

    const diagnosticoFinal = this.evaluar(mejorBlueprint);

    return guardarEnHistorial(
      {
        ...mejorBlueprint,
        analisisIA: {
          scoreEstetico: diagnosticoFinal.scoreTotal,
          sugerencias: diagnosticoFinal.sugerencias,
          simetriaFacial: diagnosticoFinal.metricas.simetria,
          desviacionLineaMedia: 1 - diagnosticoFinal.metricas.lineaMedia,
          cumplimientoProporcion: diagnosticoFinal.metricas.proporcionAurea,
        },
      },
      "Optimización IA Multi-Variable",
    );
  }
  
  /**
   * 4. AUTO-ALINEACIÓN: Sincroniza el diseño con la postura facial
   */
  static autoAlinear(blueprint: Blueprint): Blueprint {
    const features = this.extraerFeatures(blueprint.cara);
    const tiltRad = (features.ejeInterpupilar * Math.PI) / 180;
    const centroX = blueprint.cara.lineaMediaX;
    
    // Aplicar transformaciones globales basadas en el plano bipupilar
    const blueprintAlineado = {
      ...blueprint,
      dientes: blueprint.dientes.map(d => ({
        ...d,
        transformacion3D: {
          ...d.transformacion3D,
          rotZ: tiltRad // Paralelismo absoluto con el eje interpupilar
        }
      }))
    };

    // Ajuste fino de la línea media (Centrado quirúrgico)
    const d11 = blueprintAlineado.dientes.find(d => d.pieza === 11);
    const d21 = blueprintAlineado.dientes.find(d => d.pieza === 21);
    
    if (d11 && d21) {
      const centroActualX = (d11.posicion.x + (d11.dimensiones.ancho * d11.transformacion.escala) + d21.posicion.x) / 2;
      const shiftX = centroX - centroActualX;
      
      blueprintAlineado.dientes.forEach(d => {
        d.posicion.x += shiftX;
      });
    }

    return guardarEnHistorial(blueprintAlineado, "Auto-Alineación Bipupilar");
  }

  // --- Helpers de Cálculo ---

  private static calcularSimetria(dientes: Diente[]): number {
    let diff = 0;
    const pares = [
      [11, 21],
      [12, 22],
      [13, 23],
    ];
    pares.forEach(([p1, p2]) => {
      const d1 = dientes.find((d) => d.pieza === p1);
      const d2 = dientes.find((d) => d.pieza === p2);
      if (d1 && d2)
        diff += Math.abs(d1.transformacion.escala - d2.transformacion.escala);
    });
    return Math.max(0, 1 - diff);
  }

  private static calcularProporcionAurea(dientes: Diente[]): number {
    const d11 = dientes.find((d) => d.pieza === 11);
    const d12 = dientes.find((d) => d.pieza === 12);
    if (!d11 || !d12) return 1;
    const ratio =
      (d12.dimensiones.ancho * d12.transformacion.escala) /
      (d11.dimensiones.ancho * d11.transformacion.escala);
    return Math.max(0, 1 - Math.abs(ratio - 0.618) * 2);
  }

  private static calcularAlineacionMedia(blueprint: Blueprint): number {
    const d11 = blueprint.dientes.find((d) => d.pieza === 11);
    const d21 = blueprint.dientes.find((d) => d.pieza === 21);
    if (!d11 || !d21) return 1;
    const centroX = (d11.posicion.x + d21.posicion.x) / 2;
    return Math.max(
      0,
      1 - Math.abs(centroX - blueprint.cara.lineaMediaX) / 100,
    );
  }
}
