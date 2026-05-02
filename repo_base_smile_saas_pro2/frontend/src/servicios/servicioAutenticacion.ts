import { clienteApi } from "./clienteApi";

export type LoginRespuesta = {
  access_token: string;
  usuario: {
    id: string;
    email: string;
    rol: string;
    nombre_completo: string;
  };
};

export async function login(email: string, contrasena: string) {
  return clienteApi<LoginRespuesta>("/autenticacion/login", {
    method: "POST",
    body: JSON.stringify({ email, contrasena }),
  });
}
