import * as THREE from "three";

export interface ToothMaterialConfig {
  color: string;
  translucency: number;
  reflectivity: number;
  roughness: number;
  opalescence: number;
  fresnel: number;
  sss: number;
  enamelLayer: number;
  pieza?: number; // FDI number para variación por diente
}

// ── Generador Procedural de Noise Map ─────────────────────────────────────────
/**
 * Genera una textura de ruido procedural (Perlin-like) para simular
 * la micro-textura natural del esmalte dental. Cada diente recibe
 * una semilla diferente basada en su número FDI.
 */
function generarNoiseTexture(
  seed: number,
  size: number = 64,
): THREE.DataTexture {
  const data = new Uint8Array(size * size * 4);

  // Semilla determinista por pieza para variación consistente
  const rng = (x: number): number => {
    const v = Math.sin(x * 12.9898 + seed * 78.233) * 43758.5453;
    return v - Math.floor(v);
  };

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4;

      // Combinar frecuencias para simular micro-estrías del esmalte
      const freq1 = rng(x * 0.1 + y * 0.13) * 0.4;
      const freq2 = rng(x * 0.37 + y * 0.41) * 0.3;
      const freq3 = rng(x * 0.97 + y * 1.03) * 0.15;

      // Edge wear: más rugosidad en los bordes incisales (top/bottom)
      const edgeFactor = 1.0 - Math.abs(y / size - 0.5) * 2.0;
      const edgeWear = edgeFactor > 0.85 ? (edgeFactor - 0.85) * 3.0 : 0;

      const noise = 128 + (freq1 + freq2 + freq3 + edgeWear * 0.1) * 80;
      const clamped = Math.max(0, Math.min(255, noise));

      data[idx] = clamped; // R
      data[idx + 1] = clamped; // G
      data[idx + 2] = clamped; // B
      data[idx + 3] = 255; // A
    }
  }

  const texture = new THREE.DataTexture(data, size, size);
  texture.needsUpdate = true;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

/**
 * Calcula variaciones orgánicas sutiles por pieza dental.
 * Laterales más translúcidos, caninos más amarillentos, etc.
 */
function getVariacionPorPieza(pieza: number): {
  roughnessBias: number;
  colorShift: THREE.Color;
  translucencyBias: number;
} {
  // Últimas dos cifras FDI determinan el tipo
  const tipo = pieza % 10;

  switch (tipo) {
    case 1: // Incisivo central: más uniforme, ligeramente más blanco
      return {
        roughnessBias: 0.0,
        colorShift: new THREE.Color(1.0, 1.0, 1.02),
        translucencyBias: 0.02,
      };
    case 2: // Incisivo lateral: más translúcido en el borde incisal
      return {
        roughnessBias: -0.01,
        colorShift: new THREE.Color(1.0, 1.0, 1.01),
        translucencyBias: 0.05,
      };
    case 3: // Canino: ligeramente más saturado/amarillento, más grueso
      return {
        roughnessBias: 0.02,
        colorShift: new THREE.Color(1.02, 1.0, 0.97),
        translucencyBias: -0.03,
      };
    case 4:
    case 5: // Premolares: más rugosos, menos translúcidos
      return {
        roughnessBias: 0.04,
        colorShift: new THREE.Color(1.01, 0.99, 0.97),
        translucencyBias: -0.05,
      };
    case 6:
    case 7:
    case 8: // Molares: máxima rugosidad, mínima translucidez
      return {
        roughnessBias: 0.06,
        colorShift: new THREE.Color(1.02, 0.98, 0.95),
        translucencyBias: -0.08,
      };
    default:
      return {
        roughnessBias: 0.0,
        colorShift: new THREE.Color(1.0, 1.0, 1.0),
        translucencyBias: 0.0,
      };
  }
}

/**
 * Sistema de Materiales Dentales PRO (Advanced PBR + Micro-Detail).
 * Simula el esmalte dental usando propiedades físicas avanzadas, Fresnel, SSS,
 * Noise Maps procedurales, Edge Wear, y variación orgánica por pieza.
 */
export function createToothMaterial(
  config: ToothMaterialConfig,
): THREE.Material {
  const pieza = config.pieza ?? 11;
  const variacion = getVariacionPorPieza(pieza);

  // Micro Roughness Map (procedural, único por diente)
  const roughnessMap = generarNoiseTexture(pieza, 64);

  // Color con variación orgánica por tipo de pieza
  const baseColor = new THREE.Color(config.color);
  baseColor.multiply(variacion.colorShift);

  const material = new THREE.MeshPhysicalMaterial({
    color: baseColor,
    metalness: 0.0,
    roughness: Math.max(
      0,
      Math.min(1, config.roughness + variacion.roughnessBias),
    ),
    roughnessMap: roughnessMap, // 🔬 MICRO-TEXTURA DEL ESMALTE
    transmission: Math.max(0, config.translucency + variacion.translucencyBias),
    thickness: 1.0 + config.enamelLayer,
    ior: 1.63, // Índice de refracción del esmalte dental
    reflectivity: config.reflectivity * (0.5 + config.fresnel * 0.5),
    clearcoat: 0.5, // Saliva / Pulido
    clearcoatRoughness: 0.05,
    sheen: config.opalescence,
    sheenColor: new THREE.Color(0xb0d4ff), // Tono azulado de opalescencia
    specularIntensity: 0.8,
    side: THREE.DoubleSide,

    // Fake SSS (Subsurface Scattering) usando iridiscencia
    iridescence: config.sss * 0.3,
    iridescenceIOR: 1.3,

    // Attenuation para simular absorción en dentina
    attenuationColor: new THREE.Color(config.color).lerp(
      new THREE.Color(0xfff4e0),
      0.5,
    ),
    attenuationDistance: 0.5 / (config.translucency + 0.1),
  });

  return material;
}

/**
 * Material para el efecto "Wet" (Húmedo).
 */
export function getWetMaterial(baseColor: string): THREE.Material {
  return createToothMaterial({
    color: baseColor,
    translucency: 0.4,
    reflectivity: 0.95,
    roughness: 0.02,
    opalescence: 0.6,
    fresnel: 0.8,
    sss: 0.5,
    enamelLayer: 0.5,
  });
}
