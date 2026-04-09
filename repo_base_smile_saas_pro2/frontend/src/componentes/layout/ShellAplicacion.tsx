import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAutenticacionStore } from '../../store/autenticacion.store';

const menu = [
  { to: '/dashboard', etiqueta: 'Dashboard' },
  { to: '/pacientes', etiqueta: 'Pacientes' },
  { to: '/casos', etiqueta: 'Casos' },
  { to: '/presupuestos', etiqueta: 'Presupuestos' },
  { to: '/seguimientos', etiqueta: 'Seguimientos' },
];

export function ShellAplicacion() {
  const navigate = useNavigate();
  const usuario = useAutenticacionStore((s) => s.usuario);
  const cerrarSesion = useAutenticacionStore((s) => s.cerrarSesion);

  return (
    <div className="min-h-screen bg-fondo text-texto">
      <div className="grid min-h-screen grid-cols-[260px_1fr]">
        <aside className="border-r border-slate-200 bg-superficie p-5">
          <div className="mb-8">
            <div className="text-xl font-semibold">Smile SaaS</div>
            <div className="text-sm text-textoSecundario">PRO 2</div>
          </div>

          <nav className="space-y-2">
            {menu.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  [
                    'block rounded-xl px-4 py-3 text-sm transition',
                    isActive ? 'bg-blue-50 font-medium text-primario' : 'text-textoSecundario hover:bg-slate-50 hover:text-texto',
                  ].join(' ')
                }
              >
                {item.etiqueta}
              </NavLink>
            ))}
          </nav>
        </aside>

        <main className="p-8">
          <div className="mb-6 flex items-center justify-between rounded-2xl bg-superficie p-4 shadow-suave">
            <div>
              <div className="font-medium">Sesión activa</div>
              <div className="text-sm text-textoSecundario">{usuario?.email}</div>
            </div>
            <button
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm"
              onClick={() => {
                cerrarSesion();
                navigate('/login');
              }}
            >
              Cerrar sesión
            </button>
          </div>

          <Outlet />
        </main>
      </div>
    </div>
  );
}
