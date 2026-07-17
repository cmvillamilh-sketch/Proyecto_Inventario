# Especificación 05: Módulos del Sistema

## Visión general
El sistema Mante-Stock se organiza en módulos funcionales independientes, pero coherentes entre sí, para facilitar el desarrollo, el mantenimiento y la escalabilidad. Cada módulo contará con una capa de backend implementada en NestJS, una interfaz de usuario desarrollada en Next.js con App Router y Tailwind CSS, y una capa de persistencia gestionada con Prisma ORM sobre PostgreSQL.

## 1. Módulo de Autenticación

### Responsabilidades del Backend API (NestJS)
- Implementar el login de usuarios con autenticación segura mediante JWT
- Generar y validar tokens de sesión para acceso protegido a rutas privadas
- Aplicar control de acceso basado en roles (RBAC) con Guards y decoradores de autorización
- Gestionar autenticación segura de usuarios, recuperación de credenciales y protección frente a accesos no autorizados
- Restringir el acceso a endpoints según el rol del usuario autenticado: Técnico, Coordinador o Administrador

### Responsabilidades del Frontend UI (Next.js + Tailwind CSS)
- Crear la pantalla de login con validación de formulario
- Almacenar de forma segura la sesión del usuario y proteger rutas privadas con middleware de Next.js
- Mostrar el menú principal según el rol autenticado
- Redirigir automáticamente a usuarios no autenticados o sin permisos suficientes
- Mostrar mensajes de error claros para credenciales inválidas o sesiones expiradas

## 2. Módulo de Catálogo de Materiales

### Responsabilidades del Backend API (NestJS)
- Exponer endpoints para crear, consultar, editar y eliminar materiales
- Permitir búsqueda por código, descripción o categoría
- Validar datos obligatorios como código, descripción, unidad, stock mínimo y ubicación física
- Asociar cada material con una ubicación física relacional mediante Location
- Persistir información como marca/fabricante, stock actual, stock mínimo y estado de ubicación

### Responsabilidades del Frontend UI (Next.js + Tailwind CSS)
- Desarrollar la vista de catálogo con tabla o tarjetas de materiales
- Implementar buscador predictivo en tiempo real por código o descripción
- Permitir la creación y edición de materiales mediante formularios dinámicos
- Integrar la selección interactiva de ubicación física: pasillo, estante y cajón
- Mostrar estados visuales de disponibilidad y alerta por stock bajo

## 3. Módulo de Inventario y Movimientos

### Responsabilidades del Backend API (NestJS)
- Implementar el flujo de registro de entradas y salidas de inventario
- Validar stock disponible antes de registrar una salida
- Aplicar transacciones atómicas para evitar inconsistencias de stock
- Bloquear operaciones que generen saldo negativo o violen reglas de negocio
- Actualizar automáticamente el stock actual del material y registrar el movimiento en el historial inmutable

### Responsabilidades del Frontend UI (Next.js + Tailwind CSS)
- Crear formularios para registrar entradas y salidas de materiales
- Mostrar mensajes de validación al usuario en caso de stock insuficiente o movimiento inválido
- Actualizar el estado del inventario en tiempo real tras una operación exitosa
- Permitir visualizar el impacto del movimiento sobre el stock actual del material

## 4. Módulo de Auditoría y Trazabilidad

### Responsabilidades del Backend API (NestJS)
- Registrar cada movimiento de inventario en una tabla de auditoría inmutable
- Persistir datos como usuario responsable, tipo de movimiento, cantidad, stock anterior, stock nuevo y fecha/hora del servidor
- Exponer endpoints de consulta por material, usuario, fecha y tipo de movimiento
- Asegurar la integridad referencial con PostgreSQL y Prisma ORM

### Responsabilidades del Frontend UI (Next.js + Tailwind CSS)
- Mostrar un visor de historial con filtros avanzados por fecha, usuario, material y tipo de movimiento
- Presentar los registros de forma clara y legible para auditoría operativa
- Permitir la exportación o visualización de movimientos en tablas ordenadas y paginadas

## 5. Módulo de Dashboard y Consultas

### Responsabilidades del Backend API (NestJS)
- Exponer KPIs agregados como total de materiales, stock total, entradas y salidas recientes
- Proporcionar endpoints para consultar materiales críticos y estado general del inventario
- Generar la información necesaria para paneles operativos y reportes rápidos

### Responsabilidades del Frontend UI (Next.js + Tailwind CSS)
- Diseñar un dashboard con indicadores visuales claros
- Mostrar tarjetas con métricas clave: total de materiales en stock, movimientos del día, materiales críticos y tendencias básicas
- Resaltar los materiales con stock bajo mediante colores de alerta visual
- Proporcionar filtros rápidos para consultar información por categoría, ubicación o estado de stock

## 6. Módulo de Notificaciones y Alertas

### Responsabilidades del Backend API (NestJS)
- Evaluar condiciones de stock mínimo y stock crítico para cada material
- Determinar si un material debe marcarse como alerta visual en la interfaz
- Exponer datos de estado de alerta para consumo por el frontend

### Responsabilidades del Frontend UI (Next.js + Tailwind CSS)
- Mostrar alertas visuales directas mediante toasts, banners o mensajes flotantes
- Utilizar colores amarillo y rojo para indicar niveles de advertencia y criticidad
- Mostrar notificaciones cuando una operación sea rechazada por falta de stock o cuando un material requiera reposición

## Fases detalladas de construcción por módulos

### Fase 1: Configuración de la base técnica
- Crear la estructura inicial del repositorio
- Configurar PostgreSQL, NestJS, Next.js, Prisma ORM y Tailwind CSS
- Definir variables de entorno, modelos base y arquitectura de carpetas modular

### Fase 2: Implementación del núcleo backend
- Desarrollar el módulo de autenticación con JWT y RBAC
- Implementar el módulo de catálogo de materiales y ubicaciones
- Crear el módulo de inventario con validación de stock y transacciones atómicas
- Preparar el módulo de auditoría con historial inmutable

### Fase 3: Implementación del frontend modular
- Construir la interfaz de login y protección de rutas con middleware de Next.js
- Desarrollar las vistas de catálogo, entradas, salidas y consulta de stock
- Implementar el dashboard con KPIs y alertas visuales
- Integrar filtros y vistas de historial para auditoría operativa

### Fase 4: Integración, validación y estabilización
- Conectar frontend y backend mediante API REST protegida
- Validar el flujo completo de autenticación, inventario y auditoría
- Revisar permisos por rol, consistencia de stock y trazabilidad
- Ajustar la experiencia de usuario y dejar la solución lista para pruebas de aceptación
