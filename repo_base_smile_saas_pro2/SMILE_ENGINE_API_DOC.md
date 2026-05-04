# 🦷 SMILE ENGINE PRO — DOCUMENTACIÓN TÉCNICA OFICIAL

Bienvenido a la documentación del motor core de **Smile Design Pro 2**. Este sistema es un orquestador modular de alto rendimiento diseñado para el diseño de sonrisa clínico asistido por IA, con capacidades de renderizado PBR (Physically Based Rendering) y gestión de estados no lineal.

---

## 🏗️ Arquitectura del Sistema

El motor sigue una arquitectura de **Pipeline Unidireccional** dividida en capas de responsabilidad:

1.  **Capa de Tipos (Core)**: Definición única de la anatomía dental en TypeScript.
2.  **Capa de Motores (Logic)**: Algoritmos puros (Geometry, Anatomy, Physics).
3.  **Capa de Orquestación (Core)**: `SmileEngineCore` sincroniza los motores y el canvas.
4.  **Capa de Estado (Zustand)**: `useEditorStore` maneja la reactividad y persistencia.
5.  **Capa de Repotería**: `ClinicalReportEngine` transforma el diseño en documentación técnica.

---

## 🚀 SmileEngineCore (Orquestador)

El punto de entrada principal para la visualización y manipulación 3D.

### Métodos Públicos

| Método | Descripción | Retorno |
| :--- | :--- | :--- |
| `generarDisenoCompleto(cara: DatosFaciales)` | Ejecuta el pipeline completo (Detección -> Diseño). | `Blueprint` |
| `actualizarYRenderizar(blueprint: Blueprint)` | Sincroniza el estado visual con el blueprint. | `void` |
| `setModoVisual(modo: 'humedo' | 'seco')` | Cambia las propiedades ópticas del motor de renderizado. | `void` |

---

## 🧬 Motores Especializados

### VisualRenderer (Motor de Representación Fotorealista & Cinemático)
Orquestador de la escena WebGL de Three.js. Sincroniza los cambios del *Blueprint* con los *Meshes* 3D y aplica un pipeline de post-procesamiento fotográfico.
- **Cinematic Post-Processing (EffectComposer)**: Abandonó el WebGL renderer simple en favor de una cadena de post-procesamiento multi-pass:
  1. **Bloom Sutil (`UnrealBloomPass`)**: Genera el halo de dispersión de luz en las reflexiones especulares de la saliva y el esmalte, vital para el mimetismo orgánico.
  2. **Color Grading LUT (`ColorCorrectionShader`)**: Aplica corrección de color paramétrica (exposición, contraste, y temperatura de color) para unificar la paleta de las cerámicas con la iluminación real de la boca clínica.
  3. **Depth of Field (`BokehPass`)**: Emula lentes macro de fotografía odontológica, forzando un ligero desenfoque fuera del plano focal de los incisivos centrales, incrementando drásticamente el fotorrealismo ("Wow Effect").
- **Tone Mapping Avanzado**: Emplea `ACESFilmicToneMapping` con control de exposición, emulando la respuesta de las películas cinematográficas y cámaras réflex. Elimina por completo la saturación artificial "CGI" y ajusta el rango dinámico de los blancos dentales.
- **HDR Environment Mapping (IBL)**: Utiliza `RoomEnvironment` acoplado a un generador PMREM para bañar la escena en iluminación global basada en imagen. Esto genera reflejos ambientales extremadamente complejos (micro-rugosidad) sobre el esmalte, dándole el aspecto húmedo y natural de la boca humana.

### AnatomyEngine
Centraliza el conocimiento clínico. Mapea la nomenclatura FDI (Federación Dental Internacional) a geometrías específicas.

### MaterialSystem PRO (PBR + Micro-Detail)
Motor de materiales basado en física para realismo clínico indistinguible de la fotografía.
- **Fresnel**: Controla la reflexión de luz en los bordes para mimetismo cerámico.
- **SSS (Subsurface Scattering)**: Emula la penetración de luz en el esmalte/dentina.
- **Opalescencia**: Gestiona los efectos de coloración interna reactivos.
- **Noise Map Procedural**: Genera una `DataTexture` de ruido pseudo-aleatorio por pieza dental (semilla = número FDI). Cada diente recibe una micro-textura de esmalte única con estrías multi-frecuencia, eliminando el aspecto plástico de superficies perfectas.
- **Micro Roughness Variation**: El `roughnessMap` procedural modula la rugosidad a escala de píxel. Los bordes incisales concentran más irregularidad ("Edge Wear") imitando el desgaste natural del esmalte.
- **Variación Orgánica por Pieza (`getVariacionPorPieza`)**: Aplica sesgos automáticos basados en anatomía real: incisivos laterales más translúcidos, caninos más cálidos/amarillentos, premolares y molares progresivamente más rugosos y opacos. El resultado es que ningún diente se ve idéntico a otro.

