import { Diente } from "../../core/types";

/**
 * ⚛️ BIOMECHANICAL PHYSICS ENGINE PRO
 * Motor de Físicas Reactivas y Oclusión Dinámica.
 * Diferencia de Constraints: No "corrige", simula la presión,
 * fricción y resistencia biomecánica del periodonto.
 */
export class BiomechanicalPhysicsEngine {
  // Constantes biomecánicas simuladas
  private static RESISTENCIA_PERIODONTAL = 0.85; // Cuánta fuerza opone un diente a ser movido por otro
  private static FUERZA_REPULSION = 0.15; // Velocidad de separación al colisionar
  private static MAX_ITERATIONS = 5; // Resolución iterativa PBD (Position Based Dynamics)

  /**
   * Ejecuta el stepper de físicas (PBD Solver).
   * Resuelve colisiones encadenadas (Tooth A empuja a B, B empuja a C).
   */
  static simulateOclusalContact(dientes: Diente[]): Diente[] {
    // Clonamos profundamente las posiciones para simular el paso de física
    const simulated = dientes.map((d) => ({
      ...d,
      posicion: { ...d.posicion },
      transformacion: { ...d.transformacion },
    }));

    // Position Based Dynamics: Iteramos múltiples veces para resolver colisiones en cadena
    for (let iter = 0; iter < this.MAX_ITERATIONS; iter++) {
      let resolvedCollisions = false;

      for (let i = 0; i < simulated.length; i++) {
        for (let j = i + 1; j < simulated.length; j++) {
          const a = simulated[i];
          const b = simulated[j];

          // Detección de Colisión Cilíndrica/Esférica Híbrida (Bounding)
          const widthA = a.dimensiones.ancho * a.transformacion.escala;
          const widthB = b.dimensiones.ancho * b.transformacion.escala;

          // Distancia de Contacto Físico (El espacio interproximal natural)
          const contactDistance = widthA / 2 + widthB / 2 + 0.2; // 0.2mm de ligamento periodontal

          const dx = b.posicion.x - a.posicion.x;
          const dy = b.posicion.y - a.posicion.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < contactDistance && dist > 0) {
            resolvedCollisions = true;

            // Penetración real (cuánto se están cruzando)
            const penetration = contactDistance - dist;

            // Vector normal de la colisión
            const nx = dx / dist;
            const ny = dy / dist;

            // Aplicar Fuerza de Repulsión Biomecánica
            // Los dientes no se "teletransportan", se empujan con una constante elástica
            const push = penetration * this.FUERZA_REPULSION;

            // Distribuimos la fuerza. En la realidad, el diente más grande (ej. Central)
            // opone más resistencia que el pequeño (Lateral).
            const massA = widthA;
            const massB = widthB;
            const totalMass = massA + massB;

            const ratioA = massB / totalMass; // Si B es más pesado, A se mueve más
            const ratioB = massA / totalMass;

            // Fricción/Resistencia periodontal
            const displacementAx =
              -(nx * push * ratioA) * this.RESISTENCIA_PERIODONTAL;
            const displacementBx =
              nx * push * ratioB * this.RESISTENCIA_PERIODONTAL;

            // Aplicar desplazamiento dinámico
            a.posicion.x += displacementAx;
            b.posicion.x += displacementBx;

            // Micro-desplazamiento vertical (contacto oclusal desliza hacia arriba/abajo)
            const displacementAy =
              -(ny * push * ratioA) * this.RESISTENCIA_PERIODONTAL * 0.1;
            const displacementBy =
              ny * push * ratioB * this.RESISTENCIA_PERIODONTAL * 0.1;

            a.posicion.y += displacementAy;
            b.posicion.y += displacementBy;
          }
        }
      }

      // Si no hubo colisiones en esta iteración, el sistema alcanzó el equilibrio
      if (!resolvedCollisions) break;
    }

    return simulated;
  }
}
