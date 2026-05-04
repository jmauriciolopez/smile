const URL_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

/**
 * Lee el token desde localStorage (fuente de verdad persistida).
 * Si no hay token, devuelve null — el guard de usePerfil previene la llamada.
 */
function getToken(): string | null {
  return localStorage.getItem("token");
}

export async function clienteApi<T>(
  ruta: string,
  opciones?: RequestInit,
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(opciones?.headers as Record<string, string> || {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const respuesta = await fetch(`${URL_BASE}${ruta}`, {
    ...opciones,
    headers,
  });

  if (!respuesta.ok) {
    if (respuesta.status === 401) {
      // Token expirado o inválido — limpiar sesión y redirigir al login
      console.warn("⚠️ Sesión expirada. Redirigiendo al login...");
      localStorage.removeItem("token");
      localStorage.removeItem("usuario");
      // Redirigir solo si no estamos ya en /login
      if (!window.location.pathname.includes("/login")) {
        window.location.href = "/login";
      }
    }
    const errorBody = await respuesta.json().catch(() => ({}));
    throw new Error(errorBody.message || errorBody.mensaje || "Error de API");
  }

  return respuesta.json() as Promise<T>;
}
