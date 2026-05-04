import { ReactNode } from "react";

type Props = {
  titulo?: string;
  accion?: ReactNode;
  children: ReactNode;
};

export function Card({ titulo, accion, children }: Props) {
  return (
    <section className="rounded-2xl bg-superficie p-6 shadow-suave">
      {(titulo || accion) && (
        <div className="mb-4 flex items-center justify-between">
          {titulo && <h2 className="text-lg font-semibold">{titulo}</h2>}
          {accion && <div>{accion}</div>}
        </div>
      )}
      {children}
    </section>
  );
}
