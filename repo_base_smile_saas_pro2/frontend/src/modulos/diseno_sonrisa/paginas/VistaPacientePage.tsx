import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

/**
 * VISTA PACIENTE — Portal del Paciente (Fase E)
 * Ruta pública para que el paciente vea su diseño sin login.
 */
export const VistaPacientePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [diseno, setDiseno] = useState<any>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    // Simulación de carga de datos públicos del diseño
    // En producción: fetch(`${API_URL}/disenos/publico/${id}`)
    setTimeout(() => {
      setDiseno({
        id,
        paciente: "Juan Pérez",
        doctor: "Dra. García",
        clinica: "Smile Center Pro",
        imagen_antes: "/mock/antes.jpg",
        imagen_despues: "/mock/despues.jpg",
        fecha: new Date().toLocaleDateString(),
      });
      setCargando(false);
    }, 1000);
  }, [id]);

  if (cargando)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      {/* Header Público */}
      <header className="bg-white border-b px-6 py-4 flex justify-between items-center sticky top-0 z-10 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-indigo-900">
            Smile Design Portal
          </h1>
          <p className="text-xs text-gray-500">Propuesta de Diseño Estético</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium">{diseno.clinica}</p>
          <p className="text-xs text-gray-400">{diseno.fecha}</p>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-6 space-y-8">
        {/* Bienvenida */}
        <section className="text-center py-8">
          <h2 className="text-3xl font-extrabold text-gray-900">
            ¡Hola, {diseno.paciente}!
          </h2>
          <p className="mt-2 text-lg text-gray-600">
            Aquí tienes el resultado proyectado de tu nueva sonrisa.
          </p>
        </section>

        {/* Comparador Antes y Después */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
            <div className="px-4 py-2 bg-gray-100 text-xs font-bold uppercase tracking-wider text-gray-500">
              Estado Actual
            </div>
            <img
              src={diseno.imagen_antes}
              alt="Antes"
              className="w-full h-[400px] object-cover"
            />
          </div>
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-indigo-500 transform hover:scale-[1.02] transition-transform duration-300">
            <div className="px-4 py-2 bg-indigo-600 text-xs font-bold uppercase tracking-wider text-white">
              Nueva Sonrisa
            </div>
            <img
              src={diseno.imagen_despues}
              alt="Después"
              className="w-full h-[400px] object-cover"
            />
          </div>
        </div>

        {/* Mensaje del Doctor */}
        <section className="bg-indigo-50 rounded-2xl p-8 border border-indigo-100">
          <div className="flex items-start space-x-4">
            <div className="h-12 w-12 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">
              DG
            </div>
            <div>
              <h3 className="text-lg font-bold text-indigo-900">
                Nota de tu Especialista
              </h3>
              <p className="text-indigo-800 mt-1 leading-relaxed">
                "Hemos diseñado una armonía dental basada en tus proporciones
                faciales (Visagismo). El objetivo es lograr un blanco natural
                que complemente tu rostro, mejorando tanto la estética como la
                función."
              </p>
              <p className="mt-4 text-sm font-bold text-indigo-700">
                — {diseno.doctor}
              </p>
            </div>
          </div>
        </section>

        {/* Botón de Acción */}
        <div className="flex justify-center pt-8">
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-full text-lg font-bold shadow-xl hover:shadow-indigo-200 transition-all">
            Solicitar Cita de Inicio
          </button>
        </div>
      </main>

      <footer className="text-center py-12 text-gray-400 text-sm">
        © 2026 {diseno.clinica} • Impulsado por Smile Design System
      </footer>
    </div>
  );
};
