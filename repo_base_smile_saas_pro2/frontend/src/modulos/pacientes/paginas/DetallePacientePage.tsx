import { useParams, Link } from 'react-router-dom';
import { Card } from '../../../componentes/ui/Card';
import { BadgeEstado } from '../../../componentes/ui/BadgeEstado';
import { usePacienteDetalle } from '../../../hooks/usePacienteDetalle';

export function DetallePacientePage() {
  const { id } = useParams();
  const { paciente, cargando, error } = usePacienteDetalle(id);

  if (cargando) {
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
        <Link to="/pacientes" className="text-sm font-medium text-textoSecundario hover:text-primario transition-colors">
          &larr; Volver
        </Link>
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
          <div className="space-y-3">
            {casos.length > 0 ? (
              casos.map((caso) => (
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
              presupuestos.map((presupuesto) => (
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
    </div>
  );
}
