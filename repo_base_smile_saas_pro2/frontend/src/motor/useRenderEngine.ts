/**
 * useRenderEngine
 * Hook que conecta el render-engine con el estado del editor.
 *
 * Uso:
 *   const { renderizar, renderizando, resultado, limpiar } = useRenderEngine(imgRef);
 *   await renderizar({ formato: 'jpg', calidad: 0.92, incluirGuias: false });
 */

import { useState, useCallback } from 'react';
import { renderComposito, type ResultadoRender } from './render-engine';
import { useEditorStore } from '../store/editor-sonrisa.store';

interface OpcionesRender {
  formato?:      'png' | 'jpg';
  calidad?:      number;
  incluirGuias?: boolean;
  /** Resolución de output (defecto: 2x para pantallas Retina) */
  factor?:       number;
}

interface UseRenderEngineReturn {
  renderizando:   boolean;
  resultado:      ResultadoRender | null;
  error:          string | null;
  renderizar:    (img: HTMLImageElement, opts?: OpcionesRender) => Promise<ResultadoRender | null>;
  limpiar:        () => void;
  descargar:      (nombreArchivo?: string) => void;
}

export function useRenderEngine(): UseRenderEngineReturn {
  const store = useEditorStore();
  const [renderizando, setRenderizando] = useState(false);
  const [resultado,    setResultado]    = useState<ResultadoRender | null>(null);
  const [error,        setError]        = useState<string | null>(null);

  const renderizar = useCallback(
    async (img: HTMLImageElement, opts: OpcionesRender = {}): Promise<ResultadoRender | null> => {
      const {
        formato      = 'jpg',
        calidad      = 0.93,
        incluirGuias = false,
        factor       = 2,
      } = opts;

      setRenderizando(true);
      setError(null);

      try {
        const { canvasSize, dientes, guias, faceData } = store;
        const result = await renderComposito({
          foto:     img,
          dientes,
          guias,
          faceData,
          ancho:    canvasSize.width  * factor,
          alto:     canvasSize.height * factor,
          formato,
          calidad,
          incluirGuias,
        });

        setResultado(result);
        return result;
      } catch (e: any) {
        const msg = e?.message ?? 'Error al renderizar el diseño.';
        setError(msg);
        return null;
      } finally {
        setRenderizando(false);
      }
    },
    [store]
  );

  const limpiar = useCallback(() => {
    if (resultado?.dataUrl) URL.revokeObjectURL(resultado.dataUrl);
    setResultado(null);
    setError(null);
  }, [resultado]);

  const descargar = useCallback(
    (nombreArchivo = 'smile-design-pro.jpg') => {
      if (!resultado) return;
      const a = document.createElement('a');
      a.href     = resultado.dataUrl;
      a.download = nombreArchivo;
      a.click();
    },
    [resultado]
  );

  return { renderizando, resultado, error, renderizar, limpiar, descargar };
}
