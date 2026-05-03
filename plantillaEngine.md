# 🧠 PLANTILLA ENGINE PRO
## Smile Design System — Sistema de Presets Paramétricos

---

# 🎯 OBJETIVO

Permitir:

- crear plantillas reutilizables
- aplicar diseños en 1 click
- adaptar automáticamente a cada paciente
- escalar catálogo de sonrisas

---

# 🧠 PRINCIPIO CLAVE

❌ NO es:
guardar dientes

✅ ES:
👉 guardar REGLAS de diseño

---

# 🧩 CONCEPTO BASE

```ts
Plantilla → reglas → transformación → Blueprint


MODELO DE DATOS
type PlantillaSonrisa = {
  id: string
  nombre: string

  categoria: Categoria

  parametros: ParametrosPlantilla

  reglas: Regla[]

  compatibilidad: Compatibilidad
}
📂 CATEGORÍAS
type Categoria =
  | "natural"
  | "estetica"
  | "edad"
  | "forma_facial"
  | "personalidad"
  | "clinica"
⚙️ PARÁMETROS
type ParametrosPlantilla = {
  proporciones: Proporciones
  forma: FormaGlobal
  curvaSonrisa: number
  exposicionDental: number
  simetria: number
  color: ColorConfig
}
📐 PROPORCIONES
type Proporciones = {
  incisivoCentral: number
  incisivoLateral: number
  canino: number
}
🧬 FORMA GLOBAL
type FormaGlobal = {
  tipo: "cuadrado" | "oval" | "triangular"
  suavidadBordes: number
}
🎨 COLOR
type ColorConfig = {
  whiteness: number
  translucidez: number
  saturacion: number
}
🧠 REGLAS (🔥 CORE)
type Regla =
  | ReglaSimetria
  | ReglaCurvatura
  | ReglaAlineacion
  | ReglaEscala
Ejemplo: Simetría
type ReglaSimetria = {
  tipo: "simetria"
  eje: "facial"
  intensidad: number
}
Ejemplo: Curvatura
type ReglaCurvatura = {
  tipo: "curvatura"
  valor: number
}
🧠 COMPATIBILIDAD
type Compatibilidad = {
  formasFaciales: string[]
  rangosEdad: string[]
}
🚀 MOTOR DE APLICACIÓN
function aplicarPlantilla(
  plantilla: PlantillaSonrisa,
  face: FaceData
): Blueprint
Pipeline interno
1. leer landmarks
2. calcular eje facial
3. escalar proporciones
4. posicionar dientes
5. aplicar reglas
6. generar blueprint final
🧩 EJEMPLOS REALES
Hollywood
{
  categoria: "estetica",

  parametros: {
    proporciones: {
      incisivoCentral: 1.0,
      incisivoLateral: 0.8,
      canino: 0.9
    },
    forma: { tipo: "cuadrado", suavidadBordes: 0.2 },
    curvaSonrisa: 0.6,
    exposicionDental: 0.9,
    simetria: 1.0,
    color: { whiteness: 0.95, translucidez: 0.2, saturacion: 0.1 }
  }
}
Natural
{
  categoria: "natural",

  parametros: {
    proporciones: {
      incisivoCentral: 1.0,
      incisivoLateral: 0.85,
      canino: 0.9
    },
    forma: { tipo: "oval", suavidadBordes: 0.7 },
    curvaSonrisa: 0.4,
    exposicionDental: 0.6,
    simetria: 0.7,
    color: { whiteness: 0.7, translucidez: 0.4, saturacion: 0.2 }
  }
}
🔀 COMBINACIÓN DE PLANTILLAS

👉 clave para escalar

function combinarPlantillas(a, b): PlantillaSonrisa

Ejemplo:

forma (natural)
color (hollywood)
curva (juvenil)
🎯 VARIACIONES AUTOMÁTICAS
function generarVariantes(plantilla, n = 5)

Cambia:

ligera asimetría
tamaño
color
🧠 PERSONALIZACIÓN

Después de aplicar:

ajustarDiente(pieza, cambios)
⚡ PERFORMANCE
cache de plantillas
aplicar solo diffs
no recalcular todo