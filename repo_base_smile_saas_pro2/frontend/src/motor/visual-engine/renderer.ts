import * as THREE from "three";
import { Blueprint, Diente } from "../../core/types";
import { GeometryEngine } from "../geometry-engine";
import { AnatomyEngine } from "../anatomy-engine";
import { createToothMaterial } from "./materials";
import { DepthEngine } from "./depth";
import { GuideRenderer } from "./guides";
import { LipRenderer } from "./lip-renderer";
import { SoftTissueEngine } from "../soft-tissue-engine";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { BokehPass } from "three/examples/jsm/postprocessing/BokehPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { ColorCorrectionShader } from "three/examples/jsm/shaders/ColorCorrectionShader.js";

/**
 * Motor de Renderizado WebGL PRO.
 * Orquestador principal que sincroniza el Blueprint Engine con Three.js.
 */
export class VisualRenderer {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private composer!: EffectComposer;
  private toothMeshes: Map<string, THREE.Mesh> = new Map();
  private guideRenderer: GuideRenderer;
  private lipRenderer: LipRenderer;
  private gingivalMesh: THREE.Mesh | null = null;

  constructor(container: HTMLElement) {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000,
    );
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      stencil: true, // Requerido para la máscara de labios
    });

    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.localClippingEnabled = true;

    // 📸 COLOR GRADING Y TONE MAPPING (Fotorealismo)
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;

    // 🌐 HDR ENVIRONMENT MAP (Reflejos Clínicos)
    const pmremGenerator = new THREE.PMREMGenerator(this.renderer);
    pmremGenerator.compileEquirectangularShader();
    const environment = new RoomEnvironment();
    this.scene.environment = pmremGenerator.fromScene(environment).texture;
    this.scene.background = new THREE.Color(0x1a1a1a); // Dark mode para contraste clínico

    container.appendChild(this.renderer.domElement);

    this.guideRenderer = new GuideRenderer();
    this.scene.add(this.guideRenderer.getGroup());

    this.lipRenderer = new LipRenderer();

    this.camera.position.set(5, -5, 15);
    this.camera.lookAt(5, -5, 0);
    this.initLights();

    this.initPostProcessing(container.clientWidth, container.clientHeight);
  }

  private initPostProcessing(width: number, height: number) {
    this.composer = new EffectComposer(this.renderer);

    // 1. Render Base
    const renderPass = new RenderPass(this.scene, this.camera);
    this.composer.addPass(renderPass);

    // 2. Bloom Sutil (Reflejos Especulares de la saliva/esmalte)
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(width, height),
      0.15,
      0.4,
      0.85,
    );
    this.composer.addPass(bloomPass);

    // 3. Color Grading (Emulación LUT Cinemático)
    const colorPass = new ShaderPass(ColorCorrectionShader);
    // Ajustes ligeros para look clínico (más frío y contrastado)
    colorPass.uniforms["powRGB"].value = new THREE.Vector3(1.05, 1.05, 1.1); // Ligeramente azulado
    colorPass.uniforms["mulRGB"].value = new THREE.Vector3(1.1, 1.1, 1.1); // Exposición extra
    this.composer.addPass(colorPass);

    // 4. Depth of Field Leve (Bokeh de cámara macro)
    const bokehPass = new BokehPass(this.scene, this.camera, {
      focus: 10.0, // Foco exacto en la posición Z de los dientes
      aperture: 0.0001, // Apertura muy leve para no perder el contexto clínico
      maxblur: 0.005,
    });
    this.composer.addPass(bokehPass);
  }

  private initLights() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(5, 5, 10);
    this.scene.add(dirLight);

    const studioLight = new THREE.PointLight(0xffffff, 0.4);
    studioLight.position.set(-5, 2, 5);
    this.scene.add(studioLight);
  }

  /**
   * Sincroniza la escena 3D con el estado actual del Blueprint.
   */
  updateFromBlueprint(blueprint: Blueprint) {
    // 📸 CENTRAR CÁMARA EN EL DISEÑO
    const centroX = blueprint.canvas.ancho / 200;
    const centroY = -blueprint.canvas.alto / 200;
    this.camera.position.set(centroX, centroY, 15);
    this.camera.lookAt(centroX, centroY, 0);

    blueprint.dientes.forEach((diente: Diente) => {
      let mesh = this.toothMeshes.get(diente.id);

      if (!mesh) {
        mesh = this.createToothMesh(diente);
        this.scene.add(mesh);
        this.toothMeshes.set(diente.id, mesh);
      }

      this.updateMeshTransform(mesh, diente);

      // OPTIMIZACIÓN: Solo actualizar material si el estado visual o las propiedades cambiaron
      const isWet = blueprint.configuracion.modoVisual === "humedo";
      const materialJson = JSON.stringify(diente.material);
      const needsMaterialUpdate =
        isWet || materialJson !== mesh.userData.lastMaterial;
      
      if (needsMaterialUpdate) {
        this.updateMeshMaterial(mesh, diente, isWet, blueprint);
        mesh.userData.lastMaterial = materialJson;
      }
    });

    // Limpieza de dientes eliminados
    const currentIds = new Set(blueprint.dientes.map((t) => t.id));
    this.toothMeshes.forEach((mesh, id) => {
      if (!currentIds.has(id)) {
        this.scene.remove(mesh);
        this.toothMeshes.delete(id);
      }
    });

    // Actualizar Guías
    this.guideRenderer.update(blueprint);

    // Actualizar Labios (Segmentation & Blending)
    const vistaActiva = blueprint.vistas.find(
      (v) => v.id === blueprint.vistaActivaId,
    );
    if (vistaActiva?.fotoUrl) {
      this.lipRenderer.update(this.scene, blueprint, vistaActiva.fotoUrl);
    }

    DepthEngine.aplicarOcclusion(this.scene, blueprint);

    // Actualizar Encía Dinámica (Soft Tissue)
    const softTissueState = SoftTissueEngine.calcular(blueprint);
    if (this.gingivalMesh) {
      this.scene.remove(this.gingivalMesh);
      this.gingivalMesh.geometry.dispose();
      (this.gingivalMesh.material as THREE.Material).dispose();
    }
    this.gingivalMesh = SoftTissueEngine.generarMeshGingival(softTissueState);
    if (this.gingivalMesh) {
      this.scene.add(this.gingivalMesh);
    }
  }

  private createToothMesh(diente: Diente): THREE.Mesh {
    // Mapeo de piezas delegado al AnatomyEngine
    const tipo = AnatomyEngine.getTipoMorfologia(diente.pieza);
    const geometry = GeometryEngine.generarGeometria(tipo);
    const material = createToothMaterial({
      color: diente.material.colorBase,
      translucency: diente.material.translucidez,
      reflectivity: diente.material.reflectividad,
      roughness: diente.material.rugosidad,
      opalescence: diente.material.opalescencia,
      fresnel: diente.material.fresnel,
      sss: diente.material.sss,
      enamelLayer: diente.material.capaEsmalte,
      pieza: diente.pieza, // FDI para micro-variación por diente
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.userData.pieza = diente.pieza;
    return mesh;
  }

  private updateMeshTransform(mesh: THREE.Mesh, diente: Diente) {
    // Transformación 2D escalada a espacio 3D
    mesh.position.x = diente.posicion.x / 100;
    mesh.position.y = -diente.posicion.y / 100;
    mesh.position.z = diente.transformacion3D.posZ;

    mesh.rotation.x = diente.transformacion3D.rotX;
    mesh.rotation.y = diente.transformacion3D.rotY;
    mesh.rotation.z =
      diente.transformacion3D.rotZ + diente.transformacion.rotacion;

    const scale = diente.transformacion.escala * diente.transformacion3D.escala;
    mesh.scale.set(scale, scale, scale);
  }

  private updateMeshMaterial(
    mesh: THREE.Mesh,
    diente: Diente,
    isWet: boolean,
    blueprint: Blueprint,
  ) {
    const mat = mesh.material as THREE.MeshPhysicalMaterial;
    const m = diente.material;

    mat.color.set(m.colorBase);
    mat.transmission = isWet ? 0.4 : m.translucidez;
    mat.reflectivity = isWet ? 0.95 : m.reflectividad * (0.5 + m.fresnel * 0.5);
    mat.roughness = isWet ? 0.02 : m.rugosidad;
    mat.thickness = 1.0 + m.capaEsmalte;
    mat.iridescence = m.sss * 0.3;
    mat.sheen = m.opalescencia;

    // Atenuación para simular núcleo de dentina
    mat.attenuationDistance = 0.5 / (m.translucidez + 0.1);

    // OCLUSIÓN DINÁMICA: Clipping según posición de labios
    DepthEngine.configurarClippingGingival(mat, blueprint);
  }

  onResize(width: number, height: number) {
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
    if (this.composer) {
      this.composer.setSize(width, height);
    }
  }

  renderFrame() {
    if (this.composer) {
      this.composer.render();
    } else {
      this.renderer.render(this.scene, this.camera);
    }
  }

  dispose() {
    this.renderer.dispose();
    this.toothMeshes.clear();
  }
}
