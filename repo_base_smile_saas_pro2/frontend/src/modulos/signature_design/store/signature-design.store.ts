import { create } from "zustand";

export interface SignatureAsset {
  id: string;
  type: "portrait" | "scan_initial" | "waxup";
  url: string;
  name: string;
}

export interface AlignmentState {
  x: number;
  y: number;
  z: number;
  rotationX: number;
  rotationY: number;
  rotationZ: number;
  scale: number;
}

interface SignatureDesignState {
  portrait: SignatureAsset | null;
  scanInitial: SignatureAsset | null;
  waxup: SignatureAsset | null;

  // Opacidad de capas
  opacityPortrait: number;
  opacityScan: number;
  opacityWaxup: number;

  // Alineación
  alignment: AlignmentState;

  // Metadatos Pro
  status: "draft" | "review" | "final";
  createdAt: string;
  updatedAt: string;
  authorId: string;
  notes?: string;

  // Labios (Bezier / Mask)
  lipPoints: { x: number; y: number }[];
  showMask: boolean;

  // Acciones
  setAsset: (
    type: "portrait" | "scan_initial" | "waxup",
    asset: SignatureAsset | null,
  ) => void;
  setOpacity: (layer: "portrait" | "scan" | "waxup", value: number) => void;
  setAlignment: (alignment: Partial<AlignmentState>) => void;
  setStatus: (status: "draft" | "review" | "final") => void;
  setNotes: (notes: string) => void;
  setLipPoints: (points: { x: number; y: number }[]) => void;
  toggleMask: (show: boolean) => void;
  resetAlignment: () => void;
}

export const useSignatureStore = create<SignatureDesignState>((set) => ({
  portrait: null,
  scanInitial: null,
  waxup: null,

  opacityPortrait: 1,
  opacityScan: 0.5,
  opacityWaxup: 0.8,

  alignment: {
    x: 0,
    y: 0,
    z: 0,
    rotationX: 0,
    rotationY: 0,
    rotationZ: 0,
    scale: 1,
  },

  status: "draft",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  authorId: "anonymous",
  notes: "",

  lipPoints: [],
  showMask: true,

  setAsset: (type, asset) =>
    set((state) => {
      const update = { updatedAt: new Date().toISOString() };
      if (type === "portrait") return { ...state, ...update, portrait: asset };
      if (type === "scan_initial")
        return { ...state, ...update, scanInitial: asset };
      return { ...state, ...update, waxup: asset };
    }),
  setOpacity: (layer, value) =>
    set((state) => {
      const update = { updatedAt: new Date().toISOString() };
      if (layer === "portrait")
        return { ...state, ...update, opacityPortrait: value };
      if (layer === "scan") return { ...state, ...update, opacityScan: value };
      return { ...state, ...update, opacityWaxup: value };
    }),
  setAlignment: (alignment) =>
    set((state) => ({
      alignment: { ...state.alignment, ...alignment },
      updatedAt: new Date().toISOString(),
    })),
  setStatus: (status) => set({ status, updatedAt: new Date().toISOString() }),
  setNotes: (notes) => set({ notes, updatedAt: new Date().toISOString() }),
  setLipPoints: (points) =>
    set({ lipPoints: points, updatedAt: new Date().toISOString() }),
  toggleMask: (show) =>
    set({ showMask: show, updatedAt: new Date().toISOString() }),
  resetAlignment: () =>
    set({
      alignment: {
        x: 0,
        y: 0,
        z: 0,
        rotationX: 0,
        rotationY: 0,
        rotationZ: 0,
        scale: 1,
      },
      updatedAt: new Date().toISOString(),
    }),
}));
