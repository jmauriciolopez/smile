import * as THREE from "three";
import { STLExporter } from "three/examples/jsm/exporters/STLExporter.js";
import { OBJExporter } from "three/examples/jsm/exporters/OBJExporter.js";
import { Blueprint } from "../../core/types";

/**
 * 🏭 CAD/CAM EXPORT ENGINE
 * Genera archivos STL sólidos para impresión 3D (Mockups físicos) y
 * sistemas de laboratorio (Exocad, 3Shape, Cerec).
 */
export class CadExporter {
  /**
   * Exporta la dentadura actual del canvas 3D a un archivo STL.
   * Selecciona únicamente las mallas dentales, ignorando guías y labios.
   */
  static exportarSTL(scene: THREE.Scene, blueprint: Blueprint) {
    const exportScene = new THREE.Scene();

    // Extraer solo los dientes (ignorar labios, guías, luces, etc.)
    scene.children.forEach((child) => {
      if (child instanceof THREE.Mesh && child.userData.pieza) {
        // Clonar para no afectar el renderizado actual
        const clone = child.clone();
        // Resetear materiales a básicos para el export
        clone.material = new THREE.MeshBasicMaterial({ color: 0xffffff });
        exportScene.add(clone);
      }
    });

    if (exportScene.children.length === 0) {
      console.warn("No hay dientes generados para exportar a STL.");
      return;
    }

    const exporter = new STLExporter();
    const stlString = exporter.parse(exportScene);

    this.descargarArchivo(
      stlString,
      `smile_pro_design_${blueprint.id || "export"}.stl`,
    );
  }

  /**
   * Exporta la dentadura a formato OBJ (Wavefront).
   * A diferencia del STL, el OBJ mantiene UVs y grupos, siendo superior para algunos flujos CAD.
   */
  static exportarOBJ(scene: THREE.Scene, blueprint: Blueprint) {
    const exportScene = new THREE.Scene();

    scene.children.forEach((child) => {
      if (child instanceof THREE.Mesh && child.userData.pieza) {
        const clone = child.clone();
        exportScene.add(clone);
      }
    });

    if (exportScene.children.length === 0) return;

    const exporter = new OBJExporter();
    const objString = exporter.parse(exportScene);

    this.descargarArchivo(
      objString,
      `smile_pro_design_${blueprint.id || "export"}.obj`,
    );
  }

  /**
   * Exporta las coordenadas espaciales y transformaciones para Exocad/3Shape
   */
  static exportarParametrosLaboratorio(blueprint: Blueprint) {
    const data = {
      version: "1.0",
      tipo: "SmileDesignPro_LabExport",
      pacienteId: blueprint.id,
      piezas: blueprint.dientes.map((d) => ({
        fdi: d.pieza,
        escala: d.transformacion.escala,
        posicion: d.posicion,
        rotacion3D: d.transformacion3D,
      })),
    };

    const jsonString = JSON.stringify(data, null, 2);
    this.descargarArchivo(
      jsonString,
      `smile_lab_params_${blueprint.id || "export"}.json`,
      "application/json",
    );
  }

  private static descargarArchivo(
    contenido: string,
    nombre: string,
    type: string = "text/plain",
  ) {
    const blob = new Blob([contenido], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.style.display = "none";
    link.href = url;
    link.download = nombre;
    document.body.appendChild(link);
    link.click();

    // Limpieza
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 100);
  }
}
