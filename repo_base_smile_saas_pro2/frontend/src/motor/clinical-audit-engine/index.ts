import { Blueprint, Diente } from "../../core/types";

// ── Tipos del Motor de Auditoría ──────────────────────────────────────────────

export type SeveridadAlerta = "info" | "advertencia" | "critico";
export type CategoriaAlerta =
  | "proporcion"
  | "periodontal"
  | "oclusion"
  | "estetica"
  | "biomecanica"
  | "contraindicacion";

export interface AlertaClinica {
  id: string;
  severidad: SeveridadAlerta;
  categoria: CategoriaAlerta;
  pieza?: number; // FDI del diente afectado (null = global)
  mensaje: string; // Legible por el odontólogo
  detalleTecnico: string; // Valor numérico o referencia clínica
  recomendacion: string; // Acción sugerida
}

export interface ResultadoAuditoria {
  timestamp: string;
  scoreClinico: number; // 0-100 (independiente del score estético)
  alertas: AlertaClinica[];
  aprobado: boolean; // true si no hay alertas críticas
  resumen: string;
}

// ── Constantes Clínicas (Basadas en literatura odontológica) ──────────────────

const RATIO_ANCHO_ALTO_MIN = 0.65;
const RATIO_ANCHO_ALTO_MAX = 0.9;
const RATIO_ANCHO_ALTO_IDEAL = 0.78; // Lombardi (1973), Sterrett et al. (1999)

const PROPORCION_AUREA = 1.618;
const TOLERANCIA_PROPORCION = 0.15; // ±15% de desviación aceptable

const DESVIACION_LINEA_MEDIA_MAX_MM = 2.0; // >2mm es clínicamente visible
const DESVIACION_LINEA_MEDIA_CRITICA_MM = 4.0;

const ESCALA_MIN = 0.6;
const ESCALA_MAX = 1.5;
const ROTACION_MAX_RAD = 0.35; // ~20° (límite biomecánico)

const OVERJET_MIN = -0.5;
const OVERJET_MAX = 4.0; // mm (profundidad Z excesiva)

// ── Motor de Auditoría Clínica ────────────────────────────────────────────────

/**
 * 🏥 CLINICAL AUDIT ENGINE
 * Valida automáticamente un Blueprint contra reglas clínicas, biomecánicas
 * y estéticas basadas en literatura odontológica. Genera alertas médicas
 * con severidad, categoría y recomendaciones accionables.
 */
export class ClinicalAuditEngine {
  private alertas: AlertaClinica[] = [];
  private alertCounter = 0;

  /**
   * Ejecuta la auditoría completa sobre un Blueprint.
   */
  static auditar(blueprint: Blueprint): ResultadoAuditoria {
    const engine = new ClinicalAuditEngine();
    return engine.ejecutarAuditoria(blueprint);
  }

  private ejecutarAuditoria(blueprint: Blueprint): ResultadoAuditoria {
    this.alertas = [];
    this.alertCounter = 0;

    const { dientes, analisisIA } = blueprint;

    // ── Validaciones por pieza individual ──
    for (const diente of dientes) {
      this.validarProporcionAnatomica(diente);
      this.validarTransformacionBiomecanica(diente);
      this.validarOverjet(diente);
      this.validarEscala(diente);
    }

    // ── Validaciones globales (inter-diente) ──
    this.validarSimetriaHomologos(dientes);
    this.validarLineaMedia(blueprint);
    this.validarProporcionAurea(dientes);
    this.validarContactosProximales(dientes);
    this.validarCurvaSonrisa(dientes);
    this.validarInclinacionPlanoOclusal(blueprint);

    // ── Validación de Score de IA ──
    this.validarScoreEstetico(analisisIA.scoreEstetico);

    // ── Calcular Score Clínico ──
    const penalizacion = this.alertas.reduce((acc, a) => {
      if (a.severidad === "critico") return acc + 15;
      if (a.severidad === "advertencia") return acc + 5;
      return acc + 1;
    }, 0);

    const scoreClinico = Math.max(0, 100 - penalizacion);
    const criticas = this.alertas.filter((a) => a.severidad === "critico");

    return {
      timestamp: new Date().toISOString(),
      scoreClinico,
      alertas: this.alertas,
      aprobado: criticas.length === 0,
      resumen:
        criticas.length === 0
          ? `✅ Diseño aprobado clínicamente (Score: ${scoreClinico}/100). ${this.alertas.length} observaciones menores.`
          : `🚨 ${criticas.length} alertas críticas detectadas. Revisión obligatoria antes de enviar a laboratorio.`,
    };
  }

