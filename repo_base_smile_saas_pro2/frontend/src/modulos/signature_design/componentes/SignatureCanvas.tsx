import React, { Suspense, useMemo } from "react";
import { Canvas, useLoader } from "@react-three/fiber";
import {
  OrbitControls,
  PerspectiveCamera,
  Environment,
  Center,
} from "@react-three/drei";
import * as THREE from "three";
import { STLLoader } from "three/addons/loaders/STLLoader.js";
import { useSignatureStore } from "../store/signature-design.store";

// 🦷 Componente para cargar y renderizar STL
const DentalMesh = ({
  url,
  opacity,
  color = "#ffffff",
  wireframe = false,
}: {
  url: string;
  opacity: number;
  color?: string;
  wireframe?: boolean;
}) => {
  const geometry = useLoader(STLLoader, url);

  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial
        color={color}
        transparent
        opacity={opacity}
        roughness={0.3}
        metalness={0.1}
        wireframe={wireframe}
      />
    </mesh>
  );
};

// 🖼️ Fondo del retrato
const PortraitBackground = ({ url }: { url: string }) => {
  const texture = useMemo(() => new THREE.TextureLoader().load(url), [url]);
  return (
    <mesh position={[0, 0, -10]}>
      <planeGeometry args={[16, 9]} />
      <meshBasicMaterial map={texture} />
    </mesh>
  );
};

export const SignatureCanvas: React.FC = () => {
  const { portrait, scanInitial, waxup, opacityScan, opacityWaxup, alignment } =
    useSignatureStore();

  return (
    <div className="relative h-[600px] w-full overflow-hidden rounded-3xl bg-slate-900 shadow-2xl">
      <Canvas gl={{ antialias: true, stencil: true }} shadows>
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[0, 0, 20]} fov={50} />
          <ambientLight intensity={0.7} />
          <pointLight position={[10, 10, 10]} intensity={1.5} />
          <spotLight
            position={[-10, 20, 10]}
            angle={0.15}
            penumbra={1}
            intensity={2}
            castShadow
          />

          {/* 1. Retrato de Fondo */}
          {portrait && <PortraitBackground url={portrait.url} />}

          {/* 2. Escena Dental 3D */}
          <group
            position={[alignment.x, alignment.y, alignment.z]}
            rotation={[
              alignment.rotationX,
              alignment.rotationY,
              alignment.rotationZ,
            ]}
            scale={alignment.scale}
          >
            <Center top>
              {scanInitial && (
                <DentalMesh
                  url={scanInitial.url}
                  opacity={opacityScan}
                  color="#e5e7eb"
                />
              )}
              {waxup && (
                <DentalMesh
                  url={waxup.url}
                  opacity={opacityWaxup}
                  color="#ffffff"
                />
              )}
            </Center>
          </group>

          <Environment preset="city" />
          <OrbitControls makeDefault minDistance={5} maxDistance={50} />
        </Suspense>
      </Canvas>

      {/* Overlay de Carga */}
      {!portrait && !scanInitial && !waxup && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/50 backdrop-blur-md">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
          <p className="mt-4 text-xs font-bold text-white uppercase tracking-widest">
            Esperando activos...
          </p>
        </div>
      )}
    </div>
  );
};
