
# master_playbook_smile_saas.md

# MASTER PLAYBOOK
SaaS Odontológico — Diseño de Sonrisa + Cierre Comercial

---

## Qué es este archivo

Este documento unifica:

- estrategia de producto
- reglas de desarrollo
- etapas
- prompts ejecutables

Pensado para trabajar con:
- Antigravity
- Claude

---

# 1. Principio central

Construir en este orden SIEMPRE:

1. Mockup premium
2. Limpieza técnica
3. Mapeo a backend
4. Integración real
5. QA obligatorio

---

# 2. Reglas inquebrantables

- Todo en español (variables, métodos, DTOs, endpoints)
- No mezclar mock con datos reales
- UI premium SIEMPRE
- No avanzar si build falla
- No sobreconstruir
- Un módulo a la vez

---

# 3. Stack

Frontend:
- React + TypeScript + Tailwind

Backend:
- NestJS + PostgreSQL

---

# 4. Estructura mental del producto

- Smile Preview → vender
- Casos → organizar
- Presupuestos → monetizar

---

# 5. Etapas resumidas

1. Definición MVP
2. Sistema visual
3. Shell
4. Mockups
5. Limpieza
6. Mapeo
7. DB
8. Backend base
9. Integración
10. Editor funcional
11. Comercial
12. Seguridad
13. QA final

---

# 6. QA obligatorio SIEMPRE

Frontend:
npm run build
npm run lint

Backend:
npm run build
npm run test

---

# 7. Regla clave de negocio

Este producto NO es clínico.

Es:

→ motor de ventas para tratamientos

---

# 8. Uso práctico

Para cada etapa:

1. Copiar prompt
2. Ejecutar en Antigravity
3. Validar UI
4. Ejecutar QA
5. Corregir
6. Recién avanzar

---

# 9. Prompt base universal

Usar SIEMPRE como prefijo:

"""
Stack:
- React + TypeScript + Tailwind
- NestJS + PostgreSQL

Reglas:
- nombres en español
- UI premium
- no mezclar mock y real
- separar lógica de presentación
- ejecutar QA al final
- no agregar features extra

Objetivo de esta etapa:
[describir]
"""

---

# 10. Cierre

Si seguís este playbook:

- evitás deuda técnica temprana
- evitás UI mediocre
- evitás backend innecesario
- construís algo vendible rápido

Clave:

→ primero convencer visualmente  
→ después hacerlo real  
→ después hacerlo robusto  
