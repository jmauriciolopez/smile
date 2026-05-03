import * as THREE from "three";
import { Blueprint } from "../../core/types";

/**
 * 🦷 OCCLUSION & DEPTH ENGINE PRO
 * Gestiona el mimetismo anatómico, oclusión por labios y profundidad de capas.
 */
export class DepthEngine {
  private static lipMaskMesh: THREE.Mesh | null = null;

  /**
   * Orquestador de oclusión avanzada.
   */
  static aplicarOcclusion(scene: THREE.Scene, blueprint: Blueprint) {
    this.gestionarMascaraLabios(scene, blueprint);
    this.ordenarPiezasAnatomicas(scene);
  }

  /**
   * 👄 MÁSCARA DE LABIOS (STENCIL CLIPPING)
   * Crea un "agujero" dinámico basado en los landmarks de los labios.
   * Los dientes solo se renderizan dentro de esta área.
   */
  private static gestionarMascaraLabios(
    scene: THREE.Scene,
    blueprint: Blueprint,
  ) {
    const contorno = blueprint.cara.contornoLabios;
    if (!contorno || contorno.length === 0) return;

    // Eliminar máscara anterior
    if (this.lipMaskMesh) {
      scene.remove(this.lipMaskMesh);
    }

    // Crear forma a partir del contorno INTERIOR (el hueco)
    const shape = new THREE.Shape();
    blueprint.cara.labiosInterior.forEach((p, i) => {
      const x = p.x / 100;
      const y = -p.y / 100;
      if (i === 0) shape.moveTo(x, y);
      else shape.lineTo(x, y);
    });
    shape.closePath();

    const geometry = new THREE.ShapeGeometry(shape);

    // Material que escribe en el Stencil Buffer pero no se ve (Invisible Mask)
    const material = new THREE.MeshBasicMaterial({
      colorWrite: false,
      depthWrite: false,
      stencilWrite: true,
      stencilFunc: THREE.AlwaysStencilFunc,
      stencilRef: 1,
      stencilZPass: THREE.ReplaceStencilOp,
    });

    this.lipMaskMesh = new THREE.Mesh(geometry, material);
    this.lipMaskMesh.renderOrder = 0; // Se renderiza primero
    scene.add(this.lipMaskMesh);

    // Configurar todos los dientes para que obedezcan al Stencil
    scene.children.forEach((child) => {
      if (child instanceof THREE.Mesh && child.userData.pieza) {
        const mat = child.material as THREE.MeshPhysicalMaterial;
        mat.stencilWrite = true;
        mat.stencilFunc = THREE.EqualStencilFunc;
        mat.stencilRef = 1;
      }
    });
  }

  /**
   * 🏗️ ORDEN ANATÓMICO DINÁMICO
   * Asegura que el solapamiento entre piezas sea correcto según su profundidad (posZ)
   * y su jerarquía anatómica (Centrales -> Laterales -> Caninos).
   */
  private static ordenarPiezasAnatomicas(scene: THREE.Scene) {
    const teeth: { mesh: THREE.Mesh; posZ: number; pieza: number }[] = [];

    scene.children.forEach((child) => {
      if (child instanceof THREE.Mesh && child.userData.pieza) {
        teeth.push({
          mesh: child,
          posZ: child.position.z,
          pieza: child.userData.pieza,
        });
      }
    });

    // Ordenar: primero por jerarquía anatómica, luego por profundidad Z real
    teeth.sort((a, b) => {
      const orderA = this.getAnatomicalPriority(a.pieza);
      const orderB = this.getAnatomicalPriority(b.pieza);
      if (orderA !== orderB) return orderA - orderB;
      return a.posZ - b.posZ;
    });

    teeth.forEach((t, index) => {
      t.mesh.renderOrder = 10 + index; // Rango 10-30 para dientes
    });
  }

  private static getAnatomicalPriority(pieza: number): number {
    // Piezas posteriores se renderizan primero (atrás), anteriores al final (adelante)
    const mapping: Record<number, number> = {
      11: 5,
      21: 5, // Centrales (Más prioridad/adelante)
      12: 4,
      22: 4, // Laterales
      13: 3,
      23: 3, // Caninos
      14: 2,
      24: 2, // Premolares
    };
    return mapping[pieza] || 1;
  }

