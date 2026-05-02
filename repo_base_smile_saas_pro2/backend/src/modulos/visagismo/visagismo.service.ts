/**
 * VISAGISMO SERVICE — Stub Fase D
 *
 * Análisis morfológico facial para sugerencia de preset dental.
 * Stub preparado para integración con modelo de visión (Python microservice).
 *
 * Implementación real (Fase D):
 *   - Llamar a microservicio Python con MediaPipe/TensorFlow
 *   - Persistir resultado en DB (tabla analisis_visagismo)
 *   - Cachear resultado por caso_clinico_id
 *
 * Estado actual: stub que retorna análisis simulado y persiste en DB.
 */

import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AnalizarVisagismoDto } from './dto/analizar_visagismo.dto';

export type FormaFacial = 'oval' | 'cuadrada' | 'triangular' | 'redonda' | 'indeterminada';

export interface ResultadoVisagismo {
  caso_clinico_id: string;
  forma_facial: FormaFacial;
  preset_sugerido: string;
  morfologia: 'oval' | 'cuadrado';
  confianza: number;
  razonamiento: string;
  color_sugerido: string;
  vita_aproximado: string;
  fecha_analisis: string;
}

@Injectable()
export class VisagismoService {
  private readonly logger = new Logger(VisagismoService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Analiza el rostro utilizando el microservicio de Python.
   * En Fase D: delegamos el procesamiento pesado (Color Match y Visagismo Pro) a Python.
   */
  async analizar(dto: AnalizarVisagismoDto): Promise<ResultadoVisagismo> {
    this.logger.log(`Llamando a Vision Service para caso: ${dto.caso_clinico_id}`);

    const pythonUrl = process.env.VISION_SERVICE_URL || 'http://localhost:8000';
    const apiKey = process.env.VISION_API_KEY || 'smile_secret_dev_key';

    try {
      // En una implementación real, aquí recibiríamos la imagen.
      // Por ahora, simulamos la llamada si el microservicio está disponible.
      const respuesta = await fetch(`${pythonUrl}/analizar`, {
        method: 'POST',
        headers: {
          'X-API-KEY': apiKey,
        },
        // Nota: En producción aquí enviaríamos un FormData con la imagen real
      });

      if (!respuesta.ok) {
        throw new Error(`Vision Service respondió con status: ${respuesta.status}`);
      }

      const visionData = await respuesta.json();

      const resultado: ResultadoVisagismo = {
        caso_clinico_id: dto.caso_clinico_id,
        forma_facial: visionData.forma_facial.toLowerCase() as FormaFacial,
        preset_sugerido: visionData.preset_sugerido.toLowerCase(),
        morfologia: visionData.preset_sugerido === 'Oval' ? 'oval' : 'cuadrado',
        confianza: visionData.confianza,
        razonamiento: `Análisis automático: Rostro ${visionData.forma_facial}. Color sugerido ${visionData.color_sugerido} basado en esclera.`,
        color_sugerido: visionData.color_sugerido,
        vita_aproximado: visionData.color_sugerido,
        fecha_analisis: new Date().toISOString(),
      };

      // Persistir en diseño si se provee diseno_id
      if (dto.diseno_id) {
        await this.persistirEnDiseno(dto.diseno_id, resultado);
      }

      return resultado;
    } catch (error) {
      this.logger.error(`Fallo en Vision Service: ${error.message}. Cayendo a análisis local.`);
      // Fallback a análisis local si falla el microservicio
      return this.calcularVisagismoLocal(JSON.parse(dto.face_data_json || '{}'), dto.caso_clinico_id);
    }
  }

  private async persistirEnDiseno(disenoId: string, resultado: ResultadoVisagismo) {
    try {
      const disenoActual = await this.prisma.disenoSonrisa.findUnique({
        where: { id: disenoId },
      });
      if (disenoActual) {
        const ajustes = JSON.parse(disenoActual.ajustes_json || '{}');
        await this.prisma.disenoSonrisa.update({
          where: { id: disenoId },
          data: {
            ajustes_json: JSON.stringify({
              ...ajustes,
              visagismo: resultado,
            }),
          },
        });
      }
    } catch (e) {
      this.logger.warn(`No se pudo persistir visagismo en diseño: ${e}`);
    }
  }

  /**
   * Obtiene el último análisis de visagismo para un caso.
   */
  async obtenerPorCaso(casoClinicoId: string): Promise<ResultadoVisagismo | null> {
    const diseno = await this.prisma.disenoSonrisa.findFirst({
      where: { caso_clinico_id: casoClinicoId, activo: true },
      orderBy: { fecha_creacion: 'desc' },
    });

    if (!diseno?.ajustes_json) return null;

    try {
      const ajustes = JSON.parse(diseno.ajustes_json);
      return ajustes.visagismo ?? null;
    } catch {
      return null;
    }
  }

  // ── Análisis local (stub determinístico) ─────────────────────────────────

  private calcularVisagismoLocal(faceData: any, casoId: string): ResultadoVisagismo {
    // Extraer métricas si hay FaceData válido
    let indiceFacial = 1.25; // oval por defecto
    let indiceMandibular = 0.8;

    if (faceData?.boundingBox) {
      const { width, height } = faceData.boundingBox;
      if (width > 0) indiceFacial = height / width;
    }

    if (faceData?.landmarks?.boca?.ancho && faceData?.boundingBox?.width) {
      indiceMandibular = (faceData.landmarks.boca.ancho * 1.4) / faceData.boundingBox.width;
    }

    // Clasificar forma
    let forma: FormaFacial = 'oval';
    if (indiceFacial < 1.05) forma = 'redonda';
    else if (indiceFacial > 1.45) forma = 'triangular';
    else if (indiceMandibular > 0.88) forma = 'cuadrada';
    else if (indiceFacial >= 1.1 && indiceFacial <= 1.35) forma = 'oval';
    else forma = 'indeterminada';

    // Mapear a preset
    const mapa: Record<
      FormaFacial,
      { preset: string; morfologia: 'oval' | 'cuadrado'; razonamiento: string; confianza: number }
    > = {
      oval: {
        preset: 'premium',
        morfologia: 'oval',
        razonamiento: 'Rostro oval: morfología ideal para dientes amplios y redondeados.',
        confianza: 0.92,
      },
      cuadrada: {
        preset: 'natural',
        morfologia: 'cuadrado',
        razonamiento: 'Rostro cuadrado: dientes con bordes planos equilibran la mandíbula.',
        confianza: 0.85,
      },
      triangular: {
        preset: 'suave',
        morfologia: 'oval',
        razonamiento: 'Rostro triangular: dientes suaves para no acentuar el mentón.',
        confianza: 0.78,
      },
      redonda: {
        preset: 'premium',
        morfologia: 'oval',
        razonamiento: 'Rostro redondo: dientes alargados dan verticalidad al perfil.',
        confianza: 0.8,
      },
      indeterminada: {
        preset: 'natural',
        morfologia: 'oval',
        razonamiento: 'Forma no determinada. Preset Natural como punto de partida neutro.',
        confianza: 0.45,
      },
    };

    const { preset, morfologia, razonamiento, confianza } = mapa[forma];

    return {
      caso_clinico_id: casoId,
      forma_facial: forma,
      preset_sugerido: preset,
      morfologia,
      confianza,
      razonamiento,
      color_sugerido: '#F5F3EE', // blanco cálido neutro por defecto
      vita_aproximado: 'A1',
      fecha_analisis: new Date().toISOString(),
    };
  }
}
