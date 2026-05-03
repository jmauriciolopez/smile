import React from "react";
import { useEditorStore } from "../../../store/editor-sonrisa.store";
import { PLANTILLAS_PREDEFINIDAS } from "../../../motor/plantilla-engine/seed";

export const PanelPlantillas: React.FC = () => {
  const { aplicarPlantilla } = useEditorStore();

  return (
    <div className="p-4">
      <h3 className="font-bold mb-4">Librería de Sonrisas</h3>
      <div className="grid grid-cols-1 gap-2">
        {PLANTILLAS_PREDEFINIDAS.map((p) => (
          <button
            key={p.id}
            onClick={() => aplicarPlantilla(p)}
            className="p-3 bg-slate-800 hover:bg-blue-900 rounded text-left transition-colors"
          >
            <div className="font-semibold">{p.nombre}</div>
            <div className="text-xs text-slate-400">{p.categoria}</div>
          </button>
        ))}
      </div>
    </div>
  );
};
