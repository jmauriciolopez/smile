import { IoAdapter } from '@nestjs/platform-socket.io';
import { ServerOptions } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { Redis } from 'ioredis';
import { Logger } from '@nestjs/common';

export class RedisIoAdapter extends IoAdapter {
  private adapterConstructor: ReturnType<typeof createAdapter>;
  private readonly logger = new Logger(RedisIoAdapter.name);

  async connectToRedis(): Promise<void> {
    const redisUrl = process.env.REDIS_URL;

    if (!redisUrl) {
      this.logger.warn('REDIS_URL no encontrada. Usando adaptador local (sin escalado horizontal).');
      return;
    }

    try {
      this.logger.log(`Conectando a Redis para escalabilidad de WebSockets: ${redisUrl}`);
      const pubClient = new Redis(redisUrl);
      const subClient = pubClient.duplicate();

      await Promise.all([pubClient.connect, subClient.connect]);

      this.adapterConstructor = createAdapter(pubClient, subClient);
      this.logger.log('Adaptador Redis configurado correctamente.');
    } catch (error) {
      this.logger.error('Error al conectar con Redis, cayendo a modo local.', error);
    }
  }

  createIOServer(port: number, options?: ServerOptions): any {
    const server = super.createIOServer(port, options);
    if (this.adapterConstructor) {
      server.adapter(this.adapterConstructor);
    }
    return server;
  }
}
