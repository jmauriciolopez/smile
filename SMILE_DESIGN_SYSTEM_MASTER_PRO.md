# 🧠 SMILE DESIGN SYSTEM — ENTERPRISE FULL SPEC v2.0

## Plataforma de Diseño de Sonrisa (nivel SmileCloud)

---

# 🎯 PROPÓSITO DEL PRODUCTO

Construir una herramienta profesional que permita:

- diseñar sonrisas sobre imágenes reales
- editar dientes en tiempo real (UX tipo Figma)
- generar mockups visuales de alta calidad
- versionar cambios clínicos
- evolucionar hacia automatización con IA
- exportar fichas técnicas para laboratorio CAD/CAM

---

# 🧠 MODELO MENTAL

❌ NO es:
- sistema odontológico tradicional
- CRM / ERP

✅ ES:
👉 motor visual paramétrico + motor de render aplicado a odontología estética

---

# 🧩 CORE FLOW

```
Imagen
→ Face & Lip Detection
→ Blueprint
→ Canvas Engine
→ Tooth Engine
→ Render Engine
→ Output (mockup + ficha técnica)
```

---

# 🧱 PRINCIPIOS DE ARQUITECTURA

- versionado obligatorio
- sin mutaciones directas (inmutabilidad)
- determinismo total
- separación estricta: datos / engine / UI
- performance >= 60 FPS

---

# 🗂️ ESTRUCTURA DE CARPETAS

```
/core
  /engine
  /render
  /interaction
  /face
/ui
/store
/types
```

---

# 🧱 BLUEPRINT SPEC (COMPLETO)

```ts
type Blueprint = {
  id: string
  version: number
  history: BlueprintVersion[]

  metadata: {
    createdAt: string
    estado: "draft" | "review" | "final"
  }

  canvas: {
    width: number
    height: number
    zoom: number
    pan: { x: number; y: number }
  }

  face: {
    boundingBox: { x: number; y: number; width: number; height: number }
    landmarks: {
      ojos: {
        izquierdo: { x: number; y: number }
        derecho: { x: number; y: number }
      }
      nariz: { x: number; y: number }
      boca: {
        centro: { x: number; y: number }
        ancho: number
      }
      menton: { x: number; y: number }
    }
    lips: {
      contornoSuperior: { x: number; y: number }[]
      contornoInferior: { x: number; y: number }[]
      contornoCompleto: { x: number; y: number }[]
      boundingBox: { x: number; y: number; width: number; height: number }
      ejeLabial: number
    }
    transform: {
      rotation: number
      scale: number
      translation: { x: number; y: number }
    }
  }

  guides: any[]
  teeth: Tooth[]

  style: {
    whiteness: number
    textura: number
  }
}
```

---

# 🦷 TOOTH ENGINE (COMPLETO)

## Modelo

```ts
type Tooth = {
  pieza: number

  posicion: { x: number; y: number }

  dimensiones: {
    width: number
    height: number
  }

  transform: {
    rotacion: number
    escala: number
  }

  forma: {
    tipo: "oval" | "cuadrado"
    curvatura: number
  }

  material: {
    colorBase: string
    translucidez: number
    reflectividad: number
  }
}
```

---

# 🛠️ ALGORITMO DE DEFORMACIÓN (WARPING)

Para ajustes anatómicos naturales sin perder integridad del diseño:

- **Bézier Morphing**: Cada diente tiene 8 puntos de control (4 esquinas + 4 medios). Forma generada con curvas de Bézier cúbicas manipulables.
- **Mesh Deformation (Grid Warp)**: Subdivisión del diente en malla 4x4. Permite empujar/tirar zonas específicas (borde incisal, cuello cervical).
- **Consistencia de Volumen**: Algoritmo que limita la deformación para no crear formas físicamente imposibles de fabricar.

---

# 🎨 CANVAS ENGINE PRO

