# Guía de Despliegue a Producción - Smile SaaS PRO 2

Esta guía detalla los pasos técnicos para desplegar el ecosistema completo utilizando Render y AWS.

## 1. Backend y Base de Datos (Render)

### Requisitos
- Cuenta en [Render.com](https://render.com).
- Repositorio de GitHub conectado.

### Pasos
1. Sube los cambios a tu repositorio.
2. Render detectará automáticamente el archivo `render.yaml` en la raíz.
3. En el dashboard de Render, ve a "Blueprints" y selecciona tu repositorio.
4. Render creará:
   - Una base de datos **PostgreSQL**.
   - Un **Web Service** para el backend (usando el `Dockerfile`).
5. Tras el despliegue, copia la URL de tu servicio (ej: `https://smile-backend.onrender.com`).

---

## 2. Infraestructura Frontend (AWS Terraform)

### Requisitos
- AWS CLI configurado (`aws configure`).
- Terraform instalado localmente.

### Pasos
1. Navega a la carpeta `/terraform`.
2. Ejecuta:
   ```bash
   terraform init
   terraform apply
   ```
3. Confirma con `yes`. Terraform creará el bucket de S3 y la distribución de CloudFront.
4. Anota el valor de `cloudfront_domain_name` de los outputs.

---

## 3. Construcción y Despliegue del Frontend

### Configuración de Variables
1. Abre el archivo `/frontend/.env` y ajusta:
   ```env
   VITE_API_URL=https://tu-url-de-render.onrender.com
   ```

### Build
1. Desde la carpeta `/frontend`:
   ```bash
   npm install
   npm run build
   ```

### Upload a AWS
1. Sincroniza la carpeta `dist` con tu bucket de S3:
   ```bash
   aws s3 sync dist/ s3://smile-saas-frontend-produccion --delete
   ```
2. Invalida la caché de CloudFront para ver los cambios inmediatamente:
   ```bash
   aws cloudfront create-invalidation --distribution-id TU_ID_DISTRIBUCION --paths "/*"
   ```

---

## 4. Inicialización de Datos (Seed)

Una vez que el backend esté corriendo en Render:
1. Conéctate a la consola de Render o utiliza una terminal local apuntando a la DB de producción.
2. Ejecuta:
   ```bash
   npm run prisma:seed
   ```
   *Nota: Asegúrate de que las variables de entorno de producción estén configuradas en tu terminal local si lo haces desde fuera.*
