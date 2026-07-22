# Spec — Catálogo de Materiales

## 1. Objetivo
Mantener un catálogo único de materiales/repuestos, con código único, para que el resto del sistema (inventario, dashboard) tenga una fuente de verdad consistente sobre qué materiales existen.

## 2. Contexto (tablas afectadas)
- `materials`: `id`, `code`, `description`, `category`, `unitOfMeasure`, `minimumStock`, `currentStock`, `createdBy`.

## 3. Entradas / Salidas exactas
- `POST /materials` — body `{ code, description, category, unitOfMeasure, minimumStock }` → devuelve el `Material` creado con `currentStock: 0` y `createdBy` = usuario autenticado.
- `GET /materials?search=` — `search` opcional, filtra por `code` o `description` (parcial, sin distinguir mayúsculas). Sin `search`, devuelve todos.
- `GET /materials/summary` — devuelve `{ totalMaterials, totalStockUnits, lowStockCount, lowStockMaterials }` (ver `spec-dashboard.md`).
- `GET /materials/:id` — devuelve un material o `404`.
- `PUT /materials/:id` — body parcial de los mismos campos de creación (sin `currentStock`).
- `DELETE /materials/:id` — elimina físicamente el registro.

## 4. Reglas lógicas y validaciones
- `code` es único — intento de duplicado responde `409 Conflict`.
- `currentStock` **nunca** se acepta desde el cliente, ni al crear ni al editar — es responsabilidad exclusiva de `InventoryMovement` (ver `spec-inventario-movimientos.md`).
- Todos los endpoints requieren JWT válido (`JwtAuthGuard`). No hay restricción adicional por rol — cualquier usuario autenticado (Técnico, Coordinador o Admin) puede crear, editar o eliminar materiales.
- `createdBy` se captura automáticamente del usuario autenticado en el momento de creación (texto plano, no relación).

## 5. Criterios de aceptación
- **Dado** un código ya existente, **cuando** se intenta crear un material con ese código, **entonces** el sistema responde `409` y no crea el registro.
- **Dado** un material recién creado, **cuando** se consulta su detalle, **entonces** `currentStock` es `0`.
- **Dado** un texto de búsqueda parcial, **cuando** se consulta `GET /materials?search=`, **entonces** se devuelven los materiales cuyo `code` o `description` lo contienen, sin distinguir mayúsculas de minúsculas.
- **Dado** un `id` con formato inválido (no UUID), **cuando** se consulta `GET /materials/:id`, **entonces** el sistema responde `400`, no `500`.

## 6. Fuera de alcance
- Entidades separadas de Categoría o Unidad de Medida (se manejan como texto libre en esta versión).
- Soporte de stock en unidades decimales/fraccionadas.
- Restricción de estas operaciones por rol (queda abierto a cualquier usuario autenticado, decisión consciente).
