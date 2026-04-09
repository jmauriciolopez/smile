import { useEffect, useState } from 'react';
import { obtenerCasoPorId, type CasoClinicoApi } from '../servicios/servicioCasos';

export function useCasoDetalle(id: string | undefined) {
  const [caso, setCaso] = useState<CasoClinicoApi | null>(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    let vivo = true;
    setCargando(true);
    obtenerCasoPorId(id)
      .then((datos) => {
        if (vivo) setCaso(datos);
      })
      .catch(() => {
        if (vivo) setError('No se pudo cargar el detalle del caso clínico.');
      })
      .finally(() => {
        if (vivo) setCargando(false);
      });

    return () => {
      vivo = false;
    };
  }, [id]);

  return { caso, cargando, error };
}
