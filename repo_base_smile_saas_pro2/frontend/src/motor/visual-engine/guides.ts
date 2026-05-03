import * as THREE from "three";
import { Blueprint, Guia } from "../../core/types";

/**
 * Motor de Renderizado de Guías Clínicas.
 * Dibuja líneas de referencia (Media, Sonrisa, Labial) en el espacio 3D.
 */
export class GuideRenderer {
  private guideGroup: THREE.Group;
  private materials: Map<string, THREE.LineBasicMaterial> = new Map();

  constructor() {
    this.guideGroup = new THREE.Group();
    this.initMaterials();
  }

  private initMaterials() {
    this.materials.set(
      "media",
      new THREE.LineBasicMaterial({ color: 0xff0000, linewidth: 2 }),
    );
    this.materials.set(
      "sonrisa",
      new THREE.LineBasicMaterial({ color: 0xffff00, linewidth: 2 }),
    );
    this.materials.set(
      "labio",
      new THREE.LineBasicMaterial({ color: 0xff00ff, linewidth: 1 }),
    );
    this.materials.set(
      "proporcion",
      new THREE.LineBasicMaterial({
        color: 0x00ffff,
        linewidth: 1,
        transparent: true,
        opacity: 0.5,
      }),
    );
  }

  getGroup(): THREE.Group {
    return this.guideGroup;
  }

  update(blueprint: Blueprint) {
    this.guideGroup.clear();

    blueprint.guias.forEach((guia) => {
      if (!guia.visible) return;

      switch (guia.tipo) {
        case "media":
          this.drawMidline(guia);
          break;
        case "sonrisa":
          this.drawSmileLine(guia);
          break;
        case "labio":
          this.drawLipLine(guia);
          break;
        case "proporcion":
          this.drawProportions(guia);
          break;
      }
    });
  }

  private drawMidline(guia: Guia) {
    const x = guia.valor.x / 100;
    const geometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(x, 5, 0.1),
      new THREE.Vector3(x, -5, 0.1),
    ]);
    const line = new THREE.Line(geometry, this.materials.get("media"));
    this.guideGroup.add(line);
  }

  private drawSmileLine(guia: Guia) {
    const points = [];
    const yBase = -guia.valor.y / 100;
    const curva = guia.valor.curva;

    for (let x = -5; x <= 5; x += 0.1) {
      // Parábola simple para la curva de sonrisa
      const y = yBase + x * x * curva * 0.1;
      points.push(new THREE.Vector3(x, y, 0.1));
    }

    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const line = new THREE.Line(geometry, this.materials.get("sonrisa"));
    this.guideGroup.add(line);
  }

  private drawLipLine(guia: Guia) {
    if (!guia.valor.puntos || guia.valor.puntos.length === 0) return;

    const points = guia.valor.puntos.map(
      (p: any) => new THREE.Vector3(p.x / 100, -p.y / 100, 0.1),
    );
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const line = new THREE.LineLoop(geometry, this.materials.get("labio"));
    this.guideGroup.add(line);
  }

  private drawProportions(guia: Guia) {
    // Implementación simplificada de rejilla de proporciones
    const xCenter = guia.valor.x / 100;
    const scale = guia.valor.escala;

    [-1.6, -1, -0.6, 0, 0.6, 1, 1.6].forEach((offset, _i) => {
      const x = xCenter + offset * scale;
      const geometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(x, 2, 0.1),
        new THREE.Vector3(x, -2, 0.1),
      ]);
      const line = new THREE.Line(geometry, this.materials.get("proporcion"));
      this.guideGroup.add(line);
    });
  }
}