### Biomechanical Physics Engine (Oclusión y PBD)
Motor real de simulación física basado en Position Based Dynamics (PBD) que modela la interacción mecánica, la masa de las coronas y la resistencia periodontal. (Anteriormente `ConstraintEngine` estático).
- **Colisión Diente-Diente Dinámica**: En lugar de corregir estáticamente, el motor simula el contacto físico. Si el odontólogo desplaza o ensancha un incisivo, este "empuja" al diente contiguo calculando la fuerza de repulsión elástica basada en la masa relativa de las coronas.
- **Resistencia Periodontal**: Introduce constantes de fricción biomecánicas. Un incisivo central (mayor masa) ejerce mayor fuerza de desplazamiento sobre un lateral (menor masa) que viceversa.
- **Resolución Iterativa (Stepper)**: Evalúa las colisiones encadenadas en tiempo real a 60 fps (e.g. Diente A empuja a B, y B empuja a C).
- **Límites Anatómicos (Bio-Guardrails)**: Verifica constantemente que la relación ancho/alto de la pieza se mantenga dentro de parámetros fisiológicos saludables (ratio 0.7 - 0.9).
- **Soft Occlusion (Ambient Occlusion Gingival)**: Motor de intersección paramétrica (`calcularInterseccionLabioDiente`) que inyecta shaders en tiempo real (`aplicarSoftOcclusion`) para simular la sombra proyectada por el tejido blando sobre el esmalte, eliminando el corte artificial entre el labio y la corona.

### SoftTissueEngine (Gingiva Dinámica & Interacción Labio-Diente)
Motor de simulación de tejidos blandos que modela la encía y la interacción biomecánica entre labios y dientes.
- **Márgenes Gingivales Anatómicos**: Calcula el festón gingival por pieza, con desplazamiento del zenith según anatomía real (distalizado en centrales/caninos, centrado en laterales).
- **Papilas Interdentales Dinámicas**: Genera las papilas proporcionalmente al gap proximal entre dientes contiguos. A menor distancia, mayor papila (tejido más sano). Gaps grandes producen papilas colapsadas (indicativo de riesgo periodontal).
- **Profundidad de Surco Periodontal**: Calcula la profundidad del sulcus gingival basándose en la escala dental. Piezas sobredimensionadas generan surcos más profundos, reflejando tensión tisular.
- **Deformación Biomecánica del Labio**: Modela la presión que los bordes incisales ejercen sobre el labio inferior. Cada diente "empuja" los puntos del contorno labial proporcionalmente a su protrusión (`posZ`) y escala, con un coeficiente de elasticidad (`0.35`).
- **Mesh Gingival 3D**: Genera un `THREE.Mesh` con geometría de encía (`ShapeGeometry`) y color paramétrico: rosa sano (`#f5a0a0`) cuando la profundidad del surco es ≤2mm, rojo inflamado (`#d06060`) cuando supera los 4mm.
- **SVG Path de Festón**: Produce un path SVG con curvas cuadráticas suaves para renderizado 2D en la capa de Konva.

### PlantillaEngine (Smile Catalog & Library)
Motor responsable de la gestión, cruce y mutación de plantillas de diseño, acelerando drásticamente el flujo clínico.
- **Catálogo de Sonrisas / Presets**: Conjunto de bibliotecas paramétricas listas para aplicar.
- **Catálogo Persistente**: Mediante el uso del middleware de persistencia en Zustand (`smile-design-library-storage`), las plantillas personalizadas y los "favoritos" creados por el odontólogo sobreviven a los refrescos de página, creando una librería escalable.
- **Versionado Automático**: Al guardar una iteración de un preset existente, el motor automáticamente genera un versionado semántico (Ej: "Natural v2", "Natural v3"), manteniendo trazabilidad de la evolución estética.
- **Combinaciones Dinámicas**: Posibilidad de interpolar paramétricamente dos plantillas (Ej: 50% Hollywood + 50% Natural) creando presets híbridos on-the-fly (`combinarPlantillas`).
- **Aplicar Plantilla**: Reconfigura instantáneamente las morfologías, proporciones, materiales y transformaciones 3D de todas las piezas dentales o de una pieza individual para igualar el preset.
- **Variantes y Mutaciones**: Genera versiones iterativas de una plantilla base variando sutilmente atributos como la opalescencia o la curva de sonrisa.

