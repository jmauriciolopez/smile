import React, { useRef } from "react";
import { useRenderEngine } from "../../../motor/useRenderEngine";
import { useEditorSonrisa } from "../../../hooks/useEditorSonrisa";

/**
 * Componente Lienzo de Diseño PRO.
 * Contenedor principal para el renderizado WebGL del diseño de sonrisa.
 */
export const LienzoDiseno: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { blueprint, seleccionadoId, seleccionarDiente } = useEditorSonrisa();

  // Activar el motor de renderizado 3D
  useRenderEngine(containerRef);

  return (
    <div className="relative w-full h-full bg-black overflow-hidden group">
      {/* Capa de Renderizado Three.js */}
      <div
        ref={containerRef}
        className="w-full h-full cursor-crosshair"
        onClick={() => seleccionarDiente(null)}
      />

      {/* Overlay de HUD Clínico */}
      <div className="absolute top-4 left-4 pointer-events-none">
        <div className="bg-black/60 backdrop-blur-md p-3 rounded-lg border border-white/10">
          <div className="text-[10px] uppercase tracking-widest text-blue-400 font-bold mb-1">
            Status Sistema
          </div>
          <div className="text-xs text-white">
            {blueprint ? (
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                Motor 3D Activo - v{blueprint.version}
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 bg-yellow-500 rounded-full" />
                Esperando Detección Facial...
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Indicadores de Selección */}
      {seleccionadoId && (
        <div className="absolute bottom-4 right-4 bg-blue-600/20 backdrop-blur-xl p-4 rounded-xl border border-blue-500/50">
          <div className="text-xs font-bold text-blue-300 mb-1">
            PIEZA SELECCIONADA
          </div>
          <div className="text-2xl font-black text-white italic">
            {seleccionadoId}
          </div>
        </div>
      )}
    </div>
  );
};

export default LienzoDiseno;
