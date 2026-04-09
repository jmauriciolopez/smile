import { useEffect, useState } from 'react';
import { obtenerPacientePorId, type PacienteApi } from '../servicios/servicioPacientes';

export function usePacienteDetalle(id: string | undefined) {
  const [paciente, setPaciente] = useState<PacienteApi | null>(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    let vivo = true;
    setCargando(true);
    obtenerPacientePorId(id)
      .then((datos) => {
        if (vivo) setPaciente(datos);
      })
      .catch(() => {
        if (vivo) setError('No se pudo cargar el detalle del paciente.');
      })
      .finally(() => {
        if (vivo) setCargando(false);
      });

    return () => {
      vivo = false;
    };
  }, [id]);

  return { paciente, cargando, error };
}