- **Engine**: `react-konva` (Wrapper de Konva.js) para grafos de escena 2D.
- **Estado**: `Zustand` para gestión de nodos y acciones atómicas (Undo/Redo).
- **Pipeline**: `Blueprint` → `SceneGraph` → `Konva Layers` → `Canvas (React)`.
- **Render Loop**: Optimizado por Konva (Layering y Caching de Path2D).

```ts
requestAnimationFrame(loop)
```

### Jerarquía de Capas (Stack)
1. **Fondo**: Imagen Base (Foto Paciente)
2. **Guías**: SVG Overlays (Bipupilar, Media, Oclusal)
3. **Dental**: Objetos `Tooth` manipulables
4. **Máscara**: Clipping labial dinámico (Opcional)

---

# 🧩 SCENE GRAPH

```ts
type Nodo = {
  tipo: "imagen" | "diente" | "guia"
  transform: any
}
```

---

# 🖱️ INTERACTION ENGINE

Eventos:
- `pointerdown`
- `pointermove`
- `pointerup`
- `pinch-to-zoom` (mobile)
- `two-finger-pan` (mobile)
- `long-press` (selección en mobile)

---

# ⚙️ ACTION SYSTEM

```ts
type Action =
  | { type: "MOVE_TOOTH";   payload: any }
  | { type: "RESIZE_TOOTH"; payload: any }
  | { type: "ROTATE_TOOTH"; payload: any }
```

---

# 🔁 APPLY ACTION

```ts
function applyAction(bp: Blueprint, action: Action): Blueprint {
  // retorna nuevo Blueprint sin mutar el original
  return nuevoBlueprint
}
```

---

# 🎨 RENDER ENGINE PRO

## Stack de Capas

```
imagen base
→ sombras
→ dientes
→ translucidez
→ highlights
```

## Sombra dinámica (bajo labio superior)

```ts
ctx.globalCompositeOperation = "multiply"
ctx.globalAlpha = 0.25
// dibujar sombra
```

## Translucidez

```ts
ctx.globalAlpha = material.translucidez
// dibujar diente
```

## Highlight

```ts
ctx.globalCompositeOperation = "screen"
// dibujar highlight
```

## Blending final

```ts
ctx.globalCompositeOperation = "soft-light"
```

## Diferenciales Premium

- **Shadow Mapping**: Sombra dinámica bajo el labio superior.
- **Color Match**: Algoritmo que sugiere blanco basado en la esclera del ojo.
- **Morphing**: Deformación suave de bordes incisales (Warping).

---

# 🧠 FACE & LIP DETECTION ENGINE

## Objetivo

Detectar automáticamente rostro, landmarks faciales, labios (contorno completo) y zona de sonrisa para alinear diseño, aplicar máscaras e integrar render realista.

## Principio Clave

❌ NO es: detectar puntos  
✅ ES: construir un sistema de referencia facial coherente

## Pipeline

```
Imagen
→ detección rostro
→ detección landmarks
→ extracción labios
→ generación máscaras
→ normalización coordenadas
→ output usable por Blueprint
```

## Tipos

```ts
type InputImagen = {
  src: string
  width: number
  height: number
}

type FaceData = {
  boundingBox: Rect
  landmarks: Landmarks
  lips: LipData
  transform: Transform
}

type Landmarks = {
  ojos: {
    izquierdo: Vec2
    derecho: Vec2
  }
  nariz: Vec2
  boca: {
    centro: Vec2
    ancho: number
  }
  menton: Vec2
}

type LipData = {
  contornoSuperior: Vec2[]
  contornoInferior: Vec2[]
  contornoCompleto: Vec2[]
  boundingBox: Rect
  ejeLabial: number
}

type Transform = {
  rotation: number
  scale: number
  translation: Vec2
}
```

## Tecnologías Recomendadas

- **Opción PRO (rápida)**: MediaPipe Face Mesh
- **Opción Web**: TensorFlow.js `face-landmarks-detection`
- **Opción avanzada**: modelo propio (futuro)

## Implementación Base

```ts
import * as faceLandmarks from "@tensorflow-models/face-landmarks-detection"

const model = await faceLandmarks.load()
const pred = await model.estimateFaces({ input: image })
```

