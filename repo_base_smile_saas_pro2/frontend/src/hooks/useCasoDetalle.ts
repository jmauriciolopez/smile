import { useEffect, useState } from 'react';
import { obtenerCasoPorId, type CasoClinicoApi } from '../servicios/servicioCasos';

export function useCasoDetalle(id: string | undefined) {
  const [caso, setCaso] = useState<CasoClinicoApi | null>(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cargarDatos = () => {
    if (!id) return;
    setCargando(true);
    obtenerCasoPorId(id)
      .then((datos) => {
        setCaso(datos);
      })
      .catch(() => {
        setError('No se pudo cargar el detalle del caso clínico.');
      })
      .finally(() => {
        setCargando(false);
      });
  };

  useEffect(() => {
    cargarDatos();
  }, [id]);

  return { caso, cargando, error, refrescar: cargarDatos };
}
