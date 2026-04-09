import { PrismaClient, EstadoPaciente, EstadoCaso, EstadoPresupuesto, RolUsuario } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando Seeding Premium...');
  
  const hash = await bcrypt.hash('admin123', 10);

  // 1. Usuarios Profesionales
  const drLopez = await prisma.usuario.upsert({
    where: { email: 'admin@smilesaas.local' },
    update: {},
    create: {
      nombre_completo: 'Dr. Mauricio Lopez',
      email: 'admin@smilesaas.local',
      contrasena_hash: hash,
      rol: RolUsuario.administrador,
    },
  });

  const draSosa = await prisma.usuario.upsert({
    where: { email: 'sosa@smilesaas.local' },
    update: {},
    create: {
      nombre_completo: 'Dra. Valentina Sosa',
      email: 'sosa@smilesaas.local',
      contrasena_hash: hash,
      rol: RolUsuario.odontologo,
    },
  });

  // 2. Pacientes con Historias Reales
  const laura = await prisma.paciente.create({
    data: {
      nombre_completo: 'Laura Pérez',
      email: 'laura.p@gmail.com',
      telefono: '+54 9 351 555 1111',
      ciudad: 'Córdoba Capital',
      observaciones_generales: 'Paciente interesada en mejorar estética frontal por evento próximo (boda).',
      estado_paciente: EstadoPaciente.en_seguimiento,
    },
  });

  const martin = await prisma.paciente.create({
    data: {
      nombre_completo: 'Martín Gómez',
      email: 'm.gomez88@yahoo.com',
      telefono: '+54 9 351 555 2222',
      ciudad: 'Villa Allende',
      estado_paciente: EstadoPaciente.con_diseno,
    },
  });

  const sofia = await prisma.paciente.create({
    data: {
      nombre_completo: 'Sofía Ramírez',
      email: 'sramirez@outlook.com',
      telefono: '+54 9 351 555 3333',
      estado_paciente: EstadoPaciente.nuevo,
    },
  });

  // 3. Casos Clínicos Detallados
  const casoLaura = await prisma.casoClinico.create({
    data: {
      paciente_id: laura.id,
      usuario_responsable_id: drLopez.id,
      titulo: 'Diseño de Sonrisa Superior (Carillas)',
      motivo_consulta: 'Desea cerrar diastemas y mejorar el tono de los incisivos centrales.',
      estado_caso: EstadoCaso.con_presupuesto_emitido,
      fotos: {
        create: [
          { url_foto: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=800', tipo: 'frontal' },
          { url_foto: 'https://images.unsplash.com/photo-1554151228-14d9def656ec?auto=format&fit=crop&q=80&w=800', tipo: 'lateral_derecha' }
        ]
      },
      notas: {
        create: [
          { contenido: 'Se observa leve asimetría en encía marginal de pieza 11. Se sugiere gingivoplastía.' },
          { contenido: 'Paciente prefiere tono BL2 para el diseño final.' }
        ]
      },
      disenos: {
        create: {
          ajustes_json: JSON.stringify({ ancho: 60, alto: 22, posicionX: 0, posicionY: -1, intensidad: 90, preset: 'premium_square' }),
          activo: true
        }
      }
    }
  });

  // 4. Presupuestos y Opciones de Tratamiento
  const presupLaura = await prisma.presupuesto.create({
    data: {
      paciente_id: laura.id,
      caso_clinico_id: casoLaura.id,
      estado_presupuesto: EstadoPresupuesto.en_seguimiento,
      monto_total_estimado: 2800,
      cantidad_cuotas: 12,
      opciones: {
        create: [
          { titulo: 'Plan Estético Essential', descripcion: '6 Carillas de composite Inyectado de alta densidad.', monto: 1800, recomendada: false },
          { titulo: 'Plan Estético Premium', descripcion: '6 Carillas de porcelana disilicato de litio (E-max). Incluye gingivoplastía.', monto: 2800, recomendada: true },
          { titulo: 'Plan Hollywood Smile', descripcion: '10 Carillas de porcelana + Blanqueamiento inferior.', monto: 4200, recomendada: false }
        ]
      },
      seguimientos: {
        create: [
          { comentario: 'Se presentó presupuesto vía Zoom. Paciente interesada en el plan Premium.', proxima_accion: 'Llamar para coordinar entrega de seña', fecha_accion: new Date(Date.now() + 86400000) },
          { comentario: 'Consulta sobre financiación. Se autorizaron 12 cuotas sin interés.' }
        ]
      }
    }
  });

  console.log('✅ Base de datos poblada con éxito.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
