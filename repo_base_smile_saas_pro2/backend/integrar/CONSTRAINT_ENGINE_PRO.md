# 🧠 CONSTRAINT ENGINE PRO
## Smile Design System — Motor de Restricciones

---

# 🎯 OBJETIVO

Garantizar que cualquier diseño:

- sea visualmente coherente
- no tenga colisiones
- respete proporciones reales
- sea clínicamente plausible

---

# 🧠 PRINCIPIO CLAVE

❌ NO es:
validar al final

✅ ES:
👉 corregir en tiempo real

---

# 🧩 UBICACIÓN EN EL PIPELINE

```text
Plantilla → Tooth Engine → Constraint Engine → Render




MODELO
type ConstraintResult = {
  teeth: Tooth[]
  warnings: string[]
}
🧠 TIPOS DE CONSTRAINTS
type Constraint =
  | "COLISION"
  | "PROPORCION"
  | "ALINEACION"
  | "SIMETRIA"
  | "LIMITE_ANATOMICO"
🚫 1. COLISIONES ENTRE DIENTES
function evitarColisiones(teeth: Tooth[]): Tooth[] {
  for (let i = 0; i < teeth.length - 1; i++) {
    const a = teeth[i]
    const b = teeth[i + 1]

    const distancia = b.posicion.x - a.posicion.x
    const minimo = (a.dimensiones.width + b.dimensiones.width) * 0.45

    if (distancia < minimo) {
      const ajuste = (minimo - distancia) / 2

      a.posicion.x -= ajuste
      b.posicion.x += ajuste
    }
  }

  return teeth
}
📐 2. PROPORCIONES VÁLIDAS
function validarProporciones(teeth: Tooth[]): Tooth[] {
  return teeth.map((t) => {
    const ratio = t.dimensiones.height / t.dimensiones.width

    if (ratio < 0.8) t.dimensiones.height = t.dimensiones.width * 0.8
    if (ratio > 1.5) t.dimensiones.height = t.dimensiones.width * 1.5

    return t
  })
}
📏 3. ALINEACIÓN DE SONRISA
function alinearCurva(teeth: Tooth[], curva: number): Tooth[] {
  return teeth.map((t, i) => {
    const offset = Math.abs(i - 2.5)

    return {
      ...t,
      posicion: {
        x: t.posicion.x,
        y: t.posicion.y - offset * curva * 4
      }
    }
  })
}
🪞 4. SIMETRÍA CONTROLADA
function forzarSimetria(teeth: Tooth[], intensidad: number): Tooth[] {
  const centro = teeth.reduce((acc, t) => acc + t.posicion.x, 0) / teeth.length

  return teeth.map((t) => {
    const espejo = centro - (t.posicion.x - centro)

    return {
      ...t,
      posicion: {
        x: t.posicion.x * (1 - intensidad) + espejo * intensidad,
        y: t.posicion.y
      }
    }
  })
}
🧬 5. LÍMITES ANATÓMICOS
function limitarAnatomia(teeth: Tooth[], face: FaceData): Tooth[] {
  return teeth.map((t) => ({
    ...t,
    posicion: {
      x: clamp(t.posicion.x, face.centroBoca.x - face.anchoBoca, face.centroBoca.x + face.anchoBoca),
      y: clamp(t.posicion.y, face.centroBoca.y - 40, face.centroBoca.y + 40)
    }
  }))
}
⚙️ CORE ENGINE
export function aplicarConstraints(
  teeth: Tooth[],
  face: FaceData,
  config: any
): ConstraintResult {
  let resultado = [...teeth]
  const warnings: string[] = []

  resultado = evitarColisiones(resultado)
  resultado = validarProporciones(resultado)
  resultado = alinearCurva(resultado, config.curvaSonrisa)
  resultado = forzarSimetria(resultado, config.simetria)
  resultado = limitarAnatomia(resultado, face)

  return { teeth: resultado, warnings }
}
⚡ EJECUCIÓN EN TIEMPO REAL
onDragTooth(() => {
  teeth = aplicarConstraints(teeth, face, config).teeth
})
🧪 QA
sin superposición
proporciones válidas
no saltos visuales
estabilidad al arrastrar
⚡ PERFORMANCE
aplicar solo al diente modificado
usar bounding boxes
evitar loops completos innecesarios
🚨 WARNINGS (UX)

Ejemplos:

"colisión detectada"
"proporción inválida corregida"
"fuera de zona anatómica"
🤖 PROMPT ANTIGRAVITY

Crear Constraint Engine con:

validación en tiempo real
corrección automática
sistema de warnings