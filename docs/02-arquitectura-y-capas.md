# Especificación 02: Arquitectura y Capas

> **Nota (22/07/2026):** este documento describe la arquitectura **propuesta originalmente**. La implementación real coincide en las 4 capas y en los principios de diseño, con una corrección puntual: el ORM usado es **TypeORM**, no Prisma (ver Fase 2 más abajo). Se conserva el resto del documento porque describe fielmente lo construido — el detalle exacto de checkpoints y decisiones vivas está en `CLAUDE.md`.

## Arquitectura propuesta
El sistema se compone de cuatro capas:

1. Frontend Web con Next.js
   - Aplicación web basada en Next.js
   - Acceso por navegador
   - Roles: técnico, coordinador, administrador

2. Backend API
   - Servicios de autenticación, materiales y movimientos
   - Validaciones de negocio
   - Control de permisos
   - Transacciones atómicas

3. Base de datos relacional
   - PostgreSQL recomendado
   - Persistencia de usuarios, materiales y movimientos

4. Seguridad
   - Hash + salt para contraseñas
   - Sesiones o JWT
   - Bloqueo por intentos fallidos

## Principios de diseño
- Una sola fuente de verdad para el stock
- Transacciones consistentes
- Auditoría inmutable
- Separación por módulos
- Escalabilidad por crecimiento futuro

## Fases detalladas de implementación

### Fase 1: Configuración del entorno local
- instalar dependencias base del sistema
- configurar Node.js y Next.js
- preparar NestJS para el backend
- crear instancia local de PostgreSQL
- definir archivos de entorno (`.env`) y variables globales

### Fase 2: Construcción del backend
- crear módulos de autenticación, usuarios, materiales y movimientos
- integrar un ORM con PostgreSQL — **implementado con TypeORM** (no Prisma)
- desarrollar servicios de entrada/salida con validación de stock
- crear endpoints de consulta e historial
- aplicar control de permisos por rol
- implementar transacciones y locking en la base de datos

### Fase 3: Construcción del frontend
- crear layout, navegación y autenticación en Next.js
- desarrollar pantallas de login, dashboard, catálogo y movimientos
- consumir los endpoints del backend con fetch o Axios
- crear vistas de detalle y historial de materiales
- definir mensajes de error y estados de carga

### Fase 4: Integración y estabilización
- conectar frontend y backend en entorno local
- validar flujo completo de una salida válida e inválida
- revisar consistentencia de datos y trazabilidad
- preparar pruebas de integración y correcciones finales
