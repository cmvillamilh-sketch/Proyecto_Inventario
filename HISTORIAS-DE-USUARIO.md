# Historias de Usuario — ManteStock

Formato: `Como [Rol], quiero [Acción], para [Beneficio]`, con criterios de aceptación `Dado / Cuando / Entonces`. Todas verificadas contra el comportamiento real del sistema (Postman + navegador), no aspiracionales.

---

## HU01 — Iniciar sesión

**Como** usuario del sistema, **quiero** iniciar sesión con usuario y contraseña, **para** acceder a las funciones según mi rol.

- **Dado** un usuario y contraseña correctos, **cuando** envío el formulario de login, **entonces** el sistema me redirige al dashboard con una sesión activa.
- **Dado** que fallo el login 2 veces seguidas, **cuando** intento una tercera vez con la clave correcta antes de 5 minutos, **entonces** el sistema me rechaza igual, por bloqueo temporal.

## HU02 — Registrar un material

**Como** técnico o coordinador, **quiero** registrar un material nuevo en el catálogo, **para** poder controlar su stock desde el primer momento.

- **Dado** un código que no existe todavía, **cuando** completo el formulario y guardo, **entonces** el material se crea con stock actual en 0.
- **Dado** un código ya registrado, **cuando** intento crear otro material con el mismo código, **entonces** el sistema lo rechaza y no se duplica.

## HU03 — Buscar un material

**Como** técnico, **quiero** buscar un material por código o descripción, **para** encontrarlo rápido sin recorrer todo el catálogo.

- **Dado** un texto parcial que coincide con el código o la descripción de varios materiales, **cuando** busco, **entonces** veo solo esos materiales, sin importar mayúsculas o minúsculas.

## HU04 — Registrar una salida de material

**Como** técnico, **quiero** registrar la salida de un material que usé, **para** que el stock quede actualizado y quede constancia de quién lo retiró.

- **Dado** un material con stock disponible suficiente, **cuando** registro una salida por esa cantidad, **entonces** el stock disminuye exactamente en esa cantidad y el movimiento queda registrado con mi usuario.
- **Dado** un material con stock insuficiente, **cuando** intento registrar una salida mayor al disponible, **entonces** el sistema la rechaza y el stock no cambia.

## HU05 — Registrar una entrada de material

**Como** técnico o coordinador, **quiero** registrar la llegada de material nuevo, **para** que el stock refleje la reposición.

- **Dado** un material existente, **cuando** registro una entrada, **entonces** el stock aumenta exactamente en la cantidad ingresada.

## HU06 — Consultar el historial de movimientos

**Como** técnico o coordinador, **quiero** ver el historial completo de movimientos, **para** entender cómo llegó el inventario a su estado actual.

- **Dado** que existen movimientos registrados, **cuando** entro a la sección de inventario, **entonces** veo cada uno con fecha, material, tipo, cantidad, motivo y responsable.

## HU07 — Filtrar el historial

**Como** técnico o coordinador, **quiero** filtrar el historial por material, responsable, tipo o rango de fechas, **para** auditar rápido sin revisar todo el historial manualmente.

- **Dado** varios movimientos de distintos materiales y usuarios, **cuando** filtro por un material y un responsable a la vez, **entonces** solo veo los movimientos que cumplen ambas condiciones.
- **Dado** un rango de fechas de un solo día, **cuando** filtro "desde" y "hasta" ese mismo día, **entonces** veo todos los movimientos de ese día completo.

## HU08 — Intentar modificar un movimiento

**Como** cualquier usuario (incluido administrador), **quiero** que el sistema impida editar o borrar un movimiento ya registrado, **para** que el historial sea confiable para una auditoría.

- **Dado** un movimiento ya guardado, **cuando** intento editarlo o eliminarlo, **entonces** el sistema lo rechaza siempre, sin excepción de rol.

## HU09 — Consultar el dashboard

**Como** técnico, coordinador o administrador, **quiero** ver un resumen general del inventario al entrar al sistema, **para** identificar de un vistazo qué materiales necesitan reposición.

- **Dado** que hay materiales cuyo stock actual llegó a su mínimo o está por debajo, **cuando** entro al dashboard, **entonces** los veo listados aparte, junto con los indicadores generales (total de materiales, unidades totales en stock, cantidad en stock bajo).

## HU10 — Gestionar usuarios (administrador)

**Como** administrador, **quiero** ver la lista de usuarios del sistema, **para** saber quién tiene acceso y con qué rol.

- **Dado** que soy administrador, **cuando** entro a la sección Usuarios, **entonces** veo el listado completo con nombre de usuario, rol y estado (activo/inactivo).
- **Dado** que soy técnico o coordinador, **cuando** intento entrar a la sección Usuarios por la URL directa, **entonces** el sistema me redirige y no me deja ver nada.

## HU11 — Protección contra autobloqueo (administrador)

**Como** administrador, **quiero** que el sistema me impida desactivar mi propia cuenta, **para** no dejar el sistema sin ningún administrador activo por error.

- **Dado** que soy el administrador autenticado, **cuando** intento desactivar mi propia cuenta, **entonces** el sistema rechaza la acción.
