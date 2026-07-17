# Especificación 04: Modelo de Datos

## Diseño general
El modelo de datos de Mante-Stock se basa en un esquema relacional PostgreSQL, implementado con Prisma ORM para garantizar consistencia, seguridad y facilidad de mantenimiento. El diseño contempla usuarios, materiales, ubicaciones físicas y movimientos de inventario con trazabilidad completa.

## Modelos principales

### 1. User
Representa a los usuarios del sistema y su rol dentro del proceso de inventario.

Campos:
- id: String @id @default(cuid())
- email: String @unique
- password: String
- name: String
- role: UserRole @default(TECNICO)
- createdAt: DateTime @default(now())

Enum:
- TECNICO
- COORDINADOR
- ADMINISTRADOR

Relaciones:
- Un usuario puede registrar muchos movimientos de inventario.

### 2. Material
Representa cada repuesto o material controlado por el sistema.

Campos:
- id: String @id @default(cuid())
- code: String @unique
- description: String
- category: String
- unit: String
- stockActual: Int
- stockMinimo: Int
- brand: String?
- locationId: String
- createdAt: DateTime @default(now())

Relaciones:
- Un material pertenece a una ubicación física.
- Un material puede tener muchos movimientos de inventario.

### 3. Location
Representa la ubicación física del material dentro del almacén.

Campos:
- id: String @id @default(cuid())
- pasillo: String
- estante: String
- cajon: String
- createdAt: DateTime @default(now())

Relaciones:
- Una ubicación puede tener muchos materiales.

### 4. Movement
Representa cada entrada o salida de inventario registrada por el sistema.

Campos:
- id: String @id @default(cuid())
- type: MovementType
- quantity: Int
- previousStock: Int
- newStock: Int
- userId: String
- materialId: String
- reason: String?
- createdAt: DateTime @default(now())

Enum:
- ENTRADA
- SALIDA

Relaciones:
- Un movimiento pertenece a un usuario.
- Un movimiento pertenece a un material.

## Relaciones del modelo
- User 1:N Movement
- Location 1:N Material
- Material 1:N Movement

## Restricciones clave
- Los IDs se generan automáticamente mediante valores seguros y únicos.
- El campo code de Material debe ser único para evitar duplicados de inventario.
- El campo locationId en Material debe ser una clave foránea válida hacia Location.
- Los campos userId y materialId en Movement deben ser claves foráneas válidas hacia User y Material.
- El stock actual no puede ser negativo.
- Las cantidades de movimiento deben ser positivas.
- Los movimientos deben ser inmutables para garantizar trazabilidad histórica.
- La integridad referencial debe mantenerse mediante relaciones relacionales y restricciones de base de datos.

## Reglas de integridad y auditoría
- Cada entrada o salida debe registrar el estado del stock antes y después del movimiento.
- Los movimientos no deben editarse ni eliminarse una vez creados, preservando el historial del inventario.
- La relación entre Material y Movement permite reconstruir el historial completo de cambios por artículo.
- La relación entre User y Movement permite identificar quién ejecutó cada operación.
- La relación entre Location y Material permite localizar físicamente los repuestos dentro del almacén.

## Consideraciones para Prisma
El esquema propuesto puede implementarse en Prisma de forma clara y mantenible mediante:
- modelos con tipos enumerados para roles y tipos de movimiento
- relaciones explícitas entre tablas
- restricciones únicas y claves foráneas definidas en el esquema
- soporte para migraciones automáticas y auditoría por historial

## Fases detalladas de construcción del modelo

### Fase 1: Configuración del entorno local
- preparar PostgreSQL local
- crear la base de datos del proyecto
- definir el esquema inicial de modelos con Prisma
- configurar la conexión desde el backend NestJS

### Fase 2: Construcción del backend de datos
- crear los modelos de User, Material, Location y Movement
- definir relaciones entre entidades
- establecer restricciones de unicidad, integridad referencial y validación de stock
- preparar migraciones y scripts de creación

### Fase 3: Construcción del frontend asociado
- consumir los datos a través de endpoints del backend
- mapear tablas, filtros y ubicaciones en el dashboard de Next.js
- mostrar stock actual, historial y alertas de bajo inventario

### Fase 4: Validación de integridad
- probar entradas y salidas contra el modelo
- verificar que el historial no pueda editarse ni eliminarse
- confirmar que el stock se mantenga consistente ante transacciones concurrentes
