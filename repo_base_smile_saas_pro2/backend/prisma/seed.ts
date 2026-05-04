import {
  PrismaClient,
  EstadoPaciente,
  EstadoCaso,
  EstadoPresupuesto,
  RolUsuario,
} from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PLANTILLAS } from './plantillas.seed';

const prisma = new PrismaClient();

// ── Blueprint realista para seed ─────────────────────────────────────────────
function crearBlueprintSeed(
  frontalUrl: string,
  lateralUrl: string,
  retratoUrl: string,
) {
  return JSON.stringify({
    id: `design-${Math.random().toString(36).substring(7)}`,
    version: 1,
    metadata: {
      creadoEn: new Date().toISOString(),
      actualizadoEn: new Date().toISOString(),
      autorId: 'dr-lopez',
      estado: 'borrador',
      notasClinicas: '',
    },
    canvas: {
      ancho: 1000,
      alto: 1000,
      zoom: 1,
      pan: { x: 0, y: 0 },
      espacioColor: 'Display-P3',
    },
    cara: {
      puntos: [],
      anchoCara: 1000,
      altoCara: 1000,
      lineaMediaX: 500,
      lineaBipupilarY: 400,
      contornoLabios: [],
      labiosExterior: [],
      labiosInterior: [],
    },
    vistaActivaId: 'vista-frontal',
    vistas: [
      {
        id: 'vista-frontal',
        tipo: 'frontal',
        fotoUrl: frontalUrl,
        activo: true,
        transformacion: { zoom: 1, pan: { x: 0, y: 0 } },
        capasVisibles: ['capa-img', 'capa-labios', 'capa-dientes', 'capa-guias'],
      },
      {
        id: 'vista-sonrisa',
        tipo: 'sonrisa',
        fotoUrl: frontalUrl,
        activo: false,
        transformacion: { zoom: 1, pan: { x: 0, y: 0 } },
        capasVisibles: ['capa-img', 'capa-labios', 'capa-dientes', 'capa-guias'],
      },
      {
        id: 'vista-reposo',
        tipo: 'reposo',
        fotoUrl: retratoUrl,
        activo: false,
        transformacion: { zoom: 1, pan: { x: 0, y: 0 } },
        capasVisibles: ['capa-img', 'capa-labios', 'capa-dientes', 'capa-guias'],
      },
      {
        id: 'vista-lateral',
        tipo: 'lateral',
        fotoUrl: lateralUrl,
        activo: false,
        transformacion: { zoom: 1, pan: { x: 0, y: 0 } },
        capasVisibles: ['capa-img', 'capa-labios', 'capa-dientes', 'capa-guias'],
      },
    ],
    capas: [
      { id: 'capa-img', tipo: 'imagen', visible: true, opacidad: 1, zIndex: 0 },
      { id: 'capa-labios', tipo: 'labios', visible: true, opacidad: 1, zIndex: 10 },
      { id: 'capa-dientes', tipo: 'dientes', visible: true, opacidad: 0.9, zIndex: 20 },
      { id: 'capa-guias', tipo: 'guias', visible: true, opacidad: 0.7, zIndex: 30 },
    ],
    dientes: [
      {
        id: 'diente-11',
        pieza: 11,
        posicion: { x: 450, y: 450 },
        dimensiones: { ancho: 8.5, alto: 11 },
        transformacion: { rotacion: 0, escala: 1 },
        transformacion3D: { rotX: 0, rotY: 0, rotZ: 0, posZ: 0, escala: 1 },
        material: {
          colorBase: '#fcfaf2',
          translucidez: 0.6,
          reflectividad: 0.8,
          brillo: 0.7,
          saturacion: 0.1,
          opalescencia: 0.7,
          fluorescencia: 0.3,
          rugosidad: 0.2,
          fresnel: 0.6,
          sss: 0.4,
          capaEsmalte: 0.5,
          capaDentina: 0.8,
        },
        geometria: {
          tipo: 'incisivo_central',
          pathSVG: 'M0,0 L8.5,0 L8.5,11 L0,11 Z',
        },
        visible: true,
      },
      {
        id: 'diente-21',
        pieza: 21,
        posicion: { x: 550, y: 450 },
        dimensiones: { ancho: 8.5, alto: 11 },
        transformacion: { rotacion: 0, escala: 1 },
        transformacion3D: { rotX: 0, rotY: 0, rotZ: 0, posZ: 0, escala: 1 },
        material: {
          colorBase: '#fcfaf2',
          translucidez: 0.6,
          reflectividad: 0.8,
          brillo: 0.7,
          saturacion: 0.1,
          opalescencia: 0.7,
          fluorescencia: 0.3,
          rugosidad: 0.2,
          fresnel: 0.6,
          sss: 0.4,
          capaEsmalte: 0.5,
          capaDentina: 0.8,
        },
        geometria: {
          tipo: 'incisivo_central',
          pathSVG: 'M0,0 L8.5,0 L8.5,11 L0,11 Z',
        },
        visible: true,
      },
      {
        id: 'diente-12',
        pieza: 12,
        posicion: { x: 390, y: 455 },
        dimensiones: { ancho: 7, alto: 10 },
        transformacion: { rotacion: 0, escala: 1 },
        transformacion3D: { rotX: 0, rotY: 0, rotZ: 0, posZ: 0, escala: 1 },
        material: {
          colorBase: '#fdf9f0',
          translucidez: 0.65,
          reflectividad: 0.75,
          brillo: 0.65,
          saturacion: 0.12,
          opalescencia: 0.65,
          fluorescencia: 0.25,
          rugosidad: 0.25,
          fresnel: 0.55,
          sss: 0.45,
          capaEsmalte: 0.45,
          capaDentina: 0.75,
        },
        geometria: {
          tipo: 'incisivo_lateral',
          pathSVG: 'M0,0 L7,0 L7,10 L0,10 Z',
        },
        visible: true,
      },
      {
        id: 'diente-22',
        pieza: 22,
        posicion: { x: 610, y: 455 },
        dimensiones: { ancho: 7, alto: 10 },
        transformacion: { rotacion: 0, escala: 1 },
        transformacion3D: { rotX: 0, rotY: 0, rotZ: 0, posZ: 0, escala: 1 },
        material: {
          colorBase: '#fdf9f0',
          translucidez: 0.65,
          reflectividad: 0.75,
          brillo: 0.65,
          saturacion: 0.12,
          opalescencia: 0.65,
          fluorescencia: 0.25,
          rugosidad: 0.25,
          fresnel: 0.55,
          sss: 0.45,
          capaEsmalte: 0.45,
          capaDentina: 0.75,
        },
        geometria: {
          tipo: 'incisivo_lateral',
          pathSVG: 'M0,0 L7,0 L7,10 L0,10 Z',
        },
        visible: true,
      },
      {
        id: 'diente-13',
        pieza: 13,
        posicion: { x: 335, y: 460 },
        dimensiones: { ancho: 7.5, alto: 11.5 },
        transformacion: { rotacion: 0, escala: 1 },
        transformacion3D: { rotX: 0, rotY: 0, rotZ: 0, posZ: 0, escala: 1 },
        material: {
          colorBase: '#fdf6e8',
          translucidez: 0.5,
          reflectividad: 0.7,
          brillo: 0.6,
          saturacion: 0.18,
          opalescencia: 0.55,
          fluorescencia: 0.2,
          rugosidad: 0.3,
          fresnel: 0.5,
          sss: 0.35,
          capaEsmalte: 0.4,
          capaDentina: 0.85,
        },
        geometria: {
          tipo: 'canino',
          pathSVG: 'M0,0 L7.5,0 L7.5,11.5 L0,11.5 Z',
        },
        visible: true,
      },
      {
        id: 'diente-23',
        pieza: 23,
        posicion: { x: 665, y: 460 },
        dimensiones: { ancho: 7.5, alto: 11.5 },
        transformacion: { rotacion: 0, escala: 1 },
        transformacion3D: { rotX: 0, rotY: 0, rotZ: 0, posZ: 0, escala: 1 },
        material: {
          colorBase: '#fdf6e8',
          translucidez: 0.5,
          reflectividad: 0.7,
          brillo: 0.6,
          saturacion: 0.18,
          opalescencia: 0.55,
          fluorescencia: 0.2,
          rugosidad: 0.3,
          fresnel: 0.5,
          sss: 0.35,
          capaEsmalte: 0.4,
          capaDentina: 0.85,
        },
        geometria: {
          tipo: 'canino',
          pathSVG: 'M0,0 L7.5,0 L7.5,11.5 L0,11.5 Z',
        },
        visible: true,
      },
    ],
    guias: [
      { id: 'guia-media', tipo: 'media', visible: true, valor: { x: 500 } },
      { id: 'guia-sonrisa', tipo: 'sonrisa', visible: true, valor: { curva: 1.2, y: 450 } },
      { id: 'guia-labio', tipo: 'labio', visible: true, valor: { puntos: [] } },
      { id: 'guia-proporcion', tipo: 'proporcion', visible: false, valor: { escala: 1, x: 500 } },
    ],
    proporcionAurea: { visible: false, intensidad: 0.5, posicionX: 500 },
    analisisIA: {
      scoreEstetico: 0,
      sugerencias: ['Pendiente de análisis'],
      simetriaFacial: 1,
      desviacionLineaMedia: 0,
      cumplimientoProporcion: 0,
    },
    configuracion: {
      modoVisual: 'humedo',
      mostrarEncias: true,
      simularSombras: true,
      renderizadoGPU: true,
      unidadMedida: 'mm',
      opacidadLabios: 1,
    },
    historial: [],
    indiceHistorial: -1,
  });
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  console.log('🌱 Iniciando Seeding Premium (v2)...');

  const hash = await bcrypt.hash('admin123', 10);

  // ── 1. Usuarios — upsert para no romper sesiones existentes ──────────────
  // Los emails del seed original se preservan intactos.
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

  // Usuario adicional del seed v2 (email diferente, no colisiona)
  const drMauricio = await prisma.usuario.upsert({
    where: { email: 'mauricio@smilepro.com' },
    update: {},
    create: {
      nombre_completo: 'Dr. Mauricio López',
      email: 'mauricio@smilepro.com',
      contrasena_hash: hash,
      rol: RolUsuario.odontologo,
    },
  });

  console.log(`👤 Usuarios: ${drLopez.email}, ${draSosa.email}, ${drMauricio.email}`);

  // ── 2. Limpiar solo datos de contenido (no usuarios) ─────────────────────
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

  // ── 3. Pacientes ──────────────────────────────────────────────────────────
  const laura = await prisma.paciente.create({
    data: {
      nombre_completo: 'Laura Pérez',
      email: 'laura.p@gmail.com',
      telefono: '+54 9 351 555 1111',
      ciudad: 'Córdoba Capital',
      observaciones_generales:
        'Paciente interesada en mejorar estética frontal por evento próximo (boda).',
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

  const elena = await prisma.paciente.create({
    data: {
      nombre_completo: 'Elena Rodríguez',
      email: 'elena.rodriguez@outlook.com',
      telefono: '+54 9 11 3333-2222',
      estado_paciente: EstadoPaciente.en_evaluacion,
    },
  });

  console.log(`🧑‍⚕️ Pacientes: ${laura.nombre_completo}, ${martin.nombre_completo}, ${sofia.nombre_completo}, ${elena.nombre_completo}`);

  // ── 4. Casos Clínicos ─────────────────────────────────────────────────────
  const casoLaura = await prisma.casoClinico.create({
    data: {
      paciente_id: laura.id,
      usuario_responsable_id: drLopez.id,
      titulo: 'Diseño de Sonrisa Superior (Carillas)',
      motivo_consulta:
        'Desea cerrar diastemas y mejorar el tono de los incisivos centrales.',
      estado_caso: EstadoCaso.con_presupuesto_emitido,
      fotos: {
        create: [
          {
            url_foto:
              'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=800',
            tipo: 'frontal',
          },
          {
            url_foto:
              'https://images.unsplash.com/photo-1554151228-14d9def656ec?auto=format&fit=crop&q=80&w=800',
            tipo: 'lateral_derecha',
          },
        ],
      },
      notas: {
        create: [
          {
            contenido:
              'Se observa leve asimetría en encía marginal de pieza 11. Se sugiere gingivoplastía.',
          },
          { contenido: 'Paciente prefiere tono BL2 para el diseño final.' },
        ],
      },
      disenos: {
        create: {
          ajustes_json: crearBlueprintSeed(
            '/seed/frontal_antes.png',
            '/seed/lateral_izq.png',
            '/seed/retrato_completo.png',
          ),
          activo: true,
        },
      },
    },
  });

  const casoMartin = await prisma.casoClinico.create({
    data: {
      paciente_id: martin.id,
      usuario_responsable_id: draSosa.id,
      titulo: 'Rehabilitación Oclusal Completa',
      motivo_consulta: 'Desgaste severo por bruxismo. Requiere reconstrucción de guía anterior.',
      estado_caso: EstadoCaso.con_diseno_borrador,
      disenos: {
        create: {
          ajustes_json: crearBlueprintSeed(
            '/seed/frontal_antes.png',
            '/seed/lateral_izq.png',
            '/seed/retrato_completo.png',
          ),
          activo: true,
        },
      },
    },
  });

  const casoElena = await prisma.casoClinico.create({
    data: {
      paciente_id: elena.id,
      usuario_responsable_id: drMauricio.id,
      titulo: 'Diseño de Sonrisa Completo',
      motivo_consulta: 'Boda próxima, quiere sonrisa perfecta.',
      estado_caso: EstadoCaso.con_presupuesto_emitido,
      disenos: {
        create: {
          ajustes_json: crearBlueprintSeed(
            '/seed/frontal_antes.png',
            '/seed/lateral_izq.png',
            '/seed/retrato_completo.png',
          ),
          activo: true,
        },
      },
    },
  });

  await prisma.casoClinico.create({
    data: {
      paciente_id: sofia.id,
      usuario_responsable_id: drLopez.id,
      titulo: 'Primera Consulta Estética',
      motivo_consulta: 'Evaluación inicial. Sin tratamiento previo.',
      estado_caso: EstadoCaso.en_evaluacion,
    },
  });

  console.log(`📋 Casos: ${casoLaura.titulo}, ${casoMartin.titulo}, ${casoElena.titulo}`);

  // ── 5. Presupuestos ───────────────────────────────────────────────────────
  await prisma.presupuesto.create({
    data: {
      paciente_id: laura.id,
      caso_clinico_id: casoLaura.id,
      estado_presupuesto: EstadoPresupuesto.en_seguimiento,
      monto_total_estimado: 2800,
      cantidad_cuotas: 12,
      opciones: {
        create: [
          {
            titulo: 'Plan Estético Essential',
            descripcion: '6 Carillas de composite Inyectado de alta densidad.',
            monto: 1800,
            recomendada: false,
          },
          {
            titulo: 'Plan Estético Premium',
            descripcion:
              '6 Carillas de porcelana disilicato de litio (E-max). Incluye gingivoplastía.',
            monto: 2800,
            recomendada: true,
          },
          {
            titulo: 'Plan Hollywood Smile',
            descripcion: '10 Carillas de porcelana + Blanqueamiento inferior.',
            monto: 4200,
            recomendada: false,
          },
        ],
      },
      seguimientos: {
        create: [
          {
            comentario:
              'Se presentó presupuesto vía Zoom. Paciente interesada en el plan Premium.',
            proxima_accion: 'Llamar para coordinar entrega de seña',
            fecha_accion: new Date(Date.now() + 86400000),
          },
          {
            comentario:
              'Consulta sobre financiación. Se autorizaron 12 cuotas sin interés.',
          },
        ],
      },
    },
  });

  await prisma.presupuesto.create({
    data: {
      paciente_id: elena.id,
      caso_clinico_id: casoElena.id,
      estado_presupuesto: EstadoPresupuesto.presentado,
      monto_total_estimado: 3500,
      cantidad_cuotas: 6,
      opciones: {
        create: [
          {
            titulo: 'Sonrisa Completa E-max',
            descripcion: '8 Carillas de porcelana E-max + blanqueamiento.',
            monto: 3500,
            recomendada: true,
          },
        ],
      },
    },
  });

  // ── 6. Plantillas de Diseño de Sonrisa ────────────────────────────────────
  console.log(`✨ Cargando ${PLANTILLAS.length} plantillas...`);
  for (const p of PLANTILLAS) {
    await prisma.plantillaSonrisa.upsert({
      where: { id: p.id },
      update: {
        nombre: p.nombre,
        categoria: p.categoria,
        parametros: p.parametros as any,
      },
      create: {
        id: p.id,
        nombre: p.nombre,
        categoria: p.categoria,
        parametros: p.parametros as any,
      },
    });
  }

  console.log('✅ Base de datos poblada con éxito.');
  console.log('');
  console.log('📌 Credenciales de acceso:');
  console.log('   admin@smilesaas.local  / admin123  (administrador)');
  console.log('   sosa@smilesaas.local   / admin123  (odontólogo)');
  console.log('   mauricio@smilepro.com  / admin123  (odontólogo)');
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
