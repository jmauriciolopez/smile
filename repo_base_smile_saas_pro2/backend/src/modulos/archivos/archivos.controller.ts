import { Controller, Post, Get, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ArchivosService } from './archivos.service';
import { SubirArchivoDto } from './dto/subir_archivo.dto';
import { JwtAuthGuard } from '../autenticacion/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('archivos')
export class ArchivosController {
  constructor(private readonly archivosService: ArchivosService) {}

  /**
   * POST /archivos/url-subida
   * Genera una URL presignada para subida directa desde el cliente.
   * Fase D: retorna URL real de S3/GCS.
   */
  @Post('url-subida')
  generarUrlSubida(@Body() dto: SubirArchivoDto) {
    return this.archivosService.generarUrlSubida(dto);
  }

  /**
   * POST /archivos/:id/confirmar
   * Confirma que el archivo fue subido exitosamente.
   */
  @Post(':id/confirmar')
  confirmarSubida(@Param('id') id: string, @Body() dto: SubirArchivoDto) {
    return this.archivosService.confirmarSubida(id, dto);
  }

  /**
   * GET /archivos/:id/url
   * Obtiene la URL CDN de un archivo existente.
   */
  @Get(':id/url')
  obtenerUrl(@Param('id') id: string) {
    return this.archivosService.obtenerUrl(id);
  }

  /**
   * DELETE /archivos/:id
   * Elimina un archivo del storage.
   */
  @Delete(':id')
  eliminar(@Param('id') id: string) {
    return this.archivosService.eliminar(id);
  }
}
