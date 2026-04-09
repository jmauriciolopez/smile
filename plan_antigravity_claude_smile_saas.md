
# plan_antigravity_claude_smile_saas.md

# Guía de etapas para crear un SaaS tipo Smile Design con Antigravity o Claude

## Objetivo

Construir un producto web con:

- **UI premium**
- flujo primero visual/mockup
- posterior limpieza y mapeo al backend
- **QA obligatorio en cada etapa**
- nombres de **métodos, variables, funciones, DTOs, tablas y endpoints en español**
- criterio claro para separar:
  - prototipo visual
  - lógica real
  - integración backend
  - endurecimiento técnico

---

# 1. Principios rectores del proyecto

## 1.1. Regla general de construcción

Siempre avanzar en este orden:

1. **Definir módulo**
2. **Diseñar mockup premium**
3. **Validar UX**
4. **Limpiar componentes**
5. **Mapear datos**
6. **Conectar backend**
7. **Agregar validaciones**
8. **Ejecutar QA**
9. **Cerrar etapa**

Nunca empezar por backend si la pantalla todavía no está clara.

---

## 1.2. Regla de idioma del código

Todo debe ir en español, salvo librerías externas.

### Ejemplos correctos

- `PacienteCard`
- `EditorSonrisaPage`
- `obtenerCasoPorId`
- `guardarDisenoSonrisa`
- `calcularLineaMedia`
- `crearCaso`
- `actualizarEstadoTratamiento`
- `caso_id`
- `fecha_creacion`
- `ancho_diente`

### Ejemplos a evitar

- `SmileEditor`
- `saveSmile`
- `getPatient`
- `caseId`
- `treatmentStatus`

---

## 1.3. Regla de mockup

Durante etapas visuales:

- se permite usar datos falsos
- se permite hardcodear listas
- se permite simular estados
- se permite ignorar integración real

Pero debe quedar **explícito** que el código es mockup.

### Convención sugerida

- carpeta: `src/mock/`
- prefijo de variables: `mock...`
- comentario: `// MOCK TEMPORAL`

Ejemplo:

```ts
const mockPacientes = [...]
const mockDisenoActivo = {...}
```

---

## 1.4. Regla de limpieza post-mockup

Toda etapa visual cerrada debe pasar por una limpieza mínima:

- extraer componentes repetidos
- eliminar estilos duplicados
- mover datos mock a archivos separados
- definir props tipadas
- separar contenedor de presentación
- dejar puntos claros de integración

No conectar backend sobre un mockup caótico.

---

## 1.5. QA obligatorio por etapa

Cada etapa debe cerrar con:

### Frontend
```bash
npm run build
```

### Tests unitarios si existen
```bash
npm run test
```

### Lint si existe
```bash
npm run lint
```

### Backend
```bash
npm run build
```

### NestJS tests si existen
```bash
npm run test
```

### E2E si aplica
```bash
npm run test:e2e
```

Si una etapa no compila, no se considera terminada.

---

# 2. Stack sugerido

## Frontend
- React
- TypeScript
- Tailwind
- shadcn/ui
- Zustand o TanStack Query
- React Hook Form
- Zod

## Backend
- NestJS
- TypeScript
- PostgreSQL
- Prisma u ORM equivalente

## Motor visual / IA inicial
- servicio aislado futuro para visión
- en MVP inicial: simulación visual 2D
- luego microservicio Python si hace falta

---

# 3. Estructura macro del proyecto

## Frontend

```text
src/
  componentes/
  modulos/
    pacientes/
    casos/
    diseno_sonrisa/
    presupuestos/
  paginas/
  servicios/
  hooks/
  store/
  tipos/
  mock/
  utilidades/
```

## Backend

```text
src/
  modulos/
    pacientes/
    casos/
    disenos/
    presupuestos/
    archivos/
    autenticacion/
  comun/
  base_datos/
```

---

# 4. Metodología de trabajo con Antigravity o Claude

## 4.1. Regla de prompt por etapa

No pedir “haceme todo el sistema”.
Pedir bloques cerrados, con criterio de aceptación.

### Estructura recomendada de cada prompt

1. contexto del módulo
2. objetivo puntual
3. restricciones técnicas
4. reglas visuales
5. salida esperada
6. criterio de QA

---

## 4.2. Regla de doble pasada

Cada etapa debe tener dos pasadas:

### Pasada A — Construcción rápida
- crear pantalla o módulo
- privilegiar velocidad y claridad visual