## Extracción de Labios (MediaPipe indices)

```ts
const labiosIndices = [61, 146, 91, 181, 84, 17, 314, 405, 321, 375]
```

## Generación de Zona de Sonrisa

```ts
const zonaSonrisa = expandirBoundingBox(lips.boundingBox, 1.2)
```

## Generación de Máscara

```ts
function generarMascaraLabios(lips: LipData): Path2D {
  const path = new Path2D()
  lips.contornoCompleto.forEach((p, i) => {
    if (i === 0) path.moveTo(p.x, p.y)
    else path.lineTo(p.x, p.y)
  })
  path.closePath()
  return path
}
```

## Normalización de Coordenadas

```ts
function normalizar(punto, imagen, canvas) {
  return {
    x: punto.x * (canvas.width / imagen.width),
    y: punto.y * (canvas.height / imagen.height)
  }
}
```

## Transformación Facial

```ts
const angulo = Math.atan2(
  ojo_der.y - ojo_izq.y,
  ojo_der.x - ojo_izq.x
)
```

## Integración con Render

```ts
ctx.save()
ctx.clip(mascaraLabios)
renderDientes()
ctx.restore()
```

## Suavizado de Bordes

```ts
ctx.filter = "blur(2px)"
```

---

# ⚡ PERFORMANCE

- **Proxy Rendering**: Trabajar sobre versión de baja resolución (720p/1080p) durante edición en tiempo real.
- **OffscreenCanvas**: Usar `OffscreenCanvas` + Web Workers para cálculos pesados de filtros y render final.
- **Tiling**: Dividir imagen base en tiles para imágenes extremadamente grandes (optimización GPU).
- **Cache Path2D**: Cachear paths de dientes para evitar recalcular en cada frame.
- **Dirty Flags**: Marcar solo los nodos modificados para re-render selectivo.
- **Evitar re-render global**: Solo redibujar capas afectadas por la acción.

---

# 📱 UX / WORKFLOW MOBILE-RESPONSIVE

- **Touch Gestures**: `pinch-to-zoom`, `two-finger-pan`, `long-press` para seleccionar piezas.
- **Adaptative UI**: Panel de herramientas colapsable lateral (Drawer) en mobile, flotante en Desktop.
- **Precision Mode**: Lupa (magnifier) al mover puntos de control táctiles para no tapar con el dedo.

---

# 📥 INPUT / 📤 OUTPUT DETALLADO

### Inputs
- **Foto Principal**: Frontal en alta resolución.
- **Referencia Métrica**: Medida real en mm para calibración del lienzo.
- **Style Context**: Morfología deseada (Oval, Square, etc).

### Outputs
- **JSON de Diseño**: Grafo de escena persistente para re-edición.
- **Render Final**: Imagen compuesta (Blending: Multiply/Overlay/Soft-light).
- **Ficha Técnica**: Medidas ancho/largo de cada pieza para Laboratorio.
- **Archivo `.smile`**: JSON con metadata + imagen base para intercambio.

---

# 🔗 INTEGRACIÓN CON LABORATORIOS

- **Export Format**: Archivo `.smile` (JSON + imagen base) o contornos vectoriales en formato CAD/CAM (STL 2D / DXF).
- **Handoff**: API de envío directo a proveedores certificados con tracking de estado del pedido.

---

# 🔁 HISTORIAL Y FIRMA DIGITAL

- **Chain of Custody**: Cada versión guardada genera un hash `SHA-256` único del Blueprint.
- **Digital Signature**: Integración con certificados digitales para firma de aprobación del doctor (validez legal/clínica).
- **Snapshot Diff**: Visualización de diferencias entre versiones (antes/después de ajustes).

---

# 🤖 INTELIGENCIA ARTIFICIAL (AUTOMATIZACIÓN)

- **Auto-Landmarking**: Detección de línea media, bipupilar y comisuras labiales (MediaPipe).
- **Segmentación Dental**: Identificación automática de contornos diente-encía para máscaras.
- **Sugerencia Morfológica**: Análisis facial para sugerir preset ideal (Visagismo digital).

