import { PrismaClient, EstadoPaciente, EstadoCaso, EstadoPresupuesto, RolUsuario } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const hash = await bcrypt.hash('admin123', 10);

  const usuario = await prisma.usuario.upsert({
    where: { email: 'admin@smilesaas.local' },
    update: {},
    create: {
      nombre_completo: 'Administrador Demo',
      email: 'admin@smilesaas.local',
      contrasena_hash: hash,
      rol: RolUsuario.administrador,
    },
  });

  const laura = await prisma.paciente.upsert({
    where: { id: 'p1-demo' },
    update: {},
    create: {
      id: 'p1-demo',
      nombre_completo: 'Laura Pérez',
      email: 'laura@demo.com',
      telefono: '+54 9 351 555 1111',
      ciudad: 'Córdoba',
      estado_paciente: EstadoPaciente.con_presupuesto,
    },
  });

  const martin = await prisma.paciente.upsert({
    where: { id: 'p2-demo' },
    update: {},
    create: {
      id: 'p2-demo',
      nombre_completo: 'Martín Gómez',
      email: 'martin@demo.com',
      telefono: '+54 9 351 555 2222',
      ciudad: 'Córdoba',
      estado_paciente: EstadoPaciente.con_diseno,
    },
  });

  const casoLaura = await prisma.casoClinico.upsert({
    where: { id: 'c1-demo' },
    update: {},
    create: {
      id: 'c1-demo',
      paciente_id: laura.id,
      usuario_responsable_id: usuario.id,
      titulo: 'Carillas superiores',
      motivo_consulta: 'Mejorar estética frontal',
      estado_caso: EstadoCaso.con_diseno_aprobado,
    },
  });

  await prisma.casoClinico.upsert({
    where: { id: 'c2-demo' },
    update: {},
    create: {
      id: 'c2-demo',
      paciente_id: martin.id,
      usuario_responsable_id: usuario.id,
      titulo: 'Rehabilitación estética',
      motivo_consulta: 'Diseño de sonrisa integral',
      estado_caso: EstadoCaso.con_diseno_borrador,
    },
  });

  const presupuestoLaura = await prisma.presupuesto.upsert({
    where: { id: 'pr1-demo' },
    update: {},
    create: {
      id: 'pr1-demo',
      paciente_id: laura.id,
      caso_clinico_id: casoLaura.id,
      estado_presupuesto: EstadoPresupuesto.presentado,
      monto_total_estimado: 2400,
      cantidad_cuotas: 6,
    },
  });

  // Fotos Clínicas Demo para Laura
  await prisma.fotoClinica.createMany({
    data: [
      {
        caso_clinico_id: casoLaura.id,
        url_foto: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=800',
        tipo: 'frontal'
      },
      {
        caso_clinico_id: casoLaura.id,
        url_foto: 'https://images.unsplash.com/photo-1554151228-14d9def656ec?auto=format&fit=crop&q=80&w=800',
        tipo: 'perfil'
      }
    ]
  });

  // Diseño de Sonrisa Demo para Laura
  await prisma.disenoSonrisa.create({
    data: {
      caso_clinico_id: casoLaura.id,
      ajustes_json: JSON.stringify({
        ancho: 58,
        alto: 20,
        posicionX: 0,
        posicionY: -2,
        intensidad: 85,
        preset: 'premium'
      }),
      activo: true
    }
  });

  console.log('✅ Base de datos poblada con datos premium');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
