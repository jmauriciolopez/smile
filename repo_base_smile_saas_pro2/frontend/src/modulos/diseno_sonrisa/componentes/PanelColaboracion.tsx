/**
 * PANEL COLABORACIÓN — Fase E (Live Design Room)
 *
 * Stub navegable del ecosistema colaborativo.
 * Arquitectura preparada para WebSockets (Socket.io).
 * La conexión real se activa cuando el backend de Fase E esté disponible.
 *
 * Estado actual: UI funcional con simulación de presencia.
 * Próximo paso: conectar useColaboracion() a Socket.io real.
 */

import React, { useState } from 'react';

interface Participante {
  id:     string;
  nombre: string;
  rol:    'odontologo' | 'tecnico' | 'paciente';
  activo: boolean;
  color:  string;
}

// Participantes simulados para demo
const PARTICIPANTES_DEMO: Participante[] = [
  { id: '1', nombre: 'Dr. García',    rol: 'odontologo', activo: true,  color: '#3b82f6' },
  { id: '2', nombre: 'Tec. Martínez', rol: 'tecnico',    activo: false, color: '#8b5cf6' },
  { id: '3', nombre: 'Paciente',      rol: 'paciente',   activo: false, color: '#10b981' },
];

const ROL_LABEL: Record<string, string> = {
  odontologo: 'Odontólogo',
  tecnico:    'Técnico Lab',
  paciente:   'Paciente',
};

export const PanelColaboracion: React.FC = () => {
  const [copiado, setCopiado] = useState(false);
  const codigoSesion = 'SMILE-' + Math.random().toString(36).slice(2, 8).toUpperCase();

  const copiarCodigo = () => {
    navigator.clipboard.writeText(codigoSesion).catch(() => {});
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  return (
    <div className="space-y-4 text-xs">

      {/* Estado de conexión */}
      <div className="rounded-xl bg-amber-50 border border-amber-100 p-3 flex items-start gap-2">
        <span className="text-amber-500 text-base leading-none mt-0.5">⚡</span>
        <div>
          <p className="font-bold text-amber-700">Fase E — Colaboración en tiempo real</p>
          <p className="text-amber-600 mt-0.5 leading-relaxed">
            El servidor WebSockets se activa en Fase E. Esta UI está lista para conectarse.
          </p>
        </div>
      </div>

      {/* Código de sesión */}
      <div className="rounded-xl border border-slate-200 bg-white p-3 space-y-2">
        <p className="font-bold uppercase tracking-wider text-slate-400 text-[10px]">🔗 Código de sesión</p>
        <div className="flex items-center gap-2">
          <code className="flex-1 rounded-lg bg-slate-100 px-3 py-2 font-mono text-sm font-bold text-slate-700 tracking-widest">
            {codigoSesion}
          </code>
          <button
            onClick={copiarCodigo}
            className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-500 hover:bg-slate-50 transition"
          >
            {copiado ? '✓' : '📋'}
          </button>
        </div>
        <p className="text-[10px] text-slate-400">Compartí este código con el técnico o paciente para unirse a la sesión.</p>
      </div>

      {/* Participantes */}
      <div className="rounded-xl border border-slate-200 bg-white p-3 space-y-2">
        <p className="font-bold uppercase tracking-wider text-slate-400 text-[10px]">👥 Participantes</p>
        <div className="space-y-2">
          {PARTICIPANTES_DEMO.map(p => (
            <div key={p.id} className="flex items-center gap-2.5">
              <div
                className="h-7 w-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0"
                style={{ backgroundColor: p.color }}
              >
                {p.nombre.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-slate-700 truncate">{p.nombre}</p>
                <p className="text-[10px] text-slate-400">{ROL_LABEL[p.rol]}</p>
              </div>
              <span className={`h-2 w-2 rounded-full flex-shrink-0 ${p.activo ? 'bg-emerald-400' : 'bg-slate-200'}`} />
            </div>
          ))}
        </div>
        <button
          disabled
          className="w-full mt-1 rounded-xl border border-dashed border-slate-200 py-2 text-[10px] text-slate-400 cursor-not-allowed"
        >+ Invitar participante (Fase E)</button>
      </div>

      {/* Chat simulado */}
      <div className="rounded-xl border border-slate-200 bg-white p-3 space-y-2">
        <p className="font-bold uppercase tracking-wider text-slate-400 text-[10px]">💬 Chat de sesión</p>
        <div className="rounded-lg bg-slate-50 p-2 space-y-1.5 min-h-[60px]">
          <div className="flex gap-1.5">
            <span className="font-bold text-blue-600">Dr. García:</span>
            <span className="text-slate-600">¿Qué te parece el ancho de los centrales?</span>
          </div>
          <div className="flex gap-1.5">
            <span className="font-bold text-violet-600">Tec. Martínez:</span>
            <span className="text-slate-600">Perfecto, puedo fabricarlo así.</span>
          </div>
        </div>
        <div className="flex gap-2">
          <input
            disabled
            placeholder="Mensaje… (disponible en Fase E)"
            className="flex-1 rounded-lg border border-slate-200 px-2 py-1.5 text-[10px] bg-slate-50 text-slate-400 cursor-not-allowed"
          />
          <button disabled className="rounded-lg bg-slate-200 px-3 py-1.5 text-[10px] text-slate-400 cursor-not-allowed">
            →
          </button>
        </div>
      </div>

    </div>
  );
};
