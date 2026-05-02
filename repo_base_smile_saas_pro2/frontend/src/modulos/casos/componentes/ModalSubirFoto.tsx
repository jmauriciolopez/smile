import React, { useState } from "react";
import { Modal } from "../../../componentes/ui/Modal";
import { useFotos } from "../../../hooks/useFotos";

interface ModalSubirFotoProps {
  abierto: boolean;
  alCerrar: () => void;
  casoId: string;
}

export function ModalSubirFoto({
  abierto,
  alCerrar,
  casoId,
}: ModalSubirFotoProps) {
  const { subir } = useFotos(casoId);
  const [enviando, setEnviando] = useState(false);
  const [formData, setFormData] = useState({
    url_foto: "",
    tipo: "frontal",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);
    try {
      await subir(formData.url_foto, formData.tipo);
      alCerrar();
      setFormData({ url_foto: "", tipo: "frontal" });
    } catch (error) {
      alert("Error al registrar la foto.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <Modal
      abierto={abierto}
      alCerrar={alCerrar}
      titulo="Subir Registro Fotográfico"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700">
            URL de la Imagen
          </label>
          <input
            required
            type="url"
            placeholder="https://ejemplo.com/foto.jpg"
            className="mt-1 block w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 focus:border-primario focus:bg-white focus:outline-none focus:ring-2 focus:ring-primario/20 transition-all font-sans"
            value={formData.url_foto}
            onChange={(e) =>
              setFormData({ ...formData, url_foto: e.target.value })
            }
          />
          <p className="mt-2 text-[10px] text-textoSecundario uppercase tracking-tighter">
            * En esta versión demo, pega el link de una imagen pública.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">
            Tipo de Toma
          </label>
          <select
            className="mt-1 block w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 focus:border-primario focus:bg-white focus:outline-none focus:ring-2 focus:ring-primario/20 transition-all font-sans appearance-none"
            value={formData.tipo}
            onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
          >
            <option value="frontal">Frontal</option>
            <option value="sonrisa">Sonrisa</option>
            <option value="perfil">Perfil</option>
            <option value="oclusal_superior">Oclusal Superior</option>
            <option value="oclusal_inferior">Oclusal Inferior</option>
          </select>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={alCerrar}
            className="rounded-xl px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={enviando}
            className="rounded-xl bg-primario px-6 py-2 text-sm font-medium text-white shadow-lg shadow-primario/20 hover:bg-primario/90 disabled:opacity-50 transition-all"
          >
            {enviando ? "Subiendo..." : "Registrar Foto"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
