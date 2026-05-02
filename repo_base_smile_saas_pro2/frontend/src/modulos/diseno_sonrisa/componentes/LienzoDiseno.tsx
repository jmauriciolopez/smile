import React from "react";
import {
  Stage,
  Layer,
  Image as KImage,
  Line,
  Group,
  Path,
  Shape,
  Transformer,
} from "react-konva";
import useImage from "use-image";
import { useEditorStore } from "../../../store/editor-sonrisa.store";
import type Konva from "konva";

interface Props {
  width: number;
  height: number;
}

export const LienzoDiseno: React.FC<Props> = ({ width, height }) => {
  const {
    fotoUrl,
    dientes,
    guias,
    seleccionadoId,
    faceData,
    setSeleccionado,
    actualizarDiente,
  } = useEditorStore();

  const [image] = useImage(fotoUrl ?? "");

  const imageScale = image
    ? Math.min(width / image.width, height / image.height)
    : 1;
  const imageX = image ? (width - image.width * imageScale) / 2 : 0;
  const imageY = image ? (height - image.height * imageScale) / 2 : 0;

  /* ── Transformer ref ────────────────────────────────────────────────────── */
  const transformerRef = React.useRef<Konva.Transformer>(null);
  const shapeRefs = React.useRef<Record<string, Konva.Path>>({});

  React.useEffect(() => {
    if (!transformerRef.current) return;
    const node = seleccionadoId ? shapeRefs.current[seleccionadoId] : null;
    transformerRef.current.nodes(node ? [node] : []);
    transformerRef.current.getLayer()?.batchDraw();
  }, [seleccionadoId]);

  return (
    <div className="overflow-hidden rounded-b-2xl bg-slate-900">
      <Stage
        width={width}
        height={height}
        onMouseDown={(e) => {
          if (e.target === e.target.getStage()) setSeleccionado(null);
        }}
      >
        {/* ── CAPA 1: Foto del paciente ────────────────────────────────── */}
        <Layer listening={false}>
          {image && (
            <KImage
              image={image}
              x={imageX}
              y={imageY}
              scaleX={imageScale}
              scaleY={imageScale}
            />
          )}
        </Layer>

        {/* ── CAPA 2: Guías clínicas ───────────────────────────────────── */}
        <Layer listening={false}>
          {guias.map((g) =>
            g.visible ? (
              <Line
                key={g.id}
                points={
                  g.tipo === "vertical"
                    ? [g.posicion.x, 0, g.posicion.x, height]
                    : [0, g.posicion.y, width, g.posicion.y]
                }
                stroke={g.id === "guia-media" ? "#3b82f6" : "#a78bfa"}
                strokeWidth={1}
                dash={[10, 5]}
                opacity={0.45}
              />
            ) : null,
          )}
        </Layer>

        {/* ── CAPA 3: Máscara labial (FaceEngine) ─────────────────────── */}
        {faceData && (
          <Layer listening={false} opacity={0.25}>
            <Shape
              sceneFunc={(ctx) => {
                ctx.beginPath();
                const pts = faceData.lips.contornoCompleto;
                pts.forEach((p, i) => {
                  if (i === 0) ctx.moveTo(p.x, p.y);
                  else ctx.lineTo(p.x, p.y);
                });
                ctx.closePath();
                ctx.fillStyle = "rgba(251,146,60,0.35)";
                ctx.fill();
                ctx.strokeStyle = "#f97316";
                ctx.lineWidth = 1.5;
                ctx.stroke();
              }}
            />
          </Layer>
        )}

        {/* ── CAPA 4: Dientes manipulables ────────────────────────────── */}
        <Layer>
          {dientes.map((diente) =>
            diente.visible ? (
              <Group
                key={diente.id}
                draggable
                x={diente.transform.x}
                y={diente.transform.y}
                rotation={diente.transform.rotation}
                scaleX={diente.transform.scaleX}
                scaleY={diente.transform.scaleY}
                onClick={() => setSeleccionado(diente.id)}
                onTap={() => setSeleccionado(diente.id)}
                onDragEnd={(e) =>
                  actualizarDiente(diente.id, {
                    x: e.target.x(),
                    y: e.target.y(),
                  })
                }
                onTransformEnd={(e) =>
                  actualizarDiente(diente.id, {
                    x: e.target.x(),
                    y: e.target.y(),
                    rotation: e.target.rotation(),
                    scaleX: e.target.scaleX(),
                    scaleY: e.target.scaleY(),
                  })
                }
              >
                <Path
                  ref={(node) => {
                    if (node) shapeRefs.current[diente.id] = node;
                  }}
                  data={diente.svgPath}
                  fill="rgba(255,255,255,0.92)"
                  stroke={
                    seleccionadoId === diente.id
                      ? "#3b82f6"
                      : "rgba(200,200,210,0.4)"
                  }
                  strokeWidth={seleccionadoId === diente.id ? 2 : 0.8}
                  opacity={diente.opacity}
                  shadowBlur={seleccionadoId === diente.id ? 16 : 6}
                  shadowColor="rgba(255,255,255,0.7)"
                  fillLinearGradientStartPoint={{ x: 50, y: 0 }}
                  fillLinearGradientEndPoint={{ x: 50, y: 160 }}
                  fillLinearGradientColorStops={[
                    0,
                    "rgba(255,255,255,1)",
                    0.6,
                    "rgba(240,244,255,0.95)",
                    1,
                    "rgba(210,220,240,0.85)",
                  ]}
                />
              </Group>
            ) : null,
          )}

          <Transformer
            ref={transformerRef}
            rotateEnabled
            enabledAnchors={[
              "top-left",
              "top-right",
              "bottom-left",
              "bottom-right",
              "middle-left",
              "middle-right",
            ]}
            boundBoxFunc={(oldBox, newBox) =>
              newBox.width < 10 || newBox.height < 10 ? oldBox : newBox
            }
          />
        </Layer>
      </Stage>
    </div>
  );
};
