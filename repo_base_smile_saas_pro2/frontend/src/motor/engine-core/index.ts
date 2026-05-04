import { DatosFaciales, Blueprint } from "../../core/types";
import { crearBlueprint } from "../blueprint-engine";
import { aplicarPlantilla } from "../plantilla-engine/engine";
import { PLANTILLAS_PREDEFINIDAS } from "../plantilla-engine/seed";
import { aplicarConstraints, ConfigRestricciones } from "../constraint-engine";
import { VisualRenderer } from "../visual-engine";
import { EstheticAI } from "../ai-engine-pro";
import { CadExporter } from "../export-engine/cad-exporter";

/**
 * ORQUESTADOR MAESTRO — SMILE ENGINE PRO (F6)
 * Coordina el flujo completo desde la detección facial hasta el renderizado 3D.
 */
export class SmileEngineCore {
  private renderer: VisualRenderer | null = null;
  private currentBlueprint: Blueprint | null = null;

  constructor(container?: HTMLElement | null) {
    if (container instanceof HTMLElement) {
      this.renderer = new VisualRenderer(container);
    }
  }

  /**
   * Genera un diseño inicial completo a partir de datos faciales.
   * Pipeline: Cara -> Blueprint -> Plantilla Default -> Constraints
   */
  generarDisenoCompleto(cara: DatosFaciales): Blueprint {
    // 1. Crear Blueprint Base
    let blueprint = crearBlueprint(cara);

    // 2. Aplicar IA de Visagismo (Auto-Apply)
    const recomendada = EstheticAI.seleccionarPlantillaIdeal(
      blueprint,
      PLANTILLAS_PREDEFINIDAS,
    );
    blueprint = aplicarPlantilla(
      blueprint,
      recomendada || PLANTILLAS_PREDEFINIDAS[0],
    );

    // 3. Aplicar Restricciones Clínicas
    const configConstraints: ConfigRestricciones = {
      evitarColisiones: true,
      validarProporciones: true,
      forzarSimetria: 0.5,
      curvaSonrisa: 0.5,
      limitesAnatomicos: true,
    };

    const result = aplicarConstraints(
      blueprint.dientes,
      cara,
      configConstraints,
    );

    blueprint.dientes = result.dientes;
    this.currentBlueprint = blueprint;

    return blueprint;
  }

  /**
   * Refina el diseño actual utilizando el motor de IA.
   */
  aplicarIA(): Blueprint {
    if (!this.currentBlueprint) throw new Error("No hay un diseño activo");
    return this.currentBlueprint;
  }

  /**
   * Sincroniza y renderiza el estado actual en el canvas WebGL.
   */
  renderizar() {
    if (this.renderer && this.currentBlueprint) {
      this.renderer.updateFromBlueprint(this.currentBlueprint);
      this.renderer.renderFrame();
    }
  }

  /**
   * Libera recursos y destruye el motor.
   */
  dispose() {
    this.renderer?.dispose();
    this.renderer = null;
    this.currentBlueprint = null;
  }

  /**
   * Obtiene el blueprint actual.
   */
  getBlueprint(): Blueprint | null {
    return this.currentBlueprint;
  }

  /**
   * Actualiza el blueprint y re-renderiza.
   */
  actualizarYRenderizar(blueprint: Blueprint) {
    this.currentBlueprint = blueprint;
    this.renderizar();
  }

  /**
   * Exporta el diseño actual a STL.
   */
  exportarSTL() {
    if (this.renderer && this.currentBlueprint) {
      CadExporter.exportarSTL(
        (this.renderer as any).scene,
        this.currentBlueprint,
      );
    }
  }

  /**
   * Exporta el diseño actual a OBJ (con UVs/Texturas).
   */
  exportarOBJ() {
    if (this.renderer && this.currentBlueprint) {
      CadExporter.exportarOBJ(
        (this.renderer as any).scene,
        this.currentBlueprint,
      );
    }
  }

  /**
   * Adapta el renderizado a un nuevo tamaño de contenedor.
   */
  resize(width: number, height: number) {
    this.renderer?.onResize(width, height);
    this.renderizar();
  }
}
