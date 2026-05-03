import React, { useState, useEffect } from "react";
import { Stage, Layer, Path, Circle } from "react-konva";
import { useSignatureStore } from "../store/signature-design.store";

export const LipSegmenter: React.FC<{ width: number; height: number }> = ({
  width,
  height,
}) => {
  const { lipPoints, setLipPoints, showMask } = useSignatureStore();
  const [points, setPoints] = useState(lipPoints);

  // Inicializar puntos si está vacío (forma de boca genérica)
  useEffect(() => {
    if (lipPoints.length === 0) {
      const initialPoints = [
        { x: width * 0.4, y: height * 0.5 },
        { x: width * 0.5, y: height * 0.45 },
        { x: width * 0.6, y: height * 0.5 },
        { x: width * 0.5, y: height * 0.55 },
      ];
      setPoints(initialPoints);
      setLipPoints(initialPoints);
    }
  }, [width, height, lipPoints, setLipPoints]);

  const handleDrag = (index: number, e: any) => {
    const newPoints = [...points];
    newPoints[index] = { x: e.target.x(), y: e.target.y() };
    setPoints(newPoints);
    setLipPoints(newPoints);
  };

  // Generar SVG Path para Bezier
  const getPathData = () => {
    if (points.length < 4) return "";
    const [p1, p2, p3, p4] = points;
    // Simplificación de curva: superior + inferior
    return `M ${p1.x} ${p1.y} Q ${p2.x} ${p2.y} ${p3.x} ${p3.y} Q ${p4.x} ${p4.y} ${p1.x} ${p1.y}`;
  };

  if (!showMask) return null;

  return (
    <div className="absolute inset-0 z-20 pointer-events-none">
      <Stage width={width} height={height} className="pointer-events-auto">
        <Layer>
          {/* La máscara visual */}
          <Path
            data={getPathData()}
            fill="rgba(59, 130, 246, 0.2)"
            stroke="#3b82f6"
            strokeWidth={2}
            dash={[5, 5]}
          />

          {/* Puntos de control */}
          {points.map((p, i) => (
            <Circle
              key={i}
              x={p.x}
              y={p.y}
              radius={6}
              fill="white"
              stroke="#3b82f6"
              strokeWidth={2}
              draggable
              onDragMove={(e) => handleDrag(i, e)}
              shadowBlur={5}
              shadowColor="rgba(0,0,0,0.2)"
            />
          ))}
        </Layer>
      </Stage>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-none">
        <div className="rounded-full bg-slate-900/80 px-4 py-2 text-[10px] font-bold text-white backdrop-blur-md shadow-xl border border-white/10">
          👄 Ajusta los puntos para definir el contorno de la sonrisa
        </div>
      </div>
    </div>
  );
};
