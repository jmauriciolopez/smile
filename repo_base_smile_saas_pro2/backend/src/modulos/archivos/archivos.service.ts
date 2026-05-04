/**
 * ARCHIVOS SERVICE
 *
 * Estrategia dual:
 *   - LOCAL (dev): guarda en disco en /uploads, sirve como estático desde el backend.
 *   - PRODUCCIÓN: si AWS_S3_BUCKET está configurado, sube a S3 y devuelve URL de CloudFront.
 *
 * El frontend siempre recibe una URL absoluta lista para usar en <img src>.
 */

import { Injectable, Logger } from '@nestjs/common';
import { TipoArchivo } from './dto/subir_archivo.dto';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import * as fs from 'fs';
import * as path from 'path';

export interface ArchivoSubido {
  id: string;
  url: string;
  url_cdn: string;
  nombre: string;
  tipo: TipoArchivo;
  tamano_bytes: number;
  fecha: string;
}

@Injectable()
export class ArchivosService {
  private readonly logger = new Logger(ArchivosService.name);
  private readonly usarS3: boolean;
  private s3Client: S3Client | null = null;
  private readonly bucketName: string;
  private readonly uploadsDir: string;

  constructor() {
    this.bucketName = process.env.AWS_S3_BUCKET || '';
    this.usarS3 = !!(
      this.bucketName &&
      process.env.AWS_ACCESS_KEY_ID &&
      process.env.AWS_SECRET_ACCESS_KEY
    );

    if (this.usarS3) {
      this.s3Client = new S3Client({
        region: process.env.AWS_REGION || 'sa-east-1',
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
        },
      });
      this.logger.log('📦 Modo almacenamiento: S3');
    } else {
      this.logger.log('💾 Modo almacenamiento: Local (disco)');
    }

    // Carpeta uploads relativa al proceso (raíz del backend)
    this.uploadsDir = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(this.uploadsDir)) {
      fs.mkdirSync(this.uploadsDir, { recursive: true });
    }
  }

  /**
   * Recibe el buffer del archivo y lo persiste (local o S3).
   * Devuelve la URL pública lista para usar.
   */
  async subirArchivo(
    buffer: Buffer,
    nombreOriginal: string,
    tipo: TipoArchivo,
    mimeType: string,
  ): Promise<ArchivoSubido> {
    const timestamp = Date.now();
    // Sanitizar nombre para evitar path traversal
    const nombreSanitizado = nombreOriginal.replace(/[^a-zA-Z0-9._-]/g, '_');
    const nombreFinal = `${timestamp}-${nombreSanitizado}`;

    if (this.usarS3) {
      return this.subirAws(buffer, nombreFinal, tipo, mimeType, nombreOriginal);
    } else {
      return this.guardarLocal(buffer, nombreFinal, tipo, nombreOriginal);
    }
  }

  private async guardarLocal(
    buffer: Buffer,
    nombreFinal: string,
    tipo: TipoArchivo,
    nombreOriginal: string,
  ): Promise<ArchivoSubido> {
    const filePath = path.join(this.uploadsDir, nombreFinal);
    fs.writeFileSync(filePath, buffer);

    // Si BACKEND_URL está configurado, usar URL absoluta (prod/staging)
    // Si no, usar ruta relativa — el proxy de Vite la resuelve en dev
    const backendUrl = process.env.BACKEND_URL;
    const url = backendUrl
      ? `${backendUrl}/uploads/${nombreFinal}`
      : `/uploads/${nombreFinal}`;

    this.logger.log(`✅ Archivo guardado localmente: ${filePath} → ${url}`);

    return {
      id: nombreFinal,
      url,
      url_cdn: url, // En local, url y url_cdn son iguales
      nombre: nombreOriginal,
      tipo,
      tamano_bytes: buffer.length,
      fecha: new Date().toISOString(),
    };
  }

  private async subirAws(
    buffer: Buffer,
    nombreFinal: string,
    tipo: TipoArchivo,
    mimeType: string,
    nombreOriginal: string,
  ): Promise<ArchivoSubido> {
    const key = `uploads/${nombreFinal}`;
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Body: buffer,
      ContentType: mimeType,
    });

    await this.s3Client!.send(command);

    const cloudfrontUrl = process.env.CLOUDFRONT_URL;
    const url = `https://${this.bucketName}.s3.amazonaws.com/${key}`;
    const url_cdn = cloudfrontUrl ? `${cloudfrontUrl}/${key}` : url;

    this.logger.log(`✅ Archivo subido a S3: ${key}`);

    return {
      id: key,
      url,
      url_cdn,
      nombre: nombreOriginal,
      tipo,
      tamano_bytes: buffer.length,
      fecha: new Date().toISOString(),
    };
  }

  async eliminar(archivoId: string): Promise<{ eliminado: boolean }> {
    try {
      if (this.usarS3) {
        const command = new DeleteObjectCommand({
          Bucket: this.bucketName,
          Key: archivoId,
        });
        await this.s3Client!.send(command);
      } else {
        // archivoId es el nombre del archivo en local
        const nombreArchivo = path.basename(archivoId);
        const filePath = path.join(this.uploadsDir, nombreArchivo);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
      return { eliminado: true };
    } catch (error) {
      this.logger.error(`Error eliminando archivo: ${error.message}`);
      return { eliminado: false };
    }
  }
}
