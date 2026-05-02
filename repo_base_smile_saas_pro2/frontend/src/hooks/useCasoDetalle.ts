import { useEffect, useState, useCallback } from "react";
import {
  obtenerCasoPorId,
  actualizarCaso,
  type CasoClinicoApi,
} from "../servicios/servicioCasos";

export function useCasoDetalle(id: string | undefined) {
  const [caso, setCaso] = useState<CasoClinicoApi | null>(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cargarDatos = useCallback(() => {
    if (!id) return;
    setCargando(true);
    obtenerCasoPorId(id)
      .then((datos) => {
        setCaso(datos);
        setError(null);
      })
      .catch(() => {
        setError("No se pudo cargar el detalle del caso clínico.");
      })
      .finally(() => {
        setCargando(false);
      });
  }, [id]);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  const actualizar = async (datos: Partial<CasoClinicoApi>) => {
    if (!id) return;
    try {
      const actualizado = await actualizarCaso(id, datos);
      setCaso(actualizado);
      return actualizado;
    } catch (err) {
      console.error(err);
      throw new Error("No se pudo actualizar el caso clínico.");
    }
  };

  return { caso, cargando, error, refrescar: cargarDatos, actualizar };
}
