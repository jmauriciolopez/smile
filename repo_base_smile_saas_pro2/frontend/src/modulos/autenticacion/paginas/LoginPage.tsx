import { useNavigate } from 'react-router-dom';
import { useAutenticacionStore } from '../../../store/autenticacion.store';

export function LoginPage() {
  const navigate = useNavigate();
  const iniciarSesionDemo = useAutenticacionStore((s) => s.iniciarSesionDemo);

  return (
    <div className="flex min-h-screen items-center justify-center bg-fondo p-6">
      <div className="w-full max-w-md rounded-2xl bg-superficie p-8 shadow-suave">
        <h1 className="text-2xl font-semibold">Iniciar sesión</h1>
        <p className="mt-2 text-sm text-textoSecundario">Usá las credenciales demo.</p>

        <div className="mt-6 space-y-4">
          <input className="w-full rounded-xl border border-slate-200 px-4 py-3" value="admin@smilesaas.local" readOnly />
          <input className="w-full rounded-xl border border-slate-200 px-4 py-3" type="password" value="admin123" readOnly />
          <button
            className="w-full rounded-xl bg-primario px-4 py-3 font-medium text-white"
            onClick={() => {
              iniciarSesionDemo();
              navigate('/dashboard');
            }}
          >
            Entrar
          </button>
        </div>
      </div>
    </div>
  );
}
