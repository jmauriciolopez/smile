import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle } from "@phosphor-icons/react";
import { useEditorStore } from "../../../store/editor-sonrisa.store";
import { useEditorInit } from "../hooks/useEditorInit";
import { useGuardarFoto } from "../hooks/useGuardarFoto";
import { SidebarIzquierdo } from "../componentes/SidebarIzquierdo";
import { CanvasCentral } from "../componentes/CanvasCentral";
import { PanelDerechoEditor } from "../componentes/PanelDerechoEditor";
import { CapturaFotoModal } from "../componentes/CapturaFotoModal";
import { TipoCeramica } from "../../../motor/plantilla-engine/materiales";

export const EditorSonrisaPage: React.FC = () => {
  const { casoId: id } = useParams<{ casoId: string }>();
  const navigate = useNavigate();

  // ── Inicialización del engine ──────────────────────────────────────────────
  const containerRef = useEditorInit(id);
  const { guardarFoto } = useGuardarFoto(id);

  // ── Store ──────────────────────────────────────────────────────────────────
  const {
    blueprint, auditoria, seleccionadoId, modoComparativa, favoritos,
    cambiarVista, alternarGuia, setGuiaValor, aplicarPreset, alternarFavorito,
    aplicarEstiloAPieza, seleccionarMaterialCeramico, setModoVisual,
    setOpacidadLabios, actualizarTransformacion3D, resetearTransformacion3D,
    actualizarDiente, ejecutarOptimizacionIA, ejecutarAutoAlineacion,
    recomendarPlantillaIA, ejecutarAuditoria, obtenerDiagnosticoIA,
    alternarComparativa, guardarDisenoPersistente, generarReporteClinico,
    seleccionarDiente, undo, redo, saltarAVersion, crearSnapshotInterno,
  } = useEditorStore();

  // ── Estado local de UI ─────────────────────────────────────────────────────
  const [showSuccess, setShowSuccess] = React.useState(false);
  const [logoClicks, setLogoClicks] = React.useState(0);
  const [goldenMode, setGoldenMode] = React.useState(false);
  const [modalCapturaAbierto, setModalCapturaAbierto] = React.useState(false);
  const [vistaParaCapturar, setVistaParaCapturar] = React.useState<string | null>(null);
  const [fotoGuardada, setFotoGuardada] = React.useState<string | null>(null);
  const [filtroFavoritos, setFiltroFavoritos] = React.useState(false);
  const [tabDerecho, setTabDerecho] = React.useState<"vistas" | "gizmos" | "pbr" | "auditoria">("vistas");
  const [snapshotNombre, setSnapshotNombre] = React.useState("");

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleLogoClick = () => {
    const next = logoClicks + 1;
    setLogoClicks(next);
    if (next >= 5) { setGoldenMode((g) => !g); setLogoClicks(0); }
  };

  const handleIAConExito = (fn: () => void) => {
    fn();
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  const handleCapturarFoto = async (url: string) => {
    if (!vistaParaCapturar) return;
    await guardarFoto(vistaParaCapturar, url);
    const labels: Record<string, string> = {
      "vista-frontal": "Frontal", "vista-sonrisa": "Sonrisa",
      "vista-reposo": "Reposo", "vista-lateral": "Lateral",
    };
    setFotoGuardada(labels[vistaParaCapturar] ?? vistaParaCapturar);
    setTimeout(() => setFotoGuardada(null), 3000);
  };

  const handleGuardarDiseno = () => {
    if (!id) return;
    guardarDisenoPersistente(id);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="relative w-full h-screen bg-black flex overflow-hidden">
      <SidebarIzquierdo
        blueprint={blueprint}
        seleccionadoId={seleccionadoId}
        modoComparativa={modoComparativa}
        favoritos={favoritos}
        filtroFavoritos={filtroFavoritos}
        snapshotNombre={snapshotNombre}
        onNavigateBack={() => navigate(-1)}
        onLogoClick={handleLogoClick}
        onAbrirCaptura={(vistaId) => { setVistaParaCapturar(vistaId); setModalCapturaAbierto(true); }}
        onAlternarComparativa={alternarComparativa}
        onEjecutarOptimizacionIA={() => handleIAConExito(ejecutarOptimizacionIA)}
        onEjecutarAutoAlineacion={ejecutarAutoAlineacion}
        onRecomendarPlantillaIA={() => handleIAConExito(recomendarPlantillaIA)}
        onSetModoVisual={setModoVisual}
        onSetOpacidadLabios={setOpacidadLabios}
        onAplicarPreset={aplicarPreset}
        onAlternarFavorito={alternarFavorito}
        onAplicarEstiloAPieza={aplicarEstiloAPieza}
        onSeleccionarMaterial={(tipo: TipoCeramica) => seleccionarMaterialCeramico(tipo)}
        onSetFiltroFavoritos={setFiltroFavoritos}
        onUndo={undo}
        onRedo={redo}
        onCrearSnapshot={() => { if (snapshotNombre.trim()) { crearSnapshotInterno(snapshotNombre.trim()); setSnapshotNombre(""); } }}
        onSaltarAVersion={saltarAVersion}
        onSetSnapshotNombre={setSnapshotNombre}
      />

      <CanvasCentral
        blueprint={blueprint}
        containerRef={containerRef}
        modoComparativa={modoComparativa}
        goldenMode={goldenMode}
        showSuccess={showSuccess}
        seleccionadoId={seleccionadoId}
        onDeseleccionarDiente={() => seleccionarDiente(null)}
      />

      <PanelDerechoEditor
        blueprint={blueprint}
        auditoria={auditoria}
        seleccionadoId={seleccionadoId}
        tabActivo={tabDerecho}
        goldenMode={goldenMode}
        casoId={id}
        onCambiarTab={setTabDerecho}
        onCambiarVista={cambiarVista}
        onAlternarGuia={alternarGuia}
        onSetGuiaValor={setGuiaValor}
        onToggleGoldenMode={() => setGoldenMode((g) => !g)}
        onActualizarTransformacion3D={actualizarTransformacion3D}
        onResetearTransformacion3D={resetearTransformacion3D}
        onAplicarEstiloAPieza={aplicarEstiloAPieza}
        onActualizarDiente={actualizarDiente}
        onEjecutarAuditoria={ejecutarAuditoria}
        onObtenerDiagnosticoIA={obtenerDiagnosticoIA}
        onGuardarDiseno={handleGuardarDiseno}
        onGenerarReporte={generarReporteClinico}
      />

      {/* Modal de captura de foto */}
      <CapturaFotoModal
        abierto={modalCapturaAbierto}
        alCerrar={() => setModalCapturaAbierto(false)}
        alCapturar={handleCapturarFoto}
        titulo="Capturar Fotografía Clínica"
      />

      {/* Toast de foto guardada */}
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
            Foto <span className="font-black">{fotoGuardada}</span> guardada correctamente
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
