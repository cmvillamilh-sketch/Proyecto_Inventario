# Spec — Inventario y Movimientos

## 1. Objetivo
Registrar entradas, salidas y ajustes de stock de forma atómica y trazable, siendo la única vía autorizada del sistema para modificar `Material.currentStock`.

## 2. Contexto (tablas afectadas)
- `inventory_movements`: `id`, `materialId` (FK a `materials`), `type`, `quantity`, `reason`, `createdBy`, `createdAt`.
- `materials.currentStock` (se actualiza como efecto secundario dentro de la misma transacción).

## 3. Entradas / Salidas exactas
- `POST /inventory-movements` — body `{ materialId, type: ENTRY|EXIT|ADJUSTMENT, quantity, reason }` → crea el movimiento y actualiza el stock del material, devuelve el movimiento con el material relacionado.
- `GET /inventory-movements?materialId=&type=&createdBy=&dateFrom=&dateTo=` — todos los filtros opcionales y combinables, devuelve el historial filtrado con el material relacionado.
- `GET /inventory-movements/:id` — devuelve un movimiento o `404`.

## 4. Reglas lógicas y validaciones
- Toda la operación de `create()` corre dentro de `DataSource.transaction()` — si algo falla, no queda ni el movimiento ni el cambio de stock a medias.
- `ENTRY` → `nuevoStock = stockActual + cantidad`.
- `EXIT` → valida `cantidad <= stockActual`; si no se cumple, responde `400 Bad Request` ("Insufficient stock") y no modifica nada.
- `ADJUSTMENT` → el nuevo stock es exactamente el valor recibido (no suma ni resta, reemplaza).
- Los movimientos son **inmutables**: el controller no expone `PUT`/`DELETE`, y el service rechaza esas operaciones con `ForbiddenException` si se invocan directamente — aplica a cualquier rol, incluido Administrador.
- `createdBy` se captura del usuario autenticado en el momento de creación.
- Todos los endpoints requieren JWT válido, sin restricción adicional por rol.

## 5. Criterios de aceptación
- **Dado** un material con stock `5`, **cuando** se registra un `EXIT` de `10`, **entonces** el sistema responde `400` y el stock permanece en `5`.
- **Dado** un `ENTRY` válido, **cuando** se registra, **entonces** `currentStock` del material aumenta exactamente en la cantidad indicada.
- **Dado** un movimiento ya creado, **cuando** se intenta modificarlo o eliminarlo (por cualquier vía, API directa incluida), **entonces** el sistema lo rechaza sin excepción.
- **Dado** un `ADJUSTMENT` a un valor `X`, **cuando** se registra, **entonces** `currentStock` queda exactamente en `X`, sin importar el valor anterior.

## 6. Fuera de alcance
- Reversión o cancelación de movimientos ya registrados.
- Múltiples bodegas o ubicaciones de stock.
- Unidades fraccionadas/decimales (`quantity` y `currentStock` son enteros).
