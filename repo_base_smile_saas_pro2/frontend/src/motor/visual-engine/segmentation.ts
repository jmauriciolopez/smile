/**
 * Sistema de Segmentación Labial (Pixel-Level Alpha Matte).
 * Procesa máscaras binarias generadas por CNN mediante manipulación directa de buffer de píxeles (Uint8ClampedArray).
 */
export class SegmentationEngine {
  /**
   * Extrae la matriz de píxeles (Alpha Matte) a partir de una imagen rasterizada.
   * @param image Imagen cargada (ej. máscara proveniente de modelo CNN)
   * @param width Ancho del canvas objetivo
   * @param height Alto del canvas objetivo
   * @returns Buffer plano de píxeles RGBA (Uint8ClampedArray)
   */
  static generarMascaraLabios(
    image: HTMLImageElement,
    width: number,
    height: number,
  ): Uint8ClampedArray {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });

    if (!ctx) throw new Error("Canvas 2D context not available");

    ctx.drawImage(image, 0, 0, width, height);
    return ctx.getImageData(0, 0, width, height).data;
  }

  /**
   * Aplica un suavizado gaussiano (Feather) directo sobre el buffer Alpha de la máscara.
   * @param imageData Buffer RGBA modificado in-place
   * @param width Ancho de la máscara
   * @param height Alto de la máscara
   * @param radius Radio de desenfoque (Feather) en píxeles
   */
  static aplicarAlphaFeather(
    imageData: ImageData,
    width: number,
    height: number,
    radius: number,
  ): void {
    const data = imageData.data;
    const bufferSize = data.length;
    const tempAlpha = new Uint8ClampedArray(width * height);

    // Extraer canal Alpha (índice 3, 7, 11...)
    for (let i = 0, j = 0; i < bufferSize; i += 4, j++) {
      tempAlpha[j] = data[i + 3];
    }

    // Box blur simplificado para suavizado rápido (Horizontal + Vertical)
    // Para Edge Feather dinámico sin sobrecargar el hilo principal
    const blurredAlpha = new Uint8ClampedArray(width * height);

    // Pass 1: Horizontal
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        let sum = 0;
        let count = 0;
        for (let k = -radius; k <= radius; k++) {
          const px = x + k;
          if (px >= 0 && px < width) {
            sum += tempAlpha[y * width + px];
            count++;
          }
        }
        blurredAlpha[y * width + x] = sum / count;
      }
    }

    // Pass 2: Vertical y reinyectar al buffer principal
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        let sum = 0;
        let count = 0;
        for (let k = -radius; k <= radius; k++) {
          const py = y + k;
          if (py >= 0 && py < height) {
            sum += blurredAlpha[py * width + x];
            count++;
          }
        }
        // Inyectar el alpha suavizado de vuelta al RGBA original
        const alphaIndex = (y * width + x) * 4 + 3;
        data[alphaIndex] = sum / count;
      }
    }
  }
}
