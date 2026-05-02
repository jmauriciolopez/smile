import { useEffect, useState } from "react";
import {
  obtenerPresupuestos,
  type PresupuestoApi,
} from "../servicios/servicioPresupuestos";

export function usePresupuestos() {
  const [presupuestos, setPresupuestos] = useState<PresupuestoApi[]>([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let vivo = true;
    setCargando(true);
    obtenerPresupuestos()
      .then((datos) => {
        if (vivo) setPresupuestos(datos);
      })
      .catch(() => {
        if (vivo) setError("No se pudieron cargar los presupuestos.");
      })
      .finally(() => {
        if (vivo) setCargando(false);
      });

    return () => {
      vivo = false;
    };
  }, []);

  return { presupuestos, cargando, error };
}
