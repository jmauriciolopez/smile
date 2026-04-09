import React, { useState } from 'react';
import { Modal } from '../../../componentes/ui/Modal';
import { crearPaciente } from '../../../servicios/servicioPacientes';

interface ModalNuevoPacienteProps {
  abierto: boolean;
  alCerrar: () => void;
  alGuardar: () => void;
}

export function ModalNuevoPaciente({ abierto, alCerrar, alGuardar }: ModalNuevoPacienteProps) {
  const [enviando, setEnviando] = useState(false);
  const [formData, setFormData] = useState({
    nombre_completo: '',
    email: '',
    telefono: '',
    ciudad: '',
    observaciones_generales: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);
    try {
      await crearPaciente(formData);
      alGuardar();
      alCerrar();
      setFormData({
        nombre_completo: '',
        email: '',
        telefono: '',
        ciudad: '',
        observaciones_generales: '',
      });
    } catch (error) {
      console.error('Error al crear paciente:', error);
      alert('Error al crear el paciente. Por favor, reintente.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <Modal abierto={abierto} alCerrar={alCerrar} titulo="Registrar Nuevo Paciente">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700">Nombre Completo *</label>
          <input
            required
            type="text"
            className="mt-1 block w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 focus:border-primario focus:bg-white focus:outline-none focus:ring-2 focus:ring-primario/20 transition-all font-sans"
            value={formData.nombre_completo}
            onChange={(e) => setFormData({ ...formData, nombre_completo: e.target.value })}
            placeholder="Ej: Juan Pérez"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-slate-700">Email</label>
            <input
              type="email"
              className="mt-1 block w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 focus:border-primario focus:bg-white focus:outline-none focus:ring-2 focus:ring-primario/20 transition-all font-sans"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="correo@ejemplo.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Teléfono</label>
            <input
              type="text"
              className="mt-1 block w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 focus:border-primario focus:bg-white focus:outline-none focus:ring-2 focus:ring-primario/20 transition-all font-sans"
              value={formData.telefono}
              onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
              placeholder="+54 11 ..."
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">Ciudad</label>
          <input
            type="text"
            className="mt-1 block w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 focus:border-primario focus:bg-white focus:outline-none focus:ring-2 focus:ring-primario/20 transition-all font-sans"
            value={formData.ciudad}
            onChange={(e) => setFormData({ ...formData, ciudad: e.target.value })}
          />
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={alCerrar}
            className="rounded-xl px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={enviando}
            className="rounded-xl bg-primario px-6 py-2 text-sm font-medium text-white shadow-lg shadow-primario/20 hover:bg-primario/90 disabled:opacity-50 transition-all"
          >
            {enviando ? 'Guardando...' : 'Guardar Paciente'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
