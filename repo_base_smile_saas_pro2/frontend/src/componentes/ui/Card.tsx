import { ReactNode } from 'react';

type Props = {
  titulo?: string;
  children: ReactNode;
};

export function Card({ titulo, children }: Props) {
  return (
    <section className="rounded-2xl bg-superficie p-6 shadow-suave">
      {titulo ? <h2 className="mb-4 text-lg font-semibold">{titulo}</h2> : null}
      {children}
    </section>
  );
}