### AI Engine PRO (Inteligencia Estética - Nivel 2)
Módulo inteligente que asiste en las decisiones clínicas mediante análisis cuantitativo y algoritmos de optimización matemática iterativa.
- **Scoring Estético**: Evalúa en tiempo real (0-100) la simetría, proporción áurea y coincidencia con la línea media facial.
- **Auto-Alineación Bipupilar**: Sincroniza automáticamente la rotación del diseño con el ángulo detectado entre las comisuras oculares (`ejeInterpupilar`). Corrige el tilt facial mediante trigonometría aplicada a los landmarks 33 y 263.
- **Auto-Optimización Multi-Variable (Hill Climbing)**: Reemplaza las simples heurísticas por un algoritmo iterativo estocástico que realiza decenas de permutaciones microscópicas (`MAX_ITERATIONS = 50`) en la posición `X/Y` y escala de los dientes anteriores. La IA busca activamente maximizar la "Función de Coste" del Score Estético sin romper la oclusión posterior.
- **Centrado Quirúrgico**: Calcula el desplazamiento milimétrico exacto para que el eje inter-incisivo coincida perfectamente con la línea media facial y el filtro labial detectado por el modelo de visión.
- **Selección Automática (Visagismo)**: Analiza la forma facial (ratio vertical/horizontal) y sugiere la plantilla anatómica más armoniosa (ej. dientes rectangulares para caras redondas).

### CollaborationEngine (Multi-User & Tele-Odontología)
Motor de sincronización en tiempo real vía WebSockets que convierte el editor en un entorno colaborativo multitenant.
- **Presencia Activa (Tele-Pointers)**: Transmite y renderiza la posición del cursor (`x`, `y`) de los participantes (ej. Odontólogo y Ceramista) sobre el canvas, facilitando la discusión clínica remota.
- **Locks Pesimistas (Control de Concurrencia)**: Al interactuar con una pieza dental, el motor solicita un bloqueo exclusivo (`DIENTE_BLOQUEADO`). Si el laboratorio edita el diente 11, el odontólogo no puede arrastrarlo, evitando condiciones de carrera o estados inválidos.
- **Sincronización Delta**: Intercepta los cambios del `Blueprint` y los transmite mediante un payload liviano. Al recibir un `BLUEPRINT_DELTA`, el Zustand Store aplica el merge y el `SmileEngineCore` re-renderiza a 60fps sin perder el contexto visual.

### ClinicalAuditEngine (Auditoría Clínica Automática)
Motor de validación médica que evalúa el diseño contra reglas clínicas basadas en literatura odontológica (Lombardi 1973, Sterrett 1999). Produce un informe de auditoría con score clínico independiente y alertas con 3 niveles de severidad (`info`, `advertencia`, `critico`).
- **Validación de Proporciones Anatómicas**: Verifica que la relación ancho/alto de cada pieza esté dentro del rango fisiológico (0.65-0.90). Valores fuera de rango generan alertas con recomendaciones de ajuste.
- **Detección de Riesgo Periodontal**: Analiza los contactos proximales entre piezas contiguas. Gaps excesivos (>3px) se marcan como riesgo de empaquetamiento alimenticio; superposiciones (>5px) indican colisiones no resueltas.
- **Contraindicaciones Biomecánicas**: Detecta angulaciones excesivas (>20°), escalas anómalas (<60% o >150%), y overjet fuera de rango que comprometerían la funcionalidad oclusal.
- **Simetría de Homólogos**: Compara pares contralaterales (11↔21, 12↔22, 13↔23) para detectar asimetrías >10% en dimensiones.
- **Validación de Proporción Áurea**: Calcula la relación Central/Lateral y Lateral/Canino contra el coeficiente φ (1.618) con ±15% de tolerancia.
- **Desviación de Línea Media**: Marca como perceptible a >2mm y como crítica a >4mm de desviación respecto al eje facial.
- **Curva de Sonrisa**: Detecta curvas invertidas (cóncavas) o planas, recomendando ajustes incisales.
- **Integración con IA**: Si el Score Estético del AI Engine es <40, emite alerta crítica; <65, advertencia.
---

