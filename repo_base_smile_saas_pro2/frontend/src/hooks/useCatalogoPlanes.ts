import { useState, useCallback, useEffect } from "react";
import {
  obtenerCatalogoPlanes,
  crearCatalogoPlan,
  actualizarCatalogoPlan,
  eliminarCatalogoPlan,
  CatalogoPlanData,
} from "../servicios/servicioCatalogoPlanes";

export function useCatalogoPlanes() {
  const [planes, setPlanes] = useState<CatalogoPlanData[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cargarPlanes = useCallback(async () => {
    try {
      setCargando(true);
      setError(null);
      const data = await obtenerCatalogoPlanes();
      setPlanes(data);
    } catch (err: any) {
      setError(err.message || "Error al cargar el catálogo de planes.");
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargarPlanes();
  }, [cargarPlanes]);

  const agregarPlanGlobal = async (data: Omit<CatalogoPlanData, "id" | "activo">) => {
    const nuevo = await crearCatalogoPlan(data);
    setPlanes((prev) => [...prev, nuevo]);
    return nuevo;
  };

  const editarPlanGlobal = async (id: string, data: Partial<CatalogoPlanData>) => {
    const actualizado = await actualizarCatalogoPlan(id, data);
    setPlanes((prev) => prev.map((p) => (p.id === id ? actualizado : p)));
    return actualizado;
  };

  const eliminarPlanGlobal = async (id: string) => {
    await eliminarCatalogoPlan(id);
    setPlanes((prev) => prev.filter((p) => p.id !== id));
  };

  return {
    planes,
    cargando,
    error,
    recargar: cargarPlanes,
    agregarPlanGlobal,
    editarPlanGlobal,
    eliminarPlanGlobal,
  };
}
