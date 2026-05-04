import React, { useState, useRef } from "react";
import { Modal } from "../../../componentes/ui/Modal";
import { useFotos } from "../../../hooks/useFotos";
import { subirArchivo, dataUrlABlob } from "../../../servicios/servicioArchivos";
import { Upload, Camera, CheckCircle, CircleNotch, Trash } from "@phosphor-icons/react";

interface ModalSubirFotoProps {
  abierto: boolean;
  alCerrar: () => void;
  casoId: string;
}

export function ModalSubirFoto({ abierto, alCerrar, casoId }: ModalSubirFotoProps) {
  const { subir } = useFotos(casoId);
  const [enviando, setEnviando] = useState(false);
  const [tipo, setTipo] = useState("frontal");
  const [preview, setPreview] = useState<string | null>(null);
  const [archivoSeleccionado, setArchivoSeleccionado] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setArchivoSeleccionado(file);
    const reader = new FileReader();
    reader.onload = (ev) => setPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!archivoSeleccionado && !preview) return;
    setEnviando(true);
    try {
      const blob = archivoSeleccionado ?? dataUrlABlob(preview!);
      const resultado = await subirArchivo(blob, "foto_clinica", archivoSeleccionado?.name);
      const urlFinal = resultado.url_cdn || resultado.url;
      await subir(urlFinal, tipo);
      handleCerrar();
    } catch (error: any) {
      alert(`Error al subir la foto: ${error?.message || "Error desconocido"}`);
    } finally {
      setEnviando(false);
    }
  };

  const handleCerrar = () => {
    setPreview(null);
    setArchivoSeleccionado(null);
    setTipo("frontal");
    if (inputRef.current) inputRef.current.value = "";
    alCerrar();
  };

  return (
    <Modal abierto={abierto} alCerrar={handleCerrar} titulo="Subir Registro Fotográfico">
      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Zona de drop / preview */}
        {preview ? (
          <div className="relative rounded-xl overflow-hidden aspect-video bg-slate-100">
            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => {
                setPreview(null);
                setArchivoSeleccionado(null);
                if (inputRef.current) inputRef.current.value = "";
              }}
              className="absolute top-2 right-2 p-1.5 rounded-full bg-red-500/80 text-white hover:bg-red-600 transition-colors"
            >
              <Trash size={14} weight="bold" />
            </button>
          </div>
        ) : (
          <label className="flex flex-col items-center gap-3 p-8 rounded-xl border-2 border-dashed border-slate-200 hover:border-primario/50 hover:bg-primario/[0.02] transition-all cursor-pointer group">
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
            <div className="p-3 rounded-full bg-slate-100 group-hover:bg-primario/10 transition-colors">
              <Camera size={28} weight="duotone" className="text-slate-400 group-hover:text-primario" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-slate-600 group-hover:text-primario">
                Haz click o arrastra una imagen
              </p>
              <p className="text-xs text-slate-400 mt-0.5">JPG, PNG, WEBP — máx. 20MB</p>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Upload size={12} />
              <span>Seleccionar archivo</span>
            </div>
          </label>
        )}

        {/* Tipo de toma */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Tipo de Toma
          </label>
          <select
            className="block w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 focus:border-primario focus:bg-white focus:outline-none focus:ring-2 focus:ring-primario/20 transition-all appearance-none"
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
          >
            <option value="frontal">Frontal</option>
            <option value="sonrisa">Sonrisa</option>
            <option value="perfil">Perfil</option>
            <option value="oclusal_superior">Oclusal Superior</option>
            <option value="oclusal_inferior">Oclusal Inferior</option>
          </select>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={handleCerrar}
            className="rounded-xl px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={enviando || !preview}
            className="flex items-center gap-2 rounded-xl bg-primario px-6 py-2 text-sm font-medium text-white shadow-lg shadow-primario/20 hover:bg-primario/90 disabled:opacity-50 transition-all"
          >
            {enviando ? (
              <>
                <CircleNotch size={16} weight="bold" className="animate-spin" />
                Subiendo...
              </>
            ) : (
              <>
                <CheckCircle size={16} weight="fill" />
                Registrar Foto
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}
