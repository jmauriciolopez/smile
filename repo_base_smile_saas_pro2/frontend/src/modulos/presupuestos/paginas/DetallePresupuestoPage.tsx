import { useParams, Link } from 'react-router-dom';
import { Card } from '../../../componentes/ui/Card';
import { BadgeEstado } from '../../../componentes/ui/BadgeEstado';
import { usePresupuestoDetalle } from '../../../hooks/usePresupuestoDetalle';

const opcionesMock = [
  { nombre: 'Opción esencial', monto: 1900, cuotas: 6, recomendada: false },
  { nombre: 'Opción recomendada', monto: 2400, cuotas: 6, recomendada: true },
  { nombre: 'Opción premium', monto: 3200, cuotas: 9, recomendada: false },
];

export function DetallePresupuestoPage() {
  const { id } = useParams();
  const { presupuesto, cargando, error } = usePresupuestoDetalle(id);

  if (cargando) {
    return (
      <div className="flex min-h-[400px] items-center justify-center italic text-textoSecundario">
        Cargando detalles del presupuesto...
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

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Presupuesto Comercial</h1>
          <p className="mt-1 text-textoSecundario font-medium">
            Paciente: <Link to={`/pacientes/${presupuesto.paciente_id}`} className="text-primario hover:underline">{presupuesto.paciente?.nombre_completo}</Link>
          </p>
        </div>
        <Link to="/presupuestos" className="text-sm font-medium text-textoSecundario hover:text-primario transition-colors">
          &larr; Volver
        </Link>
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card titulo="Resumen Económico">
          <div className="space-y-3">
            <div className="text-4xl font-black text-slate-900">USD {presupuesto.monto_total_estimado}</div>
            <div className="flex items-center gap-2">
              <BadgeEstado texto={presupuesto.estado_presupuesto} />
              <span className="text-sm text-textoSecundario font-medium">· {presupuesto.cantidad_cuotas} cuotas</span>
            </div>
          </div>
        </Card>

        <Card titulo="Carpeta Clínica">
          {presupuesto.caso_clinico ? (
            <Link to={`/casos/${presupuesto.caso_clinico_id}`} className="group block">
              <div className="text-sm font-medium text-textoSecundario group-hover:text-primario transition-colors">Vinculado a:</div>
              <div className="mt-1 font-bold text-slate-800 group-hover:text-primario transition-colors">{presupuesto.caso_clinico.titulo}</div>
              <div className="mt-2 text-xs text-primario font-semibold underline underline-offset-4">Ver caso completo →</div>
            </Link>
          ) : (
            <div className="text-sm text-textoSecundario italic">Sin caso vinculado.</div>
          )}
        </Card>

        <Card titulo="Seguimiento de Venta">
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-2 text-textoSecundario">
              <span className="h-1.5 w-1.5 rounded-full bg-slate-300"></span>
              Presupuesto emitido el {new Date(presupuesto.fecha_creacion).toLocaleDateString()}
            </li>
            <li className="flex items-center gap-2 text-textoSecundario">
              <span className="h-1.5 w-1.5 rounded-full bg-slate-300"></span>
              Pendiente de revisión con el paciente
            </li>
          </ul>
        </Card>
      </div>

      <Card titulo="Detalle de Propuestas Reales (Simulado)">
        <div className="grid gap-6 md:grid-cols-3">
          {opcionesMock.map((opcion) => (
            <div 
              key={opcion.nombre} 
              className={`relative overflow-hidden rounded-2xl border p-6 transition-all ${
                opcion.recomendada 
                  ? 'border-primario bg-primario/[0.03] shadow-lg shadow-primario/5' 
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              {opcion.recomendada && (
                <div className="absolute top-0 right-0 rounded-bl-xl bg-primario px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white">
                  Ideal
                </div>
              )}
              <div className="font-bold text-slate-500 uppercase text-[10px] tracking-widest">{opcion.nombre}</div>
              <div className="mt-2 text-3xl font-black text-slate-900">USD {opcion.monto}</div>
              <div className="mt-1 text-sm font-medium text-textoSecundario opacity-70">{opcion.cuotas} cuotas fijas</div>
              
              <button className={`mt-6 w-full rounded-xl py-2.5 text-sm font-bold transition-all ${
                opcion.recomendada 
                  ? 'bg-primario text-white hover:bg-primario/90 shadow-md shadow-primario/20' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}>
                Seleccionar plan
              </button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