  // ── VALIDADORES ─────────────────────────────────────────────────────────────

  /**
   * Verifica que la proporción ancho/alto de cada pieza esté dentro del rango
   * fisiológico (Lombardi 1973: 0.65-0.90).
   */
  private validarProporcionAnatomica(diente: Diente) {
    const { ancho, alto } = diente.dimensiones;
    if (alto === 0) return;
    const ratio = ancho / alto;

    if (ratio < RATIO_ANCHO_ALTO_MIN || ratio > RATIO_ANCHO_ALTO_MAX) {
      this.emitir({
        severidad: ratio < 0.5 || ratio > 1.0 ? "critico" : "advertencia",
        categoria: "proporcion",
        pieza: diente.pieza,
        mensaje: `Proporción ancho/alto fuera de rango clínico (${ratio.toFixed(2)})`,
        detalleTecnico: `Ratio actual: ${ratio.toFixed(3)}. Rango aceptable: ${RATIO_ANCHO_ALTO_MIN}-${RATIO_ANCHO_ALTO_MAX}. Ideal (Lombardi): ${RATIO_ANCHO_ALTO_IDEAL}`,
        recomendacion:
          ratio < RATIO_ANCHO_ALTO_MIN
            ? "Aumentar el ancho o reducir la altura de la pieza."
            : "Reducir el ancho o aumentar la altura de la pieza.",
      });
    }
  }

  /**
   * Detecta rotaciones o angulaciones excesivas que podrían indicar
   * un riesgo biomecánico o un error de manipulación.
   */
  private validarTransformacionBiomecanica(diente: Diente) {
    const { rotX, rotY, rotZ } = diente.transformacion3D;
    const rotTotal = Math.abs(rotX) + Math.abs(rotY) + Math.abs(rotZ);

    if (rotTotal > ROTACION_MAX_RAD) {
      this.emitir({
        severidad: rotTotal > ROTACION_MAX_RAD * 2 ? "critico" : "advertencia",
        categoria: "biomecanica",
        pieza: diente.pieza,
        mensaje: `Angulación excesiva (${((rotTotal * 180) / Math.PI).toFixed(1)}°)`,
        detalleTecnico: `RotX: ${((rotX * 180) / Math.PI).toFixed(1)}°, RotY: ${((rotY * 180) / Math.PI).toFixed(1)}°, RotZ: ${((rotZ * 180) / Math.PI).toFixed(1)}°. Límite: ${((ROTACION_MAX_RAD * 180) / Math.PI).toFixed(0)}°`,
        recomendacion:
          "Reducir la angulación. Valores extremos pueden comprometer la oclusión funcional y la estabilidad de la restauración.",
      });
    }
  }

  /**
   * Verifica que el overjet (profundidad Z) se mantenga dentro de los
   * parámetros clínicos. Un overjet excesivo indica una protrusión irreal.
   */
  private validarOverjet(diente: Diente) {
    const posZ = diente.transformacion3D.posZ;
    if (posZ < OVERJET_MIN || posZ > OVERJET_MAX) {
      this.emitir({
        severidad: "advertencia",
        categoria: "oclusion",
        pieza: diente.pieza,
        mensaje: `Overjet fuera de rango (${posZ.toFixed(2)}mm)`,
        detalleTecnico: `PosZ: ${posZ.toFixed(3)}. Rango clínico aceptable: ${OVERJET_MIN} a ${OVERJET_MAX}mm.`,
        recomendacion:
          "Ajustar la profundidad del diente para mantener una oclusión funcional.",
      });
    }
  }

