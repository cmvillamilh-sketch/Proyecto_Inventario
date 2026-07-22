# Especificación 04: Modelo de Datos

> **Nota (22/07/2026):** este documento describe el modelo **planeado originalmente**, antes de iniciar la implementación. El modelo **real implementado** es distinto en varios puntos (ver tabla de discrepancias en `ERD.md`, que además incluye el diagrama Mermaid actualizado). Se conserva este documento sin borrar por trazabilidad histórica de la planeación, pero **`ERD.md` es la fuente de verdad actual** — si hay conflicto entre ambos, prevalece `ERD.md`. Resumen de lo que cambió: no existen las tablas `Roles`, `Categories` ni `Sessions` (`role` es un enum simple en `User`, `category` es texto libre en `Material`, y no hay tabla de sesiones porque el JWT es sin estado); `Material` y `InventoryMovement` sí tienen `created_by`, pero como texto plano (username), no como relación.

## Entidades principales

### Users
Atributos mínimos:
- id
- username
- password_hash
- salt
- role_id
- status
- failed_login_attempts
- locked_until

### Roles
*(planeado, no implementado — en el modelo real `role` es un enum directo dentro de `User`: `TECNICO`/`COORDINADOR`/`ADMIN`)*
- id
- name

### Materials
- id
- code
- description
- category_id
- unit_of_measure
- current_stock
- minimum_stock
- created_by
- created_at
- updated_at

### Categories
*(planeado, no implementado — en el modelo real `category` es texto libre dentro de `Material`)*
- id
- name

### InventoryMovements
- id
- material_id
- movement_type
- quantity
- reason
- created_by
- created_at
- reference_id

### Sessions
*(planeado, no implementado — la autenticación real usa JWT sin estado; no se persisten sesiones en base de datos)*
- id
- user_id
- token
- expires_at
- created_at

## Restricciones
- `code` debe ser único
- `current_stock` nunca puede ser negativo
- `quantity` debe ser positiva en entradas y salidas
- movimientos registran trazabilidad e inmutabilidad

## Fases detalladas de construcción del modelo

### Fase 1: Configuración del entorno local
- preparar PostgreSQL local
- crear base de datos del proyecto
- definir esquema inicial de tablas
- configurar conexión desde backend

### Fase 2: Construcción del backend de datos
- crear tablas de usuarios, roles, materiales, categorías y movimientos
- definir relaciones entre entidades
- establecer restricciones de integridad y unicidad
- preparar migraciones o scripts de creación

### Fase 3: Construcción del frontend asociado
- consumir el modelo de datos a través de endpoints del backend
- mapear tablas y filtros en el dashboard de Next.js
- mostrar stock actual, historial y alertas de bajo inventario

### Fase 4: Validación de integridad
- probar entradas y salidas contra el modelo
- verificar que el historial no se pueda editar ni eliminar
- confirmar que el stock se mantenga consistente ante transacciones concurrentes
