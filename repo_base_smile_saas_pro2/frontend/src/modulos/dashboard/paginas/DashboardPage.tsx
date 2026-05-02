import { Card } from "../../../componentes/ui/Card";
import { useDashboard } from "../../../hooks/useDashboard";
import { useAutenticacionStore } from "../../../store/autenticacion.store";

export function DashboardPage() {
  const { resumen, cargando } = useDashboard();
  const usuario = useAutenticacionStore((s) => s.usuario);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-700">
      <header className="flex items-end justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">
            {usuario?.rol === "odontologo" || usuario?.rol === "administrador"
              ? "¡Hola Doc!"
              : "¡Hola!"}{" "}
            {usuario?.nombre_completo}
          </h1>
          <p className="mt-2 text-lg text-textoSecundario font-medium">
            Este es el resumen operativo de tu clínica hoy.
          </p>
        </div>
        <div className="hidden pb-1 text-sm font-bold text-primario md:block">
          {new Date().toLocaleDateString("es-ES", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>
      </header>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[
          {
            titulo: "Pacientes Totales",
            valor: resumen?.pacientes_totales,
            color: "text-primario",
            bg: "bg-primario/[0.03]",
            icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z",
          },
          {
            titulo: "Casos Activos",
            valor: resumen?.casos_activos,
            color: "text-indigo-600",
            bg: "bg-indigo-50/50",
            icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01",
          },
          {
            titulo: "Presupuestos Emitidos",
            valor: resumen?.presupuestos_pendientes,
            color: "text-emerald-600",
            bg: "bg-emerald-50/50",
            icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.407 2.67 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.407-2.67-1M12 16v1m4-12l-1 1m-10 0l1-1",
          },
          {
            titulo: "Tasa de Conversión",
            valor: "78%",
            color: "text-amber-600",
            bg: "bg-amber-50/50",
            icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6",
          },
        ].map((stat) => (
          <div
            key={stat.titulo}
            className={`relative overflow-hidden rounded-3xl border border-slate-100 ${stat.bg} p-6 transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-slate-200/50`}
          >
            <div className="flex items-center justify-between">
              <div className={`rounded-xl ${stat.bg} p-2 ${stat.color}`}>
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d={stat.icon}
                  />
                </svg>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">
                {stat.titulo}
              </p>
              <div className={`mt-1 text-4xl font-black ${stat.color}`}>
                {cargando ? "..." : (stat.valor ?? 0)}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card titulo="Actividad del Flujo de Pacientes">
          <div className="space-y-6 pt-2">
            {[
              {
                text: "Se guardó un nuevo diseño digital para Laura Pérez",
                time: "hace 5m",
                active: true,
              },
              {
                text: "Presupuesto #1024 aceptado por Martín Gómez",
                time: "hace 2h",
                active: false,
              },
              {
                text: " Valentina Díaz completó la carga de fotos clínicas",
                time: "hace 5h",
                active: false,
              },
              {
                text: "Nueva consulta recibida vía web (Sistema externo)",
                time: "ayer",
                active: false,
              },
            ].map((item, idx) => (
              <div key={idx} className="flex gap-4">
                <div
                  className={`mt-1.5 h-2 w-2 flex-shrink-0 rounded-full ${item.active ? "bg-primario ring-4 ring-primario/20" : "bg-slate-300"}`}
                />
                <div className="space-y-1">
                  <p
                    className={`text-sm ${item.active ? "font-bold text-slate-900" : "text-slate-600"}`}
                  >
                    {item.text}
                  </p>
                  <p className="text-xs text-slate-400 font-medium">
                    {item.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card titulo="Pendientes de Gestión Comercial">
          <div className="space-y-4">
            {[
              {
                name: "Laura Pérez",
                action: "Llamar para cierre de tratamiento",
                target: "Mañana 10:00",
                priority: "alta",
              },
              {
                name: "Martín Gómez",
                action: "Enviar propuesta PDF corregida",
                target: "Hoy 18:00",
                priority: "media",
              },
              {
                name: "Sofía Ramírez",
                action: "Agendar segunda consulta estética",
                target: "Viernes",
                priority: "baja",
              },
            ].map((task) => (
              <div
                key={task.name}
                className="flex items-center justify-between rounded-2xl bg-slate-50 p-4 transition-colors hover:bg-slate-100"
              >
                <div>
                  <div className="text-sm font-bold text-slate-900">
                    {task.name}
                  </div>
                  <div className="text-xs text-slate-500 font-medium">
                    {task.action}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-black uppercase text-primario">
                    {task.target}
                  </div>
                  <div
                    className={`mt-1 h-1 w-full rounded-full ${task.priority === "alta" ? "bg-red-400" : task.priority === "media" ? "bg-amber-400" : "bg-emerald-400"}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