  /**
   * Detecta piezas con escala anómala (demasiado grandes o pequeñas).
   */
  private validarEscala(diente: Diente) {
    const escala =
      diente.transformacion.escala * diente.transformacion3D.escala;
    if (escala < ESCALA_MIN || escala > ESCALA_MAX) {
      this.emitir({
        severidad: escala < 0.4 || escala > 2.0 ? "critico" : "advertencia",
        categoria: "proporcion",
        pieza: diente.pieza,
        mensaje: `Escala anómala (${(escala * 100).toFixed(0)}%)`,
        detalleTecnico: `Escala combinada: ${escala.toFixed(3)}. Rango aceptable: ${ESCALA_MIN * 100}%-${ESCALA_MAX * 100}%.`,
        recomendacion:
          "Restaurar la escala a valores fisiológicamente plausibles.",
      });
    }
  }

  /**
   * Compara dientes homólogos (11 vs 21, 12 vs 22, 13 vs 23) para detectar
   * asimetrías significativas en dimensiones.
   */
  private validarSimetriaHomologos(dientes: Diente[]) {
    const pares: [number, number][] = [
      [11, 21],
      [12, 22],
      [13, 23],
      [14, 24],
      [15, 25],
    ];

    for (const [piezaA, piezaB] of pares) {
      const dA = dientes.find((d) => d.pieza === piezaA);
      const dB = dientes.find((d) => d.pieza === piezaB);
      if (!dA || !dB) continue;

      const diffAncho = Math.abs(dA.dimensiones.ancho - dB.dimensiones.ancho);
      const diffAlto = Math.abs(dA.dimensiones.alto - dB.dimensiones.alto);
      const avgAncho = (dA.dimensiones.ancho + dB.dimensiones.ancho) / 2;

      if (avgAncho > 0 && diffAncho / avgAncho > 0.1) {
        this.emitir({
          severidad: diffAncho / avgAncho > 0.2 ? "critico" : "advertencia",
          categoria: "estetica",
          pieza: piezaA,
          mensaje: `Asimetría significativa entre pieza ${piezaA} y ${piezaB}`,
          detalleTecnico: `Diferencia de ancho: ${diffAncho.toFixed(1)}px (${((diffAncho / avgAncho) * 100).toFixed(1)}%). Diferencia de alto: ${diffAlto.toFixed(1)}px.`,
          recomendacion:
            "Igualar las dimensiones de los dientes homólogos para mejorar la armonía visual.",
        });
      }
    }
  }

  /**
   * Verifica la desviación de la línea media dental respecto a la línea
   * media facial. >2mm es perceptible, >4mm es clínicamente inaceptable.
   */
  private validarLineaMedia(blueprint: Blueprint) {
    const desviacion = Math.abs(blueprint.analisisIA.desviacionLineaMedia);

    if (desviacion > DESVIACION_LINEA_MEDIA_MAX_MM) {
      this.emitir({
        severidad:
          desviacion > DESVIACION_LINEA_MEDIA_CRITICA_MM
            ? "critico"
            : "advertencia",
        categoria: "estetica",
        mensaje: `Desviación de línea media: ${desviacion.toFixed(1)}mm`,
        detalleTecnico: `Desviación detectada: ${desviacion.toFixed(2)}mm. Umbral perceptible: ${DESVIACION_LINEA_MEDIA_MAX_MM}mm. Umbral crítico: ${DESVIACION_LINEA_MEDIA_CRITICA_MM}mm.`,
        recomendacion:
          "Centrar el eje inter-incisivo con la línea media facial. Considerar la auto-optimización de la IA.",
      });
    }
  }

