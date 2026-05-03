import * as THREE from "three";
import { GeometriaDental } from "../../core/types";

/**
 * Motor de Geometría Dental PRO (F4) - AUDITADO.
 * Gestiona mallas 3D con pivotación anatómica y validación de parámetros.
 */
export class GeometryEngine {
  private static cacheGeometrias: Map<string, THREE.BufferGeometry> = new Map();

  /**
   * Genera o recupera una geometría dental optimizada.
   */
  static generarGeometria(
    tipo: GeometriaDental["tipo"],
    variacion: number = 0.5,
  ): THREE.BufferGeometry {
    // 1. Validación de Edge Case: NaN o undefined en variación
    const vSegura = isFinite(variacion)
      ? Math.max(0, Math.min(1, variacion))
      : 0.5;

    // 2. Cuantización para hit de caché
    const vKey = Math.round(vSegura * 10) / 10;
    const key = `${tipo}_${vKey}`;

    if (this.cacheGeometrias.has(key)) {
      return this.cacheGeometrias.get(key)!;
    }

    const forma = new THREE.Shape();
    this.dibujarMorfologia(forma, tipo, vKey);

    const geometria = new THREE.ExtrudeGeometry(forma, {
      depth: 0.15,
      bevelEnabled: true,
      bevelThickness: 0.04,
      bevelSize: 0.03,
      bevelSegments: 2,
      curveSegments: 12,
    });

    // 3. Gestión del Centro y Pivote
    // IMPORTANTE: No usamos .center() porque perdemos el origen anatómico (cíngulo).
    // En su lugar, calculamos el bounding box para asegurar que la geometría es válida.
    geometria.computeBoundingBox();

    // Validar que la geometría no sea nula (Edge Case de MediaPipe con shapes vacíos)
    if (!geometria.boundingBox || geometria.attributes.position.count === 0) {
      console.error("Fallo crítico: Geometría generada vacía para", tipo);
      return new THREE.BoxGeometry(0.1, 0.1, 0.1); // Fallback seguro
    }

    this.cacheGeometrias.set(key, geometria);
    return geometria;
  }

  private static dibujarMorfologia(
    forma: THREE.Shape,
    tipo: string,
    v: number,
  ) {
    const offset = (v - 0.5) * 0.1;

    switch (tipo) {
      case "incisivo_central":
        forma.moveTo(-0.45, -0.6);
        forma.lineTo(0.45, -0.6);
        forma.bezierCurveTo(0.5 + offset, 0.4, -0.5 - offset, 0.4, -0.45, -0.6);
        break;
      case "incisivo_lateral":
        forma.moveTo(-0.35, -0.55);
        forma.lineTo(0.35, -0.55);
        forma.bezierCurveTo(
          0.4 + offset,
          0.3,
          -0.4 - offset,
          0.3,
          -0.35,
          -0.55,
        );
        break;
      case "canino":
        forma.moveTo(0, -0.7 - offset);
        forma.lineTo(0.4, -0.3);
        forma.bezierCurveTo(0.5, 0.5, -0.5, 0.5, -0.4, -0.3);
        forma.lineTo(0, -0.7 - offset);
        break;
      default:
        forma.absarc(0, 0, 0.4, 0, Math.PI * 2, false);
    }
  }

  static limpiarCache() {
    this.cacheGeometrias.forEach((g) => g.dispose());
    this.cacheGeometrias.clear();
  }
}
