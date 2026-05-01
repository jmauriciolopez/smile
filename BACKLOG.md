# Backlog: Smile SaaS PRO 2 - Roadmap de Etapas 🚀

Este documento centraliza el progreso del proyecto basado en las 20 etapas de desarrollo definidas para el MVP PRO.

## Estado Actual: Etapa 18 finalizada / Etapa 19 en curso 🛠️

### 🏁 Etapas Completadas (1-17)
- [x] **Etapa 1: Definición MVP PRO** - Alcance, módulos y flujo de negocio.
- [x] **Etapa 2: Sistema Visual Base** - UI Kit premium, Tailwind tokens y componentes base.
- [x] **Etapa 3: Shell y Navegación** - Estructura principal, Sidebar y Topbar.
- [x] **Etapa 4: Mockup Dashboard** - Primera versión visual del centro de control.
- [x] **Etapa 5: Mockup Pacientes** - Listado y fichas de pacientes.
- [x] **Etapa 6: Mockup Detalle Caso** - Centro operativo del caso clínico.
- [x] **Etapa 7: Mockup Editor de Sonrisa** - UX del editor digital.
- [x] **Etapa 8: Mockup Presupuestos** - Presentación comercial y seguimiento.
- [x] **Etapa 9: Limpieza Técnica Mockups** - Refactor de componentes presentacionales.
- [x] **Etapa 10: Mapeo Técnico** - Definición de contratos y endpoints.
- [x] **Etapa 11: Modelo de Datos** - Diseño de base de datos y relaciones.
- [x] **Etapa 12: Módulos Backend Base** - Implementación inicial en NestJS.
- [x] **Etapa 13: Integración Pacientes** - Conexión real de CRUD de pacientes.
- [x] **Etapa 14: Integración Casos** - Conexión real de casos clínicos y fotos.
- [x] **Etapa 15: Editor de Sonrisa Funcional** - Implementación del lienzo y controles reales.
- [x] **Etapa 16: Integración Presupuestos** - Conexión de presupuestos, opciones y seguimiento.
- [x] **Etapa 17: Autenticación y Seguridad** - Login JWT, rutas protegidas y roles.

### 🏗️ Etapa 18: Refactor Transversal (En Proceso)
- [x] **Limpieza de "Dead Code"**: Conexión de métodos huérfanos a la UI.
- [x] **Estandarización de Naming**: Unificación de términos en español en toda la app.
- [x] **Arquitectura de Hooks**: Centralización de lógica API en hooks reutilizables.
- [ ] **Validación de Tipos Estricta**: Revisión final de consistencia entre Backend DTOs y Frontend Interfaces.

### 🧪 Etapa 19: QA Funcional Completo (Pendiente)
- [ ] **Validación de Flujo de Punta a Punta**:
  - [ ] Crear paciente → Crear caso clínico.
  - [ ] Cargar fotos → Usar editor de sonrisa.
  - [ ] Guardar diseño → Crear presupuesto.
  - [ ] Definir opciones de tratamiento → Registrar seguimiento comercial.
- [ ] **Reporte de Issues**: Clasificación por prioridad (Crítico, Medio, Menor).

### 🚀 Etapa 20: Ajustes Finales y Preparación Demo (Pendiente)
- [ ] **Fixes Prioritarios**: Resolución de bugs detectados en etapa 19.
- [ ] **Datos Demo Consistentes**: Carga de un set de datos realista para presentaciones.
- [ ] **Guion de Demo**: Definición de la narrativa comercial (3-5 minutos).
- [ ] **Estrategia de Mercado**: Propuesta de pricing y validación inicial.

---

## 🔧 Tareas Técnicas Detalladas (Backlog Operativo)

### Gestión Clínica 🦷
- [x] Implementar `useFotos` para gestión de galería.
- [x] Implementar `useNotas` para notas de evolución.
- [x] Formulario de edición de paciente funcional.
- [x] Creación de casos desde el perfil de paciente.

### Módulo Comercial 💰
- [x] Hook `useSeguimientos` para el Timeline.
- [x] Hook `useOpciones` para alternativas de tratamiento.
- [x] Lógica de "Seleccionar Plan" en presupuestos.
- [x] Modal de configuración de presupuesto (monto, cuotas, estado).

### Seguridad 🔒
- [x] Integración de `/usuarios/perfil` en el Header.
- [x] Persistencia de JWT y manejo de sesiones.

---
*Referencia: [mapeo_tecnico.md](file:///D:/Code/smile/mapeo_tecnico.md)*
