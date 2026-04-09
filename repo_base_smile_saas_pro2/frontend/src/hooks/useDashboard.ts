import { useState, useEffect } from 'react';
import { obtenerResumenDashboard, type ResumenDashboardApi } from '../servicios/servicioDashboard';

export function useDashboard() {
  const [resumen, setResumen] = useState<ResumenDashboardApi | null>(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let vivo = true;
    setCargando(true);
    obtenerResumenDashboard()
      .then((datos) => {
        if (vivo) setResumen(datos);
      })
      .catch(() => {
        if (vivo) setError('No se pudo cargar el resumen del dashboard.');
      })
      .finally(() => {
        if (vivo) setCargando(false);
      });

    return () => { vivo = false; };
  }, []);

  return { resumen, cargando, error };
}
