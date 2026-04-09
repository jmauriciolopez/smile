
# prompts_antigravity_smile_saas.md

# Prompts listos para Antigravity o Claude
## SaaS premium de diseño de sonrisa + gestión comercial

Este archivo está pensado para usarlo directamente en sesiones de construcción por etapas.

## Reglas maestras para pegar antes de cualquier prompt

```md
Reglas obligatorias para esta etapa:

- Stack frontend: React + TypeScript + Tailwind
- Stack backend: NestJS + PostgreSQL
- Nombres de métodos, variables, componentes, DTOs, tablas y endpoints en español
- Mantener una UI premium, clínica, moderna y limpia
- No mezclar mocks con fetch real en la misma etapa
- Si la etapa es visual, usar datos mock aislados en archivos separados
- Si la etapa es de integración, conservar la UI ya aprobada
- Separar componentes presentacionales de lógica de datos
- Al cerrar la etapa, ejecutar QA con run build, lint, test o equivalente
- Si algo falla, corregir antes de avanzar
- No introducir features no pedidas
- Código compilable, modular y listo para evolucionar
```

---

# Prompt 01 — Definir alcance exacto del MVP

```md
Quiero definir el MVP de un SaaS odontológico premium orientado a diseño de sonrisa y cierre comercial.

Necesito que me entregues:
1. módulos exactos del MVP
2. actores del sistema
3. flujo principal del producto
4. funcionalidades fuera de alcance
5. lista preliminar de entidades
6. convenciones de nomenclatura en español
7. estructura inicial de carpetas frontend y backend

Restricciones:
- frontend React + TypeScript + Tailwind
- backend NestJS + PostgreSQL
- nombres de métodos, variables, componentes, DTOs, tablas y endpoints en español
- separar claramente mockup, limpieza, integración y QA
- no sobrediseñar
- pensar como producto vendible, no como software enterprise gigante

Quiero una respuesta clara, estructurada, lista para usar como base del proyecto.
```

Objetivo de salida:
- dejar el alcance cerrado
- evitar construir de más
- fijar idioma y metodología desde el inicio

---

# Prompt 02 — Sistema visual premium y lenguaje de interfaz

```md
Necesito crear el sistema visual premium para una aplicación odontológica enfocada en estética dental y seguimiento comercial.

Quiero que construyas:
- tokens de diseño
- paleta de color
- tipografías y jerarquías
- spacing y tamaños
- radios y sombras
- estilos base de cards, botones, inputs, badges, tablas y paneles
- layout base de dashboard
- componentes reutilizables base

Restricciones:
- React + TypeScript + Tailwind
- estética premium, clínica, sobria y moderna
- evitar look de template genérico de admin
- nombres de componentes y archivos en español
- priorizar claridad visual, espacio en blanco y consistencia

Entrega:
- componentes base reutilizables
- tokens o constantes reutilizables
- ejemplos de uso
- código organizado para crecer
- ejecutar QA con npm run build y npm run lint al cerrar
```

Objetivo de salida:
- tener una base visual consistente antes de crear pantallas

---

# Prompt 03 — Shell principal, navegación y layout maestro

```md
Quiero construir el shell principal de la aplicación.

Necesito:
- sidebar premium colapsable
- topbar
- breadcrumb
- contenedor de página
- layout responsive
- estados vacíos
- estados de carga
- cards resumen reutilizables
- estructura base para dashboard y formularios

Restricciones:
- no conectar backend
- usar React + TypeScript + Tailwind
- nombres en español
- mantener estética premium y clínica
- usar mock simple solo si hace falta
- dejar componentes listos para reutilizar en el resto del sistema

Entrega:
- componentes separados y limpios
- código modular
- navegación base funcionando
- QA final con npm run build y npm run lint
```

Objetivo de salida:
- tener la carcasa del sistema lista para montar módulos encima

---

# Prompt 04 — Mockup premium de dashboard principal

```md
Quiero crear el dashboard principal como mockup premium.

Debe incluir:
- métricas resumidas
- pacientes recientes
- casos activos
- presupuestos pendientes
- oportunidades comerciales
- recordatorios o tareas próximas
- estado visual elegante y fácil de leer

Restricciones:
- usar datos mock en archivos separados
- no conectar APIs
- nombres en español
- evitar saturar la pantalla
- se debe ver como producto premium real, no como wireframe

Entrega:
- página de dashboard navegable
- componentes reutilizables
- mock centralizado
- QA con npm run build y npm run lint
```

Objetivo de salida:
- validar look & feel del producto

---

# Prompt 05 — Mockup premium de listado y detalle de pacientes

