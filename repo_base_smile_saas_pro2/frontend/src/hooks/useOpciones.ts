import { useState } from "react";
import { actualizarPresupuesto } from "../servicios/servicioPresupuestos";

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
      // Al seleccionar un plan, actualizamos el monto total del presupuesto
      // y cambiamos el estado a 'aprobado' para reflejar la aceptación comercial.
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

  return { seleccionarPlan, procesando, error };
}
