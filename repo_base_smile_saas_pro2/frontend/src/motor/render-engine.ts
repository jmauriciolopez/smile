/**
 * RENDER ENGINE PRO
 * Motor de composición de imagen para el render final.
 *
 * Pipeline:
 *   Blueprint (JSON) + Foto base (alta resolución)
 *   → OffscreenCanvas (sin bloquear UI)
 *   → Dibujar foto base
 *   → Sombra bajo labio superior (si hay FaceData)
 *   → Dientes con material real (translucidez + reflectividad)
 *   → Highlight de esmalte (screen blending)
 *   → Zona de sonrisa overlay (si hay FaceData)
 *   → Guías clínicas (opcional)
 *   → Watermark
 *   → Exportar Blob PNG/JPG
 */

import type { FaceData } from "./tipos-faciales";
import { expandirBoundingBox } from "./tipos-faciales";
import type { Diente, Guia } from "../store/editor-sonrisa.store";

export interface ConfigRender {
  foto: HTMLImageElement;
  dientes: Diente[];
  guias: Guia[];
  faceData?: FaceData | null;
  ancho: number;
  alto: number;
  formato: "png" | "jpg";
  calidad: number; // 0..1
  incluirGuias: boolean;
}

export interface ResultadoRender {
  blob: Blob;
  dataUrl: string;
  ancho: number;
  alto: number;
}

type Ctx = OffscreenCanvasRenderingContext2D | CanvasRenderingContext2D;

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Dibuja un diente aplicando material real (translucidez + reflectividad) */
function dibujarDiente(ctx: Ctx, diente: Diente, escala: number) {
  if (!diente.visible) return;

  const { transform: t, material, opacity } = diente;

  ctx.save();
  ctx.translate(t.x * escala, t.y * escala);
  ctx.rotate((t.rotation * Math.PI) / 180);
  ctx.scale(t.scaleX * escala, t.scaleY * escala);

  const path = new Path2D(diente.svgPath);

  // ── Capa base: gradiente esmalte ──────────────────────────────────────
  // La translucidez reduce la opacidad base (más translúcido = más transparente)
  const opacidadBase = opacity * (1 - material.translucidez * 0.4);
  ctx.globalAlpha = opacidadBase;
  ctx.globalCompositeOperation = "source-over";

  // Sombra de integración suave
  ctx.shadowColor = "rgba(200,210,230,0.45)";
  ctx.shadowBlur = 8;
  ctx.shadowOffsetY = 2;

  // Gradiente vertical: blanco puro arriba → tono ligeramente azulado abajo
  const grad = ctx.createLinearGradient(50, 0, 50, 160);
  grad.addColorStop(0, "rgba(255,255,255,0.97)");
  grad.addColorStop(0.45, "rgba(242,246,255,0.94)");
  grad.addColorStop(1, "rgba(215,224,242,0.82)");
  ctx.fillStyle = grad;
  ctx.fill(path);

  // ── Capa de translucidez: overlay azul-grisáceo ───────────────────────
  if (material.translucidez > 0.02) {
    ctx.shadowColor = "transparent";
    ctx.globalAlpha = material.translucidez * 0.35;
    ctx.globalCompositeOperation = "multiply";
    ctx.fillStyle = "rgba(180,200,230,1)";
    ctx.fill(path);
  }

  // ── Capa de reflectividad: highlight screen ───────────────────────────
  if (material.reflectividad > 0.02) {
    ctx.globalAlpha = material.reflectividad * 0.6;
    ctx.globalCompositeOperation = "screen";
    // Highlight concentrado en el tercio superior (zona incisal)
    const highlightGrad = ctx.createLinearGradient(50, 0, 50, 60);
    highlightGrad.addColorStop(0, "rgba(255,255,255,0.9)");
    highlightGrad.addColorStop(0.5, "rgba(255,255,255,0.3)");
    highlightGrad.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = highlightGrad;
    ctx.fill(path);
  }

  // ── Borde incisal ─────────────────────────────────────────────────────
  ctx.globalAlpha = 1;
  ctx.globalCompositeOperation = "source-over";
  ctx.shadowColor = "transparent";
  ctx.strokeStyle = "rgba(180,190,210,0.45)";
  ctx.lineWidth = 0.6;
  ctx.stroke(path);

  ctx.restore();
}

/** Dibuja las guías clínicas */
function dibujarGuias(
  ctx: Ctx,
  guias: Guia[],
  ancho: number,
  alto: number,
  escala: number,
) {
  guias.forEach((g) => {
    if (!g.visible) return;
    ctx.save();
    ctx.setLineDash([10 * escala, 5 * escala]);
    ctx.strokeStyle =
      g.id === "guia-media" ? "rgba(59,130,246,0.5)" : "rgba(167,139,250,0.5)";
    ctx.lineWidth = 1 * escala;
    ctx.beginPath();
    if (g.tipo === "vertical") {
      ctx.moveTo(g.posicion.x * escala, 0);
      ctx.lineTo(g.posicion.x * escala, alto);
    } else {
      ctx.moveTo(0, g.posicion.y * escala);
      ctx.lineTo(ancho, g.posicion.y * escala);
    }
    ctx.stroke();
    ctx.restore();
  });
}

