import { Card } from '../../../componentes/ui/Card';

export function DashboardPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-semibold">Dashboard</h1>
        <p className="mt-1 text-textoSecundario">Resumen operativo y comercial.</p>
      </header>

      <div className="grid gap-4 md:grid-cols-4">
        <Card titulo="Pacientes activos"><div className="text-3xl font-bold">24</div></Card>
        <Card titulo="Casos abiertos"><div className="text-3xl font-bold">12</div></Card>
        <Card titulo="Presupuestos"><div className="text-3xl font-bold">8</div></Card>
        <Card titulo="Seguimientos"><div className="text-3xl font-bold">6</div></Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card titulo="Actividad reciente">
          <ul className="space-y-3 text-sm text-textoSecundario">
            <li>Se guardó un nuevo diseño para Laura Pérez</li>
            <li>Se presentó presupuesto a Martín Gómez</li>
            <li>Hay una próxima acción para Valentina Díaz</li>
          </ul>
        </Card>
        <Card titulo="Próximas acciones">
          <ul className="space-y-3 text-sm text-textoSecundario">
            <li>Llamar a Laura Pérez — mañana 10:00</li>
            <li>Revisar diseño de Martín Gómez</li>
            <li>Enviar propuesta a Sofía Ramírez</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
