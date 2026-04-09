import { useEffect, useState } from 'react';
import { obtenerCasos, type CasoClinicoApi } from '../servicios/servicioCasos';

export function useCasos() {
  const [casos, setCasos] = useState<CasoClinicoApi[]>([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let vivo = true;
    setCargando(true);
    obtenerCasos()
      .then((datos) => {
        if (vivo) setCasos(datos);
      })
      .catch(() => {
        if (vivo) setError('No se pudieron cargar los casos clínicos.');
      })
      .finally(() => {
        if (vivo) setCargando(false);
      });

    return () => {
      vivo = false;
    };
  }, []);

  return { casos, cargando, error };
}