### Pasada B — Limpieza técnica
- refactor
- nombres consistentes
- props tipadas
- separación de responsabilidades
- preparación para integración

---

# 5. Etapas del proyecto

---

# ETAPA 0 — Definición base del producto

## Objetivo
Definir alcance exacto del MVP.

## Salidas esperadas
- módulos del MVP
- actores
- flujo principal
- decisiones de stack
- convención de nombres en español

## Entregables
- `README.md`
- `arquitectura_mvp.md`
- `convenciones_codigo.md`

## Prompt sugerido para Antigravity o Claude

```md
Quiero definir el MVP de un SaaS odontológico orientado a diseño de sonrisa y cierre comercial.

Necesito:
1. módulos del MVP
2. flujo principal del usuario
3. lista de entidades
4. convenciones de código
5. propuesta de estructura de carpetas

Restricciones:
- frontend React + TypeScript
- backend NestJS
- nombres de variables, métodos, componentes y entidades en español
- enfoque UI premium
- separar claramente mockup y posterior integración real

Entrega:
- markdown claro
- tablas cuando ayuden
- sin código innecesario
```

## QA de cierre
No técnico aún, pero sí revisión manual:
- ¿el alcance está claro?
- ¿hay módulos de más?
- ¿la nomenclatura en español quedó definida?

---

# ETAPA 1 — Sistema visual y design language

## Objetivo
Construir las reglas visuales premium antes de armar pantallas.

## Qué debe definirse
- tipografías
- escalas
- spacing
- radios
- sombras
- cards
- botones
- inputs
- badges
- tablas
- layout de dashboard
- reglas de densidad visual

## Regla de UI premium

La UI debe sentirse:
- clínica
- elegante
- moderna
- confiable
- no recargada

### Debe incluir
- mucho espacio en blanco
- jerarquías claras
- tarjetas con borde suave
- fondos neutros
- acentos mínimos
- componentes consistentes

### Evitar
- gradientes excesivos
- colores estridentes
- 20 métricas en una sola pantalla
- tablas pesadas sin aire
- sombras agresivas

## Entregables
- `guia_visual.md`
- `tokens_ui.ts`
- `componentes_base/`

## Prompt sugerido

```md
Generá un sistema de diseño premium para una aplicación web odontológica enfocada en estética dental y gestión comercial.

Necesito:
- reglas de color
- tipografías
- escalas
- componentes base
- estilo de dashboard
- estilo de formularios
- estilo de cards
- estilo de tablas

Restricciones:
- React + Tailwind
- estética premium, clínica y minimalista
- no usar una UI genérica de admin
- nombres en español
- dejar listo para reutilizar en múltiples módulos

Entregá:
- componentes base
- tokens reutilizables
- ejemplos de uso
```

## QA
```bash
npm run build
npm run lint
```

Criterios:
- no errores de tipos
- no clases desordenadas repetidas si pueden abstraerse
- componentes base reutilizables

---

# ETAPA 2 — Mockup premium de navegación y shell principal

## Objetivo
Crear el contenedor visual principal del sistema.

## Alcance
- sidebar
- topbar
- breadcrumbs
- layout responsive
- área de contenido
- estados vacíos
- estados loading
- layout para dashboard y formularios

## Regla
Todavía no conectar datos reales.

## Entregables
- `AppShell`
- `SidebarPrincipal`
- `TopbarPrincipal`
- `ContenedorPagina`
- `CardResumen`
- `EstadoVacio`
- `EstadoCarga`

## Prompt sugerido

```md
Construí el shell principal de una aplicación premium para odontólogos.

Debe incluir:
- sidebar colapsable
- topbar
- breadcrumb
- layout responsive
- componentes para estados vacíos y carga
- cards premium

Restricciones:
- usar React + TypeScript + Tailwind
- nombres de componentes en español
- no integrar backend
- usar mock simple
- código limpio y modular
```

## QA
```bash
npm run build
npm run lint
```

---

# ETAPA 3 — Mockup de pantallas clave del MVP

## Objetivo
Diseñar visualmente las pantallas más importantes antes de programar lógica real.

## Pantallas mínimas
1. Dashboard
2. Pacientes
3. Caso clínico
4. Editor de sonrisa
5. Presupuesto / plan
6. Seguimiento comercial

## Regla fuerte de esta etapa

Estas pantallas deben ser tratadas como **prototipos navegables premium**.

### Se permite
- navegación fake
- datos mock
- sliders sin persistencia
- before/after simulado

### No se permite
- mezclar fetch real con datos falsos
- meter lógica backend parcial

