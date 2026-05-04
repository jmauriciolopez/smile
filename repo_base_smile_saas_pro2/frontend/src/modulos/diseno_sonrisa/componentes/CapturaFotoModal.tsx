import React, { useRef, useState } from "react";
import { Modal } from "../../../componentes/ui/Modal";
import { Camera, Upload, Trash, CheckCircle, Aperture } from "@phosphor-icons/react";
import { motion, AnimatePresence } from "framer-motion";

interface CapturaFotoModalProps {
  abierto: boolean;
  alCerrar: () => void;
  alCapturar: (fotoUrl: string) => void;
  titulo: string;
}

export function CapturaFotoModal({
  abierto,
  alCerrar,
  alCapturar,
  titulo,
}: CapturaFotoModalProps) {
  const [modo, setModo] = useState<"seleccion" | "camara" | "preview">("seleccion");
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const iniciarCamara = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      streamRef.current = stream;
      setModo("camara");
    } catch (err) {
      console.error("Error al acceder a la cámara:", err);
      alert("No se pudo acceder a la cámara. Verifica los permisos.");
    }
  };

  const detenerCamara = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  const capturar = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
        setFotoPreview(dataUrl);
        setModo("preview");
        detenerCamara();
      }
    }
  };

  const manejarFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFotoPreview(event.target?.result as string);
        setModo("preview");
      };
      reader.readAsDataURL(file);
    }
  };

  const confirmar = () => {
    if (fotoPreview) {
      alCapturar(fotoPreview);
      limpiarYCerrar();
    }
  };

  const limpiarYCerrar = () => {
    detenerCamara();
    setFotoPreview(null);
    setModo("seleccion");
    alCerrar();
  };

  return (
    <Modal abierto={abierto} alCerrar={limpiarYCerrar} titulo={titulo}>
      <div className="min-h-[350px] flex flex-col items-center justify-center p-2">
        <AnimatePresence mode="wait">
          {modo === "seleccion" && (
            <motion.div
              key="seleccion"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-2 gap-4 w-full"
            >
              <button
                onClick={iniciarCamara}
                className="flex flex-col items-center gap-4 p-8 rounded-[2rem] border-2 border-dashed border-slate-200 hover:border-emerald-500 hover:bg-emerald-500/5 transition-all group"
              >
                <div className="p-4 rounded-full bg-slate-100 group-hover:bg-emerald-500 text-slate-400 group-hover:text-white transition-all">
                  <Camera size={32} weight="duotone" />
                </div>
                <span className="text-xs font-black text-slate-600 uppercase tracking-widest">Cámara Nativa</span>
              </button>

              <label className="flex flex-col items-center gap-4 p-8 rounded-[2rem] border-2 border-dashed border-slate-200 hover:border-blue-500 hover:bg-blue-500/5 transition-all group cursor-pointer">
                <input type="file" className="hidden" accept="image/*" onChange={manejarFileUpload} />
                <div className="p-4 rounded-full bg-slate-100 group-hover:bg-blue-500 text-slate-400 group-hover:text-white transition-all">
                  <Upload size={32} weight="duotone" />
                </div>
                <span className="text-xs font-black text-slate-600 uppercase tracking-widest">Subir Archivo</span>
              </label>
            </motion.div>
          )}

          {modo === "camara" && (
            <motion.div
              key="camara"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative w-full aspect-square md:aspect-video rounded-[2rem] overflow-hidden bg-black shadow-2xl"
            >
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover scale-x-[-1]"
              />

              {/* 🎯 GUÍAS DE ALINEACIÓN CLÍNICA */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <svg className="w-full h-full opacity-40" viewBox="0 0 100 100">
                  {/* Línea Media Facial */}
                  <line x1="50" y1="0" x2="50" y2="100" stroke="white" strokeWidth="0.2" strokeDasharray="1,1" />
                  
                  {/* Zona de Interés (Boca) */}
                  <ellipse cx="50" cy="65" rx="30" ry="15" fill="none" stroke="white" strokeWidth="0.3" strokeDasharray="2,2" />
                  
                  {/* Referencias Pupilares */}
                  <line x1="30" y1="35" x2="70" y2="35" stroke="white" strokeWidth="0.1" />
                  <circle cx="30" cy="35" r="1" fill="none" stroke="white" strokeWidth="0.1" />
                  <circle cx="70" cy="35" r="1" fill="none" stroke="white" strokeWidth="0.1" />
                  
                  <text x="50" y="95" textAnchor="middle" fill="white" className="text-[2px] font-black uppercase tracking-[0.2em]">
                    Alinee el plano bipupilar y la línea media
                  </text>
                </svg>
              </div>

              <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-4 z-10">
                <button
                  onClick={capturar}
                  className="p-6 rounded-full bg-white text-emerald-600 shadow-2xl hover:scale-110 active:scale-90 transition-all border-4 border-emerald-500/20"
                >
                  <Aperture size={40} weight="fill" className="animate-spin-slow" />
                </button>
                <button
                  onClick={() => {
                    detenerCamara();
                    setModo("seleccion");
                  }}
                  className="p-4 rounded-full bg-black/40 backdrop-blur-xl text-white border border-white/20 hover:bg-red-500 transition-all"
                >
                  <Trash size={24} />
                </button>
              </div>
            </motion.div>
          )}

          {modo === "preview" && (
            <motion.div
              key="preview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="relative w-full aspect-square md:aspect-video rounded-[2rem] overflow-hidden bg-slate-100"
            >
              <img src={fotoPreview!} className="w-full h-full object-cover" alt="Preview" />
              <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-black/80 to-transparent flex items-center justify-center gap-4">
                <button
                  onClick={confirmar}
                  className="flex items-center gap-2 px-10 py-4 rounded-full bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest shadow-2xl hover:bg-emerald-400 transition-all btn-tactile"
                >
                  <CheckCircle size={20} weight="fill" />
                  Confirmar Fotografía
                </button>
                <button
                  onClick={() => setModo("seleccion")}
                  className="p-4 rounded-full bg-white/20 backdrop-blur-xl text-white border border-white/20 hover:bg-red-500 transition-all"
                >
                  <Trash size={24} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Modal>
  );
}