## 📦 Tipos Principales (Core Types)

### Blueprint (PRO)
El "Plano Maestro" del diseño. Ahora incluye soporte para **Branching**.
```typescript
interface Blueprint {
  id: string;
  dientes: Diente[];
  vistas: Vista[];         // Multi-Escenario Clínico (Frontal, Lateral, etc.)
  vistaActivaId: string;
  cara: {
    mascaraLabiosUrl?: string; // Alpha Matte (CNN) para Lip Blending
    // ... landmarks
  };
  guias: Guia[];           // Guías paramétricas (Media, Sonrisa, Áurea)
  configuracion: {
    modoVisual: "humedo" | "seco";
    opacidadLabios: number; // 0.0 a 1.0 para Alpha Blending (Raster Mask)
  };
  historial: VersionHistorial[];
  indiceHistorial: number;
}
```

### Motor de Segmentación Labial (Pixel-Level)
El `LipRenderer` desecha la antigua segmentación por polígonos/landmarks.
- **CNN Mask Ingestion**: Ingiere una máscara binaria (Alpha Matte) generada por redes neuronales (ej. BiSeNet) enviada desde el `vision-service`.
- **Pixel-Perfect Alpha Blending**: Utiliza Canvas API (`destination-out`) para calar la máscara sobre la fotografía original a resolución nativa.
- **Dynamic Edge Feather**: Aplica un difuminado paramétrico (`filter: blur`) a los bordes de la máscara antes del blending. Esto suaviza la transición visual entre la mucosa húmeda (labios reales) y el esmalte cerámico (3D), haciendo que la integración sea imperceptible.

### Vista (Multi-Escenario)
Almacena el contexto clínico por escenario fotográfico.
```typescript
interface Vista {
  id: string;              // ej: "vista-frontal", "vista-lateral"
  nombre: string;
  fotoUrl: string | null;  // Foto específica del paciente en esta pose
  cara: DatosFaciales;     // Landmarks específicos para esta vista
}
```

### Guia (Diagnóstico Clínico)
Estructura paramétrica para justificación de proporciones.
```typescript
interface Guia {
  id: string;              // "linea-media", "sonrisa", "aurea"
  tipo: string;
  activa: boolean;
  parametros: {
    escala?: number;
    offsetX?: number;
    offsetY?: number;
    curvatura?: number;
  };
}
```

### Diente (Estructura Avanzada)
Representación de una pieza dental individual con control 3D completo.
```typescript
interface Diente {
  id: string;
  pieza: number; // FDI (11, 21, etc)
  transformacion3D: {
    rotX: number; // Inclinación vestibular/palatina
    rotY: number; // Angulación mesio-distal
    rotZ: number; // Rotación sobre el eje
    posZ: number; // Profundidad (Overjet)
  };
  material: {
    colorBase: string;
    translucidez: number;
    sss: number;        // Subsurface Scattering
    fresnel: number;    // Reflexión física
    opalescencia: number;
    rugosidad: number;
  };
}
```

### VersionHistorial (Branching Support)
Permite una navegación no lineal por el historial de diseño.
```typescript
interface VersionHistorial {
  id: string;
  parentId: string | null; // Soporte para ramificación
  etiqueta?: string;       // Ejemplo: "SNAPSHOT: Propuesta B"
  fecha: number;
  data: string;            // Snapshot serializado (JSON)
}
```

---

## 📄 ClinicalReportEngine & CAD/CAM Pipeline
Transforma el diseño digital en una hoja de ruta técnica para el laboratorio dental y en archivos de manufactura.
- **Exportación HTML/PDF**: Genera reportes con métricas PBR precisas.
- **Trazabilidad**: Incluye el historial de cambios validado por el profesional.
- **Datos de Estratificación**: Indica valores de Scattering y Fresnel para el ceramista.
- **Exportación STL (Geometría Sólida)**: Compila las geometrías 3D ajustadas (rotación, oclusión, escala) en un archivo STL sólido. Ideal para impresión 3D directa de mockups físicos.
- **Exportación OBJ (Geometría Texturizada)**: Genera un archivo Wavefront OBJ que, a diferencia del STL, conserva los grupos (piezas individuales) y las coordenadas UV para texturizado. Crítico para laboratorios que necesitan mapear texturas o propiedades PBR.
- **Integración Laboratorio (Exocad/3Shape)**: Los parámetros espaciales y mallas pueden importarse en software CAD odontológico mediante JSON, asegurando que el técnico de laboratorio comience su modelado guiado por el diseño 3D aprobado por el clínico.

