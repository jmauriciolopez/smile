import { Link } from 'react-router-dom';
import { Card } from '../../../componentes/ui/Card';
import { BadgeEstado } from '../../../componentes/ui/BadgeEstado';
import { useCasos } from '../../../hooks/useCasos';

export function CasosPage() {
  const { casos, cargando, error } = useCasos();

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-semibold">Casos clínicos</h1>
        <p className="mt-1 text-textoSecundario">Centro operativo de tratamientos en curso.</p>
      </header>

      <Card titulo="Listado de casos">
        {cargando && (
          <div className="py-12 text-center text-textoSecundario italic">Cargando casos...</div>
        )}
        
        {error && (
          <div className="py-12 text-center text-red-500 font-medium">{error}</div>
        )}

        {!cargando && !error && (
          <div className="space-y-4">
            {casos.map((caso) => (
              <Link 
                key={caso.id} 
                to={`/casos/${caso.id}`} 
                className="group block rounded-2xl border border-slate-200 p-5 hover:border-primario/40 hover:bg-primario/[0.02] transition-all"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-slate-900 group-hover:text-primario transition-colors">{caso.titulo}</div>
                    <div className="mt-1 text-sm text-textoSecundario">
                      Paciente: <span className="font-medium text-slate-600">{caso.paciente?.nombre_completo || 'No asignado'}</span>
                    </div>
                  </div>
                  <BadgeEstado texto={caso.estado_caso} />
                </div>
              </Link>
            ))}
            {casos.length === 0 && (
              <div className="py-12 text-center text-textoSecundario italic">
                No hay casos clínicos registrados en este momento.
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}
