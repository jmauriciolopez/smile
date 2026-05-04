import {
  Controller,
  Post,
  Delete,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { ArchivosService } from './archivos.service';
import { TipoArchivo } from './dto/subir_archivo.dto';
import { JwtAuthGuard } from '../autenticacion/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('archivos')
export class ArchivosController {
  constructor(private readonly archivosService: ArchivosService) {}

  /**
   * POST /archivos/subir
   * Recibe el archivo como multipart/form-data.
   * Query params: tipo (TipoArchivo), caso_clinico_id (opcional)
   *
   * Estrategia dual automática:
   *   - Sin credenciales S3 → guarda en disco local (/uploads)
   *   - Con credenciales S3  → sube a S3 y devuelve URL de CloudFront
   */
  @Post('subir')
  @UseInterceptors(
    FileInterceptor('archivo', {
      storage: memoryStorage(), // Mantenemos en RAM para decidir destino en el service
      limits: { fileSize: 20 * 1024 * 1024 }, // 20 MB máximo
      fileFilter: (_req, file, cb) => {
        const permitidos = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/json'];
        if (permitidos.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(new BadRequestException(`Tipo de archivo no permitido: ${file.mimetype}`), false);
        }
      },
    }),
  )
  async subirArchivo(
    @UploadedFile() archivo: Express.Multer.File,
    @Query('tipo') tipo: TipoArchivo,
  ) {
    if (!archivo) {
      throw new BadRequestException('No se recibió ningún archivo');
    }
    if (!tipo || !Object.values(TipoArchivo).includes(tipo)) {
      throw new BadRequestException(`Tipo inválido. Valores permitidos: ${Object.values(TipoArchivo).join(', ')}`);
    }

    return this.archivosService.subirArchivo(
      archivo.buffer,
      archivo.originalname,
      tipo,
      archivo.mimetype,
    );
  }

  /**
   * DELETE /archivos/:id
   * Elimina un archivo del storage (local o S3).
   */
  @Delete(':id')
  eliminar(@Param('id') id: string) {
    return this.archivosService.eliminar(id);
  }
}
