import { useEffect, useState } from 'react';
import { obtenerPacientes, type PacienteApi } from '../servicios/servicioPacientes';

export function usePacientes() {
  const [pacientes, setPacientes] = useState<PacienteApi[]>([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cargarDatos = () => {
    setCargando(true);
    obtenerPacientes()
      .then((datos) => {
        setPacientes(datos);
      })
      .catch(() => {
        setError('No se pudieron cargar los pacientes.');
      })
      .finally(() => {
        setCargando(false);
      });
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  return { pacientes, cargando, error, refrescar: cargarDatos };
}