  /**
   * ✂️ CLIPPING GINGIVAL DINÁMICO
   * Simula la inserción de los dientes bajo la encía del labio superior.
   */
  static configurarClippingGingival(
    material: THREE.MeshPhysicalMaterial,
    blueprint: Blueprint,
  ) {
    const lips = blueprint.cara.labiosInterior;
    if (!lips || lips.length < 4) return;

    // Obtener zeniths (puntos más altos del labio superior)
    const topY = lips.reduce((min, p) => Math.min(min, p.y), 1000) / 100;
    const leftX = lips.reduce((min, p) => Math.min(min, p.x), 1000) / 100;
    const rightX = lips.reduce((max, p) => Math.max(max, p.x), 0) / 100;

    // Sistema de 3 planos para clipping más anatómico
    material.clippingPlanes = [
      new THREE.Plane(new THREE.Vector3(0, -1, 0), -topY + 0.05), // Plano Superior
      new THREE.Plane(new THREE.Vector3(1, 0, 0), leftX - 0.1), // Plano Izquierdo
      new THREE.Plane(new THREE.Vector3(-1, 0, 0), -rightX - 0.1), // Plano Derecho
    ];
    material.clipShadows = true;

    // Ejecutar lógica de Soft Occlusion
    this.aplicarSoftOcclusion(material, topY);
  }

  /**
   * 🌑 SOFT OCCLUSION (Ambient Occlusion Gingival)
   * Simula la sombra proyectada por el labio sobre el diente,
   * difuminando la intersección para un realismo superior.
   */
  private static aplicarSoftOcclusion(
    material: THREE.MeshPhysicalMaterial,
    labioTopY: number,
  ) {
    // Usamos onBeforeCompile para inyectar un gradiente de sombra cerca del plano de corte
    material.onBeforeCompile = (shader) => {
      shader.uniforms.lipTopY = { value: -labioTopY + 0.05 };

      shader.vertexShader = shader.vertexShader
        .replace(
          "#include <common>",
          `
        #include <common>
        varying vec3 vWorldPositionOcclusion;
        `,
        )
        .replace(
          "#include <worldpos_vertex>",
          `
        #include <worldpos_vertex>
        vWorldPositionOcclusion = (modelMatrix * vec4(transformed, 1.0)).xyz;
        `,
        );

      shader.fragmentShader = shader.fragmentShader
        .replace(
          "#include <common>",
          `
        #include <common>
        varying vec3 vWorldPositionOcclusion;
        uniform float lipTopY;
        `,
        )
        .replace(
          "#include <dithering_fragment>",
          `
        #include <dithering_fragment>
        
        // Calcular distancia al labio
        float distToLip = vWorldPositionOcclusion.y - lipTopY;
        
        // Si está muy cerca del labio (ej. 0.2 unidades), aplicar gradiente oscuro (Ambient Occlusion)
        if (distToLip > -0.2 && distToLip < 0.0) {
          float shadowFactor = smoothstep(-0.2, 0.0, distToLip); // 0 a 1 (1 es más cerca)
          gl_FragColor.rgb = mix(gl_FragColor.rgb, gl_FragColor.rgb * vec3(0.6, 0.4, 0.4), shadowFactor * 0.8);
        }
        `,
        );
    };
  }

  /**
   * 📐 DETECCIÓN DE INTERSECCIÓN (Bounding Box vs Contorno)
   * Calcula la proximidad de un diente específico respecto a la máscara del labio.
   */
  static calcularInterseccionLabioDiente(
    diente: THREE.Mesh,
    mascaraLabio: THREE.Mesh | null,
  ): { distance: number; intersects: boolean } {
    if (!mascaraLabio) return { distance: 999, intersects: false };

    // bounding box del diente
    diente.geometry.computeBoundingBox();
    const box = diente.geometry.boundingBox;
    if (!box) return { distance: 999, intersects: false };

    // Altura del diente en world space
    const highestPointY = box.max.y + diente.position.y;

    // Asumimos un labio superior promedio si no podemos hacer raycast complejo
    const lipTopY = 0; // Se debería pasar la altura real calculada

    const distance = lipTopY - highestPointY;

    return {
      distance,
      intersects: distance < 0.1, // Intersección "soft" si está a menos de 1mm
    };
  }
}
