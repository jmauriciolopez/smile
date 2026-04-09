# Repo base PRO 2 — SaaS Diseño de Sonrisa

Boilerplate avanzado para un SaaS odontológico enfocado en diseño de sonrisa y cierre comercial.

## Incluye

### Frontend
- React + TypeScript + Vite + Tailwind
- Layout premium
- Dashboard
- Pacientes: listado + detalle
- Casos clínicos: listado + detalle
- Editor de sonrisa con estado local real
- Presupuestos y seguimientos con pantallas navegables
- Router y servicios preparados para API
- Mocks demo realistas
- Formularios base

### Backend
- NestJS + Prisma + PostgreSQL
- CRUD real de pacientes
- CRUD base de casos
- Login JWT funcional
- Seeds demo
- Prisma schema más completo
- Estructura modular y nombres en español

## Cómo usar

### 1. Frontend
```bash
cd frontend
npm install
npm run dev
```

### 2. Backend
```bash
cd backend
cp .env.ejemplo .env
npm install
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run start:dev
```

## Credenciales demo
- email: admin@smilesaas.local
- contraseña: admin123

## Nota
Es una base avanzada lista para continuar. No incluye IA real ni procesamiento clínico complejo.
