import { clienteApi } from './clienteApi';

export type UsuarioPerfil = {
  id: string;
  nombre_completo: string;
  email: string;
  rol: string;
  activo: boolean;
};

export async function obtenerPerfil() {
  return clienteApi<UsuarioPerfil>('/usuarios/perfil');
}
