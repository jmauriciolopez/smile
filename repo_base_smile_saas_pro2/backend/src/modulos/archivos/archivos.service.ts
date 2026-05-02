/**
 * ARCHIVOS SERVICE — Stub Fase D
 *
 * Gestión de archivos pesados (imágenes 4K, renders, archivos .smile).
 * Stub preparado para Object Storage (S3/GCS) con CDN.
 *
 * Implementación real (Fase D):
 *   - Integrar @aws-sdk/client-s3 o @google-cloud/storage
 *   - Configurar bucket con CDN (CloudFront / Cloud CDN)
 *   - Generar presigned URLs para upload directo desde el cliente
 *   - Almacenar metadata en DB (tabla archivos_diseno)
 *
 * Estado actual: stub que simula URLs y retorna respuestas válidas.
 */

import { Injectable, Logger } from '@nestjs/common';
import { SubirArchivoDto, TipoArchivo } from './dto/subir_archivo.dto';
import { S3Client, PutObjectCommand, DeleteObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

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
  private s3Client: S3Client;
  private readonly bucketName = process.env.AWS_S3_BUCKET || 'smile-saas-images';

  constructor() {
    this.s3Client = new S3Client({
      region: process.env.AWS_REGION || 'sa-east-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'dummy',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'dummy',
      },
    });
  }

  /**
   * Genera una URL firmada para que el cliente suba el archivo directamente a S3.
   * Esto evita que el archivo pesado pase por el servidor de NestJS.
   */
  async generarUrlSubida(dto: SubirArchivoDto): Promise<{ url_subida: string; archivo_id: string; key: string }> {
    const key = `casos/${Date.now()}-${dto.nombre_original}`;
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      ContentType: this.getMimeType(dto.tipo),
    });

    try {
      const url_subida = await getSignedUrl(this.s3Client, command, { expiresIn: 3600 });
      return {
        url_subida,
        archivo_id: key, // Usamos la Key como ID para simplificar
        key,
      };
    } catch (error) {
      this.logger.error(`Error generando pre-signed URL: ${error.message}`);
      throw error;
    }
  }

  /**
   * Confirma la existencia del archivo en S3 y retorna la metadata.
   */
  async confirmarSubida(archivoId: string, dto: SubirArchivoDto): Promise<ArchivoSubido> {
    const command = new HeadObjectCommand({
      Bucket: this.bucketName,
      Key: archivoId,
    });

    try {
      const metadata = await this.s3Client.send(command);
      const url_cdn = `${process.env.CLOUDFRONT_URL || 'https://cdn.smile-saas.com'}/${archivoId}`;

      return {
        id: archivoId,
        url: `https://${this.bucketName}.s3.amazonaws.com/${archivoId}`,
        url_cdn: url_cdn,
        nombre: dto.nombre_original,
        tipo: dto.tipo,
        tamano_bytes: metadata.ContentLength || 0,
        fecha: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error(`Error verificando archivo en S3: ${error.message}`);
      throw error;
    }
  }

  async obtenerUrl(archivoId: string): Promise<{ url: string; url_cdn: string }> {
    const url_cdn = `${process.env.CLOUDFRONT_URL || 'https://cdn.smile-saas.com'}/${archivoId}`;
    return {
      url: `https://${this.bucketName}.s3.amazonaws.com/${archivoId}`,
      url_cdn: url_cdn,
    };
  }

  async eliminar(archivoId: string): Promise<{ eliminado: boolean }> {
    const command = new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: archivoId,
    });

    try {
      await this.s3Client.send(command);
      return { eliminado: true };
    } catch (error) {
      this.logger.error(`Error eliminando de S3: ${error.message}`);
      return { eliminado: false };
    }
  }

  private getMimeType(tipo: TipoArchivo): string {
    switch (tipo) {
      case TipoArchivo.FOTO_CLINICA:
        return 'image/jpeg';
      case TipoArchivo.IMAGEN_DISENO:
        return 'image/png';
      case TipoArchivo.ARCHIVO_SMILE:
        return 'application/json';
      default:
        return 'application/octet-stream';
    }
  }
}
