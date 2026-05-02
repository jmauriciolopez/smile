import React from "react";
import { Link, useParams } from "react-router-dom";
import { Card } from "../../../componentes/ui/Card";
import { BadgeEstado } from "../../../componentes/ui/BadgeEstado";
import { useCasoDetalle } from "../../../hooks/useCasoDetalle";
import { useFotos } from "../../../hooks/useFotos";
import { crearPresupuesto } from "../../../servicios/servicioPresupuestos";
import { ModalSubirFoto } from "../componentes/ModalSubirFoto";
import { SeccionNotasClinicas } from "../componentes/SeccionNotasClinicas";
import { Modal } from "../../../componentes/ui/Modal";

export function DetalleCasoClinicoPage() {
  const { id } = useParams();
  const {
    caso,
    cargando,
    error,
    actualizar: actualizarCasoDatos,
    refrescar: refrescarCaso,
  } = useCasoDetalle(id);
  const {
    fotos,
    eliminar: eliminarFoto,
    cargando: cargandoFotos,
  } = useFotos(id);
  const [modalFotoAbierto, setModalFotoAbierto] = React.useState(false);

  // Estados para edición de caso
  const [modalEditCasoAbierto, setModalEditCasoAbierto] = React.useState(false);
  const [formEditCaso, setFormEditCaso] = React.useState({
    titulo: "",
    motivo_consulta: "",
    estado_caso: "",
  });
  const [enviandoEditCaso, setEnviandoEditCaso] = React.useState(false);

  // Estados para nuevo presupuesto
  const [modalNuevoPresupuestoAbierto, setModalNuevoPresupuestoAbierto] =
    React.useState(false);
  const [formPresupuesto, setFormPresupuesto] = React.useState({
    monto_total_estimado: 0,
    cantidad_cuotas: 12,
  });
  const [enviandoPresupuesto, setEnviandoPresupuesto] = React.useState(false);

  const abrirEdicionCaso = () => {
    if (caso) {
      setFormEditCaso({
        titulo: caso.titulo,
        motivo_consulta: caso.motivo_consulta || "",
        estado_caso: caso.estado_caso,
      });
      setModalEditCasoAbierto(true);
    }
  };

  const handleGuardarEdicionCaso = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviandoEditCaso(true);
    try {
      await actualizarCasoDatos(formEditCaso);
      setModalEditCasoAbierto(false);
    } catch (err) {
      alert("Error al actualizar el caso.");
    } finally {
      setEnviandoEditCaso(false);
    }
  };

  const handleCrearPresupuesto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!caso) return;
    setEnviandoPresupuesto(true);
    try {
      await crearPresupuesto({
        paciente_id: caso.paciente_id,
        caso_clinico_id: caso.id,
        monto_total_estimado: Number(formPresupuesto.monto_total_estimado),
        cantidad_cuotas: Number(formPresupuesto.cantidad_cuotas),
      });

      setModalNuevoPresupuestoAbierto(false);
      refrescarCaso();
    } catch (err) {
      alert("Error al crear el presupuesto.");
    } finally {
      setEnviandoPresupuesto(false);
    }
  };

  if (cargando) {
    return (
      <div className="flex min-h-[400px] items-center justify-center italic text-textoSecundario">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primario border-t-transparent" />
          <span>Cargando detalles del caso...</span>
        </div>
      </div>
    );
  }

  if (error || !caso) {
    return (
      <div className="rounded-xl bg-red-50 p-8 text-center text-red-600">
        {error || "Caso clínico no encontrado."}
        <div className="mt-4">
          <Link
            to="/casos"
            className="text-primario font-medium hover:underline"
          >
            Volver a la lista de casos
          </Link>
        </div>
      </div>
    );
  }

  const presupuestos = (caso as any).presupuestos || [];
  const primerPresupuesto = presupuestos[0];

  const handleEliminarFoto = async (id: string) => {
    if (!confirm("¿Eliminar esta fotografía clínica?")) return;
    try {
      await eliminarFoto(id);
    } catch (err) {
      alert("Error al eliminar la foto.");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900 leading-tight">
            {caso.titulo}
          </h1>
          <p className="mt-1 text-textoSecundario">
            Paciente:{" "}
            <Link
              to={`/pacientes/${caso.paciente_id}`}
              className="font-medium text-primario hover:underline"
            >
              {caso.paciente?.nombre_completo}
            </Link>
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={abrirEdicionCaso}
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-textoSecundario hover:bg-slate-50 transition-colors"
          >
            Editar Detalles
          </button>
          <Link
            className="rounded-xl bg-primario px-4 py-2 text-sm font-medium text-white shadow-lg shadow-primario/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
            to={`/disenos/editor/${caso.id}`}
          >
            Abrir editor de sonrisa
          </Link>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Columna Izquierda: Resumen y Notas */}
        <div className="lg:col-span-2 space-y-6">
          <Card titulo="Resumen del caso">
            <div className="space-y-4 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-textoSecundario">Estado actual:</span>
                <BadgeEstado texto={caso.estado_caso} />
              </div>
              <div className="space-y-1">
                <span className="text-textoSecundario">
                  Motivo de consulta / Objetivos:
                </span>
                <p className="rounded-lg bg-slate-50 p-3 text-slate-700 leading-relaxed italic border border-slate-100">
                  {caso.motivo_consulta ||
                    "No se registraron notas de consulta."}
                </p>
              </div>
            </div>
          </Card>

          <SeccionNotasClinicas casoId={caso.id} />
        </div>

        {/* Columna Derecha: Fotos y Comercial */}
        <div className="space-y-6">
          <Card titulo="Documentación Fotográfica">
            <div className="space-y-4">
              <button
                onClick={() => setModalFotoAbierto(true)}
                className="w-full rounded-xl border-2 border-dashed border-slate-200 p-4 text-center text-sm font-medium text-textoSecundario hover:border-primario/50 hover:bg-primario/[0.02] hover:text-primario transition-all"
              >
                + Añadir registro fotográfico
              </button>

              {cargandoFotos && fotos.length === 0 ? (
                <p className="text-center text-xs text-slate-400 animate-pulse">
                  Cargando fotos...
                </p>
              ) : fotos.length > 0 ? (
                <div className="grid grid-cols-2 gap-3">
                  {fotos.map((foto: any) => (
                    <div
                      key={foto.id}
                      className="group relative aspect-video cursor-pointer overflow-hidden rounded-xl bg-slate-100 ring-1 ring-slate-200 transition-all hover:ring-primario/50 shadow-sm"
                    >
                      <img
                        src={foto.url_foto}
                        alt={foto.tipo}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                        <div className="flex justify-end">
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              handleEliminarFoto(foto.id);
                            }}
                            className="rounded-lg bg-red-500/80 p-1 text-white hover:bg-red-600 transition-colors"
                          >
                            <svg
                              className="h-3 w-3"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-white">
                          {foto.tipo}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-6 text-center text-xs text-textoSecundario italic bg-slate-50 rounded-xl border border-slate-100">
                  Sin fotos registradas.
                </div>
              )}
            </div>
          </Card>

          <Card titulo="Gestión Comercial">
            {primerPresupuesto ? (
              <Link
                to={`/presupuestos/${primerPresupuesto.id}`}
                className="group block rounded-xl border border-slate-200 p-5 hover:border-primario/40 hover:bg-primario/[0.02] transition-all shadow-sm bg-white"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      Presupuesto Activo
                    </div>
                    <div className="mt-1 text-2xl font-bold text-slate-900 group-hover:text-primario">
                      USD {primerPresupuesto.monto_total_estimado}
                    </div>
                  </div>
                  <BadgeEstado texto={primerPresupuesto.estado_presupuesto} />
                </div>
                <div className="mt-4 flex items-center gap-2 text-sm font-medium text-primario">
                  Ver detalle completo
                  <span className="transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </div>
              </Link>
            ) : (
              <div className="space-y-4">
                <div className="py-6 text-center text-sm text-textoSecundario italic bg-slate-50 rounded-xl border border-slate-100">
                  No hay presupuestos activos.
                </div>
                <button
                  onClick={() => setModalNuevoPresupuestoAbierto(true)}
                  className="w-full rounded-xl bg-primario/10 p-3 text-center text-xs font-bold uppercase tracking-wider text-primario hover:bg-primario/20 transition-all"
                >
                  + Crear Presupuesto
                </button>
              </div>
            )}
          </Card>

          <Card titulo="Estado del Diseño">
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 text-center">
              <div className="mx-auto mb-3 h-10 w-10 text-slate-300">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                  />
                </svg>
              </div>
              <p className="text-xs text-textoSecundario leading-relaxed">
                Utiliza el Editor de Sonrisa para procesar el diseño
                comparativo.
              </p>
            </div>
          </Card>
        </div>
      </div>

      <ModalSubirFoto
        abierto={modalFotoAbierto}
        alCerrar={() => setModalFotoAbierto(false)}
        casoId={caso.id}
      />

      {/* Modal Editar Caso */}
      <Modal
        abierto={modalEditCasoAbierto}
        alCerrar={() => setModalEditCasoAbierto(false)}
        titulo="Editar Detalles del Caso"
      >
        <form onSubmit={handleGuardarEdicionCaso} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Título
            </label>
            <input
              required
              className="mt-1 block w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 focus:border-primario focus:bg-white focus:outline-none focus:ring-2 focus:ring-primario/20 transition-all"
              value={formEditCaso.titulo}
              onChange={(e) =>
                setFormEditCaso({ ...formEditCaso, titulo: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Estado
            </label>
            <select
              className="mt-1 block w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 focus:border-primario focus:bg-white focus:outline-none focus:ring-2 focus:ring-primario/20 transition-all"
              value={formEditCaso.estado_caso}
              onChange={(e) =>
                setFormEditCaso({
                  ...formEditCaso,
                  estado_caso: e.target.value,
                })
              }
            >
              <option value="en_estudio">En Estudio</option>
              <option value="presupuestado">Presupuestado</option>
              <option value="en_proceso">En Proceso</option>
              <option value="finalizado">Finalizado</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Motivo de Consulta
            </label>
            <textarea
              rows={3}
              className="mt-1 block w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 focus:border-primario focus:bg-white focus:outline-none focus:ring-2 focus:ring-primario/20 transition-all"
              value={formEditCaso.motivo_consulta}
              onChange={(e) =>
                setFormEditCaso({
                  ...formEditCaso,
                  motivo_consulta: e.target.value,
                })
              }
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => setModalEditCasoAbierto(false)}
              className="rounded-xl px-4 py-2 text-sm text-slate-500 hover:bg-slate-100"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={enviandoEditCaso}
              className="rounded-xl bg-primario px-6 py-2 text-sm font-bold text-white shadow-lg shadow-primario/20 disabled:opacity-50"
            >
              {enviandoEditCaso ? "Guardando..." : "Guardar Cambios"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal Nuevo Presupuesto */}
      <Modal
        abierto={modalNuevoPresupuestoAbierto}
        alCerrar={() => setModalNuevoPresupuestoAbierto(false)}
        titulo="Nuevo Presupuesto"
      >
        <form onSubmit={handleCrearPresupuesto} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Monto Total Estimado (USD)
            </label>
            <input
              required
              type="number"
              className="mt-1 block w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 focus:border-primario focus:bg-white focus:outline-none focus:ring-2 focus:ring-primario/20 transition-all"
              value={formPresupuesto.monto_total_estimado}
              onChange={(e) =>
                setFormPresupuesto({
                  ...formPresupuesto,
                  monto_total_estimado: Number(e.target.value),
                })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Cantidad de Cuotas
            </label>
            <select
              className="mt-1 block w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 focus:border-primario focus:bg-white focus:outline-none focus:ring-2 focus:ring-primario/20 transition-all"
              value={formPresupuesto.cantidad_cuotas}
              onChange={(e) =>
                setFormPresupuesto({
                  ...formPresupuesto,
                  cantidad_cuotas: Number(e.target.value),
                })
              }
            >
              <option value={1}>Pago Único</option>
              <option value={3}>3 Cuotas</option>
              <option value={6}>6 Cuotas</option>
              <option value={12}>12 Cuotas</option>
              <option value={18}>18 Cuotas</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => setModalNuevoPresupuestoAbierto(false)}
              className="rounded-xl px-4 py-2 text-sm text-slate-500 hover:bg-slate-100"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={enviandoPresupuesto}
              className="rounded-xl bg-primario px-6 py-2 text-sm font-bold text-white shadow-lg shadow-primario/20 disabled:opacity-50"
            >
              {enviandoPresupuesto ? "Creando..." : "Crear Presupuesto"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
