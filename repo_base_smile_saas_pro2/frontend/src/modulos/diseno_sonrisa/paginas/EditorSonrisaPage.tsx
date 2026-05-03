import React, { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useEditorStore } from "../../../store/editor-sonrisa.store";
import { PLANTILLAS_PREDEFINIDAS } from "../../../motor/plantilla-engine/seed";
import {
  PRESETS_MATERIALES,
  TipoCeramica,
} from "../../../motor/plantilla-engine/materiales";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { CadExporter } from "../../../motor/export-engine/cad-exporter";

export const EditorSonrisaPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const containerRef = useRef<HTMLDivElement>(null);

  const {
    blueprint,
    generarDiseno,
    inicializarEngine,
    cargarDisenoPersistente,
    guardarDisenoPersistente,
    cambiarVista,
    alternarGuia,
    undo,
    redo,
    aplicarPreset,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    explorarVariantes,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    plantillasPersonalizadas,
    ejecutarOptimizacionIA,
    ejecutarAutoAlineacion,
    obtenerDiagnosticoIA,
    recomendarPlantillaIA,
    modoComparativa,
    alternarComparativa,
    generarReporteClinico,
    seleccionarMaterialCeramico,
    setOpacidadLabios,
    seleccionadoId,
    actualizarTransformacion3D,
    resetearTransformacion3D,
    aplicarEstiloAPieza,
    favoritos,
    alternarFavorito,
    setModoVisual,
    saltarAVersion,
    crearSnapshotInterno,
    actualizarDiente,
    actualizarFotoVista,
    setGuiaValor,
  } = useEditorStore();

  const [filtroFavoritos, setFiltroFavoritos] = React.useState(false);

  useEffect(() => {
    if (containerRef.current) {
      inicializarEngine(containerRef.current);
    }
  }, [inicializarEngine]);

  useEffect(() => {
    if (id) {
      cargarDisenoPersistente(id).then(() => {
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
        }
      });
    }
  }, [id, generarDiseno, cargarDisenoPersistente]);

  return (
    <div className="flex h-screen w-full bg-slate-900 text-white overflow-hidden">
      {/* Sidebar Izquierda */}
      <div className="w-80 border-r border-slate-700 p-4 flex flex-col overflow-y-auto scrollbar-hide">
        <h2 className="text-xl font-bold mb-4">Smile Engine PRO</h2>

        <div className="flex gap-2 mb-4">
          <button
            onClick={alternarComparativa}
            className={`flex-1 py-2 font-bold rounded text-xs transition-all ${
              modoComparativa
                ? "bg-blue-600 shadow-lg shadow-blue-500/30"
                : "bg-slate-800 text-slate-400"
            }`}
          >
            {modoComparativa ? "👁️ Vista Única" : "🌓 Comparativa"}
          </button>
        </div>

        {/* Controles de Historial */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={undo}
            disabled={!blueprint || blueprint.historial.length <= 1}
            className="flex-1 py-1 bg-slate-800 rounded text-xs disabled:opacity-30"
          >
            ↩️ Undo
          </button>
          <button
            onClick={redo}
            className="flex-1 py-1 bg-slate-800 rounded text-xs"
          >
            Redo ↪️
          </button>
        </div>

        {/* CAD/CAM Export */}
        <div className="pt-2 border-t border-slate-700 mb-4">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">
            Laboratorio CAD/CAM
          </h3>
          <div className="flex gap-2 mb-2">
            <button
              onClick={() => useEditorStore.getState().engine?.exportarSTL()}
              disabled={!blueprint}
              className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-[10px] font-black rounded shadow-lg transition-all disabled:opacity-30 flex items-center justify-center gap-1"
            >
              <span>🦷</span> STL Diseño Pro
            </button>
            <button
              onClick={() => useEditorStore.getState().engine?.exportarOBJ()}
              disabled={!blueprint}
              className="flex-1 py-2 bg-teal-600 hover:bg-teal-500 text-[10px] font-black rounded shadow-lg transition-all disabled:opacity-30 flex items-center justify-center gap-1"
            >
              <span>📦</span> OBJ Diseño Pro
            </button>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => useEditorStore.getState().engine?.exportarExocad()}
              disabled={!blueprint}
              className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-[10px] font-black rounded shadow-lg transition-all disabled:opacity-30 flex items-center justify-center gap-1"
            >
              <span>⚙️</span> Exocad / 3Shape Data
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {/* Inteligencia Facial */}
          <div className="pt-2 border-t border-slate-700">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">
              Inteligencia Facial
            </h3>
            <div className="flex gap-2 mb-3">
              <button
                onClick={ejecutarOptimizacionIA}
                className="flex-1 py-2 bg-blue-600 hover:bg-blue-500 text-[10px] font-black rounded shadow-lg transition-all"
                title="Optimización iterativa de proporciones"
              >
                🤖 Optimizar
              </button>
              <button
                onClick={ejecutarAutoAlineacion}
                className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-500 text-[10px] font-black rounded shadow-lg transition-all"
                title="Sincronizar con el plano bipupilar"
              >
                ⚖️ Auto-Alinear
              </button>
              <button
                onClick={() => {
                  obtenerDiagnosticoIA();
                  recomendarPlantillaIA();
                }}
                className="py-2 px-4 bg-slate-800 hover:bg-slate-700 rounded transition-all"
                title="Analizar Diseño"
              >
                🔍
              </button>
            </div>

            {blueprint?.analisisIA &&
              blueprint.analisisIA.scoreEstetico > 0 && (
                <div className="bg-slate-800/80 border border-slate-700 rounded-lg p-3 animate-in fade-in slide-in-from-top-2">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-bold text-slate-400">
                      SCORE ESTÉTICO
                    </span>
                    <span
                      className={`text-lg font-black ${blueprint.analisisIA.scoreEstetico > 80 ? "text-green-400" : "text-yellow-400"}`}
                    >
                      {blueprint.analisisIA.scoreEstetico}%
                    </span>
                  </div>
                  <div className="space-y-1">
                    {blueprint.analisisIA.sugerencias.map(
                      (s: string, i: number) => (
                        <p
                          key={i}
                          className="text-[9px] text-slate-300 flex gap-2"
                        >
                          <span className="text-blue-500">→</span> {s}
                        </p>
                      ),
                    )}
                  </div>
                </div>
              )}
          </div>

          <div className="pt-2">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">
              Modo de Visualización
            </h3>
            <div className="flex bg-slate-800 rounded-lg p-1 gap-1">
              <button
                onClick={() => setModoVisual("humedo")}
                className={`flex-1 py-2 text-[10px] font-bold rounded-md transition-all flex items-center justify-center gap-2 ${blueprint?.configuracion.modoVisual === "humedo" ? "bg-blue-600 text-white shadow-lg" : "text-slate-400 hover:text-white"}`}
              >
                <span className="w-2 h-2 bg-blue-300 rounded-full animate-pulse"></span>
                HÚMEDO
              </button>
              <button
                onClick={() => setModoVisual("seco")}
                className={`flex-1 py-2 text-[10px] font-bold rounded-md transition-all flex items-center justify-center gap-2 ${blueprint?.configuracion.modoVisual === "seco" ? "bg-slate-600 text-white shadow-lg" : "text-slate-400 hover:text-white"}`}
              >
                <span className="w-2 h-2 bg-amber-400 rounded-full"></span>
                SECO
              </button>
            </div>
          </div>

          {/* Biblioteca de Estilos */}
          <div className="pt-2">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500">
                Biblioteca de Estilos
              </h3>
              <button
                onClick={() => setFiltroFavoritos(!filtroFavoritos)}
                className={`text-[9px] px-2 py-0.5 rounded-full border transition-all ${filtroFavoritos ? "bg-pink-600/20 border-pink-500 text-pink-400" : "bg-slate-800 border-slate-700 text-slate-500"}`}
              >
                {filtroFavoritos ? "❤️ Favoritos" : "♡ Todos"}
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {PLANTILLAS_PREDEFINIDAS.filter(
                (p: any) => !filtroFavoritos || favoritos.includes(p.id),
              ).map((p: any) => (
                <div
                  key={p.id}
                  className="group flex flex-col bg-slate-800/40 border border-slate-700/50 rounded-xl overflow-hidden hover:border-blue-500/50 transition-all"
                >
                  <div className="relative h-20 bg-slate-900">
                    <img
                      src={
                        p.id === "hollywood"
                          ? "/C:/Users/mauricio/.gemini/antigravity/brain/6201f9e6-6b07-4d02-bda0-48bba529db63/smile_template_hollywood_1777765683086.png"
                          : "/C:/Users/mauricio/.gemini/antigravity/brain/6201f9e6-6b07-4d02-bda0-48bba529db63/smile_template_natural_1777765700791.png"
                      }
                      className="w-full h-full object-cover opacity-50 group-hover:opacity-80 transition-all"
                      alt={p.nombre}
                    />
                    <div className="absolute bottom-2 left-2 flex justify-between w-[90%] items-center">
                      <span className="text-[9px] font-black uppercase text-white drop-shadow-md">
                        {p.nombre}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          alternarFavorito(p.id);
                        }}
                        className={`p-1 rounded-full backdrop-blur-md ${favoritos.includes(p.id) ? "bg-pink-600 text-white" : "text-slate-300"}`}
                      >
                        ❤️
                      </button>
                    </div>
                  </div>
                  <div className="p-2 flex gap-1">
                    <button
                      onClick={() => aplicarPreset(p.id)}
                      className="flex-1 py-1 bg-blue-600/20 text-[9px] rounded"
                    >
                      APLICAR
                    </button>
                    {seleccionadoId && (
                      <button
                        onClick={() =>
                          aplicarEstiloAPieza(seleccionadoId, p.id)
                        }
                        className="flex-1 py-1 bg-emerald-600/20 text-[9px] rounded"
                      >
                        PIEZA
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-slate-700">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">
              Material Cerámico
            </h3>
            <div className="grid grid-cols-1 gap-2 mb-4">
              {Object.entries(PRESETS_MATERIALES).map(
                ([id, m]: [string, any]) => (
                  <button
                    key={id}
                    onClick={() =>
                      seleccionarMaterialCeramico(id as TipoCeramica)
                    }
                    className={`w-full p-2.5 rounded-lg border text-left transition-all ${blueprint?.dientes[0]?.material.colorBase === id ? "bg-blue-600 border-blue-400 shadow-lg" : "bg-slate-800/40 border-slate-700 hover:border-slate-500"}`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold">
                        {id.toUpperCase()}
                      </span>
                      <div
                        className="w-3 h-3 rounded-full border border-white/20"
                        style={{ background: m.colorBase }}
                      ></div>
                    </div>
                  </button>
                ),
              )}
            </div>

            {/* Personalización Óptica Avanzada */}
            <div className="space-y-3 p-3 bg-slate-900/50 rounded-xl border border-slate-700/50">
              <h4 className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
                Personalización Óptica (PBR)
              </h4>

              <div>
                <div className="flex justify-between text-[8px] text-slate-400 mb-1 font-bold">
                  <span>FRESNEL</span>
                  <span>
                    {(blueprint?.dientes[0]?.material.fresnel || 0).toFixed(2)}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={blueprint?.dientes[0]?.material.fresnel || 0}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    blueprint?.dientes.forEach((d: any) =>
                      actualizarDiente(d.id, {
                        material: { ...d.material, fresnel: val },
                      }),
                    );
                  }}
                  className="w-full h-0.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-[8px] text-slate-400 mb-1 font-bold">
                  <span>SSS (Scattering)</span>
                  <span>
                    {(blueprint?.dientes[0]?.material.sss || 0).toFixed(2)}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={blueprint?.dientes[0]?.material.sss || 0}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    blueprint?.dientes.forEach((d: any) =>
                      actualizarDiente(d.id, {
                        material: { ...d.material, sss: val },
                      }),
                    );
                  }}
                  className="w-full h-0.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-[8px] text-slate-400 mb-1 font-bold">
                  <span>OPALESCENCIA</span>
                  <span>
                    {(
                      blueprint?.dientes[0]?.material.opalescencia || 0
                    ).toFixed(2)}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={blueprint?.dientes[0]?.material.opalescencia || 0}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    blueprint?.dientes.forEach((d: any) =>
                      actualizarDiente(d.id, {
                        material: { ...d.material, opalescencia: val },
                      }),
                    );
                  }}
                  className="w-full h-0.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="pt-2">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">
              Transparencia Labial
            </h3>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={blueprint?.configuracion.opacidadLabios || 1}
              onChange={(e) => setOpacidadLabios(parseFloat(e.target.value))}
              className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
          </div>

          {/* Panel 3D */}
          {seleccionadoId && (
            <div className="bg-slate-800/80 border border-blue-500/30 rounded-xl p-4 animate-in fade-in slide-in-from-right-4">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-blue-400 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                Control 3D Pieza{" "}
                {
                  blueprint?.dientes.find((d: any) => d.id === seleccionadoId)
                    ?.pieza
                }
              </h3>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-[9px] text-slate-400 mb-1 font-bold">
                    <span>ROTACIÓN X</span>
                    <span>
                      {(
                        (blueprint?.dientes.find(
                          (d: any) => d.id === seleccionadoId,
                        )?.transformacion3D.rotX || 0) *
                        (180 / Math.PI)
                      ).toFixed(0)}
                      °
                    </span>
                  </div>
                  <input
                    type="range"
                    min="-0.5"
                    max="0.5"
                    step="0.01"
                    value={
                      blueprint?.dientes.find(
                        (d: any) => d.id === seleccionadoId,
                      )?.transformacion3D.rotX || 0
                    }
                    onChange={(e) =>
                      actualizarTransformacion3D(seleccionadoId, {
                        rotX: parseFloat(e.target.value),
                      })
                    }
                    className="w-full h-1 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-[9px] text-slate-400 mb-1 font-bold">
                    <span>ROTACIÓN Y</span>
                    <span>
                      {(
                        (blueprint?.dientes.find(
                          (d: any) => d.id === seleccionadoId,
                        )?.transformacion3D.rotY || 0) *
                        (180 / Math.PI)
                      ).toFixed(0)}
                      °
                    </span>
                  </div>
                  <input
                    type="range"
                    min="-0.5"
                    max="0.5"
                    step="0.01"
                    value={
                      blueprint?.dientes.find(
                        (d: any) => d.id === seleccionadoId,
                      )?.transformacion3D.rotY || 0
                    }
                    onChange={(e) =>
                      actualizarTransformacion3D(seleccionadoId, {
                        rotY: parseFloat(e.target.value),
                      })
                    }
                    className="w-full h-1 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-[9px] text-slate-400 mb-1 font-bold">
                    <span>PROFUNDIDAD (Z)</span>
                    <span>
                      {(
                        blueprint?.dientes.find(
                          (d: any) => d.id === seleccionadoId,
                        )?.transformacion3D.posZ || 0
                      ).toFixed(2)}
                      mm
                    </span>
                  </div>
                  <input
                    type="range"
                    min="-2"
                    max="2"
                    step="0.1"
                    value={
                      blueprint?.dientes.find(
                        (d: any) => d.id === seleccionadoId,
                      )?.transformacion3D.posZ || 0
                    }
                    onChange={(e) =>
                      actualizarTransformacion3D(seleccionadoId, {
                        posZ: parseFloat(e.target.value),
                      })
                    }
                    className="w-full h-1 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                </div>

                <button
                  onClick={() => resetearTransformacion3D(seleccionadoId)}
                  className="w-full py-2 bg-slate-900 hover:bg-slate-700 text-[9px] font-bold text-slate-400 rounded transition-all"
                >
                  RESETEAR ANATOMÍA 3D
                </button>
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-slate-700 flex flex-col gap-2">
            <button
              onClick={() => id && guardarDisenoPersistente(id)}
              className="w-full py-3 bg-green-600 hover:bg-green-500 font-black rounded shadow-lg transition-all"
            >
              💾 Guardar Diseño
            </button>
            <button
              onClick={generarReporteClinico}
              className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-[10px] font-bold rounded border border-slate-700 transition-all"
            >
              📄 Generar Reporte Clínico
            </button>
          </div>

          {/* Historial Ramificado */}
          <div className="pt-6 border-t border-slate-700">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500">
                Historial de Diseño
              </h3>
              <button
                onClick={() => {
                  const nombre = prompt("Nombre del Snapshot:");
                  if (nombre) crearSnapshotInterno(nombre);
                }}
                className="text-[9px] bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white px-2 py-0.5 rounded transition-all"
              >
                + Snapshot
              </button>
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1 scrollbar-thin">
              {blueprint?.historial
                .slice()
                .reverse()
                .map((version: any, idx: number) => {
                  const esSnapshot = version.etiqueta?.startsWith("SNAPSHOT:");
                  const esActiva =
                    blueprint.historial.length - 1 - idx ===
                    blueprint.indiceHistorial;

                  return (
                    <button
                      key={version.id}
                      onClick={() => saltarAVersion(version.id)}
                      className={`w-full text-left p-2 rounded-lg border transition-all relative overflow-hidden ${
                        esActiva
                          ? "bg-blue-600 border-blue-400"
                          : esSnapshot
                            ? "bg-emerald-600/10 border-emerald-500/30"
                            : "bg-slate-800/50 border-slate-700 hover:border-slate-500"
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <span
                          className={`text-[9px] font-black uppercase truncate ${esActiva ? "text-white" : esSnapshot ? "text-emerald-400" : "text-blue-400"}`}
                        >
                          {version.etiqueta || "Edición Manual"}
                        </span>
                      </div>
                    </button>
                  );
                })}
            </div>
          </div>
        </div>
      </div>

      {/* Área Central */}
      <div className="flex-1 relative bg-black flex overflow-hidden">
        {modoComparativa && (
          <div className="flex-1 border-r border-slate-700 relative bg-slate-900">
            <div className="absolute top-4 left-4 bg-black/50 px-2 py-1 rounded text-[10px] font-bold text-slate-400 z-10">
              ORIGINAL
            </div>
            <img
              src={
                blueprint?.vistas.find((v) => v.id === blueprint.vistaActivaId)
                  ?.fotoUrl || "/static/img/ejemplo_paciente_frontal.jpg"
              }
              className="w-full h-full object-contain opacity-50 grayscale"
              alt="Antes"
            />
          </div>
        )}
        <div className="flex-1 relative" ref={containerRef}>
          <div className="absolute top-4 left-4 bg-blue-600/50 px-2 py-1 rounded text-[10px] font-bold text-white z-10 uppercase tracking-widest">
            {modoComparativa ? "DISEÑO PRO" : "SMILE DESIGN ENGINE"}
          </div>
        </div>
      </div>

      {/* Capas Derecha */}
      <div className="w-64 border-l border-slate-700 p-4 bg-slate-900/50">
        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">
          Capas & Escenarios
        </h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-2">
            {blueprint?.vistas.map((vista: any) => (
              <div key={vista.id} className="flex gap-1">
                <button
                  onClick={() => cambiarVista(vista.id)}
                  className={`flex-1 py-2 text-[10px] rounded border transition-all ${vista.activo ? "bg-blue-600 border-blue-400 text-white font-black" : "bg-slate-800 border-slate-700 text-slate-400"}`}
                >
                  {vista.tipo.toUpperCase()}
                </button>
                <button
                  onClick={() => {
                    const url = prompt(
                      "URL de la foto para esta vista:",
                      vista.fotoUrl,
                    );
                    if (url) actualizarFotoVista(vista.id, url);
                  }}
                  className="p-2 bg-slate-800 border border-slate-700 rounded hover:bg-slate-700"
                  title="Cargar Foto"
                >
                  📷
                </button>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-700">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">
              Capas & Visibilidad
            </h3>
            <div className="space-y-2">
              {blueprint?.capas.map((capa: any) => (
                <div
                  key={capa.id}
                  className="flex justify-between items-center p-2 bg-slate-800/30 rounded border border-slate-700/30"
                >
                  <span className="text-[9px] font-bold text-slate-400 uppercase">
                    {capa.tipo}
                  </span>
                  <button
                    onClick={() => alternarGuia(capa.tipo)}
                    className="text-xs opacity-50"
                  >
                    {capa.visible ? "👁️" : "🙈"}
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-700">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">
              Guías Clínicas PRO
            </h3>
            <div className="space-y-4">
              {blueprint?.guias.map((guia: any) => (
                <div key={guia.id} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-bold text-slate-400 uppercase">
                      {guia.tipo.replace("-", " ")}
                    </span>
                    <button
                      onClick={() => alternarGuia(guia.tipo)}
                      className={`text-[8px] px-2 py-0.5 rounded transition-all ${guia.visible ? "bg-blue-600 text-white" : "bg-slate-800 text-slate-500"}`}
                    >
                      {guia.visible ? "ACTIVA" : "OCULTA"}
                    </button>
                  </div>

                  {guia.visible && (
                    <div className="pl-2 border-l border-slate-800 space-y-3">
                      {guia.tipo === "media" && (
                        <div>
                          <div className="flex justify-between text-[8px] text-slate-500 mb-1">
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
                                ...guia.valor,
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
                            <div className="flex justify-between text-[8px] text-slate-500 mb-1">
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
                                  ...guia.valor,
                                  curva: parseFloat(e.target.value),
                                })
                              }
                              className="w-full h-0.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-yellow-500"
                            />
                          </div>
                          <div>
                            <div className="flex justify-between text-[8px] text-slate-500 mb-1">
                              <span>ALTURA (Y)</span>
                              <span>{guia.valor.y}px</span>
                            </div>
                            <input
                              type="range"
                              min="0"
                              max="1000"
                              step="1"
                              value={guia.valor.y}
                              onChange={(e) =>
                                setGuiaValor(guia.id, {
                                  ...guia.valor,
                                  y: parseInt(e.target.value),
                                })
                              }
                              className="w-full h-0.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-yellow-500"
                            />
                          </div>
                        </div>
                      )}
                      {guia.tipo === "proporcion" && (
                        <div>
                          <div className="flex justify-between text-[8px] text-slate-500 mb-1">
                            <span>ESCALA ÁUREA</span>
                            <span>{guia.valor.escala.toFixed(2)}</span>
                          </div>
                          <input
                            type="range"
                            min="0.1"
                            max="5"
                            step="0.01"
                            value={guia.valor.escala}
                            onChange={(e) =>
                              setGuiaValor(guia.id, {
                                ...guia.valor,
                                escala: parseFloat(e.target.value),
                              })
                            }
                            className="w-full h-0.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
