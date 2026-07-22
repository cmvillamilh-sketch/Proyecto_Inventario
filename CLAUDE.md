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

Corrección aplicada y verificada (19/07/2026): se agregó `ParseUUIDPipe` en los parámetros `:id` de `InventoryMovementsController` y `MaterialsController`. Un id con formato inválido ahora responde `400 Bad Request` ("Validation failed (uuid is expected)") en vez de `500 Internal server error`.

### Módulo Material — ✅ COMPLETADO
Congelado como módulo de referencia. **No modificar salvo corrección de bugs.**

**Corrección aplicada (18/07/2026):** se detectó que `code` permitía duplicados, contradiciendo la restricción de unicidad del modelo de datos original. Se agregó `@Column({ unique: true })` en la entidad `Material`, y `MaterialsService.create()` ahora captura la violación de unique constraint de Postgres (23505) y la relanza como `ConflictException('Ya existe un material con ese code')` (409). Verificado en Postman.

**Corrección aplicada (19/07/2026):** se detectó que ni `InventoryMovementForm.tsx` ni `MaterialForm.tsx` invalidaban el router cache del cliente tras crear un registro (`force-dynamic` en la página no es suficiente al navegar con `router.push()`). Se agregó `router.refresh()` antes del `push()` en ambos formularios.

### Módulo Inventory Movements — ✅ COMPLETADO (backend + frontend)

| Elemento | Estado |
|---|---|
| Entity `InventoryMovement` | ✅ |
| Enum `MovementType` (ENTRY, EXIT, ADJUSTMENT) | ✅ |
| DTOs (`CreateInventoryMovementDto`, `UpdateInventoryMovementDto`) | ✅ |
| Module | ✅ |
| Service — `findAll()`, `findOne()`, `create()` (con transacción) | ✅ |
| Service — `update()`/`remove()` | ✅ bloqueados por diseño (`ForbiddenException`, inmutabilidad) |
| Controller (POST, GET, GET por ID — sin PUT/DELETE) | ✅ |
| Frontend (listado y alta) | ✅ |

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

## Módulo de trazabilidad y auditoría — desglose preciso (19/07/2026)

Fuente literal: `05-modulos-del-sistema.md` y `gemini-code-1784071345471.md` (sección 9). Cuatro funciones especificadas, cada una vale 25% del módulo:

| Función especificada | Estado | % |
|---|---|---|
| Historial de movimientos por material | Parcial — el dato existe (`findAll()` con relación a `material`), pero no hay filtro/endpoint dedicado (`?materialId=` o `/materials/:id/movements`) | 12.5% |
| Historial de movimientos por usuario | No iniciado — no existe campo `createdBy`/`userId` en la entidad; depende del módulo de autenticación | 0% |
| Filtros por fecha, tipo y responsable | No iniciado — `findAll()` no acepta query params ni lógica `where` condicional | 0% |
| Registros inmutables | Completo — verificado en dos capas: el controller no expone PUT/DELETE, y el service los rechaza con `ForbiddenException` si se invocan directamente | 25% |

**Total del módulo: 37.5% (≈38%)**, no una estimación a ojo — recalcular si cambia alguno de estos puntos.

---

## Próximo objetivo

Checkpoints 006.5 y 006.6 completos — el módulo Inventory Movements queda cerrado (backend + frontend).

Según `05-modulos-del-sistema.md` y `gemini-code-1784071345471.md`, el siguiente módulo en el alcance del MVP es **Autenticación y usuarios** (no iniciado): login, roles, bloqueo tras 2 intentos fallidos (5 min), y es prerrequisito para cubrir la trazabilidad por usuario (`created_by`) pendiente en Material e Inventory Movements. Pendiente de que ChatGPT (rol Claude) defina la arquitectura de este módulo antes de asignar un número de checkpoint.

---

## Módulo de Autenticación y usuarios — arquitectura (19/07/2026)

Fuente literal: `05-modulos-del-sistema.md`, `gemini-code-1784071345471.md` (secciones 9 y 10).

