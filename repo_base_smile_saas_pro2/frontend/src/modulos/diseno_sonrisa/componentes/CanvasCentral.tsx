import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkle, Intersect } from "@phosphor-icons/react";
import { Blueprint } from "../../../core/types";

interface CanvasCentralProps {
  blueprint: Blueprint | null;
  containerRef: React.RefObject<HTMLDivElement>;
  modoComparativa: boolean;
  goldenMode: boolean;
  showSuccess: boolean;
  seleccionadoId: string | null;
  onDeseleccionarDiente: () => void;
}

/** Determina si una fotoUrl es real (no placeholder) */
function esFotoReal(url: string | undefined): url is string {
  return !!url && !url.startsWith("/static/img/") && !url.startsWith("/seed/");
}

export function CanvasCentral({
  blueprint,
  containerRef,
  modoComparativa,
  goldenMode,
  showSuccess,
  seleccionadoId,
  onDeseleccionarDiente,
}: CanvasCentralProps) {
  const vistaActiva = blueprint?.vistas.find(
    (v) => v.id === blueprint.vistaActivaId,
  );
  const fotoUrl = vistaActiva?.fotoUrl;
  const hayFoto = esFotoReal(fotoUrl);

  return (
    <div className="flex-1 relative bg-black flex overflow-hidden">
      {/* Panel comparativa: imagen "antes" */}
      {modoComparativa && (
        <div className="flex-1 border-r border-white/5 relative bg-slate-950">
          <div className="absolute top-4 left-4 bg-black/60 px-2 py-1 rounded text-[8px] font-black text-slate-500 z-10 tracking-widest">
            SITUACIÓN INICIAL
          </div>
          <img
            src={fotoUrl || "/seed/frontal_antes.png"}
            className="w-full h-full object-contain opacity-40 grayscale"
            alt="Antes"
          />
        </div>
      )}

      {/* Área principal del canvas */}
      <div
        className="flex-1 relative overflow-hidden"
        onClick={() => {
          if (seleccionadoId) onDeseleccionarDiente();
        }}
      >
        {/* Imagen de fondo del paciente (detrás del canvas 3D) */}
        {hayFoto && (
          <img
            key={blueprint?.vistaActivaId}
            src={fotoUrl}
            alt="Vista clínica"
            className="absolute inset-0 w-full h-full object-contain pointer-events-none"
            style={{
              zIndex: 1,
              opacity: blueprint?.configuracion.opacidadLabios ?? 0.8,
            }}
          />
        )}

        {/* Canvas Three.js — se monta aquí */}
        <div
          className="absolute inset-0"
          style={{ zIndex: 2 }}
          ref={containerRef}
        />

        {/* Dynamic Island */}
        <motion.div
          layout
          initial={{ y: -100, x: "-50%" }}
          animate={{ y: 0, x: "-50%" }}
          className={`absolute top-6 left-1/2 px-6 py-2 bg-slate-900/80 backdrop-blur-xl rounded-full border border-white/5 flex items-center gap-3 z-30 shadow-2xl transition-all duration-500 ${
            showSuccess ? "bg-emerald-600/90 scale-105" : ""
          }`}
        >
          <AnimatePresence mode="wait">
            {showSuccess ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                className="flex items-center gap-2"
              >
                <Sparkle size={14} weight="fill" className="text-white animate-spin-slow" />
                <span className="text-[10px] font-black text-white tracking-[0.1em] uppercase">
                  DISEÑO PERFECCIONADO
                </span>
              </motion.div>
            ) : (
              <motion.div
                key="active"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-3"
              >
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-[10px] font-black text-white tracking-[0.2em] uppercase">
                  {modoComparativa ? "DISEÑO PRO" : "SMILE ENGINE ACTIVE"}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Golden Ratio Overlay */}
        <AnimatePresence>
          {goldenMode && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 0.2, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="absolute inset-0 z-10 pointer-events-none flex items-center justify-center"
            >
              <Intersect size={400} weight="thin" className="text-emerald-400" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
