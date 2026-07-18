# Especificación 02: Arquitectura y Capas

## Arquitectura propuesta
El sistema se estructura en cuatro capas principales para garantizar claridad técnica, seguridad operativa y escalabilidad futura:

1. Frontend Web con Next.js
   - Aplicación web desarrollada con Next.js utilizando el App Router
   - Interfaz de usuario responsive y orientada a operaciones de mantenimiento industrial
   - Diseño visual limpio y funcional mediante Tailwind CSS
   - Gestión de autenticación, navegación por roles y vistas específicas para técnicos, coordinadores y administradores

2. Backend API con NestJS
   - API REST construida con NestJS como framework principal del backend
   - Módulos separados para autenticación, usuarios, materiales, movimientos e historial
   - Lógica de negocio centralizada en servicios y validaciones de stock
   - Control de permisos, transacciones atómicas y manejo estructurado de excepciones

3. Base de datos relacional
   - PostgreSQL como motor de base de datos relacional principal
   - Prisma ORM para la comunicación segura, tipada y mantenible con la base de datos
   - Persistencia de usuarios, materiales, ubicaciones, movimientos y registros de auditoría

4. Seguridad y control de acceso
   - Hash y sal para contraseñas
   - Autenticación basada en JWT (JSON Web Tokens)
   - Protección de rutas mediante NestJS Guards y estrategias de autorización por rol
   - Bloqueo por múltiples intentos fallidos y manejo seguro de sesiones

## Principios de diseño
- Una sola fuente de verdad para el inventario y el stock
- Consistencia transaccional en todas las operaciones de entrada y salida
- Auditoría inmutable para cada movimiento del inventario
- Separación clara por módulos y responsabilidades
- Diseño escalable para crecimiento futuro y mantenimiento de la solución

## Arquitectura funcional y de seguridad

### Frontend
- Implementación de vistas para login, dashboard, catálogo, movimientos y reportes
- Componentes reutilizables y estructura modular para facilitar el mantenimiento del sistema
- Uso de Tailwind CSS para un diseño industrial claro, legible y consistente
- Integración con la API mediante servicios organizados y manejo de estados de carga y error

### Backend
- NestJS como base del servidor, con módulos organizados por dominio
- Prisma ORM para definir modelos, migraciones y acceso seguro a PostgreSQL
- Servicios para validación de stock, cálculo de saldos y control de reglas de negocio
- Endpoints protegidos y segmentados por rol

### Seguridad y control de acceso basado en roles (RBAC)
El sistema aplicará control de acceso basado en roles (RBAC) mediante autenticación JWT y protección de rutas con NestJS Guards:
- Técnico: podrá consultar stock, revisar ubicaciones físicas, registrar salidas y consultar su historial de operaciones
- Coordinador: podrá registrar materiales, registrar entradas, actualizar ubicaciones, revisar reportes y supervisar movimientos del inventario
- Administrador: podrá gestionar usuarios, roles, configuraciones de seguridad y permisos del sistema

La estrategia de seguridad se implementará de la siguiente manera:
- Autenticación mediante JWT al iniciar sesión
- Validación del token en cada petición protegida
- Guards especializados para restringir rutas según el rol del usuario
- Decoradores de autorización para diferenciar permisos de lectura, escritura y administración

## Auditoría y trazabilidad de inventario
Cada movimiento de stock quedará registrado en una tabla de historial inmutable, garantizando trazabilidad completa del inventario.

Los registros almacenarán, como mínimo:
- Tipo de movimiento: entrada o salida
- Material o repuesto involucrado
- Cantidad registrada
- Fecha y hora exacta de la operación
- ID del usuario que ejecutó la acción
- Estado del movimiento y observaciones relevantes, si aplica

Esta tabla permitirá:
- Consultar el historial completo de operaciones
- Identificar quién realizó cada movimiento
- Verificar cambios de stock en el tiempo
- Mejorar la responsabilidad operativa y la auditoría interna

## Fases detalladas de implementación

### Fase 1: Configuración del entorno base
- Instalar y configurar Node.js, npm y el entorno de desarrollo
- Inicializar el proyecto con Next.js para el frontend y NestJS para el backend
- Configurar PostgreSQL local y definir variables de entorno seguras
- Crear la estructura inicial del repositorio y la arquitectura de módulos

### Fase 2: Implementación del backend con NestJS y Prisma
- Crear módulos de autenticación, usuarios, materiales, movimientos y historial
- Definir modelos de base de datos y relaciones con Prisma
- Implementar migraciones y conexión segura con PostgreSQL
- Desarrollar servicios de entrada/salida con validación de stock y reglas de negocio
- Implementar JWT, Guards y control de acceso por roles
- Crear endpoints para consulta, trazabilidad y historial de inventario

### Fase 3: Implementación del frontend con Next.js y Tailwind CSS
- Crear la estructura de navegación y layout principal con Next.js App Router
- Desarrollar pantallas de login, dashboard, catálogo de materiales y formularios de movimiento
- Integrar Tailwind CSS para una interfaz limpia y funcional orientada a operaciones industriales
- Consumir los endpoints del backend con servicios organizados y manejo de estados
- Mostrar alertas, estados de carga y mensajes de error en operaciones críticas

### Fase 4: Integración, validación y estabilización
- Conectar frontend y backend en entorno local
- Validar el flujo completo de entrada y salida de inventario
- Verificar la consistencia del stock y la trazabilidad de cada movimiento
- Revisión de permisos por rol y protección de rutas
- Preparar pruebas de integración y ajustes finales de estabilidad
