import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { RedisIoAdapter } from './modulos/colaboracion/redis-io.adapter';
import * as path from 'path';
import * as fs from 'fs';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors();
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // Servir archivos subidos localmente (dev). En prod se usa S3/CloudFront.
  const uploadsDir = path.join(process.cwd(), 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  app.useStaticAssets(uploadsDir, { prefix: '/uploads' });

  // Configuración de WebSockets Híbrido (Redis para escalabilidad)
  const redisIoAdapter = new RedisIoAdapter(app);
  await redisIoAdapter.connectToRedis();
  app.useWebSocketAdapter(redisIoAdapter);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`🚀 Servidor ejecutándose en: http://localhost:${port}/api`);
  console.log(`📁 Archivos estáticos en:    http://localhost:${port}/uploads`);
}
bootstrap();
