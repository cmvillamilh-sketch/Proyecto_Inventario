# Especificación 01: Objetivo y Alcance

## Nombre del sistema
Mante-Stock

## Objetivo del sistema
Desarrollar una aplicación web para la gestión integral del inventario de mantenimiento industrial, con el fin de centralizar el control de materiales, repuestos, entradas, salidas, stock, ubicaciones físicas y trazabilidad de operaciones.

## Objetivo general
Garantizar que técnicos y coordinadores trabajen sobre una única fuente de verdad del inventario, reduciendo la dependencia de hojas de cálculo, registros manuales y comunicación informal. El sistema debe facilitar la disponibilidad de repuestos críticos, mejorar la trazabilidad operativa y fortalecer la eficiencia del proceso de mantenimiento.

## Alcance del MVP
El sistema incluirá:
- Registro y administración de materiales y repuestos
- Registro de entradas al almacén
- Registro de salidas por uso en mantenimiento
- Consulta de stock en tiempo real
- Validación de movimientos para evitar stock negativo
- Trazabilidad por usuario, fecha, hora y tipo de movimiento
- Gestión básica de usuarios y roles
- Registro de la ubicación física de los repuestos, incluyendo pasillo, estante y cajón
- Alertas visuales cuando un material alcance un nivel de stock mínimo o crítico

No incluirá:
- Integración con ERP, proveedores o sistemas externos de compras
- Órdenes de compra automáticas
- Analytics avanzados
- Aplicación móvil nativa
- Gestión de cotizaciones

## Roles de usuario

### Técnico
El técnico podrá:
- Consultar el stock disponible de repuestos y materiales
- Consultar la ubicación física de un ítem dentro del almacén (pasillo, estante, cajón)
- Registrar salidas de inventario asociadas a actividades de mantenimiento o requerimientos operativos
- Visualizar alertas de stock mínimo o crítico para anticipar faltantes
- Consultar el historial básico de movimientos relacionados con su área de trabajo

### Coordinador
El coordinador podrá:
- Registrar materiales y repuestos en el sistema
- Registrar entradas de inventario y ajustar existencias cuando se reciban nuevos abastecimientos
- Gestionar y actualizar ubicaciones físicas de los materiales
- Definir y revisar niveles de stock mínimo y crítico
- Consultar reportes de movimientos, consumos y disponibilidad
- Supervisar el uso del inventario y validar operaciones realizadas por técnicos
- Administrar usuarios y permisos básicos del sistema

## Alcance funcional orientado a mantenimiento industrial
- Control de inventario de repuestos críticos para equipos y procesos industriales
- Registro de movimientos de entrada y salida con trazabilidad completa
- Visualización del estado del inventario para apoyar decisiones operativas
- Gestión de ubicaciones físicas para facilitar la localización rápida de repuestos
- Soporte para alertas que permitan anticipar faltantes de stock antes de afectar la operación

## Fases detalladas de construcción

### Fase 1: Configuración del entorno local
- Instalar Node.js, npm/yarn/pnpm
- Configurar Git
- Crear el repositorio del proyecto
- Inicializar el backend con NestJS
- Inicializar el frontend con Next.js
- Preparar PostgreSQL local
- Definir variables de entorno

### Fase 2: Construcción del backend
- Crear la estructura modular de la API
- Definir autenticación y roles
- Implementar CRUD de materiales
- Implementar entradas y salidas con validación de stock
- Registrar trazabilidad e historial de movimientos
- Garantizar transacciones ACID y concurrencia segura

### Fase 3: Construcción del frontend
- Crear la base de la aplicación en Next.js
- Implementar login y protección de rutas
- Desarrollar el catálogo de materiales
- Desarrollar formularios de entrada y salida
- Crear el dashboard de stock e historial
- Integrar llamadas a la API del backend

### Fase 4: Integración y validación
- Probar el flujo completo desde el login hasta la gestión de movimientos
- Verificar la consistencia del stock en múltiples transacciones concurrentes
- Validar la trazabilidad de operaciones
- Ajustar la experiencia de usuario y los errores de negocio
- Preparar el despliegue de prueba local
