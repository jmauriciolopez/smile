import { Link } from 'react-router-dom';
import { Card } from '../../../componentes/ui/Card';
import { BadgeEstado } from '../../../componentes/ui/BadgeEstado';
import { usePacientes } from '../../../hooks/usePacientes';

export function PacientesPage() {
  const { pacientes, cargando, error } = usePacientes();

  return (
    <div className="space-y-6">
      <header className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Pacientes</h1>
          <p className="mt-1 text-textoSecundario">Listado de pacientes sincronizado con el sistema.</p>
        </div>
        <button className="rounded-xl bg-primario px-4 py-2 text-sm font-medium text-white">Nuevo paciente</button>
      </header>

      <Card titulo="Listado de pacientes">
        {cargando && (
          <div className="py-12 text-center text-textoSecundario italic">Cargando pacientes...</div>
        )}
        
        {error && (
          <div className="py-12 text-center text-red-500 font-medium">{error}</div>
        )}

        {!cargando && !error && (
          <div className="overflow-hidden rounded-xl border border-slate-200">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 text-left text-textoSecundario">
                <tr>
                  <th className="px-4 py-3">Paciente</th>
                  <th className="px-4 py-3">Ciudad</th>
                  <th className="px-4 py-3">Estado</th>
                  <th className="px-4 py-3">Acción</th>
                </tr>
              </thead>
              <tbody>
                {pacientes.map((paciente) => (
                  <tr key={paciente.id} className="border-t border-slate-200 hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-medium">{paciente.nombre_completo}</div>
                      <div className="text-textoSecundario">{paciente.email}</div>
                    </td>
                    <td className="px-4 py-3 text-textoSecundario">{paciente.ciudad || '-'}</td>
                    <td className="px-4 py-3">
                      <BadgeEstado texto={paciente.estado_paciente || 'nuevo'} />
                    </td>
                    <td className="px-4 py-3">
                      <Link className="text-primario font-medium hover:underline" to={`/pacientes/${paciente.id}`}>
                        Ver detalle
                      </Link>
                    </td>
                  </tr>
                ))}
                {pacientes.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-12 text-center text-textoSecundario italic">
                      No se encontraron pacientes.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
