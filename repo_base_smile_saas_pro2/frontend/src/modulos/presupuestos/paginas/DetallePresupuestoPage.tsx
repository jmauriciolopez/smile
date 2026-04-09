import { useParams, Link } from 'react-router-dom';
import { Card } from '../../../componentes/ui/Card';
import { BadgeEstado } from '../../../componentes/ui/BadgeEstado';
import { usePresupuestoDetalle } from '../../../hooks/usePresupuestoDetalle';
import { TimelineSeguimiento } from '../componentes/TimelineSeguimiento';

export function DetallePresupuestoPage() {
  const { id } = useParams();
  const { presupuesto, cargando, error, refrescar } = usePresupuestoDetalle(id);

  if (cargando) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center space-y-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primario border-t-transparent"></div>
        <p className="italic text-textoSecundario font-medium">Recuperando presupuesto comercial...</p>
      </div>
    );
  }

  if (error || !presupuesto) {
    return (
      <div className="rounded-xl bg-red-50 p-8 text-center text-red-600">
        {error || 'Presupuesto no encontrado.'}
        <div className="mt-4">
          <Link to="/presupuestos" className="text-primario font-medium hover:underline">
            Volver al listado
          </Link>
        </div>
      </div>
    );
  }

  const opciones = presupuesto.opciones || [];
  const seguimientos = presupuesto.seguimientos || [];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900 leading-tight">Presupuesto Comercial</h1>
          <p className="mt-1 text-textoSecundario">
            Paciente: <Link to={`/pacientes/${presupuesto.paciente_id}`} className="font-bold text-primario hover:underline">{presupuesto.paciente?.nombre_completo}</Link>
          </p>
        </div>
        <Link to="/presupuestos" className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-textoSecundario hover:bg-slate-50 transition-colors">
          &larr; Volver
        </Link>
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Columna Izquierda: Información General y Opciones */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <Card titulo="Resumen Económico">
              <div className="space-y-3">
                <div className="text-4xl font-black text-slate-900">USD {presupuesto.monto_total_estimado}</div>
                <div className="flex items-center gap-2">
                  <BadgeEstado texto={presupuesto.estado_presupuesto} />
                  <span className="text-[11px] font-bold uppercase tracking-wider text-textoSecundario">· {presupuesto.cantidad_cuotas} cuotas fijas</span>
                </div>
              </div>
            </Card>

            <Card titulo="Carpeta Clínica Vinculada">
              {presupuesto.caso_clinico ? (
                <Link to={`/casos/${presupuesto.caso_clinico_id}`} className="group block rounded-xl border border-slate-100 p-4 hover:border-primario/30 hover:bg-primario/[0.02] transition-all">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Caso Activo</div>
                  <div className="mt-1 font-bold text-slate-800 group-hover:text-primario transition-colors">{presupuesto.caso_clinico.titulo}</div>
                  <div className="mt-3 text-xs text-primario font-bold">Ver expediente clínico →</div>
                </Link>
              ) : (
                <div className="py-4 text-center text-sm text-textoSecundario italic bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  Sin caso clínico asociado.
                </div>
              )}
            </Card>
          </div>

          <Card titulo="Planes de Tratamiento">
            {opciones.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2">
                {opciones.map((opcion) => (
                  <div 
                    key={opcion.id} 
                    className={`group relative overflow-hidden rounded-2xl border p-6 transition-all ${
                      opcion.recomendada 
                        ? 'border-primario bg-primario/[0.03] shadow-lg shadow-primario/5' 
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    {opcion.recomendada && (
                      <div className="absolute top-0 right-0 rounded-bl-xl bg-primario px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white shadow-sm">
                        RECOMENDADA
                      </div>
                    )}
                    <div className="font-bold text-slate-400 uppercase text-[10px] tracking-widest">{opcion.titulo}</div>
                    <div className="mt-2 text-3xl font-black text-slate-900">USD {opcion.monto}</div>
                    <p className="mt-2 text-xs text-textoSecundario leading-relaxed line-clamp-2">
                      {opcion.descripcion || 'Sin descripción adicional del tratamiento.'}
                    </p>
                    
                    <button className={`mt-6 w-full rounded-xl py-2.5 text-xs font-bold transition-all ${
                      opcion.recomendada 
                        ? 'bg-primario text-white hover:bg-primario/90 shadow-md shadow-primario/20' 
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}>
                      Seleccionar éste plan
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center">
                <div className="mx-auto mb-3 h-12 w-12 text-slate-200">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                </div>
                <p className="text-sm text-textoSecundario italic">No se han definido opciones de tratamiento para este presupuesto.</p>
                <button className="mt-4 text-xs font-bold text-primario hover:underline">+ Configurar alternativas</button>
              </div>
            )}
          </Card>
        </div>

        {/* Columna Derecha: Timeline */}
        <div className="space-y-6">
          <TimelineSeguimiento 
            presupuestoId={presupuesto.id} 
            seguimientos={seguimientos} 
            alActualizar={refrescar} 
          />
        </div>
      </div>
    </div>
  );
}
