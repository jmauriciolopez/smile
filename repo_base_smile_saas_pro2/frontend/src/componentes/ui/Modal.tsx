import React, { ReactNode } from 'react';

interface ModalProps {
  abierto: boolean;
  alCerrar: () => void;
  titulo: string;
  children: ReactNode;
}

export function Modal({ abierto, alCerrar, titulo, children }: ModalProps) {
  if (!abierto) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300" 
        onClick={alCerrar}
      />
      
      {/* Contenido del Modal */}
      <div className="relative w-full max-w-lg scale-100 rounded-2xl bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-300">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-xl font-semibold text-slate-900">{titulo}</h3>
          <button 
            onClick={alCerrar}
            className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {children}
      </div>
    </div>
  );
}
