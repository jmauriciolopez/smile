import { useEffect, useState, useCallback } from 'react';
import { obtenerPacientePorId, actualizarPaciente, type PacienteApi } from '../servicios/servicioPacientes';

export function usePacienteDetalle(id: string | undefined) {
  const [paciente, setPaciente] = useState<PacienteApi | null>(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cargar = useCallback(() => {
    if (!id) return;
    setCargando(true);
    obtenerPacientePorId(id)
      .then((datos) => {
        setPaciente(datos);
        setError(null);
      })
      .catch(() => {
        setError('No se pudo cargar el detalle del paciente.');
      })
      .finally(() => {
        setCargando(false);
      });
  }, [id]);

  const actualizar = async (data: Partial<PacienteApi>) => {
    if (!id) return;
    try {
      await actualizarPaciente(id, data);
      await cargar();
    } catch (error) {
      console.error(error);
      throw new Error('Error al actualizar el paciente.');
    }
  };

  useEffect(() => {
    cargar();
  }, [cargar]);

  return { paciente, cargando, error, refrescar: cargar, actualizar };
}