```md
Quiero construir el módulo visual de pacientes.

Necesito:
- pantalla de listado de pacientes
- búsqueda y filtros visuales
- tabla o grilla premium
- ficha resumida del paciente
- pantalla de detalle del paciente
- pestañas o secciones para casos, fotos, presupuestos y seguimiento

Restricciones:
- mock puro, sin backend
- React + TypeScript + Tailwind
- nombres en español
- datos mock aislados
- UX clara y premium
- componentes reutilizables

Entrega:
- páginas navegables
- estructura limpia
- tipado correcto
- QA con npm run build y npm run lint
```

Objetivo de salida:
- definir cómo se navega y entiende el universo del paciente

---

# Prompt 06 — Mockup premium de caso clínico

```md
Quiero construir la pantalla de detalle de caso clínico.

Debe incluir:
- resumen del paciente
- estado del caso
- fotos clínicas
- diseño de sonrisa asociado
- presupuesto asociado
- notas
- timeline o historial del caso
- acciones principales del doctor

Restricciones:
- no conectar backend
- usar datos mock en archivos separados
- nombres en español
- mantener UI premium y ordenada
- evitar sobrecargar la pantalla
- preparar el diseño para futura integración real

Entrega:
- pantalla navegable
- componentes reutilizables
- layout consistente con el sistema
- QA con npm run build y npm run lint
```

Objetivo de salida:
- definir el centro operativo del producto

---

# Prompt 07 — Mockup premium del editor de sonrisa

```md
Quiero crear la primera versión visual del editor de sonrisa.

Debe incluir:
- área principal con foto del paciente
- panel lateral de controles
- presets de sonrisa
- controles visuales para ancho, alto, posición y forma
- comparación antes/después
- acciones guardar borrador, duplicar versión y aprobar

Restricciones:
- esta etapa es solo mockup visual premium
- no usar IA real todavía
- se permite simulación visual y sliders sin persistencia
- nombres de componentes, métodos y variables en español
- datos mock aislados
- debe verse como herramienta premium real

Entrega:
- pantalla navegable
- componentes separados
- estructura clara para luego volverla funcional
- QA con npm run build y npm run lint
```

Objetivo de salida:
- validar la UX del módulo más importante antes de programar lógica

---

# Prompt 08 — Mockup premium de presupuesto y cierre comercial

```md
Quiero construir el módulo visual de presupuesto y seguimiento comercial.

Debe incluir:
- presupuesto principal
- múltiples opciones de tratamiento
- cuotas
- estado de negociación
- observaciones
- próximas acciones comerciales
- vista clara para usar en consulta con el paciente

Restricciones:
- mock puro
- nombres en español
- UI premium
- no conectar backend
- dejar arquitectura clara para futura integración

Entrega:
- página navegable
- componentes reutilizables
- mocks centralizados
- QA con npm run build y npm run lint
```

Objetivo de salida:
- crear la capa que convierte el sistema en herramienta comercial

---

# Prompt 09 — Limpieza técnica de todos los mockups

```md
Tomá todas las pantallas mockup existentes y hacé una pasada completa de limpieza técnica.

Necesito:
- extraer componentes repetidos
- definir props tipadas
- separar presentación de contenedores
- mover mocks a archivos dedicados
- mejorar consistencia de nombres
- simplificar jerarquías innecesarias
- dejar todo preparado para integración futura

Restricciones:
- no conectar backend todavía
- mantener exactamente la calidad visual aprobada
- todo en español
- no romper rutas ni navegación existente

Entrega:
- estructura más limpia
- componentes reutilizables
- tipado sólido
- deuda técnica reducida
- QA con npm run build y npm run lint
```

Objetivo de salida:
- pasar de demo linda a base mantenible

---

# Prompt 10 — Mapeo pantalla → datos → acciones → estados → endpoints

```md
Necesito documentar y preparar la transición de mockup a integración real.

Para cada pantalla existente, quiero que definas:
1. datos requeridos
2. acciones del usuario
3. estados posibles
4. errores posibles
5. endpoints futuros esperados
6. servicios frontend involucrados
7. hooks o contenedores sugeridos

Restricciones:
- no implementar backend aún
- todo en español
- usar nombres coherentes con el proyecto
- pensar en integración progresiva por módulos
- dejar contratos claros y simples

Entrega:
- documento de mapeo por pantalla
- propuesta de servicios frontend
- propuesta de hooks
- estructura lista para integración
```

Objetivo de salida:
- no integrar a ciegas
- convertir UX en contratos técnicos

---

# Prompt 11 — Modelo de datos real del sistema