  /**
   * Valida la proporción áurea entre incisivo central, lateral y canino
   * (vista frontal). La relación ideal es 1.618:1:0.618.
   */
  private validarProporcionAurea(dientes: Diente[]) {
    // Verificar por cuadrante
    for (const cuadrante of [1, 2]) {
      const central = dientes.find((d) => d.pieza === cuadrante * 10 + 1);
      const lateral = dientes.find((d) => d.pieza === cuadrante * 10 + 2);
      const canino = dientes.find((d) => d.pieza === cuadrante * 10 + 3);

      if (!central || !lateral) continue;

      const ratioCL =
        central.dimensiones.ancho / (lateral.dimensiones.ancho || 1);
      const desviacionCL =
        Math.abs(ratioCL - PROPORCION_AUREA) / PROPORCION_AUREA;

      if (desviacionCL > TOLERANCIA_PROPORCION) {
        this.emitir({
          severidad:
            desviacionCL > TOLERANCIA_PROPORCION * 2
              ? "critico"
              : "advertencia",
          categoria: "proporcion",
          pieza: cuadrante * 10 + 1,
          mensaje: `Proporción áurea Central/Lateral desviada (Q${cuadrante})`,
          detalleTecnico: `Ratio actual: ${ratioCL.toFixed(3)}. Ideal (φ): ${PROPORCION_AUREA}. Desviación: ${(desviacionCL * 100).toFixed(1)}%.`,
          recomendacion:
            "Ajustar el ancho del incisivo lateral para acercarse a la proporción áurea.",
        });
      }

      if (canino && lateral) {
        const ratioLC =
          lateral.dimensiones.ancho / (canino.dimensiones.ancho || 1);
        const desviacionLC =
          Math.abs(ratioLC - PROPORCION_AUREA) / PROPORCION_AUREA;

        if (desviacionLC > TOLERANCIA_PROPORCION) {
          this.emitir({
            severidad: "info",
            categoria: "proporcion",
            pieza: cuadrante * 10 + 2,
            mensaje: `Proporción áurea Lateral/Canino desviada (Q${cuadrante})`,
            detalleTecnico: `Ratio actual: ${ratioLC.toFixed(3)}. Ideal (φ): ${PROPORCION_AUREA}. Desviación: ${(desviacionLC * 100).toFixed(1)}%.`,
            recomendacion:
              "Considerar ajustar la relación visual entre lateral y canino.",
          });
        }
      }
    }
  }

  /**
   * Detecta colisiones o gaps excesivos entre dientes contiguos
   * que podrían indicar riesgo periodontal (empaquetamiento alimenticio).
   */
  private validarContactosProximales(dientes: Diente[]) {
    const anteriores = dientes
      .filter((d) => d.pieza >= 13 && d.pieza <= 23)
      .sort((a, b) => a.posicion.x - b.posicion.x);

    for (let i = 0; i < anteriores.length - 1; i++) {
      const actual = anteriores[i];
      const siguiente = anteriores[i + 1];

      const bordeDerechoActual =
        actual.posicion.x +
        (actual.dimensiones.ancho * actual.transformacion.escala) / 2;
      const bordeIzquierdoSig =
        siguiente.posicion.x -
        (siguiente.dimensiones.ancho * siguiente.transformacion.escala) / 2;
      const gap = bordeIzquierdoSig - bordeDerechoActual;

      if (gap > 3) {
        this.emitir({
          severidad: gap > 8 ? "critico" : "advertencia",
          categoria: "periodontal",
          pieza: actual.pieza,
          mensaje: `Gap proximal excesivo entre pieza ${actual.pieza} y ${siguiente.pieza} (${gap.toFixed(1)}px)`,
          detalleTecnico: `Distancia inter-proximal: ${gap.toFixed(2)}px. Un gap >3px puede provocar empaquetamiento alimenticio y riesgo periodontal.`,
          recomendacion:
            "Cerrar el diastema o ajustar las dimensiones para establecer un punto de contacto fisiológico.",
        });
      }

      if (gap < -5) {
        this.emitir({
          severidad: "advertencia",
          categoria: "biomecanica",
          pieza: actual.pieza,
          mensaje: `Superposición excesiva entre pieza ${actual.pieza} y ${siguiente.pieza}`,
          detalleTecnico: `Overlap: ${Math.abs(gap).toFixed(2)}px. Superposiciones >5px indican una colisión que el motor de físicas debería resolver.`,
          recomendacion:
            "Activar el motor de físicas PBD o reducir manualmente las dimensiones.",
        });
      }
    }
  }

