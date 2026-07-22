# Spec — Consulta y Dashboard

## 1. Objetivo
Dar una vista general del estado del inventario al entrar al sistema, con indicadores básicos y detección rápida de materiales que necesitan reposición.

## 2. Contexto (tablas afectadas)
- Ninguna tabla nueva — es una agregación sobre `materials` (misma tabla de `spec-materiales.md`).

## 3. Entradas / Salidas exactas
- `GET /materials/summary` → `{ totalMaterials, totalStockUnits, lowStockCount, lowStockMaterials: Material[] }`.
- `GET /materials?search=` (compartido con `spec-materiales.md`) — la búsqueda de materiales también cubre la función de "búsqueda y filtros" especificada para este módulo; no se implementó dos veces.

## 4. Reglas lógicas y validaciones
- "Stock bajo" se define como `currentStock <= minimumStock` (inclusivo — el punto exacto del mínimo ya cuenta como alerta, no solo por debajo).
- `totalMaterials`: conteo total de materiales en el catálogo.
- `totalStockUnits`: suma de `currentStock` de todos los materiales.
- `lowStockCount`: cantidad de materiales que cumplen la condición de stock bajo (coincide siempre con `lowStockMaterials.length`).
- **Orden de rutas crítico**: `@Get('summary')` debe declararse antes que `@Get(':id')` en el controller — si no, Nest interpreta `"summary"` como el parámetro `:id` y `ParseUUIDPipe` lo rechaza con `400`.
- El endpoint no tiene restricción de rol — cualquier usuario autenticado ve el mismo dashboard.

## 5. Criterios de aceptación
- **Dado** un material cuyo `currentStock` es exactamente igual a su `minimumStock`, **cuando** se consulta el resumen, **entonces** ese material aparece en `lowStockMaterials`.
- **Dado** que ningún material está en stock bajo, **cuando** se consulta el resumen, **entonces** `lowStockMaterials` es un arreglo vacío y `lowStockCount` es `0`, sin error.
- **Dado** un GET a `/materials/summary`, **cuando** se ejecuta, **entonces** no se confunde con `/materials/:id` ni responde `400` por intentar parsear "summary" como UUID.

## 6. Fuera de alcance
- Notificaciones automáticas de stock bajo (módulo Notificaciones, descartado explícitamente del alcance de esta entrega — decisión del 21/07/2026).
- Gráficos históricos de consumo o tendencias.
- Indicadores por categoría o por usuario responsable.
