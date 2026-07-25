# Especificación 05: Módulos del Sistema

## Módulo de autenticación y usuarios
Funciones:
- login
- logout
- registro de usuarios
- control de permisos por rol
- bloqueo por intentos fallidos
- integración con la capa de frontend en Next.js

## Módulo de catálogo de materiales
Funciones:
- alta
- baja
- edición
- consulta
- búsqueda por código o descripción
- control de categoría y unidad de medida

## Módulo de inventario y movimientos
Funciones:
- entrada de material
- salida de material
- validación del stock disponible
- registro del movimiento
- actualización del stock

## Módulo de trazabilidad y auditoría
Funciones:
- historial por material
- historial por usuario
- filtros por fecha, tipo y responsable
- registros inmutables

## Módulo de consulta y dashboard
Funciones:
- resumen general del stock
- búsqueda y filtros
- indicadores básicos
- materiales con stock bajo

## Módulo de notificaciones
Funciones:
- alerta de stock mínimo
- alerta por movimientos críticos
- notificación de rechazo por falta de stock

## Fases detalladas por módulo

### Fase 1: Configuración del entorno local
- crear repositorio base
- levantar PostgreSQL y el backend local
- inicializar Next.js para el frontend
- preparar autenticación y entorno compartido

### Fase 2: Construcción del backend por módulos
- autenticación y usuarios
- catálogo de materiales
- movimientos de entrada/salida
- trazabilidad y auditoría
- endpoints de dashboard y notificaciones

### Fase 3: Construcción del frontend por módulos
- login y layout principal en Next.js
- dashboard de stock
- páginas de material, entrada y salida
- historial y filtros
- alertas y mensajes de validación

### Fase 4: Integración y despliegue local
- conectar frontend con backend
- validar flujo completo de usuario real
- corregir errores de comunicación o permisos
- dejar la aplicación lista para pruebas de aceptación
