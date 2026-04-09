import { useEffect, useState } from 'react';
import { obtenerPresupuestoPorId, type PresupuestoApi } from '../servicios/servicioPresupuestos';

export function usePresupuestoDetalle(id: string | undefined) {
  const [presupuesto, setPresupuesto] = useState<PresupuestoApi | null>(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cargarDatos = () => {
    if (!id) return;
    setCargando(true);
    obtenerPresupuestoPorId(id)
      .then((datos) => {
        setPresupuesto(datos);
      })
      .catch(() => {
        setError('No se pudo cargar el detalle del presupuesto.');
      })
      .finally(() => {
        setCargando(false);
      });
  };

  useEffect(() => {
    cargarDatos();
  }, [id]);

  return { presupuesto, cargando, error, refrescar: cargarDatos };
}
