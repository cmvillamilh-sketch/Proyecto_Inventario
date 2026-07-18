# Especificación 01: Objetivo y Alcance

## Objetivo del sistema
Construir una aplicación web para gestionar inventario de mantenimiento industrial, centralizando el control de materiales, entradas, salidas, stock y trazabilidad.

## Objetivo general
Garantizar que técnicos y coordinadores trabajen sobre una única fuente de verdad del inventario, eliminando Excel y mensajes informales, mediante una interfaz web construida con Next.js.

## Alcance del MVP
Incluye:
- Registro de materiales
- Entradas de inventario
- Salidas de inventario
- Consulta de stock en tiempo real
- Validación de stock negativo
- Trazabilidad por usuario y fecha/hora
- Gestión básica de usuarios y roles

No incluye:
- Integración con ERP o proveedores
- Órdenes de compra automáticas
- Analytics avanzados
- App móvil nativa
- Gestión de cotizaciones

## Fases detalladas de construcción

### Fase 1: Configuración del entorno local
- instalar Node.js, npm/yarn/pnpm
- configurar Git
- crear repositorio del proyecto
- inicializar backend con NestJS
- inicializar frontend con Next.js
- preparar PostgreSQL local
- definir variables de entorno

### Fase 2: Construcción del backend
- crear estructura modular de API
- definir autenticación y roles
- implementar CRUD de materiales
- implementar entradas y salidas con validación de stock
- registrar trazabilidad e historial
- garantizar transacciones ACID y concurrencia segura

### Fase 3: Construcción del frontend
- crear la base de la aplicación en Next.js
- implementar login y protección de rutas
- desarrollar catálogo de materiales
- desarrollar formularios de entrada y salida
- crear dashboard de stock e historial
- integrar llamadas a la API del backend

### Fase 4: Integración y validación
- probar el flujo completo desde login hasta movimiento
- verificar stock consistente en múltiples transacciones concurrentes
- validar trazabilidad
- ajustar UX y errores de negocio
- preparar despliegue de prueba local
