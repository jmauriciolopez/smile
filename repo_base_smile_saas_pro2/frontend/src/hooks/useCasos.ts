import { useEffect, useState, useCallback } from 'react';
import { obtenerCasos, crearCaso, type CasoClinicoApi } from '../servicios/servicioCasos';

export function useCasos() {
  const [casos, setCasos] = useState<CasoClinicoApi[]>([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cargarDatos = useCallback(() => {
    let vivo = true;
    setCargando(true);
    obtenerCasos()
      .then((datos) => {
        if (vivo) {
          setCasos(datos);
          setError(null);
        }
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

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  const crear = async (datos: import('../servicios/servicioCasos').CrearCasoData) => {
    try {
      const nuevo = await crearCaso(datos);
      setCasos((prev) => [nuevo, ...prev]);
      return nuevo;
    } catch (err) {
      console.error(err);
      throw new Error('No se pudo crear el caso clínico.');
    }
  };

  return { casos, cargando, error, crear, refrescar: cargarDatos };
}


