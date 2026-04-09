import React, { useState } from 'react';
import { Card } from '../../../componentes/ui/Card';
import { crearNota } from '../../../servicios/servicioNotas';

interface SeccionNotasClinicasProps {
  casoId: string;
  notasIniciales: any[];
  alActualizar: () => void;
}

export function SeccionNotasClinicas({ casoId, notasIniciales, alActualizar }: SeccionNotasClinicasProps) {
  const [nuevaNota, setNuevaNota] = useState('');
  const [enviando, setEnviando] = useState(false);

  const handleGuardarNota = async () => {
    if (!nuevaNota.trim()) return;
    setEnviando(true);
    try {
      await crearNota({
        caso_clinico_id: casoId,
        contenido: nuevaNota,
      });
      setNuevaNota('');
      alActualizar();
    } catch (error) {
      console.error(error);
      alert('Error al guardar la nota.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <Card titulo="Notas de Evolución">
      <div className="space-y-6">
        {/* Input para nueva nota */}
        <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-slate-50 p-1 focus-within:border-primario focus-within:bg-white transition-all">
          <textarea
            className="w-full resize-none border-none bg-transparent p-3 text-sm text-slate-700 outline-none placeholder:text-slate-400"
            rows={3}
            placeholder="Escribe una observación clínica o actualización del tratamiento..."
            value={nuevaNota}
            onChange={(e) => setNuevaNota(e.target.value)}
          />
          <div className="flex justify-end p-2 px-3 bg-white/50 backdrop-blur-sm border-t border-slate-100">
            <button
              onClick={handleGuardarNota}
              disabled={enviando || !nuevaNota.trim()}
              className="rounded-lg bg-primario px-4 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-primario/90 disabled:opacity-50 transition-all"
            >
              {enviando ? 'Guardando...' : 'Guardar Nota'}
            </button>
          </div>
        </div>

        {/* Listado de notas */}
        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
          {notasIniciales.length > 0 ? (
            notasIniciales.map((nota) => (
              <div key={nota.id} className="group rounded-xl border border-slate-100 bg-white p-4 shadow-sm hover:border-slate-200 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    {new Date(nota.fecha_creacion).toLocaleDateString()}
                  </span>
                  <div className="h-2 w-2 rounded-full bg-primario/40 group-hover:bg-primario transition-colors" />
                </div>
                <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {nota.contenido}
                </p>
              </div>
            ))
          ) : (
            <div className="py-8 text-center text-sm text-textoSecundario italic">
              No hay notas clínicas registradas aún.
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
