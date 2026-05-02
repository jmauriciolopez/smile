/**
 * FIRMAS SERVICE — Stub Fase F
 *
 * Firma digital de diseños con Chain of Custody.
 * Stub preparado para integración con PKI/certificados digitales.
 *
 * Implementación real (Fase F):
 *   - Integrar con proveedor de firma electrónica (DocuSign, FirmaEC, etc.)
 *   - Generar certificado X.509 por doctor
 *   - Firmar el hash del diseño con clave privada del doctor
 *   - Almacenar firma en tabla firmas_diseno con timestamp inmutable
 *   - Audit log de cada acción para cumplimiento HIPAA/GDPR
 *
 * Estado actual: stub que genera firma con hash SHA-256 y persiste en DB
 * usando el campo ajustes_json del diseño.
 */

import { Injectable, Logger, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CrearFirmaDto, AprobarFirmaDto, EstadoFirma } from './dto/crear_firma.dto';
import * as crypto from 'crypto';

export interface DocumentoFirma {
  id: string;
  diseno_id: string;
  caso_clinico_id: string;
  firmado_por: string;
  rol_firmante: string;
  hash_diseno: string;
  /** Firma HMAC del hash (stub — en Fase F: firma RSA con cert X.509) */
  firma_stub: string;
  estado: EstadoFirma;
  observaciones: string;
  aprobado_por: string | null;
  timestamp_firma: string;
  timestamp_aprobacion: string | null;
}

// Almacenamiento en memoria (stub) — en Fase F: tabla firmas_diseno en DB
const firmasRegistradas = new Map<string, DocumentoFirma>();

@Injectable()
export class FirmasService {
  private readonly logger = new Logger(FirmasService.name);

  // Clave HMAC de stub — en Fase F: clave privada RSA del doctor
  private readonly CLAVE_STUB = process.env.FIRMA_STUB_SECRET ?? 'smile-saas-stub-key-2025';

  constructor(private readonly prisma: PrismaService) {}

  /**
   * STUB: Firma un diseño y genera el documento de firma.
   * En Fase F real: firmar con RSA + certificado X.509 del doctor.
   */
  async firmar(dto: CrearFirmaDto): Promise<DocumentoFirma> {
    this.logger.log(`[STUB] Firmando diseño ${dto.diseno_id} por ${dto.firmado_por}`);

    // Verificar que el diseño existe
    const diseno = await this.prisma.disenoSonrisa.findUnique({
      where: { id: dto.diseno_id },
    });
    if (!diseno) throw new NotFoundException('Diseño no encontrado');

    // Verificar que no esté ya firmado
    const firmaExistente = Array.from(firmasRegistradas.values()).find(
      (f) => f.diseno_id === dto.diseno_id && f.estado !== EstadoFirma.REVOCADO,
    );
    if (firmaExistente) {
      throw new ConflictException('Este diseño ya tiene una firma activa');
    }

    // Generar firma HMAC del hash (stub)
    // TODO Fase F: firmaRSA = crypto.sign('SHA256', Buffer.from(dto.hash_diseno), doctorPrivateKey)
    const firmaStub = crypto
      .createHmac('sha256', this.CLAVE_STUB)
      .update(`${dto.hash_diseno}:${dto.firmado_por}:${new Date().toISOString()}`)
      .digest('hex');

    const firmaId = `firma_${Date.now()}`;

    const documento: DocumentoFirma = {
      id: firmaId,
      diseno_id: dto.diseno_id,
      caso_clinico_id: dto.caso_clinico_id,
      firmado_por: dto.firmado_por,
      rol_firmante: dto.rol_firmante,
      hash_diseno: dto.hash_diseno,
      firma_stub: firmaStub,
      estado: EstadoFirma.FIRMADO,
      observaciones: dto.observaciones ?? '',
      aprobado_por: null,
      timestamp_firma: new Date().toISOString(),
      timestamp_aprobacion: null,
    };

    firmasRegistradas.set(firmaId, documento);

    // Persistir referencia en el diseño
    try {
      const ajustes = JSON.parse(diseno.ajustes_json || '{}');
      await this.prisma.disenoSonrisa.update({
        where: { id: dto.diseno_id },
        data: {
          ajustes_json: JSON.stringify({
            ...ajustes,
            firma: { id: firmaId, estado: EstadoFirma.FIRMADO, timestamp: documento.timestamp_firma },
          }),
        },
      });
    } catch (e) {
      this.logger.warn(`No se pudo persistir firma en diseño: ${e}`);
    }

    // TODO Fase F: await auditLogService.registrar('FIRMA_DISENO', { firmaId, disenoId, firmadoPor })

    return documento;
  }

  /**
   * STUB: Aprueba una firma existente.
   * En Fase F real: segunda firma con certificado del director clínico.
   */
  async aprobar(dto: AprobarFirmaDto): Promise<DocumentoFirma> {
    this.logger.log(`[STUB] Aprobando firma ${dto.firma_id} por ${dto.aprobado_por}`);

    const firma = firmasRegistradas.get(dto.firma_id);
    if (!firma) throw new NotFoundException(`Firma ${dto.firma_id} no encontrada`);
    if (firma.estado === EstadoFirma.APROBADO) {
      throw new ConflictException('Esta firma ya fue aprobada');
    }

    firma.estado = EstadoFirma.APROBADO;
    firma.aprobado_por = dto.aprobado_por;
    firma.timestamp_aprobacion = new Date().toISOString();

    // TODO Fase F: await auditLogService.registrar('APROBACION_DISENO', { firmaId, aprobadoPor })

    return firma;
  }

  /**
   * Obtiene la firma de un diseño.
   */
  async obtenerPorDiseno(disenoId: string): Promise<DocumentoFirma | null> {
    return (
      Array.from(firmasRegistradas.values()).find(
        (f) => f.diseno_id === disenoId && f.estado !== EstadoFirma.REVOCADO,
      ) ?? null
    );
  }

  /**
   * Verifica la integridad de una firma comparando el hash actual con el firmado.
   */
  async verificar(firmaId: string, hashActual: string): Promise<{ valida: boolean; motivo: string }> {
    const firma = firmasRegistradas.get(firmaId);
    if (!firma) return { valida: false, motivo: 'Firma no encontrada' };

    const integra = firma.hash_diseno === hashActual;
    return {
      valida: integra,
      motivo: integra
        ? 'Hash coincide — diseño no fue modificado'
        : 'Hash no coincide — diseño fue modificado después de la firma',
    };
  }
}