Especificación citada:
- Funciones: login, logout, registro de usuarios, control de permisos por rol, bloqueo por intentos fallidos, integración con frontend.
- Roles: técnico, coordinador de compras, admin.
- Regla: el admin crea/edita/elimina cuentas. Política de contraseñas (longitud/complejidad) + recuperación. Bloqueo de 2 intentos fallidos, 5 minutos.
- RF08: autenticación + permisos diferenciados por rol. RNF02: contraseñas cifradas (hash+salt). RNF03: acciones críticas (entradas/salidas) protegidas por rol.

Estado previo: `AuthModule` era un stub — `POST /auth/login` aceptaba cualquier credencial no vacía y devolvía un token falso fijo (`'demo-token'`). Sin entidad `User`, sin persistencia, sin guards.

### Diseño

**Entidad `User`**: `id` (uuid), `username` (único), `passwordHash` (bcrypt), `role` (enum `TECNICO`/`COORDINADOR`/`ADMIN`), `failedLoginAttempts` (int, default 0), `lockedUntil` (timestamp nullable), `isActive` (boolean, default true — soft-delete, no borrado físico).

**Endpoints**:
- `POST /auth/login` (pública) — valida credenciales, aplica bloqueo tras 2 intentos fallidos por 5 min, devuelve JWT.
- `POST /auth/logout` (requiere JWT) — logout simple: el frontend descarta el token, sin lista negra en servidor (decisión tomada, ver abajo).
- `POST /users`, `PATCH /users/:id`, `DELETE /users/:id` (soft), `GET /users` — todos `@Roles(ADMIN)`.
- Materials e Inventory Movements — pasan a requerir JWT (antes estaban completamente abiertos; lo exige RNF03).

**Guards**: `JwtAuthGuard` (autenticación) + `RolesGuard`/`@Roles()` (autorización por rol).

### Decisiones tomadas (19/07/2026)

1. **Recuperación de contraseña**: sin infraestructura de email en el proyecto — el admin resetea la contraseña manualmente en vez de flujo de autoservicio por correo.
2. **`createdBy`**: se agrega ahora a `Material` (excepción justificada al congelamiento, ya que este era el objetivo explícito de construir Auth) e `InventoryMovement`.
3. **Logout**: simple (el frontend descarta el token), sin lista negra de tokens en el servidor — suficiente para el alcance del MVP.

### Decisiones tomadas (21/07/2026) — para 007.3

1. **Política de contraseñas** (creación y reseteo de usuarios): mínimo 8 caracteres, con al menos una mayúscula, una minúscula y un número. No se exige carácter especial obligatorio.
2. **Auto-bloqueo de admin**: un admin autenticado NO puede desactivarse/eliminarse a sí mismo vía `DELETE /users/:id`. El service debe rechazar ese caso explícitamente (400/403) para evitar quedarse sin ningún admin activo.

### Decisión tomada (21/07/2026) — para 007.4

**`createdBy`**: se guarda como texto plano (el `username` capturado en el momento de crear el registro), no como relación FK a `User.id`. Evita joins y el riesgo de exponer `passwordHash` al popular la relación; suficiente para trazabilidad del MVP (RF05). La columna es `nullable: true` en ambas entidades porque `synchronize: true` no puede rellenar retroactivamente los materiales/movimientos ya existentes en la base — para esos registros antiguos, `createdBy` queda en `null` (creados antes de que existiera trazabilidad por usuario).

### Corrección al registro (21/07/2026)

`handoff-mantestock-nuevo-chat.md` (archivo suelto, no commiteado) afirmaba que el checkpoint 007.3 estaba "en curso, prompt ya dado a Claude Code, falta ver el resultado". Se verificó el código real (`apps/backend/src`, `git log`) el 21/07/2026 y **007.3 no existe**: no hay `UsersModule`, `UsersController`, `RolesGuard` ni `@Roles()`, y `app.module.ts` no importa ningún módulo de usuarios. El último commit sigue siendo `e02ab6f` (007.2), del 18/07/2026. Se trata este hallazgo como corrección del estado real, no como avance — 007.3 se retoma desde cero con el prompt de esta sesión.

### Plan de checkpoints (007)

