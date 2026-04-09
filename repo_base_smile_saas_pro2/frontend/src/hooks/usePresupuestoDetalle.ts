import { useEffect, useState } from 'react';
import { obtenerPresupuestoPorId, type PresupuestoApi } from '../servicios/servicioPresupuestos';

export function usePresupuestoDetalle(id: string | undefined) {
  const [presupuesto, setPresupuesto] = useState<PresupuestoApi | null>(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    let vivo = true;
    setCargando(true);
    obtenerPresupuestoPorId(id)
      .then((datos) => {
        if (vivo) setPresupuesto(datos);
      })
      .catch(() => {
        if (vivo) setError('No se pudo cargar el detalle del presupuesto.');
      })
      .finally(() => {
        if (vivo) setCargando(false);
      });

    return () => {
      vivo = false;
    };
  }, [id]);

  return { presupuesto, cargando, error };
}
