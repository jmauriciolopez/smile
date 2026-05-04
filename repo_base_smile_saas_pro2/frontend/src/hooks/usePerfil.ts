import { useState, useEffect } from "react";
import { obtenerPerfil, UsuarioPerfil } from "../servicios/servicioUsuarios";
import { useAutenticacionStore } from "../store/autenticacion.store";

export function usePerfil() {
  const [perfil, setPerfil] = useState<UsuarioPerfil | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const token = useAutenticacionStore((s) => s.token);

  useEffect(() => {
    async function cargarPerfil() {
      // Verificar tanto el store como localStorage para evitar inconsistencias
      const tokenReal = token || localStorage.getItem("token");
      if (!tokenReal) {
        setCargando(false);
        return;
      }

      try {
        const datos = await obtenerPerfil();
        setPerfil(datos);
      } catch (err: any) {
        // 401 ya es manejado por clienteApi (redirige al login)
        // Solo loguear otros errores
        if (!err?.message?.includes("token")) {
          setError("No se pudo cargar el perfil");
          console.error(err);
        }
      } finally {
        setCargando(false);
      }
    }

    cargarPerfil();
  }, [token]);

  return { perfil, cargando, error };
}