---

# 🌐 ECOSISTEMA COLABORATIVO & 3D

- **3D Bridge**: Superposición de diseño 2D sobre mallas STL/OBJ de escaneo intraoral.
- **Live Design Room**: Edición síncrona vía WebSockets para Odontólogo + Técnico.
- **Portal del Paciente**: Visualización 360° y aceptación de tratamiento en entorno web seguro.

---

# 🔒 ENTERPRISE COMPLIANCE & INFRA

- **Manejo de Archivos Pesados**: Object Storage (S3/GCS) con CDN para imágenes 4K.
- **Infraestructura Real-time**: Servidor WebSockets dedicado (Socket.io/Redis) para colaboración.
- **Módulo de Consentimiento Digital**: Firma electrónica vinculada a versión específica del diseño (Inmutable).
- **Audit Logs**: Registro detallado de cada acción técnica/clínica para cumplimiento HIPAA/GDPR.

---

# 🧪 QA & STANDARDS

- Sin solapamientos de Path2D no deseados
- Sin NaN en transformaciones de escala/rotación
- Blending consistente en diferentes condiciones de luz
- Dientes visibles y correctamente posicionados
- Máscara labial cerrada y sin distorsión
- FPS >= 55 en edición activa
- Labios detectados sin saltos de posición

---

# 🤖 PROMPT MASTER

Crear sistema completo de diseño de sonrisa con:
- React
- TypeScript
- Canvas 2D / react-konva

Implementar:
- Blueprint (con historial)
- Tooth Engine (con material + reflectividad)
- Canvas Engine
- Render Engine PRO
- Face & Lip Detection
- Action System (MOVE / RESIZE / ROTATE)

Reglas:
- sin mutaciones directas
- nombres en español
- modular
- listo para producción

---

# 🚀 ROADMAP

### Fase A — Core Visual ✅
- Render de dientes sobre imagen (react-konva)
- Interacción: mover, escalar, rotar (Transformer)
- Biblioteca dental anatómica: incisivos centrales, laterales, caninos (SVG paths paramétricos)
- Posicionamiento inicial automático centrado en canvas

### Fase B — Realismo ✅
- Máscara labial (FaceData → Path2D clip)
- Render Engine PRO: sombras, translucidez (multiply), highlights (screen), blending soft-light
- Gradiente esmalte vertical por diente
- Sombra dinámica bajo labio superior (radial gradient)
- Zona de sonrisa expandida (expandirBoundingBox × 1.25)

### Fase C — Detección ✅
- Face & Lip Detection automático (MediaPipe FaceLandmarker, carga lazy)
- Auto-landmarking: ojos, nariz, boca, mentón, contorno labial completo
- Alineación dental automática al eje labial post-detección
- Normalización de coordenadas imagen → canvas

### Fase C.1 — Motor PRO ✅
- `BlueprintVersion[]` — historial Undo/Redo (max 50 snapshots, Ctrl+Z / Ctrl+Y)
- `MaterialDiente` — `reflectividad` + `translucidez` por pieza con sliders en UI
- `expandirBoundingBox` — zona de sonrisa expandida desde bounding box labial
- `exportarFichaTecnica()` — JSON con medidas px + mm (si hay calibración) por pieza
- `actualizarMaterial()` — acción inmutable en el store

### Fase C.2 — Optimización y Features PRO ✅
- **Build optimizado** — code splitting: vendor-react / vendor-konva / vendor-zustand. Chunk principal: 584KB → 102KB (−82%)
- **Render Engine PRO** — `material.translucidez` y `material.reflectividad` afectan el render real
- **Hash SHA-256** — cada `BlueprintVersion` genera hash via `crypto.subtle` (Chain of Custody)
- **Calibración métrica** — UI px → mm real → ficha técnica exporta `anchoMm`/`altoMm`
- **Snapshot Diff** — panel de historial visual con navegación directa + hash corto visible
- **Action System** — `motor/action-system.ts`: `applyAction()` puro + `validarAccion()` + `applyActions()` batch
- **Color Match** — `motor/color-match.ts`: muestreo de esclera → tono dental sugerido → escala Vita
- **Archivo `.smile`** — export JSON con diseño + metadata + hash + referencia imagen base

