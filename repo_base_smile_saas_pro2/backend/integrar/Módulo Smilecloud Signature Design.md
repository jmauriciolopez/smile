# Especificación: Módulo Smilecloud Signature Design

## Descripción
Implementación de un flujo de trabajo de renderizado odontológico que permite superponer diseños 3D (wax-ups/setups) sobre retratos 2D de pacientes para generar simulaciones de "Antes y Después".

## Requisitos de Entrada (Inputs)
* **Foto Facial:** Retrato frontal del paciente[cite: 1].
* **Escaneo Intraoral Inicial:** Archivo STL de la situación actual (Upper Initial)[cite: 1, 2].
* **Archivo Signature STL:** Superficie de wax-up digital, físico escaneado o setup estético[cite: 1].

## Flujo de Trabajo (Workflow)
1. **Selección de Proyecto:** Iniciar desde el panel y seleccionar el flujo "Signature Design".
2. **Carga de Archivos (The Stack):**
    * Cargar el escaneo superior inicial para referencia de posición[cite: 2].
    * Cargar el diseño "Signature Upper" (STL de destino)[cite: 2].
    * Cargar el retrato frontal para la superposición[cite: 2].
3. **Alineación:**
    * Alineación automática si los archivos comparten el mismo sistema de coordenadas[cite: 2].
    * Opción de alineamiento manual si es necesario[cite: 2, 4].
4. **Refinamiento de Renderizado:**
    * Ajuste del contorno interno del labio para definir el área de visualización de los dientes.
    * Capacidad de renderizado selectivo (mostrar solo ciertos dientes) mediante el recorte de curvas[cite: 3].

## Salidas Esperadas (Outputs)
* **Video de Simulación:** Renderizado del "Antes y Después" sobre el rostro del paciente[cite: 1].
* **Escena 3D de Revisión:** Espacio interactivo para inspección técnica por parte de dentistas y laboratorios[cite: 1].

## Herramientas de Visualización y Control
* **Modos de Visualización:** Alternar entre estados iniciales y finales[cite: 4].
* **Controles 3D:** Secciones transversales, anotaciones 3D y mapas de calor (Heatmaps)[cite: 4].
* **Gestión de Capas:** Control de visibilidad para objetos superiores e inferiores (Inicial vs. Signature)[cite: 4].

