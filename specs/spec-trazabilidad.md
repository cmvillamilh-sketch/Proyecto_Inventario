# Spec — Trazabilidad y Auditoría

## 1. Objetivo
Permitir reconstruir el historial completo de movimientos de inventario, filtrable por material, responsable, tipo y fecha, con la garantía de que ningún registro puede alterarse después de creado.

## 2. Contexto (tablas afectadas)
- `inventory_movements` (misma tabla de `spec-inventario-movimientos.md`) — este módulo no agrega tablas nuevas, expone capacidades de consulta sobre la existente.

## 3. Entradas / Salidas exactas
- `GET /inventory-movements?materialId=&type=&createdBy=&dateFrom=&dateTo=` — todos los parámetros opcionales y combinables entre sí (AND lógico). Devuelve el listado filtrado con el material relacionado.

## 4. Reglas lógicas y validaciones
- `materialId`: filtro exacto por UUID del material.
- `createdBy`: coincidencia **exacta** (no búsqueda parcial/difusa) — consistente con el resto de la app, que no tiene búsquedas difusas en ningún otro lado todavía.
- `type`: filtro exacto (`ENTRY`/`EXIT`/`ADJUSTMENT`).
- `dateFrom`/`dateTo`: se interpretan como fecha (no fecha+hora), porque los `<input type="date">` del navegador solo envían `YYYY-MM-DD`. `dateFrom` se ajusta internamente a `00:00:00.000` de ese día y `dateTo` a `23:59:59.999`, para que un filtro "de tal día a tal día" incluya el día completo.
- Los filtros son combinables: se pueden aplicar varios a la vez, todos deben cumplirse (AND).
- Los registros devueltos son siempre de solo lectura — este módulo no expone ninguna vía de edición o borrado (ver `spec-inventario-movimientos.md`, regla de inmutabilidad).
- El endpoint no tiene restricción de rol — cualquier usuario autenticado puede consultar el historial completo (no solo el suyo).

## 5. Criterios de aceptación
- **Dado** un rango de fechas donde `dateFrom` y `dateTo` son el mismo día, **cuando** se filtra, **entonces** se incluyen todos los movimientos de ese día completo (desde las 00:00:00 hasta las 23:59:59.999).
- **Dado** un filtro combinado de `materialId` y `createdBy`, **cuando** se consulta, **entonces** solo se devuelven los movimientos que cumplen ambas condiciones a la vez, no la unión de ambas.
- **Dado** un `createdBy` que no coincide exactamente con ningún usuario (por ejemplo, con mayúsculas distintas), **cuando** se filtra, **entonces** no se devuelven resultados (no hay coincidencia parcial).
- **Dado** ningún filtro aplicado, **cuando** se consulta el endpoint, **entonces** se devuelve el historial completo sin restricción.

## 6. Fuera de alcance
- Exportar el historial filtrado a PDF o Excel.
- Búsqueda de texto libre dentro del campo `reason`.
- Historial por material vía un endpoint separado (`/materials/:id/movements`) — se decidió cubrir esta función con el mismo endpoint filtrable, no duplicar la ruta.
