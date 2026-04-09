import { Link, useParams } from 'react-router-dom';
import { Card } from '../../../componentes/ui/Card';
import { BadgeEstado } from '../../../componentes/ui/BadgeEstado';
import { useCasoDetalle } from '../../../hooks/useCasoDetalle';

export function DetalleCasoClinicoPage() {
  const { id } = useParams();
  const { caso, cargando, error } = useCasoDetalle(id);

  if (cargando) {
    return (
      <div className="flex min-h-[400px] items-center justify-center italic text-textoSecundario">
        Cargando detalles del caso...
      </div>
    );
  }

  if (error || !caso) {
    return (
      <div className="rounded-xl bg-red-50 p-8 text-center text-red-600">
        {error || 'Caso clínico no encontrado.'}
        <div className="mt-4">
          <Link to="/casos" className="text-primario font-medium hover:underline">
            Volver a la lista de casos
          </Link>
        </div>
      </div>
    );
  }

  const presupuestos = (caso as any).presupuestos || [];
  const primerPresupuesto = presupuestos[0];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">{caso.titulo}</h1>
          <p className="mt-1 text-textoSecundario">
            Paciente: <Link to={`/pacientes/${caso.paciente_id}`} className="font-medium text-primario hover:underline">
              {caso.paciente?.nombre_completo}
            </Link>
          </p>
        </div>
        <div className="flex gap-3">
          <Link to="/casos" className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-textoSecundario hover:bg-slate-50 transition-colors">
            Volver
          </Link>
          <Link className="rounded-xl bg-primario px-4 py-2 text-sm font-medium text-white shadow-lg shadow-primario/20 hover:scale-[1.02] active:scale-[0.98] transition-all" to={`/disenos/editor/${caso.id}`}>
            Abrir editor de sonrisa
          </Link>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card titulo="Resumen del caso">
          <div className="space-y-4 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-textoSecundario">Estado actual:</span>
              <BadgeEstado texto={caso.estado_caso} />
            </div>
            <div className="space-y-1">
              <span className="text-textoSecundario">Motivo de consulta / Objetivos:</span>
              <p className="rounded-lg bg-slate-50 p-3 text-slate-700 leading-relaxed">
                {caso.motivo_consulta || 'No se registraron notas de consulta.'}
              </p>
            </div>
          </div>
        </Card>

        <Card titulo="Herramientas de Diseño">
          <div className="space-y-4 text-sm">
            <div className="flex justify-between border-b border-slate-100 pb-2">
              <span className="text-textoSecundario">Estado del diseño:</span>
              <BadgeEstado texto="Pendiente" />
            </div>
            <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50/50 p-8 text-center text-textoSecundario">
              <div className="mx-auto mb-2 h-10 w-10 text-slate-300">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              </div>
              El comparador visual estará disponible al procesar el diseño.
            </div>
          </div>
        </Card>

        <Card titulo="Documentación Fotográfica">
          <div className="grid grid-cols-2 gap-4">
            <div className="group relative aspect-video cursor-pointer overflow-hidden rounded-xl bg-slate-100 ring-1 ring-slate-200 transition-all hover:ring-primario/30">
              <div className="flex h-full items-center justify-center text-[10px] font-bold uppercase tracking-widest text-slate-400">Foto Frontal</div>
            </div>
            <div className="group relative aspect-video cursor-pointer overflow-hidden rounded-xl bg-slate-100 ring-1 ring-slate-200 transition-all hover:ring-primario/30">
              <div className="flex h-full items-center justify-center text-[10px] font-bold uppercase tracking-widest text-slate-400">Foto Perfil</div>
            </div>
          </div>
        </Card>

        <Card titulo="Gestión Comercial">
          {primerPresupuesto ? (
            <Link to={`/presupuestos/${primerPresupuesto.id}`} className="group block rounded-xl border border-slate-200 p-5 hover:border-primario/40 hover:bg-primario/[0.02] transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold uppercase tracking-widest text-slate-400">Presupuesto Activo</div>
                  <div className="mt-1 text-2xl font-bold text-slate-900 group-hover:text-primario">USD {primerPresupuesto.monto_total_estimado}</div>
                </div>
                <BadgeEstado texto={primerPresupuesto.estado_presupuesto} />
              </div>
              <div className="mt-4 flex items-center gap-2 text-sm font-medium text-primario">
                Ver propuesta comercial detallada 
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </div>
            </Link>
          ) : (
            <div className="py-8 text-center text-sm text-textoSecundario italic bg-slate-50 rounded-xl">
              No hay presupuestos asociados a este caso.
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
