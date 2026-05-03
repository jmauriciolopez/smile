import { useEffect, useRef } from "react";
import { useEditorStore } from "../store/editor-sonrisa.store";

/**
 * Hook de Ciclo de Vida del Renderizado — SMILE PRO.
 * Gestiona el loop de renderizado WebGL y la limpieza de recursos de Three.js.
 */
export const useRenderEngine = (
  containerRef: React.RefObject<HTMLDivElement>,
) => {
  const { inicializarEngine, renderizar, blueprint } = useEditorStore();
  const frameId = useRef<number>();

  // Inicializar motor 3D
  useEffect(() => {
    if (containerRef.current) {
      inicializarEngine(containerRef.current);
    }
  }, [containerRef, inicializarEngine]);

  // Loop de renderizado (RequestAnimationFrame para máxima fluidez)
  useEffect(() => {
    const loop = () => {
      renderizar();
      frameId.current = requestAnimationFrame(loop);
    };

    if (blueprint) {
      frameId.current = requestAnimationFrame(loop);
    }

    return () => {
      if (frameId.current) cancelAnimationFrame(frameId.current);
    };
  }, [blueprint, renderizar]);
};
