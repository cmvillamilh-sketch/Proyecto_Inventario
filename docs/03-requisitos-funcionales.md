# Especificación 03: Requisitos Funcionales

## RF01 - Registro de material
El sistema debe permitir crear, consultar, editar y eliminar materiales con:
- código único
- descripción
- categoría
- unidad de medida
- stock actual
- stock mínimo

## RF02 - Registro de entrada
Permitir registrar entradas de material al inventario, incrementando el stock correspondiente.

Reglas:
- cantidad mayor a 0
- usuario autorizado
- transacción atómica
- movimiento con trazabilidad

## RF03 - Registro de salida
Permitir registrar salidas de material, decrementando el stock solo si hay disponibilidad.

## RF04 - Validación de stock negativo
Se debe rechazar cualquier salida que deje el material en saldo negativo.

## RF05 - Trazabilidad de movimientos
Todo movimiento debe registrar:
- usuario responsable
- timestamp
- tipo de movimiento
- material afectado
- cantidad
- motivo

## RF06 - Consulta de inventario
Debe permitir consultar el stock disponible de cualquier material.

## RF07 - Historial de movimientos
Debe permitir consultar el historial de movimientos por material y por usuario.

## RF08 - Gestión de usuarios y roles
Debe existir autenticación y diferenciación por rol.

## RF09 - Frontend con Next.js
La interfaz de usuario debe implementarse con Next.js, manteniendo una experiencia web moderna y basada en componentes.

## RF10 - Concurrencia segura
El sistema debe prevenir inconsistencias cuando dos transacciones afectan el mismo material simultáneamente.

## Fases detalladas de entrega

### Fase 1: Configuración del entorno local
- preparar el entorno de desarrollo con Node.js, Next.js y PostgreSQL
- configurar el repositorio y la estructura base del proyecto
- documentar variables de entorno y scripts locales de arranque

### Fase 2: Construcción del backend
- implementar autenticación con roles
- crear CRUD de usuarios y materiales
- implementar transacciones de entrada y salida
- validar stock negativo y trazabilidad en cada movimiento
- exponer API REST para consumo del frontend

### Fase 3: Construcción del frontend en Next.js
- crear la pantalla de login y protección de rutas
- desarrollar el dashboard principal
- implementar el catálogo y los formularios de movimiento
- crear vistas de historial y auditoría
- conectar la interfaz con el backend para operaciones reales

### Fase 4: Validación del sistema
- ejecutar pruebas de flujo principal
- validar control de permisos por rol
- revisar concurrencia sobre un mismo material
- confirmar que cada operación deja registro auditable y consistente
