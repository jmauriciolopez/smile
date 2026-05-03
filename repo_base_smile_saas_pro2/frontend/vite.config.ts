import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Separar librerías pesadas de node_modules
          if (id.includes("node_modules")) {
            if (
              id.includes("three") ||
              id.includes("@react-three") ||
              id.includes("postprocessing")
            ) {
              return "vendor-three";
            }
            if (id.includes("konva") || id.includes("react-konva")) {
              return "vendor-konva";
            }
            if (
              id.includes("react") ||
              id.includes("scheduler") ||
              id.includes("object-assign")
            ) {
              return "vendor-react";
            }
            if (id.includes("cornerstone") || id.includes("dicom-parser")) {
              return "vendor-medical";
            }
            if (id.includes("@mediapipe")) {
              return "vendor-ai";
            }
          }
          // Separar los motores de cálculo clínico (core del negocio)
          if (id.includes("src/motor/")) {
            return "smile-engines-pro";
          }
        },
      },
    },
  },
});
