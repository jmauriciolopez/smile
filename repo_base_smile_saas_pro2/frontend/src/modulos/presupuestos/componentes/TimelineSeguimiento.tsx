import React, { useState } from 'react';
import { Card } from '../../../componentes/ui/Card';
import { crearSeguimiento, type SeguimientoApi } from '../../../servicios/servicioSeguimientos';

interface TimelineSeguimientoProps {
  presupuestoId: string;
  seguimientos: SeguimientoApi[];
  alActualizar: () => void;
}

export function TimelineSeguimiento({ presupuestoId, seguimientos, alActualizar }: TimelineSeguimientoProps) {
  const [comentario, setComentario] = useState('');
  const [proximaAccion, setProximaAccion] = useState('');
  const [fechaAccion, setFechaAccion] = useState('');
  const [enviando, setEnviando] = useState(false);

  const handleGuardar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comentario.trim()) return;
    
    setEnviando(true);
    try {
      await crearSeguimiento({
        presupuesto_id: presupuestoId,
        comentario,
        proxima_accion: proximaAccion || undefined,
        fecha_accion: fechaAccion || undefined,
      });
      setComentario('');
      setProximaAccion('');
      setFechaAccion('');
      alActualizar();
    } catch (error) {
      console.error(error);
      alert('Error al registrar seguimiento.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <Card titulo="Timeline de Seguimiento">
      <div className="space-y-8">
        {/* Formulario de Nueva Acción */}
        <form onSubmit={handleGuardar} className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4 shadow-inner">
          <div className="space-y-3">
            <textarea
              required
              className="w-full resize-none rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-primario/20 transition-all"
              rows={2}
              placeholder="¿Qué conversaste con el paciente? (Ej: Le pareció bien, consulta con su pareja...)"
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
            />
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <input
                type="text"
                placeholder="Próxima acción (Ej: Llamar)"
                className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs outline-none focus:ring-2 focus:ring-primario/10"
                value={proximaAccion}
                onChange={(e) => setProximaAccion(e.target.value)}
              />
              <input
                type="date"
                className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs outline-none focus:ring-2 focus:ring-primario/10 font-sans"
                value={fechaAccion}
                onChange={(e) => setFechaAccion(e.target.value)}
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={enviando || !comentario.trim()}
                className="rounded-xl bg-primario px-5 py-2 text-xs font-bold text-white shadow-lg shadow-primario/20 hover:bg-primario/90 disabled:opacity-50 transition-all"
              >
                {enviando ? 'Registrando...' : 'Registrar Acción'}
              </button>
            </div>
          </div>
        </form>

        {/* Listado Chronológico */}
        <div className="relative space-y-6 before:absolute before:left-[11px] before:top-2 before:h-[calc(100%-16px)] before:w-0.5 before:bg-slate-100">
          {seguimientos.length > 0 ? (
            seguimientos.map((s) => (
              <div key={s.id} className="relative pl-8">
                {/* Punto en el timeline */}
                <div className="absolute left-0 top-1.5 h-6 w-6 rounded-full border-4 border-white bg-primario shadow-sm" />
                
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      {new Date(s.fecha_creacion).toLocaleDateString()} · {new Date(s.fecha_creacion).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-slate-700 leading-relaxed">{s.comentario}</p>
                  
                  {s.proxima_accion && (
                    <div className="mt-2 inline-flex items-center gap-2 self-start rounded-full bg-primario/10 px-3 py-1 text-[10px] font-bold text-primario">
                      <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      {s.proxima_accion} {s.fecha_accion ? `(${new Date(s.fecha_accion).toLocaleDateString()})` : ''}
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="py-10 text-center text-sm text-textoSecundario italic">
              Aún no hay registros de seguimiento para esta propuesta.
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
