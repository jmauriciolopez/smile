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

### Vision AI Service (Nuevo - Fase D)
- Python + FastAPI
- Procesamiento de imágenes con MediaPipe
- Análisis de Visagismo (forma facial y presets)
- Detección de landmarks faciales y labiales
- Docker ready

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

### 3. Vision AI Service (Python)
```bash
cd vision-service
python -m venv venv
# Windows:
.\venv\Scripts\activate
# Unix:
source venv/bin/activate

pip install -r requirements.txt
python main.py
```
Accede a `http://localhost:8000/docs` para ver la documentación interactiva.

## Notas de Producción y Escalabilidad

### 🧠 Visión IA (Microservicio Python)
El sistema utiliza un microservicio independiente en Python para tareas pesadas de visión artificial. Esto permite que el backend de NestJS se mantenga ligero.
- URL por defecto: `http://localhost:8000`
- Requiere `VISION_API_KEY` para comunicación segura.

### 🔄 Colaboración en Tiempo Real (WebSockets + Redis)
El sistema de diseño colaborativo (Odontólogo + Laboratorio) está preparado para escalado horizontal:
- **Modo Local**: Funciona automáticamente en memoria (ideal para desarrollo).
- **Modo Producción**: Si despliegas múltiples instancias del backend, configura la variable `REDIS_URL` (ej: `redis://default:password@host:port`). El sistema activará automáticamente el `RedisIoAdapter` para sincronizar eventos entre servidores.

### ☁️ Almacenamiento (AWS S3)
La gestión de imágenes clínicas utiliza el SDK v3 de AWS.
- Configura `AWS_S3_BUCKET`, `AWS_ACCESS_KEY_ID` y `AWS_SECRET_ACCESS_KEY` para habilitar el almacenamiento real.
- En ausencia de estas llaves, el sistema generará URLs locales para facilitar el desarrollo.

## Credenciales demo
- email: admin@smilesaas.local
- contraseña: admin123

---
Plataforma construida bajo el estándar **Smile Design System Master Pro**.
