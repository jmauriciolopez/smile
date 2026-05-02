import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
  build: {
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks: {
          // React core — siempre necesario
          "vendor-react": ["react", "react-dom", "react-router-dom"],
          // Konva — solo en el editor
          "vendor-konva": ["konva", "react-konva", "use-image"],
          // Zustand — state management
          "vendor-zustand": ["zustand"],
        },
      },
    },
  },
});
