# PRD — ManteStock

## Servilleta

> Un técnico o coordinador de mantenimiento industrial necesita saber con certeza qué stock de repuestos existe y quién movió qué, pero se enfrenta a un control basado en hojas de Excel y mensajes de WhatsApp sin una fuente única de verdad, lo que provoca compras duplicadas, salidas sin registrar y pérdida de trazabilidad ante auditorías.

## Objetivo general

Centralizar el control de inventario de mantenimiento industrial en una única fuente de verdad, con trazabilidad completa de cada movimiento y control de acceso por rol, reemplazando el registro manual disperso.

## Usuarios principales

| Rol | Qué hace en el sistema |
|---|---|
| **Técnico** | Consulta stock, registra entradas/salidas/ajustes, gestiona el catálogo de materiales. |
| **Coordinador de compras** | Mismo acceso funcional que Técnico (no hay restricciones de rol adicionales sobre Materiales/Inventario en esta versión — ver `specs/spec-autenticacion.md`). |
| **Administrador** | Todo lo anterior, más gestión de cuentas de usuario (crear, activar/desactivar, resetear contraseña, asignar rol). |

## Matriz MoSCOW

### Must (imprescindible — entregado y verificado)
- Catálogo de materiales (alta, baja, edición, consulta, búsqueda por código/descripción).
- Registro de entradas, salidas y ajustes de inventario, con validación de stock y transacción atómica.
- Autenticación con JWT, bloqueo por intentos fallidos, permisos diferenciados por rol.
- Trazabilidad completa: historial por material y por usuario, filtros por fecha/tipo/responsable, registros inmutables.
- Dashboard con indicadores generales y materiales en stock bajo.

### Should (importante, quedó pendiente)
- Pantalla de gestión de usuarios en el frontend (crear/editar/resetear contraseña/desactivar) — hoy solo existe por API.
- Soporte de stock en unidades decimales/fraccionadas (kg, litros).
- Reemplazar el `JWT_SECRET` de desarrollo por un secreto real antes de cualquier despliegue.

### Could (deseable si sobra tiempo)
- Bloquear que un administrador se autodegrade de rol (hoy solo está bloqueada la autodesactivación).
- Documentación de API tipo OpenAPI/Swagger.
- Exportar historial de movimientos a PDF/Excel.

### Won't (fuera de alcance de esta versión, decisión consciente)
- **Módulo de Notificaciones** (alertas de stock mínimo, movimientos críticos) — descartado explícitamente el 21/07/2026.
- Integración con ERP o proveedores externos.
- Pasarelas de pago electrónico (Nequi, tarjetas).
- Automatización de mensajería (WhatsApp, SMS).
- Facturación legal avanzada.
- Operación multi-sucursal o almacenamiento offline.
- Aplicación móvil nativa.
- Analytics avanzados / reportes históricos.

## Módulos del sistema (detalle en `specs/`)

1. Catálogo de materiales
2. Inventario y movimientos
3. Autenticación y usuarios
4. Trazabilidad y auditoría
5. Consulta y dashboard

## Estado de entrega

Los 5 módulos del alcance (Must) están completos y verificados con evidencia real (colecciones de Postman con tests automáticos y pruebas manuales en navegador) — ver `CLAUDE.md` para el detalle checkpoint por checkpoint y `ManteStock-avance-proyecto.html` para el resumen de porcentajes.
