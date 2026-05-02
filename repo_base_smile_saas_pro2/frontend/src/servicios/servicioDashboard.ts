import { clienteApi } from "./clienteApi";

export type ResumenDashboardApi = {
  pacientes_totales: number;
  casos_activos: number;
  presupuestos_pendientes: number;
  ventas_mes: number;
};

export async function obtenerResumenDashboard() {
  return clienteApi<ResumenDashboardApi>("/dashboard/resumen");
}
