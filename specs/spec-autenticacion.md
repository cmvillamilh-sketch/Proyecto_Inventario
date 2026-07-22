# Spec — Autenticación y Usuarios

## 1. Objetivo
Autenticar usuarios mediante JWT, diferenciar permisos por rol, y proteger el sistema contra accesos indebidos (fuerza bruta sobre contraseñas).

## 2. Contexto (tablas afectadas)
- `users`: `id`, `username` (único), `passwordHash`, `role` (enum), `failedLoginAttempts`, `lockedUntil`, `isActive`.

## 3. Entradas / Salidas exactas
- `POST /auth/login` (pública) — body `{ username, password }` → `{ message, accessToken, user: { id, username, role } }`. Status `201` (default de Nest para `POST`, no se sobreescribió a `200`).
- `POST /users` — body `{ username, password, role }`, `@Roles(ADMIN)`.
- `GET /users` — lista sin `passwordHash`, `@Roles(ADMIN)`.
- `GET /users/:id` — detalle sin `passwordHash`, `@Roles(ADMIN)`.
- `PATCH /users/:id` — body `{ role?, isActive? }`, `@Roles(ADMIN)`.
- `DELETE /users/:id` — soft-delete (`isActive: false`), `@Roles(ADMIN)`.
- `PATCH /users/:id/reset-password` — body `{ newPassword }`, `@Roles(ADMIN)`.

## 4. Reglas lógicas y validaciones
- Contraseña se guarda con hash `bcrypt`, nunca en texto plano.
- Bloqueo tras **2 intentos fallidos** consecutivos, por **5 minutos** (`failedLoginAttempts`/`lockedUntil`). El mensaje de error es el mismo para credenciales inválidas y para cuenta bloqueada (no revela cuál de las dos causas aplica).
- Política de contraseña (creación y reseteo): mínimo 8 caracteres, al menos una mayúscula, una minúscula y un número.
- `username` único — duplicado responde `409 Conflict`.
- Baja de usuario es **lógica** (`isActive: false`), nunca se borra la fila físicamente.
- Un administrador **no puede autodesactivarse** (`DELETE` o `PATCH { isActive: false }` sobre su propio `id` responde `400`).
- `Materials` e `InventoryMovements` requieren JWT válido (`JwtAuthGuard`) pero **no** están restringidos por rol — cualquier usuario autenticado puede usarlos, decisión consciente documentada.
- Logout es del lado del cliente únicamente (se descarta el token) — no existe lista negra de tokens en el servidor.

## 5. Criterios de aceptación
- **Dado** un usuario con 2 intentos fallidos consecutivos, **cuando** intenta loguearse una tercera vez con la contraseña correcta antes de 5 minutos, **entonces** el sistema lo rechaza igual (`401`).
- **Dado** un usuario con rol `TECNICO` autenticado, **cuando** intenta acceder a `GET /users`, **entonces** el sistema responde `403` (no `401` — el sistema sabe quién es, pero no lo autoriza).
- **Dado** un administrador autenticado, **cuando** intenta desactivar su propia cuenta, **entonces** el sistema responde `400` y no la desactiva.
- **Dado** un intento de crear un usuario con contraseña de menos de 8 caracteres, **cuando** se envía la petición, **entonces** el sistema responde `400` sin crear el usuario.
- **Dado** un usuario dado de baja (`isActive: false`), **cuando** se consulta la lista de usuarios, **entonces** sigue apareciendo el registro (no se borra físicamente).

## 6. Fuera de alcance
- Recuperación de contraseña por correo electrónico — el reseteo lo hace un administrador manualmente.
- Pantalla de gestión de usuarios en el frontend (crear, editar, resetear contraseña, desactivar) — hoy solo existe por API; el frontend solo tiene una vista de solo lectura.
- Lista negra de tokens / invalidación server-side del JWT antes de su expiración natural.
- Restricción por rol sobre Materiales e Inventory Movements.
