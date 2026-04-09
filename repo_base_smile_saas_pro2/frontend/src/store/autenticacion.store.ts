import { create } from 'zustand';

type UsuarioSesion = {
  email: string;
  rol: string;
};

type EstadoAutenticacion = {
  autenticado: boolean;
  token: string | null;
  usuario: UsuarioSesion | null;
  iniciarSesionDemo: () => void;
  cerrarSesion: () => void;
};

export const useAutenticacionStore = create<EstadoAutenticacion>((set) => ({
  autenticado: true,
  token: 'token-demo',
  usuario: {
    email: 'admin@smilesaas.local',
    rol: 'administrador',
  },
  iniciarSesionDemo: () =>
    set({
      autenticado: true,
      token: 'token-demo',
      usuario: { email: 'admin@smilesaas.local', rol: 'administrador' },
    }),
  cerrarSesion: () => set({ autenticado: false, token: null, usuario: null }),
}));
