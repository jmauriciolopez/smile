import React from "react";
import { motion } from "framer-motion";
import {
  Tooth, MagicWand, ArrowSquareOut, Palette, Camera, Eye, Sparkle,
  ArrowLeft, ClockCounterClockwise, Drop, Star, Crosshair,
} from "@phosphor-icons/react";
import { Blueprint, Diente } from "../../../core/types";
import { PLANTILLAS_PREDEFINIDAS } from "../../../motor/plantilla-engine/seed";
import { PRESETS_MATERIALES, TipoCeramica } from "../../../motor/plantilla-engine/materiales";
import { useEditorStore } from "../../../store/editor-sonrisa.store";

const itemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0 },
};

interface SidebarIzquierdoProps {
  blueprint: Blueprint | null;
  seleccionadoId: string | null;
  modoComparativa: boolean;
  favoritos: string[];
  filtroFavoritos: boolean;
  snapshotNombre: string;
  onNavigateBack: () => void;
  onLogoClick: () => void;
  onAbrirCaptura: (vistaId: string) => void;
  onAlternarComparativa: () => void;
  onEjecutarOptimizacionIA: () => void;
  onEjecutarAutoAlineacion: () => void;
  onRecomendarPlantillaIA: () => void;
  onSetModoVisual: (modo: "humedo" | "seco") => void;
  onSetOpacidadLabios: (v: number) => void;
  onAplicarPreset: (id: string) => void;
  onAlternarFavorito: (id: string) => void;
  onAplicarEstiloAPieza: (dienteId: string, plantillaId: string) => void;
  onSeleccionarMaterial: (tipo: TipoCeramica) => void;
  onSetFiltroFavoritos: (v: boolean) => void;
  onUndo: () => void;
  onRedo: () => void;
  onCrearSnapshot: () => void;
  onSaltarAVersion: (id: string) => void;
  onSetSnapshotNombre: (v: string) => void;
}

