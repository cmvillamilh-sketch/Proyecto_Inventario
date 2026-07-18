# Especificación 03: Requisitos Funcionales

## RF01 - Registro de material
El sistema debe permitir crear, consultar, editar y eliminar materiales de mantenimiento con la siguiente información mínima:
- código único del material, generado automáticamente o validado contra duplicados
- descripción detallada del repuesto o insumo
- categoría o familia de material
- unidad de medida
- stock actual
- stock mínimo configurado
- ubicación física del material, definida por pasillo, estante y cajón
- marca o fabricante

Reglas de negocio:
- El código debe ser único en toda la base de datos
- No se permiten materiales sin descripción o categoría válida
- La ubicación física debe poder actualizarse en cualquier momento

## RF02 - Registro de entrada
El sistema debe permitir registrar entradas de inventario para incrementar el stock de un material.

Requisitos funcionales:
- Solo un usuario con rol de Coordinador podrá registrar entradas
- La operación debe validar que la cantidad sea mayor a cero
- La transacción debe ejecutarse de forma atómica
- Cada entrada debe registrarse obligatoriamente en el historial de auditoría

## RF03 - Registro de salida
El sistema debe permitir registrar salidas de inventario para disminuir el stock de un material.

Requisitos funcionales:
- Los usuarios con rol de Técnico y Coordinador podrán registrar salidas
- La operación debe validar disponibilidad suficiente antes de ejecutar el movimiento
- La transacción debe ejecutarse de forma atómica
- Cada salida debe registrarse obligatoriamente en el historial de auditoría

## RF04 - Validación de stock negativo
El sistema debe impedir cualquier movimiento que deje el inventario en saldo negativo.

Comportamiento esperado:
- Si un Técnico intenta retirar más unidades de las disponibles, la transacción debe bloquearse
- El sistema debe mostrar un mensaje de error claro y explícito
- Si existe stock del mismo material en otra ubicación o almacén, el sistema debe sugerir dicha ubicación como alternativa
- No debe permitirse registrar la salida si la operación compromete la integridad del inventario

## RF05 - Trazabilidad de movimientos
Todo movimiento de inventario debe generarse con trazabilidad completa y persistirse en un registro de auditoría.

El sistema debe registrar, como mínimo, las siguientes columnas del log:
- ID del movimiento
- ID del usuario responsable
- fecha y hora del servidor
- cantidad anterior
- cantidad nueva
- tipo de movimiento (entrada o salida)
- material afectado
- motivo o referencia de la operación

## RF06 - Consulta de inventario y alertas visuales
El sistema debe permitir consultar el stock disponible de cualquier material en tiempo real.

Además, debe mostrar alertas visuales cuando el stock actual sea igual o menor al stock mínimo configurado:
- color amarillo para stock en nivel de alerta
- color rojo para stock crítico o por debajo del mínimo
- la interfaz debe resaltar visualmente el estado del material para facilitar la toma de decisiones operativas

## RF07 - Historial de movimientos
El sistema debe permitir consultar el historial de movimientos por material, por usuario y por rango de fechas.

Requisitos funcionales:
- Se debe mostrar la información completa del movimiento
- La consulta debe ser accesible desde la interfaz principal o desde la vista de detalle del material
- El historial debe ser consistente con la tabla de auditoría del sistema

## RF08 - Gestión de usuarios y roles
El sistema debe implementar autenticación segura y control de acceso basado en roles (RBAC).

Comportamiento esperado:
- El usuario debe iniciar sesión con credenciales válidas mediante un proceso seguro
- El sistema debe validar autenticación mediante JWT y proteger rutas con Guards
- El menú principal debe ocultar o mostrar opciones según el rol autenticado
- Técnico: acceso a consulta de stock, ubicación física, registro de salidas y vistas básicas de historial
- Coordinador: acceso adicional a registro de entradas, gestión de materiales y reportes operativos
- Administrador: acceso a administración de usuarios, configuración de permisos y supervisión del sistema

## RF09 - Frontend con Next.js y diseño industrial
La interfaz de usuario debe implementarse con Next.js utilizando el App Router y Tailwind CSS, garantizando una experiencia web moderna, clara y funcional para operaciones industriales.

## RF10 - Concurrencia segura
El sistema debe prevenir inconsistencias cuando dos o más transacciones afectan simultáneamente el mismo material.

Requisitos funcionales:
- Las operaciones de stock deben ejecutarse mediante transacciones seguras
- El sistema debe evitar condiciones de carrera sobre el mismo registro
- En caso de conflicto, debe responder con una excepción controlada y conservar la consistencia del inventario

## Fases detalladas de entrega

### Fase 1: Configuración del entorno local
- preparar el entorno de desarrollo con Node.js, Next.js, NestJS, Prisma y PostgreSQL
- configurar el repositorio y la estructura base del proyecto
- documentar variables de entorno y scripts locales de arranque

### Fase 2: Construcción del backend
- implementar autenticación segura con JWT y roles
- crear CRUD de usuarios y materiales
- implementar transacciones de entrada y salida con validación de stock
- registrar trazabilidad y auditoría en cada movimiento
- exponer API REST protegida para consumo del frontend

### Fase 3: Construcción del frontend en Next.js
- crear la pantalla de login y protección de rutas
- desarrollar el dashboard principal con alertas visuales de stock
- implementar el catálogo, los formularios de movimiento y la vista de ubicación física
- crear vistas de historial y auditoría
- conectar la interfaz con el backend para operaciones reales

### Fase 4: Validación del sistema
- ejecutar pruebas de flujo principal de entrada y salida
- validar control de permisos por rol y visibilidad del menú
- revisar concurrencia sobre un mismo material
- confirmar que cada operación deja registro auditable, consistente y con trazabilidad completa