## Entregables
- páginas navegables
- datos mock centralizados
- flujo visual claro

## Prompt sugerido

```md
Quiero crear mockups premium navegables de las pantallas clave de un SaaS odontológico.

Pantallas:
- dashboard
- listado de pacientes
- detalle de caso
- editor de sonrisa
- presupuesto del tratamiento
- seguimiento comercial

Restricciones:
- React + TypeScript
- nombres en español
- usar datos mock en archivos separados
- foco total en UX premium
- no conectar backend en esta etapa
- dejar clara la arquitectura de componentes para futura integración

Entrega:
- componentes reutilizables
- páginas navegables
- estructura prolija
```

## QA
```bash
npm run build
npm run lint
```

## Checklist manual
- ¿se entiende el flujo sin explicar?
- ¿la pantalla de editor tiene foco?
- ¿el dashboard parece producto premium y no template genérico?
- ¿los componentes son consistentes?

---

# ETAPA 4 — Limpieza de mockups y mapeo funcional

## Objetivo
Convertir mockups lindos en una base técnica mantenible.

## Tareas
- extraer componentes
- definir tipos
- crear interfaces
- identificar datos reales necesarios
- mapear estados
- mapear eventos de usuario
- documentar endpoints futuros

## Salida clave
Cada pantalla debe tener un documento de mapeo:

### Ejemplo
- pantalla: `EditorSonrisaPage`
- datos requeridos:
  - paciente
  - caso
  - diseño actual
  - presets
- acciones:
  - guardar borrador
  - comparar versión
  - aprobar diseño
- backend futuro:
  - `GET /casos/:id`
  - `POST /disenos`
  - `PATCH /disenos/:id`

## Entregables
- `mapeo_pantallas_backend.md`
- tipos TS
- servicios placeholder
- hooks placeholder

## Prompt sugerido

```md
Tomá estas pantallas mockup ya creadas y hacé una limpieza técnica.

Necesito:
- extraer componentes repetidos
- definir tipos e interfaces
- separar presentación de contenedores
- identificar datos necesarios por pantalla
- mapear acciones del usuario a futuros endpoints
- dejar servicios placeholder

Restricciones:
- no conectar backend todavía
- todo en español
- mantener la calidad visual
- preparar la base para integración real
```

## QA
```bash
npm run build
npm run lint
```

---

# ETAPA 5 — Modelado backend y base de datos

## Objetivo
Diseñar las entidades reales del sistema.

## Entidades sugeridas
- paciente
- caso_clinico
- diseno_sonrisa
- foto_clinica
- presupuesto
- opcion_tratamiento
- seguimiento_comercial
- usuario
- tarea_interna
- nota_clinica

## Regla de naming
### Tablas
- `pacientes`
- `casos_clinicos`
- `disenos_sonrisa`
- `seguimientos_comerciales`

### Columnas
- `fecha_creacion`
- `fecha_actualizacion`
- `estado_caso`
- `nombre_completo`

## Prompt sugerido

```md
Diseñá el modelo de datos para un SaaS odontológico orientado a diseño de sonrisa y gestión comercial.

Necesito:
- entidades principales
- relaciones
- campos por entidad
- enums
- decisiones de modelado
- propuesta SQL o Prisma

Restricciones:
- nombres de tablas y columnas en español
- backend NestJS
- PostgreSQL
- contemplar evolución futura sin sobrediseñar
```

## QA
Si hay Prisma:
```bash
npx prisma validate
npx prisma format
```

Si hay Nest:
```bash
npm run build
```

---

# ETAPA 6 — Backend base por módulos

## Objetivo
Crear módulos NestJS limpios, sin lógica compleja al inicio.

## Módulos mínimos
- `pacientes`
- `casos`
- `disenos`
- `presupuestos`
- `seguimientos`

## Regla
Primero CRUD limpio. Después reglas de negocio.

## Estructura sugerida por módulo
- controlador
- servicio
- dto crear
- dto actualizar
- entidad / mapper
- repositorio o acceso ORM

## Prompt sugerido

```md
Generá módulos base en NestJS para:
- pacientes
- casos
- disenos
- presupuestos
- seguimientos

Quiero:
- estructura limpia
- DTOs en español
- servicios y controladores en español
- validaciones con class-validator
- código compilable
- preparado para crecer

No agregues lógica compleja todavía.
```

## QA
```bash
npm run build
npm run test
```

---

# ETAPA 7 — Integración frontend-backend por módulo

