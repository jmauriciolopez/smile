import { PrismaClient, EstadoCaso, EstadoPresupuesto, RolUsuario } from '@prisma/client';

const prisma = new PrismaClient();

const PLANTILLAS = [
  {
    id: 'premium_square',
    nombre: 'Premium Square',
    categoria: 'Natural',
    parametros: {
      proporciones: { incisivoCentral: 1.0, incisivoLateral: 0.8, canino: 0.9 },
      forma: { tipo: 'square', suavidadBordes: 0.2 },
      curvaSonrisa: 0.5,
      exposicionDental: 0.7,
      simetria: 1.0,
      color: { blancura: 0.9, translucidez: 0.4, saturacion: 0.1, opalescencia: 0.5, rugosidad: 0.1 }
    }
  },
  {
    id: 'oval_soft',
    nombre: 'Oval Soft',
    categoria: 'Femenina',
    parametros: {
      proporciones: { incisivoCentral: 1.05, incisivoLateral: 0.75, canino: 0.85 },
      forma: { tipo: 'oval', suavidadBordes: 0.8 },
      curvaSonrisa: 0.8,
      exposicionDental: 0.8,
      simetria: 1.0,
      color: { blancura: 0.8, translucidez: 0.5, saturacion: 0.2, opalescencia: 0.6, rugosidad: 0.2 }
    }
  }
];

function crearBlueprintSeed(frontalUrl: string, lateralUrl: string, retratoUrl: string) {
  return JSON.stringify({
    id: `design-${Math.random().toString(36).substring(7)}`,
    version: 1,
    metadata: {
      creadoEn: new Date().toISOString(),
      actualizadoEn: new Date().toISOString(),
      autorId: 'dr-lopez',
      estado: 'borrador'
    },
    canvas: { ancho: 1000, alto: 1000, zoom: 1, pan: { x: 0, y: 0 }, espacioColor: 'Display-P3' },
    cara: {
      puntos: [],
      anchoCara: 1000,
      altoCara: 1000,
      lineaMediaX: 500,
      lineaBipupilarY: 400,
      contornoLabios: [],
      labiosExterior: [],
      labiosInterior: []
    },
    vistaActivaId: 'vista-frontal',
    vistas: [
      { id: 'vista-frontal', tipo: 'frontal', fotoUrl: frontalUrl, activo: true, landmarks: [] },
      { id: 'vista-sonrisa', tipo: 'sonrisa', fotoUrl: frontalUrl, activo: false, landmarks: [] },
      { id: 'vista-reposo', tipo: 'reposo', fotoUrl: retratoUrl, activo: false, landmarks: [] },
      { id: 'vista-lateral', tipo: 'lateral', fotoUrl: lateralUrl, activo: false, landmarks: [] }
    ],
    capas: [
      { id: 'capa-img', tipo: 'imagen', visible: true, opacidad: 1, zIndex: 0 },
      { id: 'capa-labios', tipo: 'labios', visible: true, opacidad: 1, zIndex: 10 },
      { id: 'capa-dientes', tipo: 'dientes', visible: true, opacidad: 0.9, zIndex: 20 },
      { id: 'capa-guias', tipo: 'guias', visible: true, opacidad: 0.7, zIndex: 30 }
    ],
    dientes: [
      {
        id: 'diente-11', pieza: 11,
        posicion: { x: 450, y: 450 },
        dimensiones: { ancho: 8.5, alto: 11 },
        rotacion: 0,
        forma: 'rectangular',
        material: { colorBase: '#fcfaf2', translucidez: 0.6, reflectividad: 0.8, opalescencia: 0.7, fluorescencia: 0.3, rugosidad: 0.2, fresnel: 0.6, sss: 0.4, capaEsmalte: 0.5, capaDentina: 0.8 },
        transformacion: { rotacion: 0, escala: 1 },
        transformacion3D: { rotX: 0, rotY: 0, rotZ: 0, posX: 0, posY: 0, posZ: 0, escala: 1 }
      },
      {
        id: 'diente-21', pieza: 21,
        posicion: { x: 550, y: 450 },
        dimensiones: { ancho: 8.5, alto: 11 },
        rotacion: 0,
        forma: 'rectangular',
        material: { colorBase: '#fcfaf2', translucidez: 0.6, reflectividad: 0.8, opalescencia: 0.7, fluorescencia: 0.3, rugosidad: 0.2, fresnel: 0.6, sss: 0.4, capaEsmalte: 0.5, capaDentina: 0.8 },
        transformacion: { rotacion: 0, escala: 1 },
        transformacion3D: { rotX: 0, rotY: 0, rotZ: 0, posX: 0, posY: 0, posZ: 0, escala: 1 }
      }
    ],
    guias: [
      { id: 'guia-media', tipo: 'media', visible: true, valor: { x: 500 } },
      { id: 'guia-sonrisa', tipo: 'sonrisa', visible: true, valor: { curva: 1.2, y: 450 } }
    ],
    historial: [],
    indiceHistorial: -1,
    configuracion: { opacidadLabios: 1, modoVisual: 'humedo' }
  });
}