```md
Quiero diseñar el modelo de datos real del sistema.

Necesito:
- entidades principales
- relaciones
- campos por entidad
- enums
- decisiones de modelado
- propuesta en Prisma o SQL
- timestamps
- estados del negocio
- contemplar futuras extensiones sin sobrecargar el MVP

Entidades mínimas sugeridas:
- pacientes
- casos_clinicos
- disenos_sonrisa
- fotos_clinicas
- presupuestos
- opciones_tratamiento
- seguimientos_comerciales
- usuarios
- notas_clinicas

Restricciones:
- tablas y columnas en español
- backend NestJS + PostgreSQL
- diseño claro y mantenible
- no sobrediseñar
- dejar base lista para módulos reales

Entrega:
- modelo completo
- explicación breve de decisiones importantes
- ejecutar validación del esquema y reportar resultado
```

Objetivo de salida:
- definir la columna vertebral del backend

---

# Prompt 12 — Generar módulos base de backend en NestJS

```md
Quiero generar los módulos base de backend en NestJS para el MVP.

Módulos:
- pacientes
- casos
- disenos
- presupuestos
- seguimientos
- usuarios

Quiero en cada módulo:
- controlador
- servicio
- DTO crear
- DTO actualizar
- validaciones con class-validator
- estructura limpia
- nombres en español
- código compilable

Restricciones:
- no agregar lógica compleja todavía
- primero dejar CRUD limpio
- backend NestJS + TypeScript
- mantener consistencia de nombres
- si se usa ORM, respetar nombres en español

Entrega:
- módulos completos
- build exitoso
- tests base si corresponde
- reporte de QA con npm run build y npm run test
```

Objetivo de salida:
- levantar backend real sin entrar todavía en reglas complejas

---

# Prompt 13 — Integrar módulo de pacientes con backend real

```md
Quiero integrar el módulo de pacientes del frontend con el backend real.

Necesito:
- reemplazar mocks por API real
- conservar la UI premium ya aprobada
- crear servicio de pacientes
- crear hooks o capa de consulta
- manejar loading, vacío y error
- mantener componentes visuales limpios
- todo en español

Restricciones:
- no mezclar mock y fetch en el mismo flujo
- no romper navegación existente
- separar claramente servicio, hook y componente visual
- React + TypeScript en frontend
- NestJS en backend

Entrega:
- integración funcional de pacientes
- QA frontend con build y lint
- QA backend con build y test
- reporte de cambios hechos
```

Objetivo de salida:
- probar la transición real de mock a datos vivos

---

# Prompt 14 — Integrar módulo de casos clínicos

```md
Quiero integrar el módulo de casos clínicos con backend real.

Necesito:
- listado y detalle de casos
- relación con paciente
- notas básicas
- estado del caso
- fotos asociadas si ya existen
- UI igual o mejor que en mock

Restricciones:
- mantener nombres en español
- no degradar la experiencia visual
- separar lógica de datos de componentes presentacionales
- manejar loading, error y vacío
- no agregar complejidad fuera del alcance actual

Entrega:
- integración funcional
- código modular
- QA con build, lint y test
```

Objetivo de salida:
- consolidar el núcleo clínico-operativo del sistema

---

# Prompt 15 — Volver funcional el editor de sonrisa, versión MVP

```md
Quiero convertir el editor de sonrisa en una herramienta funcional MVP.

Debe incluir:
- cargar foto del paciente
- mostrar lienzo principal
- superponer diseño básico
- permitir ajustes simples: ancho, alto, posición
- comparar antes/después
- guardar borrador del diseño
- recuperar diseño existente

Restricciones:
- no implementar IA avanzada todavía
- mantener UI premium
- nombres de métodos, componentes y variables en español
- arquitectura modular
- separar lienzo, panel de controles y lógica de edición
- dejar puertas claras para futura evolución con visión por computadora

Entrega:
- primera versión funcional del editor
- integración con caso clínico
- persistencia básica
- QA con npm run build, npm run lint y npm run test
```

Objetivo de salida:
- materializar el feature principal sin intentar resolver todo de una vez

---

# Prompt 16 — Integrar presupuesto y seguimiento comercial reales

```md
Quiero implementar e integrar el módulo real de presupuesto y seguimiento comercial.

Necesito:
- crear presupuesto
- editar presupuesto
- múltiples opciones de tratamiento
- cuotas
- estado comercial
- próxima acción
- observaciones
- relación con paciente y caso clínico

Restricciones:
- mantener UI premium
- nombres en español
- React en frontend y NestJS en backend
- separar componentes visuales, hooks, servicios y endpoints
- manejar errores y validaciones básicas

Entrega:
- frontend integrado
- backend funcional
- QA completo con build, lint y test
- reporte de lo implementado
```

