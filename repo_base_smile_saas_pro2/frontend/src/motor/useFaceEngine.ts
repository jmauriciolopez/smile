import { useState, useCallback, useRef } from "react";
import { useEditorStore } from "../store/editor-sonrisa.store";
import { DatosFaciales, Vec2 } from "../core/types";

interface UseFaceEngineReturn {
  detectando: boolean;
  error: string | null;
  detectar: (imagenEl: HTMLImageElement) => Promise<void>;
}

const MP_IDX = {
  ojo_izq_externo: 33,
  ojo_der_externo: 263,
  nariz_punta: 1,
  boca_izq: 61,
  boca_der: 291,
  boca_centro_sup: 13,
  boca_centro_inf: 14,
  menton: 152,
  labio_sup_ext: [61, 185, 40, 39, 37, 0, 267, 269, 270, 409, 291],
  labio_inf_ext: [291, 375, 321, 405, 314, 17, 84, 181, 91, 146, 61],
  labio_sup_int: [78, 191, 80, 81, 82, 13, 312, 311, 310, 415, 308],
  labio_inf_int: [308, 324, 318, 402, 317, 14, 87, 178, 88, 95, 78],
} as const;

/**
 * Hook de Visión Computacional — SMILE PRO.
 * Detecta landmarks faciales y activa el pipeline del motor core.
 */
export function useFaceEngine(): UseFaceEngineReturn {
  const [detectando, setDetectando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const landmarkerRef = useRef<{
    detect: (img: HTMLImageElement) => any;
  } | null>(null);
  const { generarDiseno } = useEditorStore();

  const inicializarMediaPipe = useCallback(async () => {
    if (landmarkerRef.current) return landmarkerRef.current;
    try {
      const { FaceLandmarker, FilesetResolver } =
        await import("@mediapipe/tasks-vision");
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm",
      );
      landmarkerRef.current = await FaceLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath:
            "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
          delegate: "GPU",
        },
        runningMode: "IMAGE",
        numFaces: 1,
      });
      return landmarkerRef.current;
    } catch (e) {
      throw new Error(`Error de red o GPU al inicializar IA: ${String(e)}`);
    }
  }, []);

  const detectar = useCallback(
    async (imagenEl: HTMLImageElement) => {
      setDetectando(true);
      setError(null);
      try {
        const landmarker = await inicializarMediaPipe();
        const resultado = landmarker.detect(imagenEl);
        if (!resultado?.faceLandmarks?.length)
          throw new Error("Rostro no detectado.");

        const lm = resultado.faceLandmarks[0];
        const iW = imagenEl.naturalWidth;
        const iH = imagenEl.naturalHeight;

        const toVec2 = (idx: number): Vec2 => ({
          x: lm[idx].x * iW,
          y: lm[idx].y * iH,
        });

        // Construir objeto de datos faciales PRO
        const cara: DatosFaciales = {
          puntos: lm.map((p: any) => ({ x: p.x * iW, y: p.y * iH })),
          anchoCara:
            Math.abs(
              lm[MP_IDX.ojo_der_externo].x - lm[MP_IDX.ojo_izq_externo].x,
            ) *
            iW *
            2,
          altoCara:
            Math.abs(lm[MP_IDX.menton].y - lm[MP_IDX.ojo_izq_externo].y) * iH,
          lineaMediaX: toVec2(MP_IDX.nariz_punta).x,
          lineaBipupilarY:
            (toVec2(MP_IDX.ojo_izq_externo).y +
              toVec2(MP_IDX.ojo_der_externo).y) /
            2,
          contornoLabios: (MP_IDX.labio_sup_ext as unknown as number[])
            .concat(MP_IDX.labio_inf_ext as unknown as number[])
            .map(toVec2),
          labiosExterior: (MP_IDX.labio_sup_ext as unknown as number[])
            .concat(MP_IDX.labio_inf_ext as unknown as number[])
            .map(toVec2),
          labiosInterior: (MP_IDX.labio_sup_int as unknown as number[])
            .concat(MP_IDX.labio_inf_int as unknown as number[])
            .map(toVec2),
        };

        // DISPARAR PIPELINE INTEGRADO (F6)
        generarDiseno(cara);
      } catch (e: any) {
        setError(e?.message);
      } finally {
        setDetectando(false);
      }
    },
    [generarDiseno, inicializarMediaPipe],
  );

  return { detectando, error, detectar };
}
