import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAutenticacionStore } from "../../../store/autenticacion.store";
import { login } from "../../../servicios/servicioAutenticacion";

export function LoginPage() {
  const navigate = useNavigate();
  const storeIniciarSesion = useAutenticacionStore((s) => s.iniciarSesion);

  const [email, setEmail] = useState("admin@smilesaas.local");
  const [contrasena, setContrasena] = useState("admin123");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setCargando(true);
    setError(null);

    try {
      const respuesta = await login(email, contrasena);
      storeIniciarSesion(respuesta.access_token, respuesta.usuario);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message || "Error al iniciar sesión");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-sm rounded-3xl bg-white p-10 shadow-xl shadow-slate-200/50 animate-in fade-in zoom-in-95 duration-500">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primario shadow-lg shadow-primario/25">
            <span className="text-3xl font-black text-white italic">S</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">
            Bienvenido a Smile
          </h1>
          <p className="mt-2 text-sm text-textoSecundario">
            Ingresá a tu panel clínico
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-xl bg-red-50 p-4 text-xs font-bold text-red-600 border border-red-100 flex items-center gap-2">
            <svg
              className="h-4 w-4 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
              Email
            </label>
            <input
              required
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none focus:border-primario focus:bg-white focus:ring-4 focus:ring-primario/10 transition-all font-medium"
              type="email"
              placeholder="vendedor@smile.pro"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
              Contraseña
            </label>
            <input
              required
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none focus:border-primario focus:bg-white focus:ring-4 focus:ring-primario/10 transition-all font-medium"
              type="password"
              placeholder="••••••••"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={cargando}
            className="mt-4 w-full rounded-2xl bg-primario py-4 font-bold text-white shadow-lg shadow-primario/30 hover:scale-[1.02] hover:bg-primario/90 active:scale-[0.98] disabled:opacity-50 transition-all"
          >
            {cargando ? "Autenticando..." : "Iniciar Sesión"}
          </button>
        </form>

        <p className="mt-8 text-center text-[11px] text-slate-400">
          Smile SaaS PRO 2 &copy; 2026
          <br />
          Tecnología para Odontología Moderna
        </p>
      </div>
    </div>
  );
}
