# Mapeo Técnico: Smile SaaS PRO 2 (Etapa 10)

Este documento define la interfaz de comunicación entre el frontend (React) y el backend (NestJS) para asegurar la consistencia del sistema.

## Módulo: Pacientes
| Pantalla | Endpoint | Método | Hook Sugerido | Estado |
| --- | --- | --- | --- | --- |
| PacientesPage | `/pacientes` | GET | `usePacientes` | ✅ Integrado |
| DetallePacientePage | `/pacientes/:id` | GET | `useDetallePaciente` | ✅ Integrado |
| CrearPaciente | `/pacientes` | POST | `useCrearPaciente` | ✅ Integrado |

## Módulo: Casos Clínicos
| Pantalla | Endpoint | Método | Hook Sugerido | Estado |
| --- | --- | --- | --- | --- |
| DetalleCasoClinicoPage | `/casos/:id` | GET | `useCasoDetalle` | ✅ Integrado |
| ListadoCasos | `/casos` | GET | `useCasos` | ✅ Integrado |
| GestionarFotos | `/fotos-clinicas` | POST | `useSubirFoto` | ⏳ Parcial |

## Módulo: Editor de Sonrisa
| Pantalla | Endpoint | Método | Hook Sugerido | Estado |
| --- | --- | --- | --- | --- |
| EditorSonrisaPage | `/disenos` | POST | `useEditorSonrisa` | ✅ Integrado |
| EditorSonrisaPage | `/disenos/caso/:id` | GET | `useEditorSonrisa` | ✅ Integrado |

## Módulo: Presupuestos y Seguimiento
| Pantalla | Endpoint | Método | Hook Sugerido | Estado |
| --- | --- | --- | --- | --- |
| PresupuestosPage | `/presupuestos` | GET | `usePresupuestos` | ✅ Integrado |
| DetallePresupuesto | `/presupuestos/:id` | GET | `usePresupuestoDetalle` | ✅ Integrado |
| TimelineSeguimiento | `/seguimientos/:presupuestoId` | GET | `useSeguimientos` | ❌ Pendiente |
| OpcionesTratamiento | `/presupuestos/:id/opciones` | GET | `useOpciones` | ❌ Pendiente |

## Módulo: Base (Auth y Perfil)
| Pantalla | Endpoint | Método | Hook Sugerido | Estado |
| --- | --- | --- | --- | --- |
| LoginPage | `/autenticacion/login` | POST | `useAutenticacion` | ⏳ Mock Frontend |
| Header / Shell | `/usuarios/perfil` | GET | `usePerfil` | ⏳ Mock Frontend |

## Observaciones Técnicas
- **Nomenclatura**: Se mantiene el estándar de español para todas las rutas y campos JSON.
- **Tipado**: Las interfaces de TypeScript en `frontend/src/servicios` deben coincidir exactamente con los DTOs de NestJS.
- **Seguridad**: Todos los endpoints (excepto login) requieren cabecera `Authorization: Bearer <JWT>`.
