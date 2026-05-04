import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const usuarios = await prisma.usuario.findMany({
    select: { email: true, contrasena_hash: true, activo: true, rol: true },
  });

  console.log('\n=== USUARIOS EN DB ===');
  for (const u of usuarios) {
    const ok = await bcrypt.compare('admin123', u.contrasena_hash);
    console.log(`${u.email} | activo=${u.activo} | rol=${u.rol} | hash_ok=${ok} | hash="${u.contrasena_hash.substring(0, 20)}..."`);
  }

  if (usuarios.length === 0) {
    console.log('⚠️  No hay usuarios en la base de datos.');
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => { console.error(e.message); prisma.$disconnect(); });
