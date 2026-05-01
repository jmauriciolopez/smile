import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card } from '../../../componentes/ui/Card';
import { Modal } from '../../../componentes/ui/Modal';
import { BadgeEstado } from '../../../componentes/ui/BadgeEstado';
import { usePacienteDetalle } from '../../../hooks/usePacienteDetalle';
import { crearCaso } from '../../../servicios/servicioCasos';

export function DetallePacientePage() {
  const { id } = useParams();
  const { paciente, cargando, error, actualizar, refrescar: refrescarPaciente } = usePacienteDetalle(id);
  
  const [mostrarModal, setMostrarModal] = useState(false);
  const [form, setForm] = useState({
    nombre_completo: '',
    telefono: '',
    email: '',
    ciudad: '',
  });
  const [enviando, setEnviando] = useState(false);

  // Estados para Nuevo Caso
  const [mostrarModalCaso, setMostrarModalCaso] = useState(false);
  const [formCaso, setFormCaso] = useState({ titulo: '', motivo_consulta: '' });
  const [creandoCaso, setCreandoCaso] = useState(false);

  // Sincronizar form con paciente al abrir modal
  const abrirEdicion = () => {
    if (paciente) {
      setForm({
        nombre_completo: paciente.nombre_completo,
        telefono: paciente.telefono || '',
        email: paciente.email || '',
        ciudad: paciente.ciudad || '',
      });
      setMostrarModal(true);
    }
  };

  const handleGuardar = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);
    try {
      await actualizar(form);
      setMostrarModal(false);
    } catch (error) {
      alert('Error al actualizar los datos.');
    } finally {
      setEnviando(false);
    }
  };

  const handleCrearCaso = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setCreandoCaso(true);
    try {
      await crearCaso({
        paciente_id: id,
        titulo: formCaso.titulo,
        motivo_consulta: formCaso.motivo_consulta
      });
      setMostrarModalCaso(false);
      setFormCaso({ titulo: '', motivo_consulta: '' });
      refrescarPaciente();
    } catch (error) {
      alert('Error al crear el caso clínico.');
    } finally {
      setCreandoCaso(false);
    }
  };


  if (cargando && !paciente) {
    return (
      <div className="flex min-h-[400px] items-center justify-center italic text-textoSecundario">
        Cargando detalles del paciente...
      </div>
    );
  }

  if (error || !paciente) {
    return (
      <div className="rounded-xl bg-red-50 p-8 text-center text-red-600">
        {error || 'Paciente no encontrado.'}
        <div className="mt-4">
          <Link to="/pacientes" className="text-primario font-medium hover:underline">
            Volver al listado
          </Link>
        </div>
      </div>
    );
  }

  const casos = paciente.casos_clinicos || [];
  const presupuestos = paciente.presupuestos || [];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">{paciente.nombre_completo}</h1>
          <p className="mt-1 text-textoSecundario">
            {paciente.telefono || 'Sin teléfono'} · {paciente.email || 'Sin email'}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={abrirEdicion}
            className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200 transition-colors"
          >
            Editar Perfil
          </button>
          <Link to="/pacientes" className="text-sm font-medium text-textoSecundario hover:text-primario transition-colors">
            &larr; Volver
          </Link>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card titulo="Resumen del Perfil">
          <div className="space-y-4 text-sm">
            <div className="flex justify-between border-b border-slate-100 pb-2">
              <span className="text-textoSecundario">Estado:</span> 
              <BadgeEstado texto={paciente.estado_paciente || 'nuevo'} />
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-2">
              <span className="text-textoSecundario">Ciudad:</span> 
              <span className="font-medium">{paciente.ciudad || '-'}</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-2">
              <span className="text-textoSecundario">ID:</span> 
              <span className="text-xs font-mono text-slate-400">{paciente.id}</span>
            </div>
          </div>
        </Card>

        <Card titulo="Casos Clínicos">
          <div className="mb-4">
            <button 
              onClick={() => setMostrarModalCaso(true)}
              className="w-full rounded-xl border-2 border-dashed border-slate-200 p-3 text-center text-xs font-bold uppercase tracking-wider text-slate-400 hover:border-primario/40 hover:text-primario transition-all"
            >
              + Nuevo Caso Clínico
            </button>
          </div>
          <div className="space-y-3">
            {casos.length > 0 ? (
              casos.map((caso: any) => (
                <Link key={caso.id} to={`/casos/${caso.id}`} className="group block rounded-xl border border-slate-200 p-4 hover:border-primario/50 hover:bg-primario/[0.02] transition-all">
                  <div className="font-semibold text-slate-900 group-hover:text-primario">{caso.titulo}</div>
                  <div className="mt-1 text-sm text-textoSecundario line-clamp-2">{caso.motivo_consulta || 'Sin descripción'}</div>
                  <div className="mt-3 text-[10px] uppercase tracking-wider font-bold text-slate-400">{caso.estado_caso}</div>
                </Link>
              ))
            ) : (
              <div className="py-8 text-center text-sm text-textoSecundario italic bg-slate-50 rounded-xl">
                No hay casos registrados.
              </div>
            )}
          </div>
        </Card>

        <Card titulo="Presupuestos">
          <div className="space-y-3">
            {presupuestos.length > 0 ? (
              presupuestos.map((presupuesto: any) => (
                <Link key={presupuesto.id} to={`/presupuestos/${presupuesto.id}`} className="group block rounded-xl border border-slate-200 p-4 hover:border-primario/50 hover:bg-primario/[0.02] transition-all">
                  <div className="flex items-center justify-between">
                    <div className="font-bold text-slate-900 group-hover:text-primario">USD {presupuesto.monto_total_estimado}</div>
                    <BadgeEstado texto={presupuesto.estado_presupuesto} />
                  </div>
                  <div className="mt-2 text-[10px] text-textoSecundario">PLAN DE {presupuesto.cantidad_cuotas} CUOTAS</div>
                </Link>
              ))
            ) : (
              <div className="py-8 text-center text-sm text-textoSecundario italic bg-slate-50 rounded-xl">
                No hay presupuestos emitidos.
              </div>
            )}
          </div>
        </Card>
      </div>

      <Modal 
        abierto={mostrarModal} 
        alCerrar={() => setMostrarModal(false)} 
        titulo="Editar Datos del Paciente"
      >
        <form onSubmit={handleGuardar} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Nombre Completo</label>
            <input 
              required
              className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:ring-2 focus:ring-primario/20"
              value={form.nombre_completo}
              onChange={e => setForm({...form, nombre_completo: e.target.value})}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Teléfono</label>
              <input 
                className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:ring-2 focus:ring-primario/20"
                value={form.telefono}
                onChange={e => setForm({...form, telefono: e.target.value})}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Ciudad</label>
              <input 
                className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:ring-2 focus:ring-primario/20"
                value={form.ciudad}
                onChange={e => setForm({...form, ciudad: e.target.value})}
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Email</label>
            <input 
              type="email"
              className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:ring-2 focus:ring-primario/20"
              value={form.email}
              onChange={e => setForm({...form, email: e.target.value})}
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button 
              type="button"
              onClick={() => setMostrarModal(false)}
              className="rounded-xl px-4 py-2 text-sm font-medium text-slate-500 hover:bg-slate-100"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              disabled={enviando}
              className="rounded-xl bg-primario px-6 py-2 text-sm font-bold text-white shadow-lg shadow-primario/20 hover:bg-primario/90 disabled:opacity-50"
            >
              {enviando ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal para Nuevo Caso */}
      <Modal 
        abierto={mostrarModalCaso} 
        alCerrar={() => setMostrarModalCaso(false)} 
        titulo="Nuevo Caso Clínico"
      >
        <form onSubmit={handleCrearCaso} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Título del Caso</label>
            <input 
              required
              placeholder="Ej: Rehabilitación Oral Completa"
              className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:ring-2 focus:ring-primario/20"
              value={formCaso.titulo}
              onChange={e => setFormCaso({...formCaso, titulo: e.target.value})}
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Motivo de Consulta / Objetivos</label>
            <textarea 
              rows={4}
              placeholder="Describe los objetivos del tratamiento..."
              className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:ring-2 focus:ring-primario/20"
              value={formCaso.motivo_consulta}
              onChange={e => setFormCaso({...formCaso, motivo_consulta: e.target.value})}
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button 
              type="button"
              onClick={() => setMostrarModalCaso(false)}
              className="rounded-xl px-4 py-2 text-sm font-medium text-slate-500 hover:bg-slate-100"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              disabled={creandoCaso}
              className="rounded-xl bg-primario px-6 py-2 text-sm font-bold text-white shadow-lg shadow-primario/20 hover:bg-primario/90 disabled:opacity-50"
            >
              {creandoCaso ? 'Creando...' : 'Crear Caso'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

