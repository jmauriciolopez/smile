type Props = {
  texto: string;
};

export function BadgeEstado({ texto }: Props) {
  const mapa: Record<string, string> = {
    nuevo: 'bg-blue-50 text-primario',
    en_negociacion: 'bg-amber-50 text-amber-700',
    aprobado: 'bg-emerald-50 text-emerald-700',
    borrador: 'bg-slate-100 text-slate-700',
    presentado: 'bg-blue-50 text-blue-700',
    en_seguimiento: 'bg-violet-50 text-violet-700',
  };

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-medium ${mapa[texto] || 'bg-slate-100 text-slate-700'}`}>
      {texto.replace(/_/g, ' ')}
    </span>
  );
}
