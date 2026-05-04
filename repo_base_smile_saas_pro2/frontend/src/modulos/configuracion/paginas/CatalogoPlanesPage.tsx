import { useState } from "react";
import { useCatalogoPlanes } from "../../../hooks/useCatalogoPlanes";
import { Card } from "../../../componentes/ui/Card";
import { Modal } from "../../../componentes/ui/Modal";
import { PencilSimple, Trash, Plus } from "@phosphor-icons/react";

export function CatalogoPlanesPage() {
  const { planes, cargando, error, agregarPlanGlobal, editarPlanGlobal, eliminarPlanGlobal } = useCatalogoPlanes();

  const [modalAbierto, setModalAbierto] = useState(false);
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [form, setForm] = useState({
    titulo: "",
    descripcion: "",
    monto_base: 0,
    recomendada: false,
  });
  const [enviando, setEnviando] = useState(false);

  const abrirModal = (plan?: any) => {
    if (plan) {
      setEditandoId(plan.id);
      setForm({
        titulo: plan.titulo,
        descripcion: plan.descripcion || "",
        monto_base: plan.monto_base,
        recomendada: plan.recomendada,
      });
    } else {
      setEditandoId(null);
      setForm({
        titulo: "",
        descripcion: "",
        monto_base: 0,
        recomendada: false,
      });
    }
    setModalAbierto(true);
  };

  const handleGuardar = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);
    try {
      if (editandoId) {
        await editarPlanGlobal(editandoId, form);
      } else {
        await agregarPlanGlobal(form);
      }
      setModalAbierto(false);
    } catch (err) {
      alert("Error al guardar el plan.");
    } finally {
      setEnviando(false);
    }
  };

  const handleEliminar = async (id: string) => {
    if (!confirm("¿Eliminar este plan del catálogo? Los presupuestos que ya lo usaron no se verán afectados.")) return;
    try {
      await eliminarPlanGlobal(id);
    } catch (err) {
      alert("Error al eliminar el plan.");
    }
  };

  if (cargando) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center space-y-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primario border-t-transparent"></div>
        <p className="italic text-textoSecundario font-medium">Cargando catálogo...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900 leading-tight">
            Catálogo de Planes Globales
          </h1>
          <p className="mt-1 text-textoSecundario">
            Gestiona los planes de tratamiento estándar para incluirlos en los presupuestos.
          </p>
        </div>
      </header>

      <Card
        titulo="Planes Disponibles"
        accion={
          <button
            onClick={() => abrirModal()}
            className="flex items-center gap-1 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-bold text-primario hover:bg-slate-200 transition-colors"
          >
            <Plus weight="bold" /> Nuevo Plan Base
          </button>
        }
      >
        {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

        {planes.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {planes.map((plan) => (
              <div
                key={plan.id}
                className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white hover:border-slate-300 p-6 transition-all"
              >
                {plan.recomendada && (
                  <div className="absolute top-0 right-0 rounded-bl-xl bg-primario px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white shadow-sm">
                    RECOMENDADA
                  </div>
                )}
                <div className="flex justify-between items-start">
                  <div className="font-bold text-slate-400 uppercase text-[10px] tracking-widest">
                    {plan.titulo}
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <button onClick={() => abrirModal(plan)} className="hover:text-primario transition-colors">
                      <PencilSimple size={16} />
                    </button>
                    <button onClick={() => handleEliminar(plan.id)} className="hover:text-red-500 transition-colors">
                      <Trash size={16} />
                    </button>
                  </div>
                </div>
                <div className="mt-2 text-3xl font-black text-slate-900">
                  USD {plan.monto_base}
                </div>
                <p className="mt-2 text-xs text-textoSecundario leading-relaxed line-clamp-2">
                  {plan.descripcion || "Sin descripción."}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center">
            <p className="text-sm text-textoSecundario italic">
              No hay planes base registrados en el catálogo.
            </p>
          </div>
        )}
      </Card>

      <Modal
        abierto={modalAbierto}
        alCerrar={() => setModalAbierto(false)}
        titulo={editandoId ? "Editar Plan Base" : "Nuevo Plan Base"}
      >
        <form onSubmit={handleGuardar} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">Título</label>
            <input
              required
              className="mt-1 block w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 focus:border-primario focus:bg-white focus:outline-none focus:ring-2 focus:ring-primario/20 transition-all"
              value={form.titulo}
              onChange={(e) => setForm({ ...form, titulo: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Descripción</label>
            <textarea
              className="mt-1 block w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 focus:border-primario focus:bg-white focus:outline-none focus:ring-2 focus:ring-primario/20 transition-all"
              value={form.descripcion}
              onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Monto Base (USD)</label>
            <input
              required
              type="number"
              className="mt-1 block w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 focus:border-primario focus:bg-white focus:outline-none focus:ring-2 focus:ring-primario/20 transition-all"
              value={form.monto_base}
              onChange={(e) => setForm({ ...form, monto_base: Number(e.target.value) })}
            />
          </div>
          <div className="flex items-center gap-2 mt-2">
            <input
              type="checkbox"
              id="recomendada_base"
              checked={form.recomendada}
              onChange={(e) => setForm({ ...form, recomendada: e.target.checked })}
              className="rounded text-primario focus:ring-primario"
            />
            <label htmlFor="recomendada_base" className="text-sm font-medium text-slate-700">
              Sugerir como recomendada por defecto
            </label>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => setModalAbierto(false)}
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
