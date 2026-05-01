import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAutenticacionStore } from '../../store/autenticacion.store';
import { usePerfil } from '../../hooks/usePerfil';

const menu = [
  { to: '/dashboard', etiqueta: 'Dashboard', icono: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { to: '/pacientes', etiqueta: 'Pacientes', icono: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
  { to: '/casos', etiqueta: 'Historias Clínicas', icono: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
  { to: '/presupuestos', etiqueta: 'Presupuestos', icono: 'M9 8l3 5m0 0l3-5m-3 5v4m-3-5h6m-6 3h6m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
];

export function ShellAplicacion() {
  const navigate = useNavigate();
  const usuarioLocal = useAutenticacionStore((s) => s.usuario);
  const cerrarSesion = useAutenticacionStore((s) => s.cerrarSesion);
  const { perfil, cargando } = usePerfil();

  const usuario = perfil || usuarioLocal;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-primario/10 selection:text-primario">
      <div className="flex min-h-screen">
        {/* Sidebar Premium */}
        <aside className="fixed inset-y-0 left-0 w-72 border-r border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-12 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primario to-blue-700 text-white shadow-lg shadow-primario/20">
              <span className="text-xl font-black italic">S</span>
            </div>
            <div>
              <div className="text-lg font-black tracking-tight text-slate-800">SMILE SAAS</div>
              <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-primario opacity-80">Professional Edition</div>
            </div>
          </div>

          <nav className="space-y-1.5">
            {menu.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  [
                    'group flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-semibold transition-all duration-300',
                    isActive 
                      ? 'bg-primario text-white shadow-md shadow-primario/20 ring-1 ring-primario' 
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900',
                  ].join(' ')
                }
              >
                {({ isActive }) => (
                  <>
                    <svg className={`h-5 w-5 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-primario'} transition-colors duration-300`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icono} />
                    </svg>
                    {item.etiqueta}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* User Profile Sute */}
          <div className="absolute bottom-6 left-6 right-6">
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 transition-all hover:border-primario/20">
               <div className="flex items-center gap-3">
                 <div className={`h-10 w-10 rounded-full bg-slate-200 ring-2 ring-white ${cargando ? 'animate-pulse' : ''}`} />
                 <div className="overflow-hidden">
                   <div className={`truncate text-xs font-bold text-slate-800 ${cargando ? 'bg-slate-200 rounded h-3 w-24 animate-pulse' : ''}`}>
                    {!cargando && (usuario?.nombre_completo || 'Dr. Usuario')}
                   </div>
                   <div className={`mt-1 truncate text-[10px] text-slate-400 font-medium capitalize ${cargando ? 'bg-slate-100 rounded h-2 w-16 animate-pulse' : ''}`}>
                    {!cargando && (usuario?.rol || 'Odontólogo')}
                   </div>
                 </div>
               </div>
               <button
                  onClick={() => {
                    cerrarSesion();
                    navigate('/login');
                  }}
                  className="mt-4 w-full rounded-xl bg-white border border-slate-200 py-2 text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all"
                >
                  Cerrar Sesión
                </button>
            </div>
          </div>
        </aside>

        {/* Content Area */}
        <main className="ml-72 flex-1 p-10 max-w-7xl">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
