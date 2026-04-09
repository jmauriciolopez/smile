const URL_BASE = 'http://localhost:3000/api';

export async function clienteApi<T>(ruta: string, opciones?: RequestInit): Promise<T> {
  const respuesta = await fetch(`${URL_BASE}${ruta}`, {
    headers: { 'Content-Type': 'application/json', ...(opciones?.headers || {}) },
    ...opciones,
  });

  if (!respuesta.ok) {
    throw new Error('Error de API');
  }

  return respuesta.json() as Promise<T>;
}
