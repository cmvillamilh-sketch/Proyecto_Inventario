# Especificación 04: Modelo de Datos

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
