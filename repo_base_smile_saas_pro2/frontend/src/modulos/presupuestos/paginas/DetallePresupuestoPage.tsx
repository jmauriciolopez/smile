import { useParams, Link } from "react-router-dom";
import { Card } from "../../../componentes/ui/Card";
import { BadgeEstado } from "../../../componentes/ui/BadgeEstado";
import { usePresupuestoDetalle } from "../../../hooks/usePresupuestoDetalle";
import { useOpciones } from "../../../hooks/useOpciones";
import { useCatalogoPlanes } from "../../../hooks/useCatalogoPlanes";
import { TimelineSeguimiento } from "../componentes/TimelineSeguimiento";
import { Modal } from "../../../componentes/ui/Modal";
import { useState } from "react";
import { PencilSimple, Trash, Plus } from "@phosphor-icons/react";

export function DetallePresupuestoPage() {
  const { id } = useParams();
  const { presupuesto, cargando, error, refrescar, actualizar } =
    usePresupuestoDetalle(id);
  const { seleccionarPlan, agregarPlan, editarPlan, eliminarPlan, procesando } = useOpciones(id, refrescar);
  const { planes: catalogoPlanes } = useCatalogoPlanes();

  const [modalEditAbierto, setModalEditAbierto] = useState(false);
  const [formEdit, setFormEdit] = useState({
    monto_total_estimado: 0,
    cantidad_cuotas: 12,
    estado_presupuesto: "",
  });
  const [enviando, setEnviando] = useState(false);

  const [modalPlanAbierto, setModalPlanAbierto] = useState(false);
  const [planEditandoId, setPlanEditandoId] = useState<string | null>(null);
  const [formPlan, setFormPlan] = useState({
    titulo: "",
    descripcion: "",
    monto: 0,
    recomendada: false,
  });

  const abrirEdicion = () => {
    if (presupuesto) {
      setFormEdit({
        monto_total_estimado: presupuesto.monto_total_estimado,
        cantidad_cuotas: presupuesto.cantidad_cuotas,
        estado_presupuesto: presupuesto.estado_presupuesto,
      });
      setModalEditAbierto(true);
    }
  };

  const handleGuardarEdicion = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);
    try {
      await actualizar(formEdit);
      setModalEditAbierto(false);
    } catch (err) {
      alert("Error al actualizar el presupuesto.");
    } finally {
      setEnviando(false);
    }
  };

  const abrirModalPlan = (opcion?: any) => {
    if (opcion) {
      setPlanEditandoId(opcion.id);
      setFormPlan({
        titulo: opcion.titulo,
        descripcion: opcion.descripcion || "",
        monto: opcion.monto,
        recomendada: opcion.recomendada,
      });
    } else {
      setPlanEditandoId(null);
      setFormPlan({
        titulo: "",
        descripcion: "",
        monto: 0,
        recomendada: false,
      });
    }
    setModalPlanAbierto(true);
  };

  const handleGuardarPlan = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);
    try {
      if (planEditandoId) {
        await editarPlan(planEditandoId, formPlan);
      } else {
        await agregarPlan(formPlan);
      }
      setModalPlanAbierto(false);
    } catch (err) {
      alert("Error al guardar el plan.");
    } finally {
      setEnviando(false);
    }
  };

  const handleEliminarPlan = async (idPlan: string) => {
    if (!confirm("¿Eliminar este plan de tratamiento?")) return;
    try {
      await eliminarPlan(idPlan);
    } catch (err) {
      alert("Error al eliminar.");
    }
  };

  if (cargando) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center space-y-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primario border-t-transparent"></div>
        <p className="italic text-textoSecundario font-medium">
          Recuperando presupuesto comercial...
        </p>
      </div>
    );
  }

  if (error || !presupuesto) {
    return (
      <div className="rounded-xl bg-red-50 p-8 text-center text-red-600">
        {error || "Presupuesto no encontrado."}
        <div className="mt-4">
          <Link
            to="/presupuestos"
            className="text-primario font-medium hover:underline"
          >
            Volver al listado
          </Link>
        </div>
      </div>
    );
  }

  const opciones = presupuesto.opciones || [];

  const handleSeleccionarPlan = async (monto: number) => {
    if (
      !confirm(
        `¿Confirmar selección de este plan por USD ${monto}? El estado del presupuesto cambiará a Aprobado.`,
      )
    )
      return;
    try {
      await seleccionarPlan(monto);
    } catch (err) {
      alert("Error al seleccionar el plan.");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900 leading-tight">
            Presupuesto Comercial
          </h1>
          <p className="mt-1 text-textoSecundario">
            Paciente:{" "}
            <Link
              to={`/pacientes/${presupuesto.paciente_id}`}
              className="font-bold text-primario hover:underline"
            >
              {presupuesto.paciente?.nombre_completo}
            </Link>
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={abrirEdicion}
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-textoSecundario hover:bg-slate-50 transition-colors"
          >
            Configurar
          </button>
          <Link
            to="/presupuestos"
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-textoSecundario hover:bg-slate-50 transition-colors"
          >
            &larr; Volver
          </Link>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Columna Izquierda: Información General y Opciones */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <Card titulo="Resumen Económico">
              <div className="space-y-3">
                <div className="text-4xl font-black text-slate-900">
                  USD {presupuesto.monto_total_estimado}
                </div>
                <div className="flex items-center gap-2">
                  <BadgeEstado texto={presupuesto.estado_presupuesto} />
                  <span className="text-[11px] font-bold uppercase tracking-wider text-textoSecundario">
                    · {presupuesto.cantidad_cuotas} cuotas fijas
                  </span>
                </div>
              </div>
            </Card>

            <Card titulo="Carpeta Clínica Vinculada">
              {presupuesto.caso_clinico ? (
                <Link
                  to={`/casos/${presupuesto.caso_clinico_id}`}
                  className="group block rounded-xl border border-slate-100 p-4 hover:border-primario/30 hover:bg-primario/[0.02] transition-all"
                >
                  <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    Caso Activo
                  </div>
                  <div className="mt-1 font-bold text-slate-800 group-hover:text-primario transition-colors">
                    {presupuesto.caso_clinico.titulo}
                  </div>
                  <div className="mt-3 text-xs text-primario font-bold">
                    Ver expediente clínico →
                  </div>
                </Link>
              ) : (
                <div className="py-4 text-center text-sm text-textoSecundario italic bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  Sin caso clínico asociado.
                </div>
              )}
            </Card>
          </div>

          <Card 
            titulo="Planes de Tratamiento"
            accion={
              <button
                onClick={() => abrirModalPlan()}
                className="flex items-center gap-1 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-bold text-primario hover:bg-slate-200 transition-colors"
              >
                <Plus weight="bold" /> Nuevo Plan
              </button>
            }
          >
            {opciones.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2">
                {opciones.map((opcion) => (
                  <div
                    key={opcion.id}
                    className={`group relative overflow-hidden rounded-2xl border p-6 transition-all ${
                      opcion.recomendada
                        ? "border-primario bg-primario/[0.03] shadow-lg shadow-primario/5"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >
                    {opcion.recomendada && (
                      <div className="absolute top-0 right-0 rounded-bl-xl bg-primario px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white shadow-sm">
                        RECOMENDADA
                      </div>
                    )}
                    <div className="flex justify-between items-start">
                      <div className="font-bold text-slate-400 uppercase text-[10px] tracking-widest">
                        {opcion.titulo}
                      </div>
                      <div className="flex items-center gap-2 text-slate-400">
                        <button onClick={() => abrirModalPlan(opcion)} className="hover:text-primario transition-colors">
                          <PencilSimple size={16} />
                        </button>
                        <button onClick={() => handleEliminarPlan(opcion.id)} className="hover:text-red-500 transition-colors">
                          <Trash size={16} />
                        </button>
                      </div>
                    </div>
                    <div className="mt-2 text-3xl font-black text-slate-900">
                      USD {opcion.monto}
                    </div>
                    <p className="mt-2 text-xs text-textoSecundario leading-relaxed line-clamp-2">
                      {opcion.descripcion ||
                        "Sin descripción adicional del tratamiento."}
                    </p>

                    <button
                      onClick={() => handleSeleccionarPlan(opcion.monto)}
                      disabled={
                        procesando ||
                        presupuesto.estado_presupuesto === "aprobado"
                      }
                      className={`mt-6 w-full rounded-xl py-2.5 text-xs font-bold transition-all ${
                        opcion.recomendada
                          ? "bg-primario text-white hover:bg-primario/90 shadow-md shadow-primario/20"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      } disabled:opacity-50`}
                    >
                      {presupuesto.estado_presupuesto === "aprobado" &&
                      presupuesto.monto_total_estimado === opcion.monto
                        ? "Plan Seleccionado ✅"
                        : procesando
                          ? "Procesando..."
                          : "Seleccionar éste plan"}
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center">
                <div className="mx-auto mb-3 h-12 w-12 text-slate-200">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                </div>
                <p className="text-sm text-textoSecundario italic">
                  No se han definido opciones de tratamiento para este
                  presupuesto.
                </p>
                <button 
                  onClick={() => abrirModalPlan()}
                  className="mt-4 text-xs font-bold text-primario hover:underline"
                >
                  + Configurar alternativas
                </button>
              </div>
            )}
          </Card>
        </div>

        {/* Columna Derecha: Timeline */}
        <div className="space-y-6">
          <TimelineSeguimiento presupuestoId={presupuesto.id} />
        </div>
      </div>
      <Modal
        abierto={modalEditAbierto}
        alCerrar={() => setModalEditAbierto(false)}
        titulo="Configurar Presupuesto"
      >
        <form onSubmit={handleGuardarEdicion} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Monto Total (USD)
            </label>
            <input
              required
              type="number"
              className="mt-1 block w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 focus:border-primario focus:bg-white focus:outline-none focus:ring-2 focus:ring-primario/20 transition-all"
              value={formEdit.monto_total_estimado}
              onChange={(e) =>
                setFormEdit({
                  ...formEdit,
                  monto_total_estimado: Number(e.target.value),
                })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Estado
            </label>
            <select
              className="mt-1 block w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 focus:border-primario focus:bg-white focus:outline-none focus:ring-2 focus:ring-primario/20 transition-all"
              value={formEdit.estado_presupuesto}
              onChange={(e) =>
                setFormEdit({ ...formEdit, estado_presupuesto: e.target.value })
              }
            >
              <option value="borrador">Borrador</option>
              <option value="enviado">Enviado</option>
              <option value="aprobado">Aprobado</option>
              <option value="rechazado">Rechazado</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Cuotas
            </label>
            <select
              className="mt-1 block w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 focus:border-primario focus:bg-white focus:outline-none focus:ring-2 focus:ring-primario/20 transition-all"
              value={formEdit.cantidad_cuotas}
              onChange={(e) =>
                setFormEdit({
                  ...formEdit,
                  cantidad_cuotas: Number(e.target.value),
                })
              }
            >
              <option value={1}>1 Cuota</option>
              <option value={3}>3 Cuotas</option>
              <option value={6}>6 Cuotas</option>
              <option value={12}>12 Cuotas</option>
              <option value={18}>18 Cuotas</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => setModalEditAbierto(false)}
              className="rounded-xl px-4 py-2 text-sm text-slate-500 hover:bg-slate-100"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={enviando}
              className="rounded-xl bg-primario px-6 py-2 text-sm font-bold text-white shadow-lg shadow-primario/20 disabled:opacity-50"
            >
              {enviando ? "Guardando..." : "Guardar Cambios"}
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        abierto={modalPlanAbierto}
        alCerrar={() => setModalPlanAbierto(false)}
        titulo={planEditandoId ? "Editar Plan" : "Nuevo Plan de Tratamiento"}
      >
        <form onSubmit={handleGuardarPlan} className="space-y-4">
          {!planEditandoId && catalogoPlanes.length > 0 && (
            <div className="mb-4 pb-4 border-b border-slate-100">
              <label className="block text-sm font-medium text-slate-700">Seleccionar desde Catálogo Global</label>
              <select
                className="mt-1 block w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 focus:border-primario focus:bg-white focus:outline-none focus:ring-2 focus:ring-primario/20 transition-all"
                onChange={(e) => {
                  const planGlobal = catalogoPlanes.find(p => p.id === e.target.value);
                  if (planGlobal) {
                    setFormPlan({
                      titulo: planGlobal.titulo,
                      descripcion: planGlobal.descripcion || "",
                      monto: planGlobal.monto_base,
                      recomendada: planGlobal.recomendada,
                    });
                  }
                }}
                defaultValue=""
              >
                <option value="" disabled>-- Elige un plan base --</option>
                {catalogoPlanes.map(p => (
                  <option key={p.id} value={p.id}>{p.titulo} (USD {p.monto_base})</option>
                ))}
              </select>
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-slate-700">Título</label>
            <input
              required
              className="mt-1 block w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 focus:border-primario focus:bg-white focus:outline-none focus:ring-2 focus:ring-primario/20 transition-all"
              value={formPlan.titulo}
              onChange={(e) => setFormPlan({ ...formPlan, titulo: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Descripción</label>
            <textarea
              className="mt-1 block w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 focus:border-primario focus:bg-white focus:outline-none focus:ring-2 focus:ring-primario/20 transition-all"
              value={formPlan.descripcion}
              onChange={(e) => setFormPlan({ ...formPlan, descripcion: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Monto (USD)</label>
            <input
              required
              type="number"
              className="mt-1 block w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 focus:border-primario focus:bg-white focus:outline-none focus:ring-2 focus:ring-primario/20 transition-all"
              value={formPlan.monto}
              onChange={(e) => setFormPlan({ ...formPlan, monto: Number(e.target.value) })}
            />
          </div>
          <div className="flex items-center gap-2 mt-2">
            <input
              type="checkbox"
              id="recomendada"
              checked={formPlan.recomendada}
              onChange={(e) => setFormPlan({ ...formPlan, recomendada: e.target.checked })}
              className="rounded text-primario focus:ring-primario"
            />
            <label htmlFor="recomendada" className="text-sm font-medium text-slate-700">
              Marcar como plan recomendado
            </label>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => setModalPlanAbierto(false)}
              className="rounded-xl px-4 py-2 text-sm text-slate-500 hover:bg-slate-100"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={enviando}
              className="rounded-xl bg-primario px-6 py-2 text-sm font-bold text-white shadow-lg shadow-primario/20 disabled:opacity-50"
            >
              {enviando ? "Guardando..." : "Guardar Plan"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
