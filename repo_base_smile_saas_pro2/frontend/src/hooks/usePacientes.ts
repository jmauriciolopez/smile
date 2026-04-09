import { useEffect, useState } from 'react';
import { obtenerPacientes, type PacienteApi } from '../servicios/servicioPacientes';

export function usePacientes() {
  const [pacientes, setPacientes] = useState<PacienteApi[]>([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let vivo = true;
    setCargando(true);
    obtenerPacientes()
      .then((datos) => {
        if (vivo) setPacientes(datos);
      })
      .catch(() => {
        if (vivo) setError('No se pudieron cargar los pacientes.');
      })
      .finally(() => {
        if (vivo) setCargando(false);
      });

    return () => {
      vivo = false;
    };
  }, []);

  return { pacientes, cargando, error };
}
