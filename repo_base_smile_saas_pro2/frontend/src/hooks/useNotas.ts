import { useState, useEffect, useCallback } from 'react';
import { 
  obtenerNotasPorCaso, 
  crearNota, 
  eliminarNota, 
  type NotaApi 
} from '../servicios/servicioNotas';

export function useNotas(casoId: string | undefined) {
  const [notas, setNotas] = useState<NotaApi[]>([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cargar = useCallback(async () => {
    if (!casoId) return;
    setCargando(true);
    try {
      const data = await obtenerNotasPorCaso(casoId);
      setNotas(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('No se pudieron cargar las notas.');
    } finally {
      setCargando(false);
    }
  }, [casoId]);

  const agregar = async (contenido: string) => {
    if (!casoId) return;
    try {
      await crearNota({ caso_clinico_id: casoId, contenido });
      await cargar();
    } catch (err) {
      console.error(err);
      throw new Error('Error al crear la nota.');
    }
  };

  const eliminar = async (id: string) => {
    try {
      await eliminarNota(id);
      await cargar();
    } catch (err) {
      console.error(err);
      throw new Error('Error al eliminar la nota.');
    }
  };

  useEffect(() => {
    cargar();
  }, [cargar]);

  return { notas, cargando, error, agregar, eliminar, refrescar: cargar };
}