| Checkpoint | Contenido | Estado |
|---|---|---|
| 007.1 | Entidad `User`, hash de contraseña real (bcrypt), login real (reemplaza el stub), lockout de 2 intentos/5 min | ✅ Implementado y verificado con `curl` contra el servidor real (19/07/2026). Pendiente de verificación manual del usuario en Postman antes de commitear. |
| 007.2 | `JwtAuthGuard` + estrategia JWT; proteger Materials e Inventory Movements | ✅ Implementado y verificado con `curl` (sin token → 401, token inválido → 401, token válido → 200, arranque falla sin `JWT_SECRET`). Pendiente de verificación manual del usuario en Postman antes de commitear. |
| 007.3 | `RolesGuard`/`@Roles()`; CRUD de usuarios (admin-only); reseteo de contraseña por admin | ✅ Implementado y verificado el 21/07/2026 con colección de Postman (13 requests, incluye login admin/técnico, 403 por rol, 400 por password débil, 400 autobloqueo de admin, ciclo completo de reset-password, y soft-delete verificando que el registro no se borra físicamente). Todos los tests en verde. Pendiente de commitear. |
| 007.4 | `createdBy` en `Material` e `InventoryMovement` (requiere el usuario autenticado del request) | ✅ Implementado y verificado el 21/07/2026 con colección de Postman (6 requests): material creado por `admin` trae `createdBy:"admin"`, movimiento creado por `tecnico1` trae `createdBy:"tecnico1"`, y los registros anteriores a este checkpoint siguen respondiendo con `createdBy:null` sin romper la lista. Todos los tests en verde. Pendiente de commitear. |
| 007.5 | Frontend: página de login, rutas protegidas, UI condicionada por rol | Pendiente |

**Nota sobre bootstrap de usuarios:** no existe endpoint HTTP de registro todavía (por diseño, se deja para 007.3 con guard admin-only). El primer usuario admin se crea con el script `npm run seed:test-user` (acepta username/password/role por argumento) — necesario porque un endpoint admin-only no puede usarse antes de que exista un admin. Este script queda como herramienta de desarrollo/bootstrap, no como parte de la API pública.

**Pendiente de seguridad (no bloqueante en desarrollo):** el `.env` local usa `JWT_SECRET=change-me` (valor de `.env.example`) para poder probar 007.2. **Reemplazar por un secreto fuerte y único antes de cualquier despliegue a staging o producción.**

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

## Puntos abiertos de 007.3 (no bloqueantes, pendientes de decisión del usuario)

1. **Auto-degradación de rol**: `PATCH /users/:id` bloquea que un admin se desactive a sí mismo (`isActive:false`), pero NO bloquea que un admin se cambie su propio `role` a TECNICO/COORDINADOR. Si el único admin activo hace esto por error, queda en la misma situación que la protección de auto-bloqueo buscaba evitar. Sin decidir aún si vale la pena bloquearlo también.
2. **Código de estado de `/auth/login`**: devuelve `201` (default de Nest para `@Post()` sin `@HttpCode`), no `200`. Es válido, pero si se prefiere el convencional `200` para login, es un cambio de una línea. Sin decidir.

## 007.3 — verificado (21/07/2026)

Validado con colección de Postman (`postman/ManteStock-007.3-Users.postman_collection.json`, 13 requests con tests automáticos) — 13/13 en verde. Cubre: rechazo por rol (403), rechazo por password débil (400), rechazo de autobloqueo de admin (400), ciclo completo de reset-password (clave vieja deja de servir, clave nueva funciona), y soft-delete (el registro no se borra físicamente, `isActive:false`). Pendiente de commitear.

## 007.4 — verificado (21/07/2026)

Validado con colección de Postman (`postman/ManteStock-007.4-CreatedBy.postman_collection.json`, 6 requests) — todos en verde. Cubre: `POST /materials` como `admin` devuelve `createdBy:"admin"`, `POST /inventory-movements` como `tecnico1` devuelve `createdBy:"tecnico1"`, el valor persiste al releer el material por id, y la lista completa de materiales no se rompe con registros antiguos en `createdBy:null`. Pendiente de commitear.
