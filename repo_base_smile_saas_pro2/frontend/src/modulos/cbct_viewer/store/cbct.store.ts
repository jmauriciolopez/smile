import { create } from "zustand";

export interface CBCTSlice {
  index: number;
  imageData: any; // Cornerstone Image object
}

interface CBCTState {
  files: File[];
  isLoaded: boolean;

  // Visualización MPR (Multi-Planar Reconstruction)
  axialIndex: number;
  sagittalIndex: number;
  coronalIndex: number;

  maxSlices: {
    axial: number;
    sagittal: number;
    coronal: number;
  };

  // Ajustes de Imagen
  windowWidth: number;
  windowCenter: number;

  // Acciones
  setFiles: (files: File[]) => void;
  setLoaded: (loaded: boolean) => void;
  setSliceIndex: (
    plane: "axial" | "sagittal" | "coronal",
    index: number,
  ) => void;
  setWindowing: (width: number, center: number) => void;
  reset: () => void;
}

export const useCBCTStore = create<CBCTState>((set) => ({
  files: [],
  isLoaded: false,

  axialIndex: 0,
  sagittalIndex: 0,
  coronalIndex: 0,

  maxSlices: {
    axial: 100,
    sagittal: 100,
    coronal: 100,
  },

  windowWidth: 400,
  windowCenter: 40,

  setFiles: (files) => set({ files }),
  setLoaded: (isLoaded) => set({ isLoaded }),
  setSliceIndex: (plane, index) =>
    set((state) => ({ ...state, [`${plane}Index`]: index })),
  setWindowing: (windowWidth, windowCenter) =>
    set({ windowWidth, windowCenter }),
  reset: () =>
    set({
      files: [],
      isLoaded: false,
      axialIndex: 0,
      sagittalIndex: 0,
      coronalIndex: 0,
    }),
}));