### Fase D — Inteligencia y Automatización ✅ (implementado)
- **Vision AI Service** (`vision-service/main.py`) — Microservicio Python con FastAPI y MediaPipe.
- **Visagismo Digital Pro** — Análisis morfológico en backend para detectar forma facial y sugerir presets.
- **Color Match Pro** — Muestreo real de la esclera del ojo mediante visión artificial para sugerencia de escala Vita.
- **Seguridad** — Comunicación segura entre NestJS y Python mediante `X-API-KEY`.
- **Integración Backend** — `VisagismoService` (NestJS) conectado al microservicio real con fallback automático.
- ⏳ Pendiente: Segmentación dental avanzada (identificación de contornos individuales diente-encía), S3/GCS real.

### Fase E — Ecosistema y Colaboración ✅ (stubs conectados)
- **`PanelColaboracion`** — crea sesiones reales via `POST /colaboracion/sesiones`, unirse por código, lista de participantes, cerrar sesión
- **`POST /laboratorio/enviar`** — botón "Enviar Lab" activo → retorna número de pedido + estado + historial
- **Webhook laboratorio** — `POST /laboratorio/webhook` para actualizaciones de estado del proveedor
- **Servicios frontend** — `servicioColaboracion.ts`, `servicioLaboratorio.ts`
- ⏳ Pendiente: Socket.io WebSockets real, Redis pub/sub, Portal del Paciente

### Fase F — Integración 3D y Legal ✅ (implementado)
- **`PanelFirmaDigital`** — conectado a `POST /firmas`: firma con HMAC-SHA256, aprobar, verificar integridad.
- **Auditoría Persistente** — Tabla `AuditLog` en DB (Prisma) para registro inmutable de acciones HIPAA.
- **Visor 3D STL** — Componente `Visor3D` (Three.js) para visualización de escaneos intraorales.
- **AuditModule @Global** — `GET /audit/logs` (filtros reales en DB), `GET /audit/exportar` formato HIPAA.
- ⏳ Pendiente: PKI/certificados X.509 reales para validez legal externa.

---

# � INVENTARIO DE IMPLEMENTACIÓN

## Frontend — `repo_base_smile_saas_pro2/frontend/src/`

### Motor (`motor/`)
| Archivo | Descripción |
|---------|-------------|
| `tipos-faciales.ts` | Tipos Vec2, Rect, LipData, FaceData, TransformFacial + `expandirBoundingBox`, `normalizar`, `generarMascaraLabios`, `calcularEjeFacial` |
| `render-engine.ts` | Render compuesto OffscreenCanvas: foto base → zona sonrisa → sombra labial → dientes (material real) → soft-light → guías → watermark |
| `useFaceEngine.ts` | Hook MediaPipe FaceLandmarker (lazy load) → FaceData → store + alineación dental automática |
| `useRenderEngine.ts` | Hook que conecta render-engine con el store → renderizar, limpiar, descargar |
| `biblioteca-dientes.ts` | SVG paths anatómicos: incisivo central, lateral, canino (FDI 11/12/13/21/22/23) + `generarPosicionesIniciales` |
| `action-system.ts` | `applyAction()` puro + `applyActions()` batch + `validarAccion()` — MOVE/RESIZE/ROTATE/UPDATE_MATERIAL/TOGGLE_VISIBILITY/MOVE_GUIDE/TOGGLE_GUIDE |
| `visagismo.ts` | Análisis morfológico facial → forma facial → preset sugerido + confianza + razonamiento |
| `color-match.ts` | Muestreo de esclera → temperatura de color → tono dental sugerido → escala Vita |

