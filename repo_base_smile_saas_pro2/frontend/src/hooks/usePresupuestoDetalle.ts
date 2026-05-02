import { useEffect, useState, useCallback } from "react";
import {
  obtenerPresupuestoPorId,
  actualizarPresupuesto,
  type PresupuestoApi,
} from "../servicios/servicioPresupuestos";

export function usePresupuestoDetalle(id: string | undefined) {
  const [presupuesto, setPresupuesto] = useState<PresupuestoApi | null>(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cargarDatos = useCallback(() => {
    if (!id) return;
    setCargando(true);
    obtenerPresupuestoPorId(id)
      .then((datos) => {
        setPresupuesto(datos);
        setError(null);
      })
      .catch(() => {
        setError("No se pudo cargar el detalle del presupuesto.");
      })
      .finally(() => {
        setCargando(false);
      });
  }, [id]);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  const actualizar = async (data: Partial<PresupuestoApi>) => {
    if (!id) return;
    try {
      const actualizado = await actualizarPresupuesto(id, data);
      setPresupuesto(actualizado);
      return actualizado;
    } catch (err) {
      console.error(err);
      throw new Error("Error al actualizar el presupuesto.");
    }
  };

  return { presupuesto, cargando, error, refrescar: cargarDatos, actualizar };
}
