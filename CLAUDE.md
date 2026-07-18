# CLAUDE.md — ManteStock

Este archivo se lee automáticamente al iniciar una sesión de Claude Code en este repositorio. Contiene el contexto necesario para continuar el proyecto sin perder continuidad entre sesiones.

---

## Arquitectura

- Monorepo (npm Workspaces)
- Backend: NestJS + TypeORM — corre localmente (`npm run start:dev`), **puerto 3001** (hardcodeado en `main.ts`, sin variable de entorno). No está containerizado.
- Frontend: Next.js 14 (App Router) — corre localmente, típicamente puerto 3000.
- PostgreSQL 16 — el único servicio containerizado (`docker-compose.yml`, contenedor `mante-stock-postgres`, puerto `5432` por defecto, variable `POSTGRES_PORT`).

**Importante para pruebas en Postman:** el backend NO responde en `localhost:3000` (ese puerto lo ocupa el frontend). Usar siempre `http://localhost:3001` como base URL para la API.

---

## Metodología (NO CAMBIAR)

Análisis → Diseño → Implementación → Revisión → Validación → Checkpoint

Cada checkpoint se valida antes de avanzar al siguiente.

---

## Roles (actualizado 18/07/2026)

- **Claude** (chat / conversación de arquitectura) → Arquitectura, planeación, auditoría, revisión, validación, documentación.
- **Claude (VS Code)** → Implementación, refactorizaciones pequeñas, generación de código bajo instrucciones precisas.
- **Gemini** → Segunda opinión cuando sea necesario.

ChatGPT y GitHub Copilot ya no forman parte del flujo de trabajo.

---

## Estado actual del proyecto

**Checkpoint alcanzado: 006.6 ✅ (frontend validado en navegador el 19/07/2026)**

Pruebas realizadas y confirmadas:
- `/inventory-movements` lista los movimientos con todas las columnas (fecha, material, tipo, cantidad, motivo, stock actual), sin acciones de editar/eliminar.
- `/inventory-movements/new` carga el dropdown de materiales con stock real (sin caché, tras la corrección de `router.refresh()`).
- Crear un `ENTRY` válido redirige a la lista y la nueva fila aparece de inmediato.
- Intentar un `EXIT` con cantidad mayor al stock disponible mantiene al usuario en el formulario y muestra el mensaje real del backend (`Insufficient stock`), sin pantalla de error de Next.js.
- Corrección de bug aplicada y verificada: `router.refresh()` agregado antes de `router.push()` en `InventoryMovementForm.tsx` y `MaterialForm.tsx` (el router cache del cliente servía datos obsoletos tras crear un registro).

**Módulo Inventory Movements: completo (backend + frontend). Módulo Material: completo, con dos correcciones de bugs aplicadas y documentadas.**

Pendiente identificado (no bloqueante): `GET /inventory-movements/:id` responde `500 Internal server error` en vez de `400 Bad Request` cuando `:id` no es un UUID válido (ej. si el navegador intenta resolver `/inventory-movements/new` contra el backend). Falta validación de formato UUID antes de la consulta.

### Módulo Material — ✅ COMPLETADO
Congelado como módulo de referencia. **No modificar salvo corrección de bugs.**

**Corrección aplicada (18/07/2026):** se detectó que `code` permitía duplicados, contradiciendo la restricción de unicidad del modelo de datos original. Se agregó `@Column({ unique: true })` en la entidad `Material`, y `MaterialsService.create()` ahora captura la violación de unique constraint de Postgres (23505) y la relanza como `ConflictException('Ya existe un material con ese code')` (409). Verificado en Postman.

**Corrección aplicada (19/07/2026):** se detectó que ni `InventoryMovementForm.tsx` ni `MaterialForm.tsx` invalidaban el router cache del cliente tras crear un registro (`force-dynamic` en la página no es suficiente al navegar con `router.push()`). Se agregó `router.refresh()` antes del `push()` en ambos formularios.

### Módulo Inventory Movements — en progreso

| Elemento | Estado |
|---|---|
| Entity `InventoryMovement` | ✅ |
| Enum `MovementType` (ENTRY, EXIT, ADJUSTMENT) | ✅ |
| DTOs (`CreateInventoryMovementDto`, `UpdateInventoryMovementDto`) | ✅ |
| Module | ✅ |
| Service — `findAll()`, `findOne()` | ✅ |
| Service — `create()` (con transacción) | ✅ |
| Service — `update()` | ❌ `NotImplementedException` (pendiente de definir) |
| Service — `remove()` | ❌ `NotImplementedException` (pendiente de definir) |
| Controller | ❌ Pendiente |
| Endpoints REST | ❌ Pendiente |
| Frontend | ❌ Pendiente |

