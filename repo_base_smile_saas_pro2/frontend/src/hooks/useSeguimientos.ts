import { useState, useEffect, useCallback } from 'react';
import { 
  obtenerSeguimientosPorPresupuesto, 
  crearSeguimiento, 
  eliminarSeguimiento, 
  type SeguimientoApi 
} from '../servicios/servicioSeguimientos';

export function useSeguimientos(presupuestoId: string | undefined) {
  const [seguimientos, setSeguimientos] = useState<SeguimientoApi[]>([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cargar = useCallback(async () => {
    if (!presupuestoId) return;
    setCargando(true);
    try {
      const data = await obtenerSeguimientosPorPresupuesto(presupuestoId);
      setSeguimientos(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('No se pudieron cargar los seguimientos.');
    } finally {
      setCargando(false);
    }
  }, [presupuestoId]);

  const registrar = async (dto: { comentario: string; proxima_accion?: string; fecha_accion?: string }) => {
    if (!presupuestoId) return;
    try {
      await crearSeguimiento({
        presupuesto_id: presupuestoId,
        ...dto
      });
      await cargar();
    } catch (err) {
      console.error(err);
      throw new Error('Error al registrar el seguimiento.');
    }
  };

  const eliminar = async (id: string) => {
    try {
      await eliminarSeguimiento(id);
      await cargar();
    } catch (err) {
      console.error(err);
      throw new Error('Error al eliminar el seguimiento.');
    }
  };

  useEffect(() => {
    cargar();
  }, [cargar]);

  return { 
    seguimientos, 
    cargando, 
    error, 
    registrar, 
    eliminar, 
    refrescar: cargar 
  };
}