export function SidebarIzquierdo({
  blueprint,
  seleccionadoId,
  modoComparativa,
  favoritos,
  filtroFavoritos,
  snapshotNombre,
  onNavigateBack,
  onLogoClick,
  onAbrirCaptura,
  onAlternarComparativa,
  onEjecutarOptimizacionIA,
  onEjecutarAutoAlineacion,
  onRecomendarPlantillaIA,
  onSetModoVisual,
  onSetOpacidadLabios,
  onAplicarPreset,
  onAlternarFavorito,
  onAplicarEstiloAPieza,
  onSeleccionarMaterial,
  onSetFiltroFavoritos,
  onUndo,
  onRedo,
  onCrearSnapshot,
  onSaltarAVersion,
  onSetSnapshotNombre,
}: SidebarIzquierdoProps) {
  return (
    <motion.aside
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0, x: -20 },
        visible: {
          opacity: 1, x: 0,
          transition: { staggerChildren: 0.1, type: "spring", stiffness: 100, damping: 20 },
        },
      }}
      className="w-72 h-full bg-slate-900 border-r border-white/5 z-20 p-5 flex flex-col gap-3 overflow-y-auto scrollbar-hide select-none"
    >
      {/* Logo & Volver */}
      <div className="flex items-center gap-3 mb-1">
        <button
          onClick={onNavigateBack}
          className="p-1.5 bg-white/5 hover:bg-white/10 rounded-lg transition-all group"
        >
          <ArrowLeft size={16} weight="bold" className="text-white group-hover:-translate-x-0.5 transition-transform" />
        </button>
        <div className="flex items-center gap-2 cursor-pointer group" onClick={onLogoClick}>
          <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-6 transition-transform">
            <Tooth size={18} weight="fill" className="text-white" />
          </div>
          <div>
            <h1 className="text-[12px] font-black text-white tracking-tighter uppercase">
              SMILE <span className="text-emerald-400">PRO</span>
            </h1>
            <p className="text-[7px] font-bold text-slate-500 tracking-[0.1em] uppercase opacity-60">
              Digital Masterpiece
            </p>
          </div>
        </div>
      </div>

      {/* Fotografía Clínica */}
      <motion.section variants={itemVariants} className="space-y-1.5">
        <div className="flex items-center gap-2 mb-0.5">
          <Camera size={14} weight="duotone" className="text-emerald-500" />
          <h3 className="text-[9px] font-black uppercase tracking-widest text-slate-500">Clínica</h3>
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          {[
            { id: "vista-frontal", label: "Frontal" },
            { id: "vista-sonrisa", label: "Sonrisa" },
            { id: "vista-reposo", label: "Reposo" },
            { id: "vista-lateral", label: "Lateral" },
          ].map((vista) => {
            const fotoVista = blueprint?.vistas.find((v) => v.id === vista.id)?.fotoUrl;
            const tieneFoto = fotoVista && !fotoVista.startsWith("/static/img/") && !fotoVista.startsWith("/seed/");
            return (
              <button
                key={vista.id}
                onClick={() => onAbrirCaptura(vista.id)}
                className={`relative flex items-center gap-2 px-2.5 py-2 border rounded-xl hover:bg-white/10 transition-all group ${
                  tieneFoto ? "bg-emerald-500/10 border-emerald-500/30" : "bg-white/5 border-white/5"
                }`}
              >
                {tieneFoto && <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-emerald-400" />}
                <Camera size={14} className={tieneFoto ? "text-emerald-400" : "text-slate-400 group-hover:text-white"} />
                <span className={`text-[8px] font-bold uppercase tracking-tighter group-hover:text-white ${tieneFoto ? "text-emerald-300" : "text-slate-400"}`}>
                  {vista.label}
                </span>
              </button>
            );
          })}
        </div>
        <button
          onClick={onAlternarComparativa}
          className={`w-full py-2 text-[9px] font-black rounded-xl border transition-all uppercase tracking-widest ${
            modoComparativa
              ? "bg-emerald-500 border-emerald-400 text-white shadow-lg"
              : "bg-white/5 border-white/10 text-slate-400 hover:border-white/20"
          }`}
        >
          {modoComparativa ? "Diseño Único" : "Comparativa Antes/Después"}
        </button>
      </motion.section>

      {/* IA Engine */}
      <motion.section variants={itemVariants} className="pt-2 border-t border-white/5 space-y-1.5">
        <div className="flex items-center gap-2 mb-0.5">
          <MagicWand size={14} weight="duotone" className="text-slate-400" />
          <h3 className="text-[9px] font-black uppercase tracking-widest text-slate-500">IA Engine</h3>
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          <button onClick={onEjecutarOptimizacionIA} className="py-2 bg-blue-600 hover:bg-blue-500 text-white text-[8px] font-black rounded-lg transition-all uppercase">
            Optimizar IA
          </button>
          <button onClick={onEjecutarAutoAlineacion} className="py-2 bg-white/5 border border-white/10 text-slate-400 text-[8px] font-black rounded-lg hover:bg-white/10 transition-all uppercase">
            Alinear Cara
          </button>
        </div>
        <button
          onClick={onRecomendarPlantillaIA}
          className="w-full py-2 bg-gradient-to-r from-emerald-600/20 to-blue-600/20 border border-white/10 text-white text-[8px] font-black rounded-lg hover:from-emerald-600/30 hover:to-blue-600/30 transition-all uppercase flex items-center justify-center gap-2"
        >
          <Sparkle size={12} weight="fill" className="text-emerald-400" />
          Sugerir Sonrisa Ideal
        </button>
      </motion.section>

      {/* Visual */}
      <motion.section variants={itemVariants} className="pt-2 border-t border-white/5 space-y-1.5">
        <div className="flex items-center gap-2 mb-0.5">
          <Eye size={14} weight="duotone" className="text-slate-400" />
          <h3 className="text-[9px] font-black uppercase tracking-widest text-slate-500">Visual</h3>
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          {(["humedo", "seco"] as const).map((modo) => (
            <button
              key={modo}
              onClick={() => onSetModoVisual(modo)}
              className={`py-1.5 text-[8px] font-black rounded-lg border transition-all ${
                blueprint?.configuracion.modoVisual === modo
                  ? modo === "humedo" ? "bg-blue-500 border-blue-400 text-white shadow-lg" : "bg-slate-700 border-slate-600 text-white shadow-lg"
                  : "bg-white/5 border-white/10 text-slate-500"
              }`}
            >
              {modo === "humedo" ? "HÚMEDO" : "SECO"}
            </button>
          ))}
        </div>
        <div className="pt-1">
          <div className="flex justify-between text-[7px] text-slate-600 mb-1 font-bold">
            <span className="flex items-center gap-1">
              <Drop size={10} weight="fill" className="text-blue-400" />
              OPACIDAD LABIOS
            </span>
            <span className="font-mono text-slate-400">
              {Math.round((blueprint?.configuracion.opacidadLabios ?? 0.8) * 100)}%
            </span>
          </div>
          <input
            type="range" min="0" max="1" step="0.01"
            value={blueprint?.configuracion.opacidadLabios ?? 0.8}
            onChange={(e) => onSetOpacidadLabios(parseFloat(e.target.value))}
            className="w-full h-0.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
        </div>
      </motion.section>

      {/* Biblioteca */}
      <motion.section variants={itemVariants} className="pt-2 border-t border-white/5 space-y-2">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <Tooth size={14} weight="duotone" className="text-slate-400" />
            <h3 className="text-[9px] font-black uppercase tracking-widest text-slate-500">Biblioteca</h3>
          </div>
          <button
            onClick={() => onSetFiltroFavoritos(!filtroFavoritos)}
            className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[7px] font-black border transition-all ${
              filtroFavoritos ? "bg-amber-500 border-amber-400 text-white" : "bg-white/5 border-white/10 text-slate-500 hover:text-white"
            }`}
          >
            <Star size={9} weight={filtroFavoritos ? "fill" : "regular"} />
            FAV
          </button>
        </div>
        <div className="grid grid-cols-1 gap-1.5 max-h-44 overflow-y-auto pr-1 scrollbar-hide">
          {PLANTILLAS_PREDEFINIDAS.filter((p) => !filtroFavoritos || favoritos.includes(p.id)).map((p) => (
            <div key={p.id} className="flex items-center gap-1.5 p-2 bg-white/5 border border-white/5 rounded-xl hover:border-blue-500/40 transition-all group">
              <button onClick={() => onAplicarPreset(p.id)} className="flex-1 flex items-center justify-between">
                <span className="text-[8px] font-black text-slate-400 uppercase group-hover:text-white">{p.nombre}</span>
                <div className="flex gap-0.5">
                  {[1, 2, 3].map((i) => <div key={i} className="w-1.5 h-3 bg-white/20 rounded-sm" />)}
                </div>
              </button>
              <button onClick={() => onAlternarFavorito(p.id)} className="ml-1 shrink-0">
                <Star size={12} weight={favoritos.includes(p.id) ? "fill" : "regular"} className={favoritos.includes(p.id) ? "text-amber-400" : "text-slate-600 hover:text-amber-400"} />
              </button>
              {seleccionadoId && (
                <button onClick={() => onAplicarEstiloAPieza(seleccionadoId, p.id)} title="Aplicar solo a pieza seleccionada" className="ml-0.5 shrink-0">
                  <Crosshair size={11} weight="bold" className="text-slate-600 hover:text-blue-400 transition-colors" />
                </button>
              )}
            </div>
          ))}
          {filtroFavoritos && favoritos.length === 0 && (
            <p className="text-[8px] text-slate-600 text-center py-3">Sin favoritos aún</p>
          )}
        </div>
      </motion.section>

      {/* Material */}
      <motion.section variants={itemVariants} className="pt-2 border-t border-white/5 space-y-2">
        <div className="flex items-center gap-2 mb-1">
          <Palette size={14} weight="duotone" className="text-slate-400" />
          <h3 className="text-[9px] font-black uppercase tracking-widest text-slate-500">Material</h3>
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          {Object.keys(PRESETS_MATERIALES).slice(0, 4).map((m) => (
            <button
              key={m}
              onClick={() => onSeleccionarMaterial(m as TipoCeramica)}
              className={`py-1.5 text-[7px] font-black rounded-lg border transition-all ${
                blueprint?.dientes[0]?.material.colorBase === PRESETS_MATERIALES[m as TipoCeramica].colorBase
                  ? "bg-emerald-600 border-emerald-500 text-white"
                  : "bg-white/5 border-white/5 text-slate-500"
              }`}
            >
              {m.toUpperCase()}
            </button>
          ))}
        </div>
      </motion.section>

      {/* Exportar */}
      <motion.section variants={itemVariants} className="pt-2 border-t border-white/5 space-y-1.5">
        <div className="flex items-center gap-2 mb-0.5">
          <ArrowSquareOut size={14} weight="duotone" className="text-slate-400" />
          <h3 className="text-[9px] font-black uppercase tracking-widest text-slate-500">Exportar</h3>
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          <button onClick={() => useEditorStore.getState().engine?.exportarSTL()} className="py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-[8px] font-black rounded-lg shadow-lg transition-all">STL</button>
          <button onClick={() => useEditorStore.getState().engine?.exportarOBJ()} className="py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-[8px] font-black rounded-lg transition-all">OBJ</button>
        </div>
      </motion.section>

      {/* Timeline */}
      <motion.section variants={itemVariants} className="mt-auto pt-2 border-t border-white/5 space-y-1.5">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <ClockCounterClockwise size={14} weight="duotone" className="text-slate-400" />
            <h3 className="text-[9px] font-black uppercase tracking-widest text-slate-500">Timeline</h3>
          </div>
          <div className="flex gap-1">
            <button onClick={onUndo} title="Deshacer" className="p-1 bg-white/5 hover:bg-white/10 rounded text-slate-500 hover:text-white transition-all">
              <ArrowLeft size={10} weight="bold" />
            </button>
            <button onClick={onRedo} title="Rehacer" className="p-1 bg-white/5 hover:bg-white/10 rounded text-slate-500 hover:text-white transition-all rotate-180">
              <ArrowLeft size={10} weight="bold" />
            </button>
          </div>
        </div>
        <div className="flex gap-1.5">
          <input
            type="text"
            value={snapshotNombre}
            onChange={(e) => onSetSnapshotNombre(e.target.value)}
            placeholder="Nombre versión..."
            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-[8px] text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/50"
          />
          <button
            onClick={onCrearSnapshot}
            className="px-2 py-1 bg-blue-600/30 hover:bg-blue-600/50 border border-blue-500/30 rounded-lg text-[8px] font-black text-blue-300 transition-all"
          >
            SAVE
          </button>
        </div>
        <div className="space-y-1 max-h-28 overflow-y-auto scrollbar-hide">
          {blueprint?.historial.slice().reverse().map((version: any, idx: number) => {
            const esActiva = blueprint.historial.length - 1 - idx === blueprint.indiceHistorial;
            return (
              <button
                key={version.id}
                onClick={() => onSaltarAVersion(version.id)}
                className={`w-full text-left p-1.5 rounded-lg border text-[8px] font-black uppercase transition-all ${
                  esActiva ? "bg-blue-600 border-blue-500 text-white" : "bg-white/5 border-white/5 text-slate-500 hover:text-white"
                }`}
              >
                {version.etiqueta || "Edición"}
              </button>
            );
          })}
        </div>
      </motion.section>
    </motion.aside>
  );
}