### Store (`store/`)
| Archivo | Descripción |
|---------|-------------|
| `editor-sonrisa.store.ts` | Zustand store: dientes, guías, faceData, calibración, historial Undo/Redo (SHA-256), `applyAction`, `exportarFichaTecnica`, `exportarDiseno` |

### Módulo Editor (`modulos/diseno_sonrisa/`)
| Archivo | Descripción |
|---------|-------------|
| `paginas/EditorSonrisaPage.tsx` | Editor PRO v2.1: lienzo + 4 tabs (Ajustes / Exportar / Colaborar / Firma) + Undo/Redo + Ctrl+Z/Y |
| `componentes/LienzoDiseno.tsx` | Canvas Konva: 4 capas (foto / guías / máscara labial / dientes manipulables + Transformer) |
| `componentes/PanelExportacion.tsx` | Render PNG/JPG + Before/After split + Ficha Técnica JSON + Exportar .smile + Enviar Lab |
| `componentes/PanelColaboracion.tsx` | Crear/unirse a sesiones de colaboración via API real |
| `componentes/PanelFirmaDigital.tsx` | Firma HMAC-SHA256 + aprobar + verificar integridad via API real |

### Servicios (`servicios/`)
| Archivo | Endpoints |
|---------|-----------|
| `servicioDisenos.ts` | `POST /disenos`, `GET /disenos/caso/:id` |
| `servicioArchivos.ts` | `POST /archivos/url-subida`, confirmar, `GET /:id/url`, `DELETE /:id` |
| `servicioVisagismo.ts` | `POST /visagismo/analizar`, `GET /visagismo/caso/:id` |
| `servicioColaboracion.ts` | `POST /colaboracion/sesiones`, unirse, `GET /:codigo`, listar, `DELETE /:codigo` |
| `servicioLaboratorio.ts` | `POST /laboratorio/enviar`, `GET /pedidos/:id`, `GET /caso/:id` |
| `servicioFirmas.ts` | `POST /firmas`, aprobar, `GET /diseno/:id`, `GET /:id/verificar` |

---

## Backend — `repo_base_smile_saas_pro2/backend/src/modulos/`

### Módulos MVP (Fases 1-20) ✅
`autenticacion` · `usuarios` · `pacientes` · `casos` · `presupuestos` · `disenos` · `dashboard` · `seguimientos` · `notas` · `tareas` · `fotos`

### Módulos Fase D ✅
| Módulo | Endpoints principales |
|--------|-----------------------|
| `archivos` | `POST /url-subida`, `POST /:id/confirmar`, `GET /:id/url`, `DELETE /:id` |
| `visagismo` | `POST /analizar`, `GET /caso/:id` |

### Módulos Fase E ✅
| Módulo | Endpoints principales |
|--------|-----------------------|
| `colaboracion` | `POST /sesiones`, `POST /sesiones/unirse`, `GET /sesiones/:codigo`, `GET /caso/:id`, `DELETE /sesiones/:codigo` |
| `laboratorio` | `POST /enviar`, `GET /pedidos/:id`, `GET /caso/:id`, `POST /webhook` |

### Módulos Fase F ✅
| Módulo | Endpoints principales |
|--------|-----------------------|
| `firmas` | `POST /`, `POST /aprobar`, `GET /diseno/:id`, `GET /:id/verificar` |
| `audit` (`@Global`) | `GET /audit/logs` (filtros), `GET /audit/exportar` |

---

# ⏳ PENDIENTES REALES (requieren infraestructura externa)

| Item | Fase | Requiere |
|------|------|----------|
| Socket.io WebSockets real | E | ✅ Implementado (Gateway + Client) |
| Portal del Paciente | E | ✅ Implementado (Ruta pública /v/:id) |
| PKI / certificados X.509 | F | CA o proveedor firma electrónica |
| Audit logs inmutables en DB | F | ✅ Implementado (Prisma + AuditLog) |
| Visor STL Three.js | F | ✅ Implementado (Three.js + Visor3D) |

---

# �💥 VISIÓN FINAL

Plataforma líder de odontología estética digital, impulsada por IA, colaborativa y lista para producción CAD/CAM.
