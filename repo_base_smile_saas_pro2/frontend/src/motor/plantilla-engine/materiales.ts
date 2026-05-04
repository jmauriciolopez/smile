import { MaterialDental } from "../../core/types";

export type TipoCeramica = "E-MAX" | "ZIRCONIA" | "FELDESPATICA" | "COMPOSITE";

export const PRESETS_MATERIALES: Record<
  TipoCeramica,
  Partial<MaterialDental>
> = {
  "E-MAX": {
    colorBase: "#fcfaf2",
    translucidez: 0.6,
    reflectividad: 0.8,
    opalescencia: 0.7,
    fluorescencia: 0.3,
    rugosidad: 0.2,
    fresnel: 0.6,
    sss: 0.4,
    capaEsmalte: 0.5,
    capaDentina: 0.8,
  },
  ZIRCONIA: {
    colorBase: "#ffffff",
    translucidez: 0.3,
    reflectividad: 0.9,
    opalescencia: 0.2,
    fluorescencia: 0.1,
    rugosidad: 0.1,
    fresnel: 0.4,
    sss: 0.2,
    capaEsmalte: 0.3,
    capaDentina: 1.0,
  },
  FELDESPATICA: {
    colorBase: "#fff9e6",
    translucidez: 0.8,
    reflectividad: 0.7,
    opalescencia: 0.9,
    fluorescencia: 0.5,
    rugosidad: 0.4,
    fresnel: 0.8,
    sss: 0.7,
    capaEsmalte: 0.8,
    capaDentina: 0.6,
  },
  COMPOSITE: {
    colorBase: "#f2f2f2",
    translucidez: 0.4,
    reflectividad: 0.5,
    opalescencia: 0.3,
    fluorescencia: 0.2,
    rugosidad: 0.6,
    fresnel: 0.3,
    sss: 0.5,
    capaEsmalte: 0.4,
    capaDentina: 0.7,
  },
};