---

## Reglas de negocio — Inventory Movements

- **Material**: responsabilidad exclusiva del catálogo. No conoce reglas de inventario.
- **InventoryMovement**: responsable exclusivo del historial de movimientos. Toda modificación de stock debe pasar por este módulo.
- **Transacciones**: toda modificación de inventario usa `DataSource.transaction()`. No se actualiza stock fuera de una transacción.
- **calculateNewStock()** (método privado centralizado):
  - `ENTRY` → `nuevoStock = stockActual + cantidad`
  - `EXIT` → valida `cantidad <= stockActual` (si no, `BadRequestException`), luego `nuevoStock = stockActual - cantidad`
  - `ADJUSTMENT` → el nuevo stock es exactamente el valor recibido (no calcula diferencias)

---

## Reglas para continuar (obligatorias)

- No cambiar la metodología.
- Prompts pequeños y precisos para la implementación.
- La arquitectura se define primero (rol Claude), luego se implementa (rol Claude VS Code).
- Validar cada checkpoint antes de avanzar.
- No modificar Material salvo corrección de errores.
- Todo cambio de stock debe realizarse mediante `InventoryMovement`.
- Toda modificación de inventario debe ejecutarse dentro de una transacción.

---

## Próximo objetivo

Checkpoints 006.5 y 006.6 completos — el módulo Inventory Movements queda cerrado (backend + frontend).

Según `05-modulos-del-sistema.md` y `gemini-code-1784071345471.md`, el siguiente módulo en el alcance del MVP es **Autenticación y usuarios** (no iniciado): login, roles, bloqueo tras 2 intentos fallidos (5 min), y es prerrequisito para cubrir la trazabilidad por usuario (`created_by`) pendiente en Material e Inventory Movements. Pendiente de que ChatGPT (rol Claude) defina la arquitectura de este módulo antes de asignar un número de checkpoint.

---

## Decisiones de arquitectura confirmadas (18/07/2026)

### Inmutabilidad de InventoryMovement — CONFIRMADO
RNF08 (documento técnico) es explícito: el historial de movimientos no debe ser editable ni eliminable. Esto reinterpreta `update()`/`remove()` en `InventoryMovementsService`: **no están pendientes de implementar, están bloqueados por diseño.**

- `InventoryMovementsController` (Checkpoint 006.5) expone únicamente **POST, GET, GET por ID**. No PUT, no DELETE.
- `update()`/`remove()` deben lanzar una excepción semántica de dominio (ej. `ForbiddenException('Los movimientos de inventario son inmutables')`) en vez de `NotImplementedException`.
- `@UpdateDateColumn()` en la entidad `InventoryMovement` debe eliminarse — es inconsistente con un registro inmutable.

### `quantity` / stock como `int` — diferido, no descartado
El documento técnico pide soporte de decimales (materiales en kg fraccionados), pero `Material.currentStock`/`minimumStock` e `InventoryMovement.quantity` son `int`. **Decisión: se mantiene `int` por ahora y NO se toca el módulo Material congelado.** Esto no es una aceptación permanente — se revisa y se migra a decimal específicamente cuando se implemente soporte real de materiales medidos por unidades fraccionables (kg, litros, etc.), probablemente junto con un campo de unidad de medida. Hasta entonces, el catálogo asume materiales contables en unidades enteras (piezas, cajas).

### Otros hallazgos de los documentos de especificación — registrados, no bloqueantes
Fuentes: `01-objetivo-y-alcance.md` a `05-modulos-del-sistema.md`, `gemini-code-1784071345471.md`.

- **Trazabilidad por usuario (RF05)**: ni `Material` ni `InventoryMovement` tienen `created_by`. Esperado en esta etapa — depende del módulo de autenticación/usuarios, aún no iniciado.
- **Categorías**: `Material.category` es un string simple; el modelo de datos original propone una entidad `Categories` separada con FK. Simplificación de MVP, aceptada por ahora.
- **Bloqueo de login**: 2 intentos fallidos → bloqueo de 5 min. Regla a implementar cuando se construya el módulo de autenticación (aún no iniciado).
- **RNFs generales** (rendimiento <2s, disponibilidad 99%, seguridad JWT/hash+salt): documentados en la especificación original, pendientes de verificar contra la implementación cuando corresponda.

## Pendientes por verificar (abiertos, sin confirmar aún)

- Ninguno crítico. Los dos pendientes anteriores (estado real de update/remove, y contenido de los documentos 01-05/gemini-code) quedaron resueltos y confirmados el 18/07/2026.
