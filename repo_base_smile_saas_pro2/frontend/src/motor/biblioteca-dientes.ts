/**
 * BIBLIOTECA DENTAL PRO
 * SVG paths anatómicos para cada pieza dental (notación FDI).
 *
 * Coordenadas normalizadas en viewBox 0 0 100 160.
 * Cada path representa la silueta frontal de la corona clínica visible.
 *
 * Piezas frontales superiores: 13 12 11 | 21 22 23
 * Geometría: quadratic bezier curves para curvaturas orgánicas
 */

export interface MorfologiaDiente {
  /** Notación FDI */
  pieza: number;
  /** Nombre clínico */
  nombre: string;
  /** SVG path (viewBox 100x160) */
  svgPath: string;
  /** Ancho relativo al incisivo central (1.0 = igual) */
  anchoRelativo: number;
}

// ── Helpers internos ──────────────────────────────────────────────────────────

/** Genera path de corona con cuello cervical y borde incisal curvado */
function coronaAnterior(
  anchoSuperior: number,
  anchoCuello:   number,
  alto:          number,
  curvIncisal:   number = 8,
  curvCervical:  number = 6
): string {
  const cx = 50; // Centro X del viewBox (100 wide)
  const left  = cx - anchoSuperior / 2;
  const right = cx + anchoSuperior / 2;
  const neck_l = cx - anchoCuello / 2;
  const neck_r = cx + anchoCuello / 2;
  const top    = 5;
  const bot    = top + alto;

  return [
    `M ${left} ${top}`,
    // Borde incisal curvado hacia abajo (cóncavo)
    `Q ${cx} ${top + curvIncisal} ${right} ${top}`,
    // Borde distal
    `Q ${right + curvCervical} ${(top + bot) / 2} ${neck_r} ${bot}`,
    // Cuello cervical inferior (convexo)
    `Q ${cx} ${bot + curvCervical} ${neck_l} ${bot}`,
    // Borde mesial
    `Q ${left - curvCervical} ${(top + bot) / 2} ${left} ${top}`,
    'Z',
  ].join(' ');
}

// ── Biblioteca por pieza ──────────────────────────────────────────────────────

/** Incisivo Central (11 / 21) */
const incisivoCentral = (pieza: 11 | 21): MorfologiaDiente => ({
  pieza,
  nombre:        'Incisivo Central',
  anchoRelativo: 1.0,
  svgPath:       coronaAnterior(82, 70, 130, 10, 8),
});

/** Incisivo Lateral (12 / 22) */
const incisivoLateral = (pieza: 12 | 22): MorfologiaDiente => ({
  pieza,
  nombre:        'Incisivo Lateral',
  anchoRelativo: 0.72,
  svgPath:       coronaAnterior(58, 50, 115, 8, 7),
});

/** Canino (13 / 23) */
const canino = (pieza: 13 | 23): MorfologiaDiente => ({
  pieza,
  nombre:        'Canino',
  anchoRelativo: 0.80,
  // El canino tiene cúspide (borde incisal en punta)
  svgPath: (() => {
    const cx   = 50;
    const w    = 65;
    const left = cx - w / 2;
    const rght = cx + w / 2;
    const top  = 5;
    const tip  = top + 12; // cúspide
    const bot  = top + 125;
    const nw   = 52;
    return [
      `M ${left} ${top}`,
      `Q ${cx - 10} ${top + 4} ${cx} ${tip}`, // bajada a cúspide
      `Q ${cx + 10} ${top + 4} ${rght} ${top}`, // subida desde cúspide
      `Q ${rght + 6} ${(top + bot) / 2} ${cx + nw/2} ${bot}`,
      `Q ${cx} ${bot + 6} ${cx - nw/2} ${bot}`,
      `Q ${left - 6} ${(top + bot) / 2} ${left} ${top}`,
      'Z',
    ].join(' ');
  })(),
});

// ── Mapa completo de la biblioteca ───────────────────────────────────────────

export const BIBLIOTECA_DENTAL: Record<number, MorfologiaDiente> = {
  11: incisivoCentral(11),
  21: incisivoCentral(21),
  12: incisivoLateral(12),
  22: incisivoLateral(22),
  13: canino(13),
  23: canino(23),
};

/** Orden de aparición de izquierda a derecha en boca */
export const PIEZAS_FRONTALES = [13, 12, 11, 21, 22, 23] as const;

/** Genera las posiciones X iniciales para un bloque de dientes centrado en canvasW */
export function generarPosicionesIniciales(
  canvasW: number,
  canvasH: number,
  escalaBase = 0.55
): Array<{ pieza: number; x: number; y: number; scaleX: number; scaleY: number }> {
  const anchos = PIEZAS_FRONTALES.map(p => BIBLIOTECA_DENTAL[p].anchoRelativo);
  const anchoTotal = anchos.reduce((a, b) => a + b, 0);
  const anchoBase  = 100 * escalaBase; // px para incisivo central
  const totalPx    = anchoTotal * anchoBase;
  let cursorX      = (canvasW - totalPx) / 2;
  const baseY      = canvasH * 0.42; // 42% del canvas de arriba

  return PIEZAS_FRONTALES.map((pieza) => {
    const morf  = BIBLIOTECA_DENTAL[pieza];
    const pieW  = morf.anchoRelativo * anchoBase;
    const pos   = { pieza, x: cursorX, y: baseY, scaleX: escalaBase, scaleY: escalaBase };
    cursorX    += pieW;
    return pos;
  });
}
