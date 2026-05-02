import { Link } from "react-router-dom";
import { Card } from "../../../componentes/ui/Card";
import { BadgeEstado } from "../../../componentes/ui/BadgeEstado";
import { usePresupuestos } from "../../../hooks/usePresupuestos";

export function PresupuestosPage() {
  const { presupuestos, cargando, error } = usePresupuestos();

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-semibold">Presupuestos</h1>
        <p className="mt-1 text-textoSecundario">
          Propuestas comerciales y planes de tratamiento registrados.
        </p>
      </header>

      <Card titulo="Listado de presupuestos">
        {cargando && (
          <div className="py-12 text-center text-textoSecundario italic">
            Cargando presupuestos...
          </div>
        )}

        {error && (
          <div className="py-12 text-center text-red-500 font-medium">
            {error}
          </div>
        )}

        {!cargando && !error && (
          <div className="space-y-4">
            {presupuestos.map((item) => (
              <Link
                key={item.id}
                to={`/presupuestos/${item.id}`}
                className="group block rounded-2xl border border-slate-200 p-5 hover:border-primario/40 hover:bg-primario/[0.02] transition-all"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-slate-900 group-hover:text-primario transition-colors">
                      {item.paciente?.nombre_completo ||
                        "Paciente no identificado"}
                    </div>
                    <div className="mt-1 text-sm text-textoSecundario">
                      USD {item.monto_total_estimado} · {item.cantidad_cuotas}{" "}
                      cuotas
                    </div>
                    {item.caso_clinico && (
                      <div className="mt-2 text-[10px] uppercase font-bold text-slate-400">
                        Carpeta: {item.caso_clinico.titulo}
                      </div>
                    )}
                  </div>
                  <BadgeEstado texto={item.estado_presupuesto} />
                </div>
              </Link>
            ))}
            {presupuestos.length === 0 && (
              <div className="py-12 text-center text-textoSecundario italic">
                No se encontraron presupuestos emitidos.
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}
