import { Card } from '../../../componentes/ui/Card';

export function SeguimientosPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-semibold">Seguimientos</h1>
        <p className="mt-1 text-textoSecundario">Registro comercial y próximas acciones.</p>
      </header>

      <Card titulo="Timeline comercial">
        <ul className="space-y-3 text-sm text-textoSecundario">
          <li>Laura Pérez — llamar mañana 10:00</li>
          <li>Martín Gómez — presupuesto en evaluación</li>
          <li>Sofía Ramírez — enviar recordatorio</li>
        </ul>
      </Card>
    </div>
  );
}