---

## 🛠️ Herramientas de UI (Exposed Features)

| Componente | Función | Beneficio Clínico |
| :--- | :--- | :--- |
| **Timeline PRO** | Visualiza el árbol de versiones. | Comparación de múltiples propuestas estéticas. |
| **3D Gizmos** | Sliders de rotación y profundidad. | Ajuste fino de la oclusión y posición anatómica. |
| **PBR Sliders** | Ajuste óptico manual. | Mimetismo biológico exacto con los dientes vecinos. |
| **Wet/Dry Toggle** | Conmutador de renderizado. | Visualización "Paciente" vs "Laboratorio". |
| **Library Catalog** | Galería visual de presets con filtrado por Favoritos. | Navegación rápida y selección intuitiva de estilos base. |
| **Partial Apply** | Aplicación de un preset a una sola pieza dental. | Personalización extrema y caracterización individual. |
| **Multi-View Panel** | Selector rápido de escenarios fotográficos. | Evaluación del diseño en reposo, sonrisa y perfil. |
| **Clinical Guides PRO** | Sliders paramétricos para reglas estéticas. | Justificación del tratamiento basada en métricas reales. |

---

## 📈 Rendimiento y Límites
- **FPS**: 60fps constantes mediante optimización de BufferGeometries.
- **Branching Limit**: Soporte para hasta 100 versiones por diseño.
- **Persistencia**: Sincronización en tiempo real con PostgreSQL + Redis.

---

## 🎨 Premium Design Engineering (Design Taste)

El sistema de interfaz de **Smile Pro** sigue estándares de diseño de alta gama para asegurar una experiencia clínica premium:

- **Liquid Glass System**: Uso de superficies translúcidas con `backdrop-blur-xl` y bordes de refracción interna (`border-white/20`). Esto reduce la carga cognitiva mientras mantiene una estética de boutique digital.
- **Motion Orchestration**: Todas las entradas de datos y paneles laterales están orquestados con **Framer Motion**, utilizando transiciones de tipo `spring` (física de resortes) para una respuesta táctil natural.
- **Zero-Emoji Policy**: Se prohíbe el uso de emojis en la interfaz clínica. Se emplea exclusivamente la librería **Phosphor Icons** en pesos `duotone` y `fill` para mantener la sobriedad técnica.
- **High-Fidelity Typography**:
  - **Outfit**: Tipografía principal para lectura clara y moderna.
  - **JetBrains Mono**: Utilizada exclusivamente para métricas, coordenadas 3D y scores clínicos, reforzando la precisión del motor.
- **Asymmetric Layout (Variance 8)**: El editor evita la simetría perfecta, utilizando paneles flotantes asimétricos para crear una sensación de "Laboratorio de Diseño" en lugar de un software administrativo genérico.

---

## 🎭 Premium Whimsy & Delight (Whimsy Injector)

El diseño se eleva mediante momentos de "deleite con propósito" que humanizan la tecnología clínica:

- **Strategic Personality**: Inyección de micro-interacciones sutiles que reducen la ansiedad del flujo clínico (ej: destellos premium en botones de alta importancia).
- **Playful Microcopy**: Uso de términos evocadores como "Obra Maestra" (Save), "Armonizar" (Align) o "STL Maestro" (Export), reforzando la identidad de "Artesano Digital" del clínico.
- **Micro-Celebrations**: Uso de la **Dynamic Island** para feedback de éxito no intrusivo con efectos de brillo (`shimmer-premium`).
- **Aura Áurea**: Herramienta de superposición de la Proporción Áurea accesible desde la sección de Guías Clínicas para validación estética instantánea.
- **Inclusive Whimsy**: Todas las animaciones respetan las preferencias de reducción de movimiento del sistema operativo.

---

> [!IMPORTANT]
> El motor Smile Engine PRO está diseñado para ser agnóstico al framework, pero se recomienda su uso con **Zustand** para la gestión del estado de alta frecuencia requerida por los controles 3D.

