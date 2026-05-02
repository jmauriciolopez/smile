import { useState, useEffect, useCallback } from "react";
import {
  obtenerFotosPorCaso,
  registrarFoto,
  eliminarFoto,
  type FotoApi,
} from "../servicios/servicioFotos";

export function useFotos(casoId: string | undefined) {
  const [fotos, setFotos] = useState<FotoApi[]>([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cargar = useCallback(async () => {
    if (!casoId) return;
    setCargando(true);
    try {
      const data = await obtenerFotosPorCaso(casoId);
      setFotos(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar las fotos.");
    } finally {
      setCargando(false);
    }
  }, [casoId]);

  const subir = async (url: string, tipo: string) => {
    if (!casoId) return;
    try {
      await registrarFoto({ caso_clinico_id: casoId, url_foto: url, tipo });
      await cargar();
    } catch (err) {
      console.error(err);
      throw new Error("Error al registrar la foto.");
    }
  };

  const eliminar = async (id: string) => {
    try {
      await eliminarFoto(id);
      await cargar();
    } catch (err) {
      console.error(err);
      throw new Error("Error al eliminar la foto.");
    }
  };

  useEffect(() => {
    cargar();
  }, [cargar]);

  return { fotos, cargando, error, subir, eliminar, refrescar: cargar };
}
