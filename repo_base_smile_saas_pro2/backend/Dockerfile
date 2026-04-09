# Etapa 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./
COPY prisma ./prisma/

# Instalar dependencias
RUN npm install

# Copiar el resto del código y generar prisma client
COPY . .
RUN npx prisma generate
RUN npm run build

# Etapa 2: Runtime
FROM node:20-alpine

WORKDIR /app

# Copiar archivos necesarios desde el builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma

# Variable de entorno por defecto
ENV PORT=3000
ENV NODE_ENV=production

# Exponer puerto
EXPOSE 3000

# El comando de inicio debe correr migraciones y luego el server
# En producción es mejor manejar migraciones fuera, pero para este SaaS simplificado:
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main"]
