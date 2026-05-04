import React, { useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useEditorStore } from "../../../store/editor-sonrisa.store";
import * as servicioDisenos from "../../../servicios/servicioDisenos";
import { motion, AnimatePresence } from "framer-motion";
import {
  Tooth,
  MagicWand,
  ArrowSquareOut,
  Palette,
  CheckCircle,
  FileText,
  Camera,
  Eye,
  EyeSlash,
  Sparkle,
  Intersect,
  ArrowLeft,
  ClockCounterClockwise,
  Cube,
  Drop,
  Star,
  Gauge,
  Crosshair,
  Brain,
  Faders,
  Diamond,
  Ruler,
  Lightning,
  Stethoscope,
  ShieldCheck,
  ShieldWarning,
  WarningOctagon,
  ListChecks,
  FirstAid,
} from "@phosphor-icons/react";
import { PLANTILLAS_PREDEFINIDAS } from "../../../motor/plantilla-engine/seed";
import { CapturaFotoModal } from "../componentes/CapturaFotoModal";
import {
  PRESETS_MATERIALES,
  TipoCeramica,
} from "../../../motor/plantilla-engine/materiales";

const containerVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      staggerChildren: 0.1,
      type: "spring" as const,
      stiffness: 100,
      damping: 20,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0 },
};