/** Dibuja la zona de sonrisa expandida como overlay sutil */
function dibujarZonaSonrisa(
  ctx: Ctx,
  faceData: FaceData,
  escalaX: number,
  escalaY: number,
) {
  const zonaBB = expandirBoundingBox(faceData.lips.boundingBox, 1.25);
  ctx.save();
  ctx.globalAlpha = 0.06;
  ctx.globalCompositeOperation = "source-over";
  ctx.fillStyle = "rgba(255,255,255,1)";
  ctx.beginPath();
  ctx.ellipse(
    (zonaBB.x + zonaBB.width / 2) * escalaX,
    (zonaBB.y + zonaBB.height / 2) * escalaY,
    (zonaBB.width / 2) * escalaX,
    (zonaBB.height / 2) * escalaY,
    0,
    0,
    Math.PI * 2,
  );
  ctx.fill();
  ctx.restore();
}

// ── Render principal ──────────────────────────────────────────────────────────

/** Render compuesto completo — retorna Blob y dataUrl */
export async function renderComposito(
  config: ConfigRender,
): Promise<ResultadoRender> {
  const {
    foto,
    dientes,
    guias,
    faceData,
    ancho,
    alto,
    formato,
    calidad,
    incluirGuias,
  } = config;

  // Escala entre canvas de edición (860×580) y output
  const escalaX = ancho / 860;
  const escalaY = alto / 580;
  const escala = Math.min(escalaX, escalaY);

  // OffscreenCanvas o fallback
  let canvas: OffscreenCanvas | HTMLCanvasElement;
  let ctx: Ctx;

  const useOffscreen = typeof OffscreenCanvas !== "undefined";
  if (useOffscreen) {
    canvas = new OffscreenCanvas(ancho, alto);
    ctx = (canvas as OffscreenCanvas).getContext("2d")!;
  } else {
    canvas = document.createElement("canvas");
    (canvas as HTMLCanvasElement).width = ancho;
    (canvas as HTMLCanvasElement).height = alto;
    ctx = (canvas as HTMLCanvasElement).getContext("2d")!;
  }

  // ── 1. Foto base ──────────────────────────────────────────────────────
  const imgScale = Math.min(
    ancho / foto.naturalWidth,
    alto / foto.naturalHeight,
  );
  const imgX = (ancho - foto.naturalWidth * imgScale) / 2;
  const imgY = (alto - foto.naturalHeight * imgScale) / 2;
  ctx.drawImage(
    foto,
    imgX,
    imgY,
    foto.naturalWidth * imgScale,
    foto.naturalHeight * imgScale,
  );

  // ── 2. Zona de sonrisa (overlay sutil, si hay FaceData) ───────────────
  if (faceData) {
    dibujarZonaSonrisa(ctx, faceData, escalaX, escalaY);
  }

  // ── 3. Sombra bajo labio superior ─────────────────────────────────────
  if (faceData) {
    const { lips } = faceData;
    const cx = (lips.boundingBox.x + lips.boundingBox.width / 2) * escalaX;
    const cy = lips.boundingBox.y * escalaY;
    const rw = (lips.boundingBox.width / 2) * escalaX * 1.3;
    const rh = 18 * escala;

    const shadowGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, rw);
    shadowGrad.addColorStop(0, "rgba(0,0,0,0.18)");
    shadowGrad.addColorStop(0.6, "rgba(0,0,0,0.06)");
    shadowGrad.addColorStop(1, "rgba(0,0,0,0)");

    ctx.save();
    ctx.scale(1, rh / rw);
    ctx.beginPath();
    ctx.arc(cx, cy * (rw / rh), rw, 0, Math.PI * 2);
    ctx.fillStyle = shadowGrad;
    ctx.fill();
    ctx.restore();
  }

  // ── 4. Dientes con material real ──────────────────────────────────────
  // Ordenar: primero los no seleccionados, luego el seleccionado (z-order)
  dientes.forEach((d) => dibujarDiente(ctx, d, escala));

  // ── 5. Blending final soft-light sobre toda la composición ────────────
  // Aplica un suavizado global que integra los dientes con la foto
  ctx.save();
  ctx.globalCompositeOperation = "soft-light";
  ctx.globalAlpha = 0.08;
  ctx.fillStyle = "rgba(240,245,255,1)";
  ctx.fillRect(0, 0, ancho, alto);
  ctx.restore();

  // ── 6. Guías clínicas (opcional) ──────────────────────────────────────
  if (incluirGuias) {
    dibujarGuias(ctx, guias, ancho, alto, escala);
  }

  // ── 7. Watermark ──────────────────────────────────────────────────────
  ctx.save();
  ctx.font = `${12 * escala}px Inter, system-ui, sans-serif`;
  ctx.fillStyle = "rgba(255,255,255,0.35)";
  ctx.textAlign = "right";
  ctx.fillText(
    "Smile Design PRO · Digital Mockup",
    ancho - 16 * escala,
    alto - 12 * escala,
  );
  ctx.restore();

  // ── 8. Exportar ───────────────────────────────────────────────────────
  let blob: Blob;
  if (useOffscreen) {
    blob = await (canvas as OffscreenCanvas).convertToBlob({
      type: formato === "jpg" ? "image/jpeg" : "image/png",
      quality: calidad,
    });
  } else {
    blob = await new Promise<Blob>((res, rej) =>
      (canvas as HTMLCanvasElement).toBlob(
        (b) => (b ? res(b) : rej(new Error("toBlob failed"))),
        formato === "jpg" ? "image/jpeg" : "image/png",
        calidad,
      ),
    );
  }

  const dataUrl = URL.createObjectURL(blob);
  return { blob, dataUrl, ancho, alto };
}