## Objetivo
Reemplazar mocks por datos reales de manera progresiva.

## Regla de integración

Se integra **un módulo por vez**.

Orden sugerido:
1. pacientes
2. casos
3. seguimientos
4. presupuestos
5. diseños

## Técnica recomendada
- mantener fallback visual
- usar servicios por módulo
- usar hooks por pantalla
- no mezclar fetch en componentes presentacionales

## Prompt sugerido

```md
Integramos el módulo de pacientes del frontend con el backend real.

Necesito:
- reemplazar mock por API real
- conservar la UI premium existente
- usar servicios desacoplados
- usar hooks o capa de consulta
- manejar loading, error y vacío
- mantener todos los nombres en español

No rompas componentes visuales ya aprobados.
```

## QA
Frontend:
```bash
npm run build
npm run lint
```

Backend:
```bash
npm run build
npm run test
```

Checklist:
- ¿se ve igual o mejor que en mock?
- ¿loading/error están resueltos?
- ¿no quedaron mocks mezclados accidentalmente?

---

# ETAPA 8 — Editor de sonrisa: fase funcional inicial

## Objetivo
Pasar de una pantalla linda a una herramienta funcional.

## MVP realista
- subir foto
- mostrar foto base
- seleccionar preset de sonrisa
- ajustar ancho / alto / posición
- comparar antes/después
- guardar borrador

## Regla
No intentar IA completa en esta etapa.

## Separación técnica recomendada
- `EditorSonrisaPage`
- `LienzoSonrisa`
- `PanelControlesSonrisa`
- `ComparadorAntesDespues`
- `useEditorSonrisa`
- `servicioDisenos`

## Prompt sugerido

```md
Construí la primera versión funcional del editor de sonrisa.

Funciones:
- cargar foto del paciente
- superponer diseño básico
- permitir ajustes simples
- comparación antes/después
- guardar borrador

Restricciones:
- mantener UI premium
- código en español
- arquitectura modular
- no intentar visión por computadora avanzada todavía
- dejar puertas claras para una futura evolución
```

## QA
```bash
npm run build
npm run lint
npm run test
```

---

# ETAPA 9 — Presupuesto y cierre comercial

## Objetivo
Agregar la capa de negocio que monetiza el sistema.

## Funciones
- generar presupuesto
- múltiples opciones de tratamiento
- cuotas
- estado de negociación
- fecha estimada de cierre
- observaciones

## Insight
Esta etapa da valor comercial real.

## Prompt sugerido

```md
Quiero implementar el módulo de presupuesto y seguimiento comercial.

Debe incluir:
- crear presupuesto
- opciones de tratamiento
- cuotas
- estado comercial
- observaciones
- vista premium y clara para mostrar al paciente

Restricciones:
- frontend React
- backend NestJS
- nombres en español
- integrable con pacientes y casos
```

## QA
```bash
npm run build
npm run lint
npm run test
```

---

# ETAPA 10 — Seguridad, permisos y endurecimiento

## Objetivo
Preparar el sistema para uso más real.

## Incluir
- login
- roles básicos
- permisos
- auditoría mínima
- validaciones backend
- sanitización
- manejo de errores consistente

## Prompt sugerido

```md
Agregá seguridad base al sistema.

Necesito:
- autenticación
- roles
- guards
- validaciones consistentes
- manejo de errores homogéneo
- preparación para ambiente productivo

Todo con nombres en español y código claro.
```

## QA
```bash
npm run build
npm run test
npm run test:e2e
```

---

# ETAPA 11 — QA transversal y estabilización

## Objetivo
Revisar todo el sistema de punta a punta.

## Checklist funcional
- crear paciente
- crear caso
- subir foto
- editar sonrisa
- guardar diseño
- generar presupuesto
- actualizar seguimiento

## Checklist técnico
- tipos coherentes
- componentes reutilizables
- rutas limpias
- errores manejados
- ningún mock muerto
- nombres consistentes en español

## Prompt sugerido

```md
Quiero una pasada completa de QA y refactor final.

Revisá:
- consistencia de nombres
- componentes duplicados
- servicios repetidos
- manejo de errores
- validaciones
- estados loading y vacíos
- deuda técnica visible

Proponé correcciones y aplicalas sin romper el sistema.
```

## QA
```bash
npm run build
npm run lint
npm run test
npm run test:e2e
```

---

# 6. Reglas claras de mockup y posterior mapeo al back

## 6.1. Cuándo usar mockup