async function main() {
  console.log('🌱 Iniciando Seeding Premium (v2)...');

  // Limpieza
  await prisma.disenoSonrisa.deleteMany();
  await prisma.seguimientoComercial.deleteMany();
  await prisma.opcionTratamiento.deleteMany();
  await prisma.presupuesto.deleteMany();
  await prisma.notaClinica.deleteMany();
  await prisma.fotoClinica.deleteMany();
  await prisma.signatureDesign.deleteMany();
  await prisma.cBCTStudy.deleteMany();
  await prisma.casoClinico.deleteMany();
  await prisma.paciente.deleteMany();
  await prisma.usuario.deleteMany();

  // Usuarios
  const drLopez = await prisma.usuario.create({
    data: {
      nombre_completo: 'Dr. Mauricio López',
      email: 'mauricio@smilepro.com',
      contrasena_hash: 'hashed_password_here',
      rol: RolUsuario.odontologo,
      activo: true
    }
  });

  // Pacientes
  const laura = await prisma.paciente.create({
    data: {
      nombre_completo: 'Laura Pérez',
      email: 'laura.p@gmail.com',
      telefono: '+54 9 11 5555-4444',
      estado_paciente: 'en_evaluacion'
    }
  });

  const elena = await prisma.paciente.create({
    data: {
      nombre_completo: 'Elena Rodríguez',
      email: 'elena.rodriguez@outlook.com',
      telefono: '+54 9 11 3333-2222',
      estado_paciente: 'nuevo'
    }
  });

  // Casos y Diseños
  const casoLaura = await prisma.casoClinico.create({
    data: {
      paciente_id: laura.id,
      usuario_responsable_id: drLopez.id,
      titulo: 'Rehabilitación Estética Superior',
      motivo_consulta: 'Mejora de color y forma',
      estado_caso: EstadoCaso.en_evaluacion,
      disenos: {
        create: {
          ajustes_json: crearBlueprintSeed('/seed/frontal_antes.png', '/seed/lateral_izq.png', '/seed/retrato_completo.png'),
          activo: true
        }
      }
    }
  });

  const casoElena = await prisma.casoClinico.create({
    data: {
      paciente_id: elena.id,
      usuario_responsable_id: drLopez.id,
      titulo: 'Diseño de Sonrisa Completo',
      motivo_consulta: 'Boda próxima, quiere sonrisa perfecta',
      estado_caso: EstadoCaso.con_presupuesto_emitido,
      disenos: {
        create: {
          ajustes_json: crearBlueprintSeed('/seed/frontal_antes.png', '/seed/lateral_izq.png', '/seed/retrato_completo.png'),
          activo: true
        }
      }
    }
  });

  // Plantillas
  for (const p of PLANTILLAS) {
    await prisma.plantillaSonrisa.upsert({
      where: { id: p.id },
      update: { nombre: p.nombre, categoria: p.categoria, parametros: p.parametros as any },
      create: { id: p.id, nombre: p.nombre, categoria: p.categoria, parametros: p.parametros as any }
    });
  }

  console.log('✅ Base de datos poblada con éxito.');
}

main()
  .then(async () => { await prisma.$disconnect(); })
  .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); });
