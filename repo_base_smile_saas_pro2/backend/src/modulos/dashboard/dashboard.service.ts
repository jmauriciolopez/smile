import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async obtenerResumen() {
    const [pacientes, casos, presupuestos] = await Promise.all([
      this.prisma.paciente.count(),
      this.prisma.casoClinico.count({ where: { estado_caso: { not: 'cerrado' } } }),
      this.prisma.presupuesto.count({ where: { estado_presupuesto: 'pendiente' as any } }), // 'pendiente' o lo que corresponda
    ]);

    // Ajustamos los estados segun el enum del schema si es necesario
    const presupuestosPendientes = await this.prisma.presupuesto.count({
      where: {
        estado_presupuesto: {
          in: ['borrador', 'presentado', 'en_seguimiento']
        }
      }
    });

    return {
      pacientes_totales: pacientes,
      casos_activos: casos,
      presupuestos_pendientes: presupuestosPendientes,
      ventas_mes: 0, // Placeholder para futura logica de facturacion
    };
  }
}
