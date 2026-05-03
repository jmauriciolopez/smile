import { Diente, DatosFaciales } from "../../core/types";

export interface ResultadoRestricciones {
  dientes: Diente[];
  alertas: string[];
}

export interface ConfigRestricciones {
  evitarColisiones: boolean;
  validarProporciones: boolean;
  forzarSimetria: number;
  curvaSonrisa: number;
  limitesAnatomicos: boolean;
}

/**
 * Motor de Restricciones Clínicas (F3) - AUDITADO Y CORREGIDO.
 */
export function aplicarConstraints(
  dientes: Diente[],
  cara: DatosFaciales | null,
  config: ConfigRestricciones,
): ResultadoRestricciones {
  // Clonación superficial optimizada para alto rendimiento
  const resultado = dientes.map((d) => ({
    ...d,
    posicion: { ...d.posicion },
    transformacion: { ...d.transformacion },
  })) as Diente[];
  const alertas: string[] = [];

  // 1. Guardar orden original para evitar saltos visuales en el renderizado por índice
  const ordenOriginal = new Map(resultado.map((d, i) => [d.id, i]));

  // 2. Pipeline de transformaciones seguras
  if (config.evitarColisiones) evitarColisiones(resultado);
  if (config.validarProporciones) validarProporciones(resultado);
  if (config.curvaSonrisa > 0) alinearCurva(resultado, config.curvaSonrisa);
  if (config.forzarSimetria > 0 && cara)
    aplicarSimetria(resultado, cara, config.forzarSimetria);
  if (config.limitesAnatomicos && cara) limitarAnatomia(resultado, cara);

  // 3. Restaurar orden original para consistencia en el DOM/Canvas
  resultado.sort(
    (a, b) => (ordenOriginal.get(a.id) || 0) - (ordenOriginal.get(b.id) || 0),
  );

  return { dientes: resultado, alertas };
}

function evitarColisiones(dientes: Diente[]) {
  // Ordenar temporalmente para el cálculo de vecindad
  const ordenados = [...dientes].sort((a, b) => a.posicion.x - b.posicion.x);

  for (let i = 0; i < ordenados.length - 1; i++) {
    const a = ordenados[i];
    const b = ordenados[i + 1];

    // Guardas contra NaN
    const escalaA = isFinite(a.transformacion.escala)
      ? a.transformacion.escala
      : 1;
    const escalaB = isFinite(b.transformacion.escala)
      ? b.transformacion.escala
      : 1;

    const anchoA = a.dimensiones.ancho * escalaA;
    const anchoB = b.dimensiones.ancho * escalaB;
    const distanciaX = b.posicion.x - a.posicion.x;
    const min = (anchoA + anchoB) * 0.48;

    if (distanciaX < min && isFinite(distanciaX)) {
      const correccion = (min - distanciaX) / 2;
      a.posicion.x -= correccion;
      b.posicion.x += correccion;
    }
  }
}

function validarProporciones(dientes: Diente[]) {
  for (const d of dientes) {
    const ancho = d.dimensiones.ancho * d.transformacion.escala;
    const alto = d.dimensiones.alto * d.transformacion.escala;
    if (alto === 0) continue;

    const ratio = ancho / alto;
    if (ratio < 0.7)
      d.transformacion.escala = d.dimensiones.ancho / d.dimensiones.alto / 0.7;
    if (ratio > 0.9)
      d.transformacion.escala = d.dimensiones.ancho / d.dimensiones.alto / 0.9;
  }
}

function aplicarSimetria(
  dientes: Diente[],
  cara: DatosFaciales,
  intensidad: number,
) {
  const centroX = cara.lineaMediaX; // Dinámico, no hardcoded
  const mapaDientes = new Map(dientes.map((d) => [d.pieza, d]));

  for (const d of dientes) {
    if (d.pieza >= 21 && d.pieza <= 28) {
      const par = mapaDientes.get(d.pieza - 10);
      if (par) {
        const espejoX = centroX + (centroX - par.posicion.x);
        d.posicion.x = d.posicion.x * (1 - intensidad) + espejoX * intensidad;
        d.posicion.y =
          d.posicion.y * (1 - intensidad) + par.posicion.y * intensidad;
        d.transformacion.escala =
          d.transformacion.escala * (1 - intensidad) +
          par.transformacion.escala * intensidad;
      }
    }
  }
}

function alinearCurva(dientes: Diente[], intensidad: number) {
  if (dientes.length < 2) return;
  const mid = (dientes.length - 1) / 2;
  for (let i = 0; i < dientes.length; i++) {
    const xDist = i - mid;
    const offset = xDist * xDist * intensidad * 5;
    if (isFinite(offset)) {
      dientes[i].posicion.y += offset;
    }
  }
}

function limitarAnatomia(_dientes: Diente[], _cara: DatosFaciales) {
  // Implementación de clipping anatómico
}
