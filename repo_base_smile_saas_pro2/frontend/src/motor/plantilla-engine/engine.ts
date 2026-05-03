import {
  Blueprint,
  PlantillaSonrisa,
  Diente,
  MaterialDental,
} from "../../core/types";
import { guardarEnHistorial } from "../blueprint-engine/blueprint";
import { PRESETS_MATERIALES, TipoCeramica } from "./materiales";

const generateId = () => Math.random().toString(36).substring(2, 11);

/**
 * Aplica una plantilla completa a un Blueprint existente.
 * Recalcula la posición, dimensiones y material de cada diente.
 */
export function aplicarPlantilla(
  blueprint: Blueprint,
  plantilla: PlantillaSonrisa,
): Blueprint {
  const nuevosDientes: Diente[] = blueprint.dientes.map((diente) => {
    // Lógica de escalado según proporciones de la plantilla
    let escalaX = 1;
    if (diente.pieza === 11 || diente.pieza === 21)
      escalaX = plantilla.parametros.proporciones.incisivoCentral;
    if (diente.pieza === 12 || diente.pieza === 22)
      escalaX = plantilla.parametros.proporciones.incisivoLateral;
    if (diente.pieza === 13 || diente.pieza === 23)
      escalaX = plantilla.parametros.proporciones.canino;

    const nuevoMaterial: MaterialDental = {
      ...diente.material,
      brillo: plantilla.parametros.color.blancura,
      translucidez: plantilla.parametros.color.translucidez,
      saturacion: plantilla.parametros.color.saturacion,
      opalescencia: plantilla.parametros.color.opalescencia,
      rugosidad: plantilla.parametros.color.rugosidad,
      reflectividad: 0.8, // Valor PRO por defecto
      fluorescencia: 0.2,
    };

    return {
      ...diente,
      transformacion: {
        ...diente.transformacion,
        escala: escalaX,
      },
      material: nuevoMaterial,
    };
  });

  return guardarEnHistorial(
    {
      ...blueprint,
      dientes: nuevosDientes,
      metadata: {
        ...blueprint.metadata,
        actualizadoEn: new Date().toISOString(),
      },
    },
    `Aplicar ${plantilla.nombre}`,
  );
}

/**
 * Combina dos plantillas creando una transición entre sus parámetros.
 */
export function combinarPlantillas(
  p1: PlantillaSonrisa,
  p2: PlantillaSonrisa,
  ratio: number, // 0..1
): PlantillaSonrisa {
  return {
    id: `combined-${p1.id}-${p2.id}`,
    nombre: `Mezcla: ${p1.nombre} / ${p2.nombre}`,
    categoria: "Personalizada",
    parametros: {
      proporciones: {
        incisivoCentral:
          p1.parametros.proporciones.incisivoCentral * (1 - ratio) +
          p2.parametros.proporciones.incisivoCentral * ratio,
        incisivoLateral:
          p1.parametros.proporciones.incisivoLateral * (1 - ratio) +
          p2.parametros.proporciones.incisivoLateral * ratio,
        canino:
          p1.parametros.proporciones.canino * (1 - ratio) +
          p2.parametros.proporciones.canino * ratio,
      },
      forma: {
        tipo: ratio > 0.5 ? p2.parametros.forma.tipo : p1.parametros.forma.tipo,
        suavidadBordes:
          p1.parametros.forma.suavidadBordes * (1 - ratio) +
          p2.parametros.forma.suavidadBordes * ratio,
      },
      curvaSonrisa:
        p1.parametros.curvaSonrisa * (1 - ratio) +
        p2.parametros.curvaSonrisa * ratio,
      exposicionDental:
        p1.parametros.exposicionDental * (1 - ratio) +
        p2.parametros.exposicionDental * ratio,
      simetria:
        p1.parametros.simetria * (1 - ratio) + p2.parametros.simetria * ratio,
      color: {
        blancura:
          p1.parametros.color.blancura * (1 - ratio) +
          p2.parametros.color.blancura * ratio,
        translucidez:
          p1.parametros.color.translucidez * (1 - ratio) +
          p2.parametros.color.translucidez * ratio,
        saturacion:
          p1.parametros.color.saturacion * (1 - ratio) +
          p2.parametros.color.saturacion * ratio,
        opalescencia:
          p1.parametros.color.opalescencia * (1 - ratio) +
          p2.parametros.color.opalescencia * ratio,
        rugosidad:
          p1.parametros.color.rugosidad * (1 - ratio) +
          p2.parametros.color.rugosidad * ratio,
      },
    },
  };
}

