# 🧠 BLUEPRINT ENGINE PRO
## Núcleo del sistema de diseño de sonrisa

---

# 🎯 OBJETIVO

Representar TODO el estado del diseño:

- dientes
- cara
- guías
- vistas
- capas
- historial

---

# 🧠 PRINCIPIO CLAVE

❌ NO es:
un JSON de dientes

✅ ES:
👉 sistema estructurado multi-capa

---

# 🧱 ESTRUCTURA CORE

```ts
type Blueprint = {
  id: string
  version: number

  pacienteId?: string

  metadata: {
    createdAt: string
    updatedAt: string
    estado: "draft" | "review" | "final"
  }

  canvas: CanvasState

  face: FaceData

  vistas: Vista[]

  capas: Capa[]

  teeth: Tooth[]

  guides: Guide[]

  history: BlueprintVersion[]
}

CANVAS
type CanvasState = {
  width: number
  height: number
  zoom: number
  pan: { x: number; y: number }
}
👁️ VISTAS (🔥 MUY IMPORTANTE)

Esto viene directo del concepto real de SmileCloud

type Vista = {
  id: string

  tipo:
    | "frontal"
    | "lateral"
    | "sonrisa"
    | "reposo"

  transform: {
    zoom: number
    pan: { x: number; y: number }
  }

  visibleLayers: string[]
}

👉 permite:

múltiples ángulos
múltiples escenarios
🧱 CAPAS (STACK)
type Capa = {
  id: string

  tipo:
    | "imagen"
    | "labios"
    | "dientes"
    | "guias"

  visible: boolean
  opacity: number
  zIndex: number
}

👉 esto es el “stack” que viste

🦷 TEETH (ya integrado con tu engine)
type Tooth = {
  pieza: number

  posicion: Vec2

  dimensiones: {
    width: number
    height: number
  }

  transform: {
    rotacion: number
    escala: number
  }

  material: MaterialDental

  geometry: ToothGeometry
}
📏 GUIDES (Blueprint real)

Esto es CLAVE y suele faltar en clones

type Guide =
  | MidlineGuide
  | SmileLineGuide
  | LipLineGuide
  | ProportionGuide
Ejemplo: línea media
type MidlineGuide = {
  tipo: "midline"
  x: number
}
Ejemplo: línea de sonrisa
type SmileLineGuide = {
  tipo: "smile_line"
  curva: number
}
🔄 HISTORY (versionado real)
type BlueprintVersion = {
  id: string
  timestamp: string
  snapshot: Blueprint
}

👉 undo/redo + auditoría

⚙️ OPERACIONES CORE
crear blueprint
function crearBlueprint(face: FaceData): Blueprint
aplicar plantilla
function aplicarPlantillaBlueprint(
  blueprint: Blueprint,
  plantilla: PlantillaSonrisa
): Blueprint
cambiar vista
function setVista(id: string)
toggle capa
function toggleLayer(id: string)
actualizar diente
function updateTooth(id, cambios)
🧠 RELACIÓN CON TU SISTEMA
Blueprint
├── Plantilla Engine
├── Tooth Engine
├── Constraint Engine
├── Render Engine
├── AI Engine

👉 TODO pasa por Blueprint

⚡ REGLAS IMPORTANTES
inmutable
versionado
serializable
reproducible
🧪 QA
vistas coherentes
capas correctas
dientes visibles
sin drift de estado


# 🧠 BLUEPRINT ENGINE PRO — EXTENDED
## (Library Controls + 3D Controls + Wet/Dry)

---

# 🎯 OBJETIVO

Extender el Blueprint con:

- control de librería (presets dinámicos)
- manipulación 3D real
- simulación Wet/Dry (clave visual clínica)

---

# 🧩 NUEVOS MÓDULOS

```text
Blueprint
├── Library Controls
├── 3D Controls
├── Wet/Dry Engine

LIBRARY CONTROLS (🔥 UX + PRODUCTO)
🎯 OBJETIVO

Permitir al usuario:

explorar plantillas
previsualizar
aplicar parcialmente
combinar estilos
MODELO
type LibraryItem = {
  id: string
  tipo: "plantilla" | "forma" | "color" | "borde"

  nombre: string

  preview: string

  parametros: Partial<ParametrosPlantilla>
}
APLICACIÓN PARCIAL (CLAVE)
function aplicarLibraryItem(
  blueprint: Blueprint,
  item: LibraryItem
): Blueprint

👉 permite:

cambiar SOLO color
cambiar SOLO forma
mantener resto intacto
EJEMPLOS
“Bordes redondeados”
“Canino marcado”
“Blanco alto”
UX PRO
hover preview
click apply
multi-select
🎮 2. 3D CONTROLS (Blueprint 3D real)
🎯 OBJETIVO

Permitir:

rotación
profundidad
inclinación real
MODELO
type Transform3D = {
  rotX: number
  rotY: number
  rotZ: number

  posZ: number

  escala: number
}
EXTENSIÓN DE TOOTH
type Tooth = {
  ...
  transform3D: Transform3D
}
OPERACIONES
function rotarDiente3D(tooth, delta)
function moverEnProfundidad(tooth, z)
function escalarDiente(tooth, factor)
UX
gizmo 3D
sliders
snap inteligente
CONSTRAINTS
limitar rotación excesiva
evitar penetración
💧 3. WET / DRY ENGINE (🔥 MUY IMPORTANTE)
🎯 OBJETIVO

Simular:

boca húmeda (realista)
boca seca (clínica)
MODOS
type WetMode = "wet" | "dry"
EFECTOS
WET
más brillo
más reflexión
labios húmedos
highlights fuertes
DRY
menos brillo
textura mate
contraste más claro
MODELO
type RenderModeConfig = {
  wet: {
    reflectividad: number
    brillo: number
    saturacion: number
  }
  dry: {
    reflectividad: number
    brillo: number
    saturacion: number
  }
}
APLICACIÓN
function aplicarModo(
  blueprint: Blueprint,
  modo: WetMode
)
IMPLEMENTACIÓN VISUAL
Canvas
ctx.globalAlpha = modo === "wet" ? 0.9 : 0.7
WebGL
specular = modo == wet ? 1.0 : 0.3;
RESULTADO
wet = marketing / paciente
dry = clínico / planificación
🔄 INTEGRACIÓN TOTAL
Blueprint
├── Teeth
├── Guides
├── Layers
├── Library Controls
├── 3D Controls
├── Wet/Dry Mode
⚙️ NUEVAS OPERACIONES CORE
aplicar item de librería
applyLibraryItem(blueprint, item)
cambiar modo visual
setWetMode("wet" | "dry")
transformar en 3D
updateTooth3D(id, transform)
🧪 QA
cambios parciales no rompen diseño
3D no genera artefactos
wet/dry consistente en toda la escena
⚡ PERFORMANCE
no recalcular todo blueprint
aplicar diffs
cache shaders wet/dry