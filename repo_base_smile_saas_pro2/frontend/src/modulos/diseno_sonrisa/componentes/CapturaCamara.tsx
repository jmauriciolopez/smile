import React, { useRef, useState, useEffect } from "react";

type Props = {
  onCaptura: (file: File) => void;
  onCerrar: () => void;
};

export function CapturaCamara({ onCaptura, onCerrar }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let currentStream: MediaStream | null = null;
    async function iniciarCamara() {
      try {
        const s = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "user",
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
        });
        currentStream = s;
        setStream(s);
        if (videoRef.current) {
          videoRef.current.srcObject = s;
        }
      } catch (err) {
        setError(
          "No se pudo acceder a la cámara. Por favor, verifica los permisos.",
        );
        console.error(err);
      }
    }
    iniciarCamara();

    return () => {
      if (currentStream) {
        currentStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const capturar = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const file = new File([blob], `captura_${Date.now()}.jpg`, {
              type: "image/jpeg",
            });
            onCaptura(file);
            onCerrar();
          }
        },
        "image/jpeg",
        0.95,
      );
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl rounded-3xl bg-white shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <span className="text-xl">📷</span> Capturar Foto Clínica
          </h3>
          <button
            onClick={onCerrar}
            className="text-slate-400 hover:text-slate-600 transition"
          >
            ✕
          </button>
        </div>

        <div className="relative aspect-video bg-slate-900 flex items-center justify-center">
          {error ? (
            <div className="text-center p-6 space-y-3">
              <p className="text-red-400 font-medium">⚠️ {error}</p>
              <button
                onClick={onCerrar}
                className="rounded-xl bg-white/10 px-4 py-2 text-xs text-white hover:bg-white/20 transition"
              >
                Volver
              </button>
            </div>
          ) : (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="h-full w-full object-cover mirror"
                style={{ transform: "scaleX(-1)" }} // Espejo para selfie
              />
              <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-4">
                <button
                  onClick={capturar}
                  className="h-16 w-16 rounded-full bg-white border-4 border-slate-200 flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all"
                >
                  <div className="h-10 w-10 rounded-full bg-red-500 animate-pulse" />
                </button>
              </div>
            </>
          )}
        </div>

        <canvas ref={canvasRef} className="hidden" />

        <div className="px-6 py-4 bg-slate-50 flex justify-end gap-3">
          <button
            onClick={onCerrar}
            className="px-4 py-2 text-sm font-medium text-slate-500 hover:text-slate-700"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
