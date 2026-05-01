import React, { useState } from 'react';
import { Card } from '../../../componentes/ui/Card';
import { useNotas } from '../../../hooks/useNotas';

interface SeccionNotasClinicasProps {
  casoId: string;
}

export function SeccionNotasClinicas({ casoId }: SeccionNotasClinicasProps) {
  const { notas, agregar, eliminar, cargando } = useNotas(casoId);
  const [nuevaNota, setNuevaNota] = useState('');
  const [enviando, setEnviando] = useState(false);

  const handleGuardarNota = async () => {
    if (!nuevaNota.trim()) return;
    setEnviando(true);
    try {
      await agregar(nuevaNota);
      setNuevaNota('');
    } catch (error) {
      alert('Error al guardar la nota.');
    } finally {
      setEnviando(false);
    }
  };

  const handleEliminarNota = async (id: string) => {
    if (!confirm('¿Eliminar esta nota clínica?')) return;
    try {
      await eliminar(id);
    } catch (error) {
      alert('Error al eliminar la nota.');
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
          {cargando && notas.length === 0 ? (
            <p className="text-center text-xs text-slate-400 animate-pulse">Cargando notas...</p>
          ) : notas.length > 0 ? (
            notas.map((nota) => (
              <div key={nota.id} className="group rounded-xl border border-slate-100 bg-white p-4 shadow-sm hover:border-slate-200 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    {new Date(nota.fecha_creacion).toLocaleDateString()}
                  </span>
                  <button 
                    onClick={() => handleEliminarNota(nota.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-300 hover:text-red-500"
                  >
                    <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
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

