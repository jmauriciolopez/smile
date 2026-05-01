# 🦷 Blueprints: Motor Core de Diseño de Sonrisa (Smile Design Engine)

Este documento detalla la especificación técnica y funcional para transformar el prototipo actual en una herramienta de grado profesional para odontología estética.

## 1. Visión Técnica: El Motor de Lienzo (Canvas Engine)

Para lograr la precisión necesaria, abandonaremos la manipulación vía DOM/CSS absoluto en favor de un sistema de **Canvas 2D con Grafos de Escena**.

### Tech Stack Recomendado
*   **Engine**: `react-konva` (Wrapper de Konva.js para React).
*   **Gestión de Estado**: `Zustand` (para manejar el árbol de nodos del diseño con alta performance).
*   **Procesamiento de Imágenes**: `Canvas API` nativa para filtros de blending (Overlay/Multiply).

### Jerarquía de Capas (Z-Index Stack)
1.  **Capa de Fondo (Base)**: Foto clínica original (Frontal o Sonrisa).
2.  **Capa de Referencia (Guías)**: Línea bipupilar, línea media y plano oclusal (opacidad 30%).
3.  **Capa de Trabajo (Dental)**: Objetos vectoriales (SVG) que representan cada pieza (13 a 23 en FDI).
4.  **Capa de Máscara (Labial)**: (Opcional) Un recorte del labio del paciente para que los dientes queden "detrás" de la comisura.

---

## 2. Estructura de Datos (JSON Schema)

Cada diseño se guardará como un objeto serializado en la base de datos, permitiendo "deshacer/rehacer" y re-edición infinita.

```json
{
  "version": "1.0",
  "canvas": { "width": 1920, "height": 1080 },
  "guías": {
    "lineaMedia": { "x": 960, "visible": true },
    "planoOclusal": { "y": 600, "visible": true }
  },
  "objetos": [
    {
      "id": "pieza-11",
      "tipo": "diente",
      "svg_path": "incisivo_central_tipo_A",
      "transform": { "x": 100, "y": 200, "scaleX": 1.1, "scaleY": 1.2, "rotation": 5 },
      "estilo": { "color": "#F8F9FA", "opacidad": 0.85, "brillo": 5 }
    }
  ],
  "filtros": { "contraste": 1.1, "saturacion": 0.9 }
}
```

---

## 3. Workflow de Usuario (UX Operativa)

Para que el doctor no pierda tiempo, el flujo debe ser quirúrgico:

1.  **Calibración**: El doctor marca dos puntos en la foto (ej. distancia intercanina) para que el sistema entienda la escala real en mm.
2.  **Posicionamiento de Preset**: Se carga un "Bloque de Sonrisa" completo (6-8 piezas) que se ajusta grupalmente.
3.  **Ajuste Fino**: Manipulación individual de cada pieza para corregir apiñamientos o asimetrías naturales.
4.  **Integración Estética**: Slider único de "Realismo" que ajusta sombras y transparencia de forma inteligente.
5.  **Aprobación**: Generación de PDF de propuesta comercial con el "Antes y Después".

---

## 4. Diferenciales Premium (El "Wow" Factor)

*   **Morphing de Formas**: No solo escalar, sino "deformar" suavemente los bordes incisales (Warpping).
*   **Color Matching**: Algoritmo que sugiere el tono de blanco basado en la esclera del ojo del paciente para evitar el efecto "dientes falsos".
*   **Shadow Mapping**: Generación de una sombra sutil debajo del labio superior sobre los dientes digitales.

---

## 5. Roadmap de Implementación (Phased Approach)

### Fase A: El Lienzo Dinámico (2 semanas)
*   Integración de `react-konva`.
*   Carga de foto y herramientas de Zoom/Pan.
*   Manipulación de un bloque estático de sonrisa.

### Fase B: Morfología Individual (3 semanas)
*   Desacoplamiento de piezas dentales.
*   Biblioteca de 5 tipos de sonrisa (Cuadrada, Joven, Madura, Oval, Funcional).
*   Sistema de guardado/carga de JSON.

### Fase C: Realismo y Exportación (2 semanas)
*   Filtros de blending avanzados.
*   Generador de imagen compuesta (Client-side rendering).
*   Vista de comparación "Split-Screen" interactiva.

---
