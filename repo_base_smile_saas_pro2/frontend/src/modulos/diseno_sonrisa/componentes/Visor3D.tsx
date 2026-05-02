import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { STLLoader } from "three/addons/loaders/STLLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

interface Visor3DProps {
  url?: string;
  width?: string | number;
  height?: string | number;
}

/**
 * VISOR 3D — Fase F
 * Permite visualizar archivos STL (escaneos intraorales) en el navegador.
 */
export const Visor3D: React.FC<Visor3DProps> = ({
  url = "/mock/intraoral_scan_stub.stl",
  width = "100%",
  height = 500,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mountNode = mountRef.current;
    if (!mountNode) return;

    // 1. Escena, Cámara y Renderizador
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf3f4f6); // Gray-100

    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
    camera.position.set(0, 0, 100);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    const { offsetWidth, offsetHeight } = mountNode;
    renderer.setSize(offsetWidth, offsetHeight);
    mountNode.appendChild(renderer.domElement);

    // 2. Luces
    const ambientLight = new THREE.AmbientLight(0x404040, 2);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 1);
    camera.add(pointLight);
    scene.add(camera);

    // 3. Controles
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    // 4. Cargador STL
    const loader = new STLLoader();
    loader.load(
      url,
      (geometry: THREE.BufferGeometry) => {
        const material = new THREE.MeshPhongMaterial({
          color: 0xe5e7eb,
          specular: 0x111111,
          shininess: 200,
        });
        const mesh = new THREE.Mesh(geometry, material);

        // Centrar el modelo
        geometry.computeBoundingBox();
        const center = new THREE.Vector3();
        geometry.boundingBox?.getCenter(center);
        mesh.position.sub(center);

        scene.add(mesh);
      },
      (xhr: ProgressEvent) => {
        console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
      },
      (error) => {
        console.error("Error al cargar STL:", error);
      },
    );

    // 5. Animación
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // 6. Resize handler
    const handleResize = () => {
      const { offsetWidth: ow, offsetHeight: oh } = mountNode;
      camera.aspect = ow / oh;
      camera.updateProjectionMatrix();
      renderer.setSize(ow, oh);
    };
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      mountNode.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, [url]);

  return (
    <div
      ref={mountRef}
      style={{
        width,
        height,
        borderRadius: "12px",
        overflow: "hidden",
        border: "1px solid #e5e7eb",
        backgroundColor: "#f9fafb",
      }}
      className="shadow-inner"
    />
  );
};