export const EditorSonrisaPage: React.FC = () => {
  const { casoId: id } = useParams<{ casoId: string }>();
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);

  const {
    blueprint,
    generarDiseno,
    inicializarEngine,
    cargarDisenoPersistente,
    guardarDisenoPersistente,
    cambiarVista,
    alternarGuia,
    aplicarPreset,
    ejecutarOptimizacionIA,
    ejecutarAutoAlineacion,
    recomendarPlantillaIA,
    ejecutarAuditoria,
    auditoria,
    obtenerDiagnosticoIA,
    modoComparativa,
    alternarComparativa,
    resizeEngine,
    generarReporteClinico,
    seleccionarMaterialCeramico,
    setModoVisual,
    setOpacidadLabios,
    saltarAVersion,
    crearSnapshotInterno,
    actualizarFotoVista,
    setGuiaValor,
    seleccionarDiente,
    seleccionadoId,
    actualizarTransformacion3D,
    resetearTransformacion3D,
    aplicarEstiloAPieza,
    favoritos,
    alternarFavorito,
    actualizarDiente,
    undo,
    redo,
  } = useEditorStore();

  const [showSuccess, setShowSuccess] = React.useState(false);
  const [logoClicks, setLogoClicks] = React.useState(0);
  const [goldenMode, setGoldenMode] = React.useState(false);
  const [modalCapturaAbierto, setModalCapturaAbierto] = React.useState(false);
  const [vistaParaCapturar, setVistaParaCapturar] = React.useState<
    string | null
  >(null);
  const [fotoGuardada, setFotoGuardada] = React.useState<string | null>(null);
  const [filtroFavoritos, setFiltroFavoritos] = React.useState(false);
  const [panelDerecho, setPanelDerecho] = React.useState<
    "vistas" | "gizmos" | "pbr" | "auditoria"
  >("vistas");
  const [snapshotNombre, setSnapshotNombre] = React.useState("");

  const engineInitialized = useRef(false);

  useEffect(() => {
    const init = async () => {
      if (!containerRef.current || engineInitialized.current) return;

      console.log("🚀 Inicializando Engine...");
      inicializarEngine(containerRef.current);
      engineInitialized.current = true;

      const datosFacialesDefault = {
        puntos: [],
        anchoCara: 1000,
        altoCara: 1000,
        lineaMediaX: 500,
        lineaBipupilarY: 400,
        contornoLabios: [],
        labiosExterior: [],
        labiosInterior: [],
      };

      if (id) {
        // Siempre cargar desde la DB cuando hay casoId — garantiza fotos actualizadas
        console.log("📂 Cargando diseño para:", id);
        try {
          await cargarDisenoPersistente(id);
          const { blueprint } = useEditorStore.getState();
          if (!blueprint || !blueprint.vistas?.length) {
            console.log("⚠️ Sin diseño en DB, generando nuevo");
            generarDiseno(datosFacialesDefault);
          }
        } catch {
          console.log("⚠️ Error al cargar, generando diseño nuevo");
          generarDiseno(datosFacialesDefault);
        }
      } else {
        console.log("🆕 Generando diseño nuevo");
        generarDiseno(datosFacialesDefault);
      }
    };

    init();

    return () => {
      engineInitialized.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width > 0 && height > 0) {
          resizeEngine(width, height);
        }
      }
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [resizeEngine]);

  return (
    <div className="relative w-full h-screen bg-black flex overflow-hidden">
      {/* 🧬 SIDEBAR IZQUIERDO: CONTROLES CLÍNICOS */}
      <motion.aside
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="w-72 h-full bg-slate-900 border-r border-white/5 z-20 p-5 flex flex-col gap-3 overflow-y-auto scrollbar-hide select-none"
      >
        {/* 🔙 BOTÓN VOLVER & LOGO */}
        <div className="flex items-center gap-3 mb-1">
          <button
            onClick={() => navigate(-1)}
            className="p-1.5 bg-white/5 hover:bg-white/10 rounded-lg transition-all group"
          >
            <ArrowLeft
              size={16}
              weight="bold"
              className="text-white group-hover:-translate-x-0.5 transition-transform"
            />
          </button>
          <div
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => {
              setLogoClicks((c) => c + 1);
              if (logoClicks >= 5) {
                setGoldenMode(!goldenMode);
                setLogoClicks(0);
              }
            }}
          >
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

        {/* 📸 FOTOGRAFÍA CLÍNICA */}
        <motion.section variants={itemVariants} className="space-y-1.5">
          <div className="flex items-center gap-2 mb-0.5">
            <Camera size={14} weight="duotone" className="text-emerald-500" />
            <h3 className="text-[9px] font-black uppercase tracking-widest text-slate-500">
              Clínica
            </h3>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {[
              { id: "vista-frontal", label: "Frontal" },
              { id: "vista-sonrisa", label: "Sonrisa" },
              { id: "vista-reposo", label: "Reposo" },
              { id: "vista-lateral", label: "Lateral" },
            ].map((vista) => {
              const fotoVista = blueprint?.vistas.find(
                (v) => v.id === vista.id,
              )?.fotoUrl;
              const tieneFoto =
                fotoVista &&
                !fotoVista.startsWith("/static/img/") &&
                !fotoVista.startsWith("/seed/");
              return (
                <button
                  key={vista.id}
                  onClick={() => {
                    setVistaParaCapturar(vista.id);
                    setModalCapturaAbierto(true);
                  }}
                  className={`relative flex items-center gap-2 px-2.5 py-2 border rounded-xl hover:bg-white/10 transition-all group ${
                    tieneFoto
                      ? "bg-emerald-500/10 border-emerald-500/30"
                      : "bg-white/5 border-white/5"
                  }`}
                >
                  {tieneFoto && (
                    <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  )}
                  <Camera
                    size={14}
                    className={
                      tieneFoto
                        ? "text-emerald-400"
                        : "text-slate-400 group-hover:text-white"
                    }
                  />
                  <span
                    className={`text-[8px] font-bold uppercase tracking-tighter group-hover:text-white ${tieneFoto ? "text-emerald-300" : "text-slate-400"}`}
                  >
                    {vista.label}
                  </span>
                </button>
              );
            })}
          </div>
          <button
            onClick={alternarComparativa}
            className={`w-full py-2 text-[9px] font-black rounded-xl border transition-all uppercase tracking-widest ${
              modoComparativa
                ? "bg-emerald-500 border-emerald-400 text-white shadow-lg"
                : "bg-white/5 border-white/10 text-slate-400 hover:border-white/20"
            }`}
          >
            {modoComparativa ? "Diseño Único" : "Comparativa Antes/Después"}
          </button>
        </motion.section>

        {/* ✨ IA ENGINE */}
        <motion.section
          variants={itemVariants}
          className="pt-2 border-t border-white/5 space-y-1.5"
        >
          <div className="flex items-center gap-2 mb-0.5">
            <MagicWand size={14} weight="duotone" className="text-slate-400" />
            <h3 className="text-[9px] font-black uppercase tracking-widest text-slate-500">
              IA Engine
            </h3>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            <button
              onClick={() => {
                ejecutarOptimizacionIA();
                setShowSuccess(true);
                setTimeout(() => setShowSuccess(false), 2000);
              }}
              className="py-2 bg-blue-600 hover:bg-blue-500 text-white text-[8px] font-black rounded-lg transition-all uppercase"
            >
              Optimizar IA
            </button>
            <button
              onClick={ejecutarAutoAlineacion}
              className="py-2 bg-white/5 border border-white/10 text-slate-400 text-[8px] font-black rounded-lg hover:bg-white/10 transition-all uppercase"
            >
              Alinear Cara
            </button>
          </div>
          <button
            onClick={() => {
              recomendarPlantillaIA();
              setShowSuccess(true);
              setTimeout(() => setShowSuccess(false), 2000);
            }}
            className="w-full py-2 bg-gradient-to-r from-emerald-600/20 to-blue-600/20 border border-white/10 text-white text-[8px] font-black rounded-lg hover:from-emerald-600/30 hover:to-blue-600/30 transition-all uppercase flex items-center justify-center gap-2"
          >
            <Sparkle size={12} weight="fill" className="text-emerald-400" />
            Sugerir Sonrisa Ideal
          </button>
        </motion.section>

        {/* 🎨 VISUALIZACIÓN */}
        <motion.section
          variants={itemVariants}
          className="pt-2 border-t border-white/5 space-y-1.5"
        >
          <div className="flex items-center gap-2 mb-0.5">
            <Eye size={14} weight="duotone" className="text-slate-400" />
            <h3 className="text-[9px] font-black uppercase tracking-widest text-slate-500">
              Visual
            </h3>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            <button
              onClick={() => setModoVisual("humedo")}
              className={`py-1.5 text-[8px] font-black rounded-lg border transition-all ${
                blueprint?.configuracion.modoVisual === "humedo"
                  ? "bg-blue-500 border-blue-400 text-white shadow-lg"
                  : "bg-white/5 border-white/10 text-slate-500"
              }`}
            >
              HÚMEDO
            </button>
            <button
              onClick={() => setModoVisual("seco")}
              className={`py-1.5 text-[8px] font-black rounded-lg border transition-all ${
                blueprint?.configuracion.modoVisual === "seco"
                  ? "bg-slate-700 border-slate-600 text-white shadow-lg"
                  : "bg-white/5 border-white/10 text-slate-500"
              }`}
            >
              SECO
            </button>
          </div>
          {/* Opacidad de labios */}
          <div className="pt-1">
            <div className="flex justify-between text-[7px] text-slate-600 mb-1 font-bold">
              <span className="flex items-center gap-1">
                <Drop size={10} weight="fill" className="text-blue-400" />
                OPACIDAD LABIOS
              </span>
              <span className="font-mono text-slate-400">
                {Math.round(
                  (blueprint?.configuracion.opacidadLabios ?? 0.8) * 100,
                )}
                %
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={blueprint?.configuracion.opacidadLabios ?? 0.8}
              onChange={(e) => setOpacidadLabios(parseFloat(e.target.value))}
              className="w-full h-0.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
          </div>
        </motion.section>

        {/* 🦷 BIBLIOTECA DE ESTILOS */}
        <motion.section
          variants={itemVariants}
          className="pt-2 border-t border-white/5 space-y-2"
        >
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <Tooth size={14} weight="duotone" className="text-slate-400" />
              <h3 className="text-[9px] font-black uppercase tracking-widest text-slate-500">
                Biblioteca
              </h3>
            </div>
            <button
              onClick={() => setFiltroFavoritos((f) => !f)}
              className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[7px] font-black border transition-all ${
                filtroFavoritos
                  ? "bg-amber-500 border-amber-400 text-white"
                  : "bg-white/5 border-white/10 text-slate-500 hover:text-white"
              }`}
            >
              <Star size={9} weight={filtroFavoritos ? "fill" : "regular"} />
              FAV
            </button>
          </div>
          <div className="grid grid-cols-1 gap-1.5 max-h-44 overflow-y-auto pr-1 scrollbar-hide">
            {PLANTILLAS_PREDEFINIDAS.filter(
              (p) => !filtroFavoritos || favoritos.includes(p.id),
            ).map((p) => (
              <div
                key={p.id}
                className="flex items-center gap-1.5 p-2 bg-white/5 border border-white/5 rounded-xl hover:border-blue-500/40 transition-all group"
              >
                <button
                  onClick={() => aplicarPreset(p.id)}
                  className="flex-1 flex items-center justify-between"
                >
                  <span className="text-[8px] font-black text-slate-400 uppercase group-hover:text-white">
                    {p.nombre}
                  </span>
                  <div className="flex gap-0.5">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="w-1.5 h-3 bg-white/20 rounded-sm"
                      />
                    ))}
                  </div>
                </button>
                <button
                  onClick={() => alternarFavorito(p.id)}
                  className="ml-1 shrink-0"
                >
                  <Star
                    size={12}
                    weight={favoritos.includes(p.id) ? "fill" : "regular"}
                    className={
                      favoritos.includes(p.id)
                        ? "text-amber-400"
                        : "text-slate-600 hover:text-amber-400"
                    }
                  />
                </button>
                {seleccionadoId && (
                  <button
                    onClick={() => aplicarEstiloAPieza(seleccionadoId, p.id)}
                    title="Aplicar solo a pieza seleccionada"
                    className="ml-0.5 shrink-0"
                  >
                    <Crosshair
                      size={11}
                      weight="bold"
                      className="text-slate-600 hover:text-blue-400 transition-colors"
                    />
                  </button>
                )}
              </div>
            ))}
            {filtroFavoritos && favoritos.length === 0 && (
              <p className="text-[8px] text-slate-600 text-center py-3">
                Sin favoritos aún
              </p>
            )}
          </div>
        </motion.section>

        {/* 💎 MATERIAL CERÁMICO */}
        <motion.section
          variants={itemVariants}
          className="pt-2 border-t border-white/5 space-y-2"
        >
          <div className="flex items-center gap-2 mb-1">
            <Palette size={14} weight="duotone" className="text-slate-400" />
            <h3 className="text-[9px] font-black uppercase tracking-widest text-slate-500">
              Material
            </h3>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {Object.keys(PRESETS_MATERIALES)
              .slice(0, 4)
              .map((m) => (
                <button
                  key={m}
                  onClick={() => seleccionarMaterialCeramico(m as TipoCeramica)}
                  className={`py-1.5 text-[7px] font-black rounded-lg border transition-all ${
                    blueprint?.dientes[0]?.material.colorBase ===
                    PRESETS_MATERIALES[m as TipoCeramica].colorBase
                      ? "bg-emerald-600 border-emerald-500 text-white"
                      : "bg-white/5 border-white/5 text-slate-500"
                  }`}
                >
                  {m.toUpperCase()}
                </button>
              ))}
          </div>
        </motion.section>

        {/* 🧬 CAD/CAM EXPORT */}
        <motion.section
          variants={itemVariants}
          className="pt-2 border-t border-white/5 space-y-1.5"
        >
          <div className="flex items-center gap-2 mb-0.5">
            <ArrowSquareOut
              size={14}
              weight="duotone"
              className="text-slate-400"
            />
            <h3 className="text-[9px] font-black uppercase tracking-widest text-slate-500">
              Exportar
            </h3>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            <button
              onClick={() => useEditorStore.getState().engine?.exportarSTL()}
              className="py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-[8px] font-black rounded-lg shadow-lg transition-all"
            >
              STL
            </button>
            <button
              onClick={() => useEditorStore.getState().engine?.exportarOBJ()}
              className="py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-[8px] font-black rounded-lg transition-all"
            >
              OBJ
            </button>
          </div>
        </motion.section>

        {/* 🕰️ HISTORIAL */}
        <motion.section
          variants={itemVariants}
          className="mt-auto pt-2 border-t border-white/5 space-y-1.5"
        >
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <ClockCounterClockwise
                size={14}
                weight="duotone"
                className="text-slate-400"
              />
              <h3 className="text-[9px] font-black uppercase tracking-widest text-slate-500">
                Timeline
              </h3>
            </div>
            <div className="flex gap-1">
              <button
                onClick={undo}
                title="Deshacer"
                className="p-1 bg-white/5 hover:bg-white/10 rounded text-slate-500 hover:text-white transition-all"
              >
                <ArrowLeft size={10} weight="bold" />
              </button>
              <button
                onClick={redo}
                title="Rehacer"
                className="p-1 bg-white/5 hover:bg-white/10 rounded text-slate-500 hover:text-white transition-all rotate-180"
              >
                <ArrowLeft size={10} weight="bold" />
              </button>
            </div>
          </div>
          {/* Snapshot */}
          <div className="flex gap-1.5">
            <input
              type="text"
              value={snapshotNombre}
              onChange={(e) => setSnapshotNombre(e.target.value)}
              placeholder="Nombre versión..."
              className="flex-1 bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-[8px] text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/50"
            />
            <button
              onClick={() => {
                if (snapshotNombre.trim()) {
                  crearSnapshotInterno(snapshotNombre.trim());
                  setSnapshotNombre("");
                }
              }}
              className="px-2 py-1 bg-blue-600/30 hover:bg-blue-600/50 border border-blue-500/30 rounded-lg text-[8px] font-black text-blue-300 transition-all"
            >
              SAVE
            </button>
          </div>
          <div className="space-y-1 max-h-28 overflow-y-auto scrollbar-hide">
            {blueprint?.historial
              .slice()
              .reverse()
              .map((version: any, idx: number) => {
                const esActiva =
                  blueprint.historial.length - 1 - idx ===
                  blueprint.indiceHistorial;
                return (
                  <button
                    key={version.id}
                    onClick={() => saltarAVersion(version.id)}
                    className={`w-full text-left p-1.5 rounded-lg border text-[8px] font-black uppercase transition-all ${
                      esActiva
                        ? "bg-blue-600 border-blue-500 text-white"
                        : "bg-white/5 border-white/5 text-slate-500 hover:text-white"
                    }`}
                  >
                    {version.etiqueta || "Edición"}
                  </button>
                );
              })}
          </div>
        </motion.section>
      </motion.aside>

      {/* 🖼️ ÁREA CENTRAL: LIENZO 3D */}
      <div className="flex-1 relative bg-black flex overflow-hidden">
        {modoComparativa && (
          <div className="flex-1 border-r border-white/5 relative bg-slate-950">
            <div className="absolute top-4 left-4 bg-black/60 px-2 py-1 rounded text-[8px] font-black text-slate-500 z-10 tracking-widest">
              SITUACIÓN INICIAL
            </div>
            <img
              src={
                blueprint?.vistas.find((v) => v.id === blueprint.vistaActivaId)
                  ?.fotoUrl || "/seed/frontal_antes.png"
              }
              className="w-full h-full object-contain opacity-40 grayscale"
              alt="Antes"
            />
          </div>
        )}
        <div
          className="flex-1 relative overflow-hidden"
          onClick={() => {
            if (seleccionadoId) seleccionarDiente(null);
          }}
        >
          {/* 📸 IMAGEN DE FONDO — Vista activa del paciente */}
          {(() => {
            const vistaActiva = blueprint?.vistas.find(
              (v) => v.id === blueprint.vistaActivaId,
            );
            const fotoUrl = vistaActiva?.fotoUrl;
            const esFotoReal =
              fotoUrl &&
              !fotoUrl.startsWith("/static/img/") &&
              !fotoUrl.startsWith("/seed/");
            return esFotoReal ? (
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
            ) : null;
          })()}

          {/* 🎨 CANVAS 3D — Three.js se monta aquí, encima de la foto */}
          <div
            className="absolute inset-0"
            style={{ zIndex: 2 }}
            ref={containerRef}
          />

          {/* 🏝️ Dynamic Island Mode */}
          <motion.div
            layout
            initial={{ y: -100, x: "-50%" }}
            animate={{ y: 0, x: "-50%" }}
            className={`absolute top-6 left-1/2 px-6 py-2 bg-slate-900/80 backdrop-blur-xl rounded-full border border-white/5 flex items-center gap-3 z-30 shadow-2xl transition-all duration-500 ${showSuccess ? "bg-emerald-600/90 scale-105" : ""}`}
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
                  <Sparkle
                    size={14}
                    weight="fill"
                    className="text-white animate-spin-slow"
                  />
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
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  <span className="text-[10px] font-black text-white tracking-[0.2em] uppercase">
                    {modoComparativa ? "DISEÑO PRO" : "SMILE ENGINE ACTIVE"}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* 📐 GOLDEN RATIO OVERLAY */}
          <AnimatePresence>
            {goldenMode && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 0.2, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                className="absolute inset-0 z-10 pointer-events-none flex items-center justify-center"
              >
                <Intersect
                  size={400}
                  weight="thin"
                  className="text-emerald-400"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* 🛠️ PANEL DERECHO: TABS — VISTAS / GIZMOS / PBR */}
      <motion.aside
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="w-72 h-full bg-slate-900 border-l border-white/5 z-20 flex flex-col overflow-hidden select-none"
      >
        {/* Score IA */}
        {blueprint?.analisisIA && (
          <div className="px-4 pt-4 pb-2 border-b border-white/5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Brain size={13} weight="duotone" className="text-purple-400" />
                <span className="text-[8px] font-black uppercase tracking-widest text-slate-500">
                  Score Estético
                </span>
              </div>
              <button
                onClick={() => {
                  obtenerDiagnosticoIA();
                }}
                className="text-[7px] font-black text-slate-600 hover:text-purple-400 transition-colors uppercase"
              >
                Actualizar
              </button>
            </div>
            <div className="mt-2 flex items-end gap-2">
              <span
                className={`text-2xl font-black font-mono ${blueprint.analisisIA.scoreEstetico >= 80 ? "text-emerald-400" : blueprint.analisisIA.scoreEstetico >= 60 ? "text-amber-400" : "text-red-400"}`}
              >
                {blueprint.analisisIA.scoreEstetico}
              </span>
              <span className="text-[8px] text-slate-600 mb-1">/100</span>
              <div className="flex-1 h-1 bg-slate-800 rounded-full overflow-hidden ml-1 mb-1.5">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${blueprint.analisisIA.scoreEstetico >= 80 ? "bg-emerald-500" : blueprint.analisisIA.scoreEstetico >= 60 ? "bg-amber-500" : "bg-red-500"}`}
                  style={{ width: `${blueprint.analisisIA.scoreEstetico}%` }}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-1 mt-1">
              <div className="flex items-center gap-1">
                <Crosshair size={9} className="text-slate-600" />
                <span className="text-[7px] text-slate-600">
                  Sim{" "}
                  <span className="text-slate-400 font-mono">
                    {(blueprint.analisisIA.simetriaFacial * 100).toFixed(0)}%
                  </span>
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Diamond size={9} className="text-slate-600" />
                <span className="text-[7px] text-slate-600">
                  Áurea{" "}
                  <span className="text-slate-400 font-mono">
                    {(
                      blueprint.analisisIA.cumplimientoProporcion * 100
                    ).toFixed(0)}
                    %
                  </span>
                </span>
              </div>
            </div>
            {blueprint.analisisIA.sugerencias.length > 0 && (
              <div className="mt-2 p-1.5 bg-purple-500/5 border border-purple-500/10 rounded-lg">
                <p className="text-[7px] text-purple-300 leading-relaxed">
                  {blueprint.analisisIA.sugerencias[
                    blueprint.analisisIA.sugerencias.length - 1
                  ].replace("💡 Sugerencia IA: ", "")}
                </p>
              </div>
            )}
          </div>
        )}
        {/* Tabs */}
        <div className="flex border-b border-white/5 px-2 pt-2">
          {(
            [
              { key: "vistas", icon: Palette, label: "Vistas" },
              { key: "gizmos", icon: Cube, label: "3D" },
              { key: "pbr", icon: Faders, label: "PBR" },
              { key: "auditoria", icon: Stethoscope, label: "Audit" },
            ] as const
          ).map(({ key, icon: Icon, label }) => (
            <button
              key={key}
              onClick={() => setPanelDerecho(key)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-[8px] font-black uppercase tracking-widest border-b-2 transition-all ${panelDerecho === key ? "border-blue-500 text-white" : "border-transparent text-slate-600 hover:text-slate-400"}`}
            >
              <Icon size={12} weight="duotone" />
              {label}
            </button>
          ))}
        </div>
        {/* Tab content */}
        <div className="flex-1 overflow-y-auto scrollbar-hide p-4 space-y-4">
          {panelDerecho === "vistas" && (
            <>
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Palette
                    size={14}
                    weight="duotone"
                    className="text-slate-400"
                  />
                  <h3 className="text-[9px] font-black uppercase tracking-widest text-slate-500">
                    Escenarios & Vistas
                  </h3>
                </div>

                <div className="grid grid-cols-2 gap-1.5 mb-3">
                  {blueprint?.vistas.map((vista) => (
                    <button
                      key={vista.id}
                      onClick={() => cambiarVista(vista.id)}
                      className={`py-1.5 text-[8px] font-black rounded-lg border transition-all ${
                        vista.id === blueprint.vistaActivaId
                          ? "bg-white text-slate-900 border-white shadow-lg"
                          : "bg-white/5 border-white/10 text-slate-500 hover:text-white"
                      }`}
                    >
                      {vista.tipo.toUpperCase()}
                    </button>
                  ))}
                </div>

                <div className="space-y-1.5">
                  {blueprint?.capas.map((capa: any) => (
                    <div
                      key={capa.id}
                      className="flex justify-between items-center p-2.5 bg-white/5 rounded-xl border border-white/5"
                    >
                      <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">
                        {capa.tipo}
                      </span>
                      <button
                        onClick={() => alternarGuia(capa.tipo)}
                        className="text-slate-500 hover:text-white transition-colors"
                      >
                        {capa.visible ? (
                          <Eye size={14} />
                        ) : (
                          <EyeSlash size={14} />
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <div className="pt-4 border-t border-white/5">
                <h3 className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-3">
                  Guías Clínicas PRO
                </h3>

                <div className="mb-4 p-2.5 bg-emerald-500/5 border border-emerald-500/10 rounded-xl flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Sparkle
                      size={14}
                      weight="fill"
                      className="text-emerald-500"
                    />
                    <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">
                      Aura Áurea
                    </span>
                  </div>
                  <button
                    onClick={() => setGoldenMode(!goldenMode)}
                    className={`px-2 py-0.5 text-[7px] font-black rounded-full border transition-all ${
                      goldenMode
                        ? "bg-emerald-500 border-emerald-400 text-white"
                        : "bg-white/5 border-white/10 text-slate-500 hover:text-white"
                    }`}
                  >
                    {goldenMode ? "ACTIVA" : "ACTIVAR"}
                  </button>
                </div>

                <div className="space-y-3">
                  {blueprint?.guias.map((guia: any) => (
                    <div key={guia.id} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-[8px] font-bold text-slate-500 uppercase">
                          {guia.tipo.replace("-", " ")}
                        </span>
                        <button
                          onClick={() => alternarGuia(guia.tipo)}
                          className={`text-[7px] px-2 py-0.5 rounded-full transition-all font-black uppercase ${guia.visible ? "bg-blue-600 text-white" : "bg-white/5 text-slate-600"}`}
                        >
                          {guia.visible ? "Visible" : "Oculta"}
                        </button>
                      </div>

                      {guia.visible && (
                        <div className="pl-2 border-l border-white/5 space-y-3">
                          {guia.tipo === "media" && (
                            <div>
                              <div className="flex justify-between text-[7px] text-slate-600 mb-1 font-bold">
                                <span>POSICIÓN X</span>
                                <span>{guia.valor.x}px</span>
                              </div>
                              <input
                                type="range"
                                min="0"
                                max="1000"
                                step="1"
                                value={guia.valor.x}
                                onChange={(e) =>
                                  setGuiaValor(guia.id, {
                                    x: parseInt(e.target.value),
                                  })
                                }
                                className="w-full h-0.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-red-500"
                              />
                            </div>
                          )}
                          {guia.tipo === "sonrisa" && (
                            <div className="space-y-2">
                              <div>
                                <div className="flex justify-between text-[7px] text-slate-600 mb-1 font-bold">
                                  <span>CURVATURA</span>
                                  <span>{guia.valor.curva.toFixed(2)}</span>
                                </div>
                                <input
                                  type="range"
                                  min="0"
                                  max="2"
                                  step="0.01"
                                  value={guia.valor.curva}
                                  onChange={(e) =>
                                    setGuiaValor(guia.id, {
                                      curva: parseFloat(e.target.value),
                                    })
                                  }
                                  className="w-full h-0.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-yellow-500"
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
          {panelDerecho === "gizmos" && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Cube size={13} weight="duotone" className="text-blue-400" />
                <h3 className="text-[9px] font-black uppercase tracking-widest text-slate-500">
                  3D Gizmos
                </h3>
              </div>
              {!seleccionadoId ? (
                <div className="flex flex-col items-center justify-center py-10 gap-3">
                  <Cube size={32} weight="duotone" className="text-slate-700" />
                  <p className="text-[8px] text-slate-600 text-center leading-relaxed">
                    Selecciona una pieza dental
                    <br />
                    en el canvas para editar
                    <br />
                    sus transformaciones 3D
                  </p>
                </div>
              ) : (
                (() => {
                  const diente = blueprint?.dientes.find(
                    (d) => d.id === seleccionadoId,
                  );
                  if (!diente) return null;
                  const t3d = diente.transformacion3D;
                  const sliders3D = [
                    {
                      key: "rotX" as const,
                      label: "ROT X — Vestibular",
                      min: -30,
                      max: 30,
                      step: 0.5,
                      accent: "accent-blue-500",
                      color: "text-blue-400",
                    },
                    {
                      key: "rotY" as const,
                      label: "ROT Y — Mesio-Distal",
                      min: -30,
                      max: 30,
                      step: 0.5,
                      accent: "accent-emerald-500",
                      color: "text-emerald-400",
                    },
                    {
                      key: "rotZ" as const,
                      label: "ROT Z — Axial",
                      min: -30,
                      max: 30,
                      step: 0.5,
                      accent: "accent-purple-500",
                      color: "text-purple-400",
                    },
                    {
                      key: "posZ" as const,
                      label: "POS Z — Overjet",
                      min: -10,
                      max: 10,
                      step: 0.1,
                      accent: "accent-amber-500",
                      color: "text-amber-400",
                    },
                    {
                      key: "escala" as const,
                      label: "ESCALA",
                      min: 0.6,
                      max: 1.5,
                      step: 0.01,
                      accent: "accent-rose-500",
                      color: "text-rose-400",
                    },
                  ];
                  return (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[9px] font-black text-white uppercase">
                          Pieza FDI {diente.pieza}
                        </span>
                        <button
                          onClick={() =>
                            resetearTransformacion3D(seleccionadoId)
                          }
                          className="text-[7px] font-black text-slate-600 hover:text-red-400 transition-colors uppercase"
                        >
                          Reset
                        </button>
                      </div>
                      {sliders3D.map(
                        ({ key, label, min, max, step, accent, color }) => (
                          <div key={key} className="space-y-1">
                            <div className="flex justify-between text-[7px] font-bold">
                              <span className={color}>{label}</span>
                              <span className="font-mono text-slate-400">
                                {t3d[key].toFixed(key === "escala" ? 2 : 1)}
                                {key === "escala" ? "x" : "°"}
                              </span>
                            </div>
                            <input
                              type="range"
                              min={min}
                              max={max}
                              step={step}
                              value={t3d[key]}
                              onChange={(e) =>
                                actualizarTransformacion3D(seleccionadoId, {
                                  [key]: parseFloat(e.target.value),
                                })
                              }
                              className={`w-full h-0.5 bg-slate-800 rounded-lg appearance-none cursor-pointer ${accent}`}
                            />
                          </div>
                        ),
                      )}
                      <div className="pt-3 border-t border-white/5 mt-2">
                        <p className="text-[7px] text-slate-600 mb-2 font-bold uppercase">
                          Aplicar estilo a esta pieza
                        </p>
                        <div className="grid grid-cols-2 gap-1">
                          {PLANTILLAS_PREDEFINIDAS.slice(0, 4).map((p) => (
                            <button
                              key={p.id}
                              onClick={() =>
                                aplicarEstiloAPieza(seleccionadoId, p.id)
                              }
                              className="py-1 text-[7px] font-black bg-white/5 border border-white/5 rounded-lg hover:border-blue-500/40 text-slate-500 hover:text-white transition-all uppercase"
                            >
                              {p.nombre}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })()
              )}
            </div>
          )}
          {panelDerecho === "pbr" && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Faders
                  size={13}
                  weight="duotone"
                  className="text-purple-400"
                />
                <h3 className="text-[9px] font-black uppercase tracking-widest text-slate-500">
                  PBR Material
                </h3>
              </div>
              {!seleccionadoId ? (
                <div className="flex flex-col items-center justify-center py-10 gap-3">
                  <Faders
                    size={32}
                    weight="duotone"
                    className="text-slate-700"
                  />
                  <p className="text-[8px] text-slate-600 text-center leading-relaxed">
                    Selecciona una pieza dental
                    <br />
                    para ajustar sus propiedades
                    <br />
                    ópticas PBR
                  </p>
                </div>
              ) : (
                (() => {
                  const diente = blueprint?.dientes.find(
                    (d) => d.id === seleccionadoId,
                  );
                  if (!diente) return null;
                  const mat = diente.material;
                  const pbrSliders = [
                    {
                      key: "translucidez" as const,
                      label: "TRANSLUCIDEZ",
                      icon: Drop,
                      color: "text-cyan-400",
                      accent: "accent-cyan-500",
                      desc: "Halo incisal",
                    },
                    {
                      key: "sss" as const,
                      label: "SSS",
                      icon: Lightning,
                      color: "text-amber-400",
                      accent: "accent-amber-500",
                      desc: "Subsurface scattering",
                    },
                    {
                      key: "fresnel" as const,
                      label: "FRESNEL",
                      icon: Diamond,
                      color: "text-blue-400",
                      accent: "accent-blue-500",
                      desc: "Reflexión en bordes",
                    },
                    {
                      key: "opalescencia" as const,
                      label: "OPALESCENCIA",
                      icon: Sparkle,
                      color: "text-purple-400",
                      accent: "accent-purple-500",
                      desc: "Efecto fuego",
                    },
                    {
                      key: "rugosidad" as const,
                      label: "RUGOSIDAD",
                      icon: Ruler,
                      color: "text-slate-400",
                      accent: "accent-slate-500",
                      desc: "Micro-textura esmalte",
                    },
                    {
                      key: "fluorescencia" as const,
                      label: "FLUORESCENCIA",
                      icon: Gauge,
                      color: "text-green-400",
                      accent: "accent-green-500",
                      desc: "Respuesta UV",
                    },
                  ];
                  return (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[9px] font-black text-white uppercase">
                          PBR — Pieza {diente.pieza}
                        </span>
                        <div
                          className="w-4 h-4 rounded-full border border-white/20"
                          style={{ backgroundColor: mat.colorBase }}
                        />
                      </div>
                      {pbrSliders.map(
                        ({ key, label, icon: Icon, color, accent, desc }) => (
                          <div key={key} className="space-y-1">
                            <div className="flex justify-between items-center text-[7px] font-bold">
                              <span
                                className={`flex items-center gap-1 ${color}`}
                              >
                                <Icon size={9} weight="fill" />
                                {label}
                              </span>
                              <span className="font-mono text-slate-400">
                                {(mat[key] * 100).toFixed(0)}%
                              </span>
                            </div>
                            <input
                              type="range"
                              min="0"
                              max="1"
                              step="0.01"
                              value={mat[key]}
                              onChange={(e) =>
                                actualizarDiente(seleccionadoId, {
                                  material: {
                                    ...mat,
                                    [key]: parseFloat(e.target.value),
                                  },
                                })
                              }
                              className={`w-full h-0.5 bg-slate-800 rounded-lg appearance-none cursor-pointer ${accent}`}
                            />
                            <p className="text-[6px] text-slate-700">{desc}</p>
                          </div>
                        ),
                      )}
                    </div>
                  );
                })()
              )}
            </div>
          )}
          {/* ── TAB: AUDITORÍA CLÍNICA ── */}
          {panelDerecho === "auditoria" && (
            <div className="space-y-3">
              {/* Header con botón de ejecutar */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Stethoscope
                    size={13}
                    weight="duotone"
                    className="text-rose-400"
                  />
                  <h3 className="text-[9px] font-black uppercase tracking-widest text-slate-500">
                    Auditoría Clínica
                  </h3>
                </div>
                <button
                  onClick={ejecutarAuditoria}
                  className="flex items-center gap-1.5 px-2.5 py-1 bg-rose-600/20 hover:bg-rose-600/40 border border-rose-500/30 rounded-lg text-[8px] font-black text-rose-300 transition-all uppercase"
                >
                  <FirstAid size={10} weight="fill" />
                  Auditar
                </button>
              </div>

              {!auditoria ? (
                <div className="flex flex-col items-center justify-center py-10 gap-3">
                  <Stethoscope
                    size={32}
                    weight="duotone"
                    className="text-slate-700"
                  />
                  <p className="text-[8px] text-slate-600 text-center leading-relaxed">
                    Ejecuta la auditoría para
                    <br />
                    validar el diseño contra
                    <br />
                    criterios clínicos
                  </p>
                </div>
              ) : (
                <>
                  {/* Score clínico + badge aprobado */}
                  <div
                    className={`p-3 rounded-xl border ${
                      auditoria.aprobado
                        ? "bg-emerald-500/5 border-emerald-500/20"
                        : "bg-red-500/5 border-red-500/20"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {auditoria.aprobado ? (
                          <ShieldCheck
                            size={16}
                            weight="fill"
                            className="text-emerald-400"
                          />
                        ) : (
                          <ShieldWarning
                            size={16}
                            weight="fill"
                            className="text-red-400"
                          />
                        )}
                        <span
                          className={`text-[9px] font-black uppercase ${auditoria.aprobado ? "text-emerald-400" : "text-red-400"}`}
                        >
                          {auditoria.aprobado
                            ? "Aprobado"
                            : "Requiere revisión"}
                        </span>
                      </div>
                      <div className="flex items-end gap-1">
                        <span
                          className={`text-xl font-black font-mono ${
                            auditoria.scoreClinico >= 80
                              ? "text-emerald-400"
                              : auditoria.scoreClinico >= 60
                                ? "text-amber-400"
                                : "text-red-400"
                          }`}
                        >
                          {auditoria.scoreClinico}
                        </span>
                        <span className="text-[8px] text-slate-600 mb-0.5">
                          /100
                        </span>
                      </div>
                    </div>
                    {/* Barra de score */}
                    <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${
                          auditoria.scoreClinico >= 80
                            ? "bg-emerald-500"
                            : auditoria.scoreClinico >= 60
                              ? "bg-amber-500"
                              : "bg-red-500"
                        }`}
                        style={{ width: `${auditoria.scoreClinico}%` }}
                      />
                    </div>
                    <p className="text-[7px] text-slate-500 mt-2 leading-relaxed">
                      {auditoria.resumen.replace("✅ ", "").replace("🚨 ", "")}
                    </p>
                    <p className="text-[6px] text-slate-700 mt-1">
                      {new Date(auditoria.timestamp).toLocaleTimeString()}
                    </p>
                  </div>

                  {/* Resumen de alertas por severidad */}
                  {auditoria.alertas.length > 0 && (
                    <div className="flex gap-1.5">
                      {(
                        [
                          {
                            sev: "critico",
                            label: "Críticas",
                            color: "text-red-400",
                            bg: "bg-red-500/10 border-red-500/20",
                          },
                          {
                            sev: "advertencia",
                            label: "Advertencias",
                            color: "text-amber-400",
                            bg: "bg-amber-500/10 border-amber-500/20",
                          },
                          {
                            sev: "info",
                            label: "Info",
                            color: "text-blue-400",
                            bg: "bg-blue-500/10 border-blue-500/20",
                          },
                        ] as const
                      ).map(({ sev, label, color, bg }) => {
                        const count = auditoria.alertas.filter(
                          (a) => a.severidad === sev,
                        ).length;
                        if (count === 0) return null;
                        return (
                          <div
                            key={sev}
                            className={`flex-1 flex flex-col items-center py-1.5 rounded-lg border ${bg}`}
                          >
                            <span
                              className={`text-base font-black font-mono ${color}`}
                            >
                              {count}
                            </span>
                            <span className={`text-[6px] font-bold ${color}`}>
                              {label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Lista de alertas */}
                  <div className="space-y-2">
                    {auditoria.alertas.length === 0 ? (
                      <div className="flex items-center gap-2 p-2.5 bg-emerald-500/5 border border-emerald-500/10 rounded-xl">
                        <ListChecks
                          size={14}
                          weight="fill"
                          className="text-emerald-400 shrink-0"
                        />
                        <p className="text-[8px] text-emerald-400 font-bold">
                          Sin alertas. Diseño clínicamente óptimo.
                        </p>
                      </div>
                    ) : (
                      auditoria.alertas.map((alerta) => {
                        const esIcono =
                          alerta.severidad === "critico"
                            ? WarningOctagon
                            : alerta.severidad === "advertencia"
                              ? ShieldWarning
                              : FirstAid;
                        const colorBorde =
                          alerta.severidad === "critico"
                            ? "border-red-500/20 bg-red-500/5"
                            : alerta.severidad === "advertencia"
                              ? "border-amber-500/20 bg-amber-500/5"
                              : "border-blue-500/20 bg-blue-500/5";
                        const colorIcono =
                          alerta.severidad === "critico"
                            ? "text-red-400"
                            : alerta.severidad === "advertencia"
                              ? "text-amber-400"
                              : "text-blue-400";
                        const IconoAlerta = esIcono;
                        return (
                          <div
                            key={alerta.id}
                            className={`p-2.5 rounded-xl border ${colorBorde} space-y-1`}
                          >
                            <div className="flex items-start gap-2">
                              <IconoAlerta
                                size={12}
                                weight="fill"
                                className={`${colorIcono} shrink-0 mt-0.5`}
                              />
                              <div className="flex-1 min-w-0">
                                <p className="text-[8px] font-black text-white leading-tight">
                                  {alerta.mensaje}
                                </p>
                                {alerta.pieza && (
                                  <span className="text-[6px] font-mono text-slate-600">
                                    FDI {alerta.pieza}
                                  </span>
                                )}
                              </div>
                            </div>
                            <p className="text-[7px] text-slate-500 leading-relaxed pl-5">
                              {alerta.recomendacion}
                            </p>
                            <details className="pl-5">
                              <summary className="text-[6px] text-slate-700 cursor-pointer hover:text-slate-500 transition-colors">
                                Detalle técnico
                              </summary>
                              <p className="text-[6px] text-slate-700 mt-1 font-mono leading-relaxed">
                                {alerta.detalleTecnico}
                              </p>
                            </details>
                          </div>
                        );
                      })
                    )}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
        {/* Acciones finales */}
        <div className="p-4 border-t border-white/5 flex flex-col gap-2">
          <button
            onClick={() => {
              if (id) {
                guardarDisenoPersistente(id);
                setShowSuccess(true);
                setTimeout(() => setShowSuccess(false), 3000);
              }
            }}
            className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black rounded-2xl shadow-xl shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
          >
            <CheckCircle size={16} weight="fill" />
            CONFIRMAR DISEÑO
          </button>
          <button
            onClick={generarReporteClinico}
            className="w-full py-2.5 bg-white/5 border border-white/10 text-slate-400 text-[10px] font-bold rounded-2xl transition-all flex items-center justify-center gap-2 hover:border-white/20"
          >
            <FileText size={14} />
            GENERAR REPORTE PDF
          </button>
        </div>
      </motion.aside>

      <CapturaFotoModal
        abierto={modalCapturaAbierto}
        alCerrar={() => setModalCapturaAbierto(false)}
        alCapturar={async (url) => {
          if (!vistaParaCapturar) return;

          const ejecutar = async () => {
            // 1. Actualizar la foto en el store
            actualizarFotoVista(vistaParaCapturar, url);
            // 2. Cambiar a la vista recién fotografiada
            cambiarVista(vistaParaCapturar);

            // 3. Leer el blueprint DESPUÉS de las actualizaciones síncronas
            //    y guardarlo explícitamente en la DB
            if (id) {
              const blueprintActualizado = useEditorStore.getState().blueprint;
              console.log(
                "💾 Guardando blueprint. Foto en vista:",
                blueprintActualizado?.vistas?.find(
                  (v) => v.id === vistaParaCapturar,
                )?.fotoUrl,
              );
              if (blueprintActualizado) {
                try {
                  await servicioDisenos.guardarDiseno({
                    caso_clinico_id: id,
                    ajustes_json: JSON.stringify(blueprintActualizado),
                  });
                  console.log("✅ Blueprint guardado con foto");
                } catch (e) {
                  console.error("❌ Error guardando blueprint:", e);
                }
              }
            }

            const labels: Record<string, string> = {
              "vista-frontal": "Frontal",
              "vista-sonrisa": "Sonrisa",
              "vista-reposo": "Reposo",
              "vista-lateral": "Lateral",
            };
            setFotoGuardada(labels[vistaParaCapturar] ?? vistaParaCapturar);
            setTimeout(() => setFotoGuardada(null), 3000);
          };

          if (!useEditorStore.getState().blueprint) {
            generarDiseno({
              puntos: [],
              anchoCara: 1000,
              altoCara: 1000,
              lineaMediaX: 500,
              lineaBipupilarY: 400,
              contornoLabios: [],
              labiosExterior: [],
              labiosInterior: [],
            });
            // Esperar a que generarDiseno actualice el store
            setTimeout(ejecutar, 100);
          } else {
            await ejecutar();
          }
        }}
        titulo="Capturar Fotografía Clínica"
      />

      <AnimatePresence>
        {fotoGuardada && (
          <motion.div
            key="toast-foto"
            initial={{ opacity: 0, y: 40, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 40, x: "-50%" }}
            className="fixed bottom-8 left-1/2 z-50 flex items-center gap-3 px-6 py-3 bg-emerald-600 text-white rounded-full shadow-2xl text-sm font-bold"
          >
            <CheckCircle size={20} weight="fill" />
            Foto <span className="font-black">{fotoGuardada}</span> guardada
            correctamente
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
