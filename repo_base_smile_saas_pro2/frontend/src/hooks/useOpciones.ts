import { useState } from "react";
import { 
  actualizarPresupuesto, 
  crearOpcionTratamiento, 
  actualizarOpcionTratamiento, 
  eliminarOpcionTratamiento,
  OpcionTratamientoData
} from "../servicios/servicioPresupuestos";

export function useOpciones(
  presupuestoId: string | undefined,
  alActualizar?: () => void,
) {
  const [procesando, setProcesando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const seleccionarPlan = async (monto: number) => {
    if (!presupuestoId) return;

    setProcesando(true);
    setError(null);
    try {
      await actualizarPresupuesto(presupuestoId, {
        monto_total_estimado: monto,
        estado_presupuesto: "aprobado",
      });

      if (alActualizar) {
        alActualizar();
      }
    } catch (err) {
      console.error(err);
      setError("No se pudo confirmar la selección del plan.");
      throw err;
    } finally {
      setProcesando(false);
    }
  };

  const agregarPlan = async (data: OpcionTratamientoData) => {
    if (!presupuestoId) return;
    setProcesando(true);
    setError(null);
    try {
      await crearOpcionTratamiento(presupuestoId, data);
      if (alActualizar) alActualizar();
    } catch (err) {
      console.error(err);
      setError("No se pudo agregar el plan de tratamiento.");
      throw err;
    } finally {
      setProcesando(false);
    }
  };

  const editarPlan = async (opcionId: string, data: Partial<OpcionTratamientoData>) => {
    setProcesando(true);
    setError(null);
    try {
      await actualizarOpcionTratamiento(opcionId, data);
      if (alActualizar) alActualizar();
    } catch (err) {
      console.error(err);
      setError("No se pudo actualizar el plan de tratamiento.");
      throw err;
    } finally {
      setProcesando(false);
    }
  };

  const eliminarPlan = async (opcionId: string) => {
    setProcesando(true);
    setError(null);
    try {
      await eliminarOpcionTratamiento(opcionId);
      if (alActualizar) alActualizar();
    } catch (err) {
      console.error(err);
      setError("No se pudo eliminar el plan de tratamiento.");
      throw err;
    } finally {
      setProcesando(false);
    }
  };

  return { seleccionarPlan, agregarPlan, editarPlan, eliminarPlan, procesando, error };
}
