import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class AnalizarVisagismoDto {
  @IsString()
  @IsNotEmpty()
  caso_clinico_id: string;

  /**
   * FaceData serializado como JSON string.
   * Contiene landmarks, boundingBox, lips y transform.
   */
  @IsString()
  @IsNotEmpty()
  face_data_json: string;

  @IsString()
  @IsOptional()
  diseno_id?: string;
}