/**
 * Genera variantes aleatorias controladas a partir de una plantilla base.
 */
export function generarVariantes(
  base: PlantillaSonrisa,
  cantidad: number = 3,
): PlantillaSonrisa[] {
  return Array.from({ length: cantidad }).map((_, i) => ({
    ...base,
    id: `${base.id}-var-${generateId()}`,
    nombre: `${base.nombre} (Variante ${i + 1})`,
    parametros: {
      ...base.parametros,
      curvaSonrisa: Math.min(
        1,
        Math.max(0, base.parametros.curvaSonrisa + (Math.random() - 0.5) * 0.2),
      ),
      exposicionDental: Math.min(
        1,
        Math.max(
          0,
          base.parametros.exposicionDental + (Math.random() - 0.5) * 0.2,
        ),
      ),
      color: {
        ...base.parametros.color,
        blancura: Math.min(
          1,
          Math.max(
            0,
            base.parametros.color.blancura + (Math.random() - 0.5) * 0.1,
          ),
        ),
        opalescencia: Math.min(
          1,
          Math.max(
            0,
            base.parametros.color.opalescencia + (Math.random() - 0.5) * 0.1,
          ),
        ),
      },
    },
  }));
}

/**
 * Crea una nueva plantilla basada en el estado actual de un diseño.
 */
export function extraerPlantillaDeBlueprint(
  blueprint: Blueprint,
  nombre: string,
  categoria: string = "Mis Plantillas",
): PlantillaSonrisa {
  const d11 = blueprint.dientes.find((d) => d.pieza === 11);
  const d12 = blueprint.dientes.find((d) => d.pieza === 12);
  const d13 = blueprint.dientes.find((d) => d.pieza === 13);

  const m = d11?.material;

  return {
    id: `custom-${generateId()}`,
    nombre,
    categoria,
    parametros: {
      proporciones: {
        incisivoCentral: d11?.transformacion.escala || 1,
        incisivoLateral: d12?.transformacion.escala || 0.8,
        canino: d13?.transformacion.escala || 0.9,
      },
      forma: {
        tipo: "oval",
        suavidadBordes: 0.5,
      },
      curvaSonrisa:
        blueprint.guias.find((g) => g.tipo === "sonrisa")?.valor.curva || 0.5,
      exposicionDental: 0.7,
      simetria: 1.0,
      color: {
        blancura: m?.brillo || 0.8,
        translucidez: m?.translucidez || 0.4,
        saturacion: m?.saturacion || 0.2,
        opalescencia: m?.opalescencia || 0.5,
        rugosidad: m?.rugosidad || 0.3,
      },
    },
  };
}

/**
 * Aplica un preset de material cerámico específico a todos los dientes.
 */
export function aplicarMaterialCeramico(
  blueprint: Blueprint,
  tipo: TipoCeramica,
): Blueprint {
  const preset = PRESETS_MATERIALES[tipo as TipoCeramica];

  const nuevosDientes = blueprint.dientes.map((d) => ({
    ...d,
    material: {
      ...d.material,
      ...preset,
    },
  }));

  return guardarEnHistorial(
    {
      ...blueprint,
      dientes: nuevosDientes,
      metadata: {
        ...blueprint.metadata,
        actualizadoEn: new Date().toISOString(),
      },
    },
    `Material: ${tipo}`,
  );
}
