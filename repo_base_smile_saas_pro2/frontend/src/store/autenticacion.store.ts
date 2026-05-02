import { create } from "zustand";

type UsuarioSesion = {
  nombre_completo: string;
  email: string;
  rol: string;
};

type EstadoAutenticacion = {
  autenticado: boolean;
  token: string | null;
  usuario: UsuarioSesion | null;
  iniciarSesion: (token: string, usuario: UsuarioSesion) => void;
  cerrarSesion: () => void;
};

const tokenInicial = localStorage.getItem("token");
const usuarioInicial = localStorage.getItem("usuario")
  ? JSON.parse(localStorage.getItem("usuario")!)
  : null;

export const useAutenticacionStore = create<EstadoAutenticacion>((set) => ({
  autenticado: !!tokenInicial,
  token: tokenInicial,
  usuario: usuarioInicial,
  iniciarSesion: (token, usuario) => {
    localStorage.setItem("token", token);
    localStorage.setItem("usuario", JSON.stringify(usuario));
    set({ autenticado: true, token, usuario });
  },
  cerrarSesion: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    set({ autenticado: false, token: null, usuario: null });
  },
}));