  /**
   * Valida que la curva de sonrisa (línea incisal) sea convexa y armónica.
   * Una curva inversa (cóncava) o plana es antiestética.
   */
  private validarCurvaSonrisa(dientes: Diente[]) {
    const centrales = dientes.filter((d) => d.pieza === 11 || d.pieza === 21);
    const caninos = dientes.filter((d) => d.pieza === 13 || d.pieza === 23);

    if (centrales.length < 2 || caninos.length < 2) return;

    const yCentrales =
      centrales.reduce((sum, d) => sum + d.posicion.y + d.dimensiones.alto, 0) /
      centrales.length;
    const yCaninos =
      caninos.reduce((sum, d) => sum + d.posicion.y + d.dimensiones.alto, 0) /
      caninos.length;

    // En nuestro sistema, Y positivo es hacia abajo. Los centrales deberían estar más abajo (incisal más largo)
    const diferencia = yCentrales - yCaninos;

    if (diferencia < 0) {
      this.emitir({
        severidad: "advertencia",
        categoria: "estetica",
        mensaje: "Curva de sonrisa invertida (cóncava)",
        detalleTecnico: `Borde incisal de centrales ${Math.abs(diferencia).toFixed(1)}px por encima de caninos. Una curva convexa es estéticamente deseable.`,
        recomendacion:
          "Alargar los incisivos centrales o acortar los caninos para lograr una curva de sonrisa armónica.",
      });
    }
  }

  /**
   * Emite una alerta si el Score Estético de la IA es demasiado bajo.
   */
  private validarScoreEstetico(score: number) {
    if (score < 40) {
      this.emitir({
        severidad: "critico",
        categoria: "estetica",
        mensaje: `Score estético crítico (${score}/100)`,
        detalleTecnico: `El motor de IA califica el diseño en ${score}/100. Valores <40 indican deficiencias estructurales graves.`,
        recomendacion:
          "Ejecutar la auto-optimización (Hill Climbing) o revisar manualmente las proporciones y la alineación.",
      });
    } else if (score < 65) {
      this.emitir({
        severidad: "advertencia",
        categoria: "estetica",
        mensaje: `Score estético bajo (${score}/100)`,
        detalleTecnico: `El diseño tiene un puntaje de ${score}/100. Valores 40-65 sugieren oportunidades de mejora.`,
        recomendacion:
          "Considerar aplicar la auto-optimización de la IA o ajustar plantillas.",
      });
    }
  }

  // ── Helpers ──────────────────────────────────────────────────────────────────

  /**
   * Verifica que la inclinación de los dientes coincida con el eje interpupilar.
   */
  private validarInclinacionPlanoOclusal(blueprint: Blueprint) {
    // Importamos dinámicamente o usamos EstheticAI
    let ejeInterpupilar = 0;
    if (blueprint.cara.puntos && blueprint.cara.puntos.length > 263) {
      const p33 = blueprint.cara.puntos[33];
      const p263 = blueprint.cara.puntos[263];
      ejeInterpupilar =
        (Math.atan2(p263.y - p33.y, p263.x - p33.x) * 180) / Math.PI;
    }

    const tiltDeseadoRad = (ejeInterpupilar * Math.PI) / 180;
    const d11 = blueprint.dientes.find((d) => d.pieza === 11);

    if (d11) {
      const diff = Math.abs(d11.transformacion3D.rotZ - tiltDeseadoRad);
      if (diff > 0.05) {
        // ~3 grados
        this.emitir({
          id: `tilt-bipupilar-${this.alertCounter++}`,
          severidad: diff > 0.17 ? "critico" : "advertencia", // >10 grados es crítico
          categoria: "estetica",
          mensaje: "Plano oclusal asimétrico respecto al eje interpupilar",
          detalleTecnico: `Desviación: ${((diff * 180) / Math.PI).toFixed(1)}° detectada entre el eje dental y el plano bipupilar.`,
          recomendacion:
            "Ejecutar 'Auto-Alinear' en el panel de IA o ajustar manualmente la rotación Z para compensar el tilt facial.",
        });
      }
    }
  }

  private emitir(alerta: Omit<AlertaClinica, "id"> & { id?: string }) {
    this.alertas.push({
      ...alerta,
      id: alerta.id || `alerta-${this.alertCounter++}`,
    } as AlertaClinica);
  }
}
