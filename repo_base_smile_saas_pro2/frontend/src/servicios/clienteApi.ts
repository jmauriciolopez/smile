const URL_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export async function clienteApi<T>(ruta: string, opciones?: RequestInit): Promise<T> {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...(opciones?.headers || {}),
  };

  const respuesta = await fetch(`${URL_BASE}${ruta}`, {
    ...opciones,
    headers,
  });

  if (!respuesta.ok) {
    if (respuesta.status === 401) {
      console.warn('Sesión expirada o no autorizada');
    }
    const errorBody = await respuesta.json().catch(() => ({}));
    throw new Error(errorBody.message || errorBody.mensaje || 'Error de API');
  }

  return respuesta.json() as Promise<T>;
}