Usar mockup cuando:
- todavía estás definiendo UX
- el flujo no está aprobado
- la pantalla es compleja
- querés validar estética y navegación

## 6.2. Cuándo salir de mockup

Salir de mockup cuando:
- la pantalla ya convence visualmente
- ya se entiende qué datos necesita
- ya están claras las acciones del usuario
- ya podés describir sus endpoints

## 6.3. Regla de transición

Antes de integrar backend, cada pantalla debe tener:

1. lista de datos requeridos
2. lista de acciones
3. estados posibles
4. errores posibles
5. contrato de API esperado

---

# 7. Convenciones concretas de nombres en español

## Componentes
- `FichaPaciente`
- `ResumenCaso`
- `PanelControlesSonrisa`
- `TablaSeguimientos`
- `FormularioPresupuesto`

## Hooks
- `usePacientes`
- `useCasoClinico`
- `useEditorSonrisa`
- `usePresupuesto`

## Métodos
- `obtenerPacientes`
- `crearPaciente`
- `actualizarCaso`
- `guardarBorradorDiseno`
- `calcularCuotaMensual`

## Variables
- `pacienteActivo`
- `casoSeleccionado`
- `estadoCarga`
- `listaPresupuestos`
- `disenoTemporal`

## DTOs
- `CrearPacienteDto`
- `ActualizarCasoDto`
- `CrearPresupuestoDto`

## Endpoints
- `GET /pacientes`
- `POST /pacientes`
- `GET /casos/:id`
- `POST /disenos`
- `PATCH /presupuestos/:id`

---

# 8. Secuencia recomendada de prompts reales

## Prompt 1
Definición MVP

## Prompt 2
Sistema visual premium

## Prompt 3
Shell principal y navegación

## Prompt 4
Mockups de pantallas clave

## Prompt 5
Limpieza y componentización

## Prompt 6
Mapeo pantalla → datos → acciones → endpoints

## Prompt 7
Modelo de datos

## Prompt 8
Módulos backend base

## Prompt 9
Integración pacientes

## Prompt 10
Integración casos

## Prompt 11
Editor de sonrisa funcional

## Prompt 12
Presupuestos y seguimiento

## Prompt 13
Autenticación y permisos

## Prompt 14
QA y refactor final

---

# 9. Regla operativa para QA continuo

Al final de **cada etapa**, el agente debe ejecutar o dejar preparado:

## Front
```bash
npm run build
npm run lint
```

## Back
```bash
npm run build
npm run test
```

## Si existe E2E
```bash
npm run test:e2e
```

Y reportar:

- qué pasó
- qué falló
- qué corrigió
- qué quedó pendiente

---

# 10. Prompt maestro final para usar con Antigravity o Claude

```md
Quiero construir un SaaS odontológico premium orientado a diseño de sonrisa y cierre comercial.

Stack:
- frontend React + TypeScript + Tailwind
- backend NestJS + PostgreSQL
- nombres de métodos, variables, componentes, DTOs, tablas y endpoints en español

Metodología obligatoria:
1. primero mockup premium
2. luego limpieza y componentización
3. luego mapeo de datos y acciones
4. luego integración backend
5. QA con run build o equivalente en cada etapa

Reglas:
- no hacer todo junto
- trabajar por etapas cerradas
- en etapas visuales se permite mock, pero debe estar aislado y marcado
- antes de integrar backend, cada pantalla debe tener contrato de datos, acciones y estados
- mantener UI premium, limpia y consistente
- evitar código apurado o mezcla de mocks con fetch real
- ejecutar QA en cada etapa y corregir antes de avanzar

Quiero que me acompañes etapa por etapa, generando código real, limpio, compilable y listo para evolucionar.
```

---

# 11. Recomendación práctica de trabajo

## Si usás Antigravity
Usalo mejor para:
- generar pantallas
- refactors de estructura
- crear módulos repetitivos
- pasar de mock a integración

## Si usás Claude
Usalo mejor para:
- prompts de arquitectura
- limpieza conceptual
- diseño de entidades
- revisión de consistencia
- refactor de nombres

## Estrategia ideal
- Claude: define y ordena
- Antigravity: construye y acelera
- vos: aprobás UX, recortás alcance y validás negocio

---

# 12. Cierre

La clave no es pedir “hacé un software”.
La clave es imponer esta secuencia:

**mockup premium → limpieza → mapeo → backend → QA**

Eso te evita:
- productos feos
- deuda técnica temprana
- pantallas sin sentido
- backend adelantado
- caos de nomenclatura

Y te deja una base mucho más vendible.
