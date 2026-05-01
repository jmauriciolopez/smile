import { useState, useEffect } from 'react';
import { obtenerPerfil, UsuarioPerfil } from '../servicios/servicioUsuarios';
import { useAutenticacionStore } from '../store/autenticacion.store';

export function usePerfil() {
  const [perfil, setPerfil] = useState<UsuarioPerfil | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const token = useAutenticacionStore((s) => s.token);

  useEffect(() => {
    async function cargarPerfil() {
      if (!token) {
        setCargando(false);
        return;
      }

      try {
        const datos = await obtenerPerfil();
        setPerfil(datos);
      } catch (err) {
        setError('No se pudo cargar el perfil');
        console.error(err);
      } finally {
        setCargando(false);
      }
    }

    cargarPerfil();
  }, [token]);

  return { perfil, cargando, error };
}
