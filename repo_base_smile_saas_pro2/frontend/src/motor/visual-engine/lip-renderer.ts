import * as THREE from "three";
import { Blueprint } from "../../core/types";

/**
 * 👄 LIP SEGMENTATION & BLENDING ENGINE
 * Extrae los labios de la foto original y los proyecta sobre el diseño 3D.
 */
export class LipRenderer {
  private mesh: THREE.Mesh | null = null;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D | null;
  private texture: THREE.CanvasTexture;
  private material: THREE.MeshBasicMaterial;

  constructor() {
    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d");
    this.texture = new THREE.CanvasTexture(this.canvas);
    this.texture.minFilter = THREE.LinearFilter;

    this.material = new THREE.MeshBasicMaterial({
      map: this.texture,
      transparent: true,
      depthTest: true,
      depthWrite: false,
    });
  }

  /**
   * 🎨 MÁSCARA RASTER PIXEL-PERFECT (CNN Alpha Blending & Feathering)
   * Utiliza la máscara binaria (Alpha Matte) generada por la IA de Visión
   * para calar los labios con precisión de píxel, aplicando Edge Feathering.
   */
  update(scene: THREE.Scene, blueprint: Blueprint, fotoUrl: string) {
    if (!fotoUrl || !this.ctx) return;

    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      this.canvas.width = blueprint.canvas.ancho;
      this.canvas.height = blueprint.canvas.alto;

      // 1. Dibujar la foto original completa
      this.ctx!.globalCompositeOperation = "source-over";
      this.ctx!.filter = "none";
      this.ctx!.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);

      // 2. Perforar el hueco de la boca usando la Máscara Binaria (CNN Mask)
      if (blueprint.cara.mascaraLabiosUrl) {
        const maskImg = new Image();
        maskImg.crossOrigin = "Anonymous";
        maskImg.onload = () => {
          this.aplicarMascara(maskImg, scene, blueprint);
        };
        maskImg.src = blueprint.cara.mascaraLabiosUrl;
      } else {
        // Fallback al sistema de landmarks si no hay modelo CNN disponible
        this.aplicarFallbackLandmarks(
          blueprint.cara.labiosInterior,
          scene,
          blueprint,
        );
      }
    };
    img.src = fotoUrl;
  }

  private aplicarMascara(
    maskImg: HTMLImageElement,
    scene: THREE.Scene,
    blueprint: Blueprint,
  ) {
    // Usamos destination-out: donde la máscara sea visible (boca abierta), se borra la foto
    this.ctx!.globalCompositeOperation = "destination-out";

    // Dynamic Edge Feathering: Suaviza la transición mucosa-diente
    this.ctx!.filter = "blur(4px)";
    this.ctx!.drawImage(maskImg, 0, 0, this.canvas.width, this.canvas.height);

    this.finalizarRenderizado(scene, blueprint);
  }

  private aplicarFallbackLandmarks(
    contornoInt: any[],
    scene: THREE.Scene,
    blueprint: Blueprint,
  ) {
    if (!contornoInt || contornoInt.length === 0) return;
    this.ctx!.globalCompositeOperation = "destination-out";
    this.ctx!.filter = "blur(4px)";
    this.ctx!.beginPath();
    contornoInt.forEach((p, i) => {
      if (i === 0) this.ctx!.moveTo(p.x, p.y);
      else this.ctx!.lineTo(p.x, p.y);
    });
    this.ctx!.closePath();
    this.ctx!.fillStyle = "black";
    this.ctx!.fill();

    this.finalizarRenderizado(scene, blueprint);
  }

  private finalizarRenderizado(scene: THREE.Scene, blueprint: Blueprint) {
    // Restaurar state
    this.ctx!.filter = "none";
    this.ctx!.globalCompositeOperation = "source-over";

    this.texture.needsUpdate = true;

    // 3. Crear/Actualizar el Plano Full-Screen
    if (!this.mesh) {
      // Un plano que cubra el espacio exacto del canvas base
      // (Las coordenadas X,Y en Smile Engine van de 0 a Ancho/Alto)
      const geometry = new THREE.PlaneGeometry(
        blueprint.canvas.ancho / 100,
        blueprint.canvas.alto / 100,
      );
      this.mesh = new THREE.Mesh(geometry, this.material);

      // Centrar el plano asumiendo origen en 0,0 y coordenadas positivas en X, negativas en Y
      this.mesh.position.set(
        blueprint.canvas.ancho / 200,
        -blueprint.canvas.alto / 200,
        0,
      );
      this.mesh.renderOrder = 200; // Siempre encima de los dientes
      scene.add(this.mesh);
    }

    this.material.opacity = blueprint.configuracion.opacidadLabios ?? 1.0;
  }
  getMesh() {
    return this.mesh;
  }
}