Objetivo de salida:
- activar la capa de monetización del producto

---

# Prompt 17 — Autenticación, permisos y endurecimiento

```md
Quiero agregar la base de seguridad del sistema.

Necesito:
- login
- sesión o JWT
- roles básicos
- guards
- permisos mínimos por módulo
- validaciones consistentes
- manejo homogéneo de errores
- estructura lista para crecer

Restricciones:
- nombres en español
- no sobrecomplicar permisos en esta etapa
- mantener backend limpio
- no romper módulos ya integrados
- preparar el proyecto para uso más real

Entrega:
- autenticación funcional
- permisos básicos
- QA con npm run build, npm run test y test:e2e si aplica
```

Objetivo de salida:
- preparar el producto para dejar de ser demo interna

---

# Prompt 18 — Refactor transversal y consistencia de nombres

```md
Quiero una pasada completa de refactor y consistencia.

Revisá:
- nombres de variables
- nombres de métodos
- nombres de componentes
- DTOs
- servicios
- hooks
- rutas
- archivos
- duplicaciones
- complejidad innecesaria

Restricciones:
- todo debe quedar en español
- no romper funcionalidades existentes
- priorizar claridad y mantenibilidad
- mantener la UI intacta
- proponer y aplicar mejoras concretas

Entrega:
- refactor aplicado
- reporte de convenciones corregidas
- QA completo con build, lint y test
```

Objetivo de salida:
- evitar mezcla de estilos y deuda semántica

---

# Prompt 19 — QA funcional completo del flujo principal

```md
Quiero ejecutar una pasada de QA funcional sobre el flujo principal del sistema.

Flujo a revisar:
1. crear paciente
2. crear caso clínico
3. cargar foto
4. abrir editor de sonrisa
5. guardar diseño
6. generar presupuesto
7. actualizar seguimiento comercial

Necesito que:
- verifiques flujo completo
- detectes errores
- corrijas problemas visibles
- revises estados loading, vacío y error
- revises consistencia de UX y mensajes
- ejecutes build, lint y test
- reportes qué falló, qué corregiste y qué quedó pendiente

Restricciones:
- no agregar features nuevos
- enfocarse en estabilidad y calidad
- mantener idioma español en todo el código
```

Objetivo de salida:
- cerrar una versión usable y estable

---

# Prompt 20 — Preparar release interno o demo comercial

```md
Quiero preparar una versión lista para demo interna o comercial.

Necesito:
- revisar detalles visuales
- corregir textos inconsistentes
- revisar vacíos de UX
- mejorar estados sin contenido
- asegurar navegación fluida
- dejar semilla de datos simple si hace falta
- documentar cómo levantar frontend y backend
- documentar credenciales o flujo de acceso demo si aplica

Restricciones:
- no hacer cambios gigantes
- no introducir deuda nueva
- mantener UI premium
- todo en español
- dejar el proyecto presentable y fácil de mostrar

Entrega:
- sistema estabilizado
- documentación mínima para demo
- QA final con build, lint y test
```

Objetivo de salida:
- terminar con algo mostrable, no con un proyecto crudo

---

# Secuencia recomendada de uso

Usá los prompts en este orden:

1. Definir MVP
2. Sistema visual
3. Shell principal
4. Dashboard
5. Pacientes
6. Caso clínico
7. Editor
8. Presupuesto
9. Limpieza
10. Mapeo técnico
11. Modelo de datos
12. Backend base
13. Integración pacientes
14. Integración casos
15. Editor funcional
16. Presupuestos reales
17. Seguridad
18. Refactor
19. QA funcional
20. Release demo

---

# Regla práctica de operación

En cada etapa pedile al agente que devuelva siempre:

1. qué hizo
2. archivos creados o tocados
3. comandos QA ejecutados
4. errores encontrados
5. correcciones aplicadas
6. pendientes reales de la etapa

---

# Plantilla corta para reutilizar en cualquier nueva etapa

```md
Quiero trabajar una nueva etapa del sistema.

Objetivo puntual:
[describir]

Contexto:
- SaaS odontológico premium
- React + TypeScript + Tailwind
- NestJS + PostgreSQL
- nombres en español
- UI premium y clínica
- mocks aislados si la etapa es visual
- integración limpia si la etapa es funcional

Necesito que:
1. implementes solo esta etapa
2. mantengas consistencia con lo ya construido
3. no mezcles responsabilidades
4. ejecutes QA al final
5. reportes cambios, errores y pendientes
```
