# CLAUDE.md — ManteStock

Este archivo se lee automáticamente al iniciar una sesión de Claude Code en este repositorio. Contiene el contexto necesario para continuar el proyecto sin perder continuidad entre sesiones.

---

## Arquitectura

- Monorepo (npm Workspaces)
- Backend: NestJS + TypeORM — corre localmente (`npm run start:dev`), **puerto 3001** (hardcodeado en `main.ts`, sin variable de entorno). No está containerizado.
- Frontend: Next.js 14 (App Router) — corre localmente, típicamente puerto 3000.
- PostgreSQL 16 — el único servicio containerizado (`docker-compose.yml`, contenedor `mante-stock-postgres`, puerto `5432` por defecto, variable `POSTGRES_PORT`).

**Importante para pruebas en Postman:** el backend NO responde en `localhost:3000` (ese puerto lo ocupa el frontend). Usar siempre `http://localhost:3001` como base URL para la API.

---

## Metodología (NO CAMBIAR)

Análisis → Diseño → Implementación → Revisión → Validación → Checkpoint

Cada checkpoint se valida antes de avanzar al siguiente.

---

## Roles (actualizado 18/07/2026)

- **Claude** (chat / conversación de arquitectura) → Arquitectura, planeación, auditoría, revisión, validación, documentación.
- **Claude (VS Code)** → Implementación, refactorizaciones pequeñas, generación de código bajo instrucciones precisas.
- **Gemini** → Segunda opinión cuando sea necesario.

ChatGPT y GitHub Copilot ya no forman parte del flujo de trabajo.

---

## Estado actual del proyecto

**Checkpoint alcanzado: 007.5 ✅ (módulo de Autenticación y usuarios completo, backend + frontend, validado en navegador el 21/07/2026)**

Pruebas realizadas y confirmadas:
- `/inventory-movements` lista los movimientos con todas las columnas (fecha, material, tipo, cantidad, motivo, stock actual), sin acciones de editar/eliminar.
- `/inventory-movements/new` carga el dropdown de materiales con stock real (sin caché, tras la corrección de `router.refresh()`).
- Crear un `ENTRY` válido redirige a la lista y la nueva fila aparece de inmediato.
- Intentar un `EXIT` con cantidad mayor al stock disponible mantiene al usuario en el formulario y muestra el mensaje real del backend (`Insufficient stock`), sin pantalla de error de Next.js.
- Corrección de bug aplicada y verificada: `router.refresh()` agregado antes de `router.push()` en `InventoryMovementForm.tsx` y `MaterialForm.tsx` (el router cache del cliente servía datos obsoletos tras crear un registro).

**Módulo Inventory Movements: completo (backend + frontend). Módulo Material: completo, con dos correcciones de bugs aplicadas y documentadas.**

Corrección aplicada y verificada (19/07/2026): se agregó `ParseUUIDPipe` en los parámetros `:id` de `InventoryMovementsController` y `MaterialsController`. Un id con formato inválido ahora responde `400 Bad Request` ("Validation failed (uuid is expected)") en vez de `500 Internal server error`.

### Módulo Material — ✅ COMPLETADO
Congelado como módulo de referencia. **No modificar salvo corrección de bugs.**

**Corrección aplicada (18/07/2026):** se detectó que `code` permitía duplicados, contradiciendo la restricción de unicidad del modelo de datos original. Se agregó `@Column({ unique: true })` en la entidad `Material`, y `MaterialsService.create()` ahora captura la violación de unique constraint de Postgres (23505) y la relanza como `ConflictException('Ya existe un material con ese code')` (409). Verificado en Postman.

**Corrección aplicada (19/07/2026):** se detectó que ni `InventoryMovementForm.tsx` ni `MaterialForm.tsx` invalidaban el router cache del cliente tras crear un registro (`force-dynamic` en la página no es suficiente al navegar con `router.push()`). Se agregó `router.refresh()` antes del `push()` en ambos formularios.

### Módulo Inventory Movements — ✅ COMPLETADO (backend + frontend)

| Elemento | Estado |
|---|---|
| Entity `InventoryMovement` | ✅ |
| Enum `MovementType` (ENTRY, EXIT, ADJUSTMENT) | ✅ |
| DTOs (`CreateInventoryMovementDto`, `UpdateInventoryMovementDto`) | ✅ |
| Module | ✅ |
| Service — `findAll()`, `findOne()`, `create()` (con transacción) | ✅ |
| Service — `update()`/`remove()` | ✅ bloqueados por diseño (`ForbiddenException`, inmutabilidad) |
| Controller (POST, GET, GET por ID — sin PUT/DELETE) | ✅ |
| Frontend (listado y alta) | ✅ |

---

## Reglas de negocio — Inventory Movements

- **Material**: responsabilidad exclusiva del catálogo. No conoce reglas de inventario.
- **InventoryMovement**: responsable exclusivo del historial de movimientos. Toda modificación de stock debe pasar por este módulo.
- **Transacciones**: toda modificación de inventario usa `DataSource.transaction()`. No se actualiza stock fuera de una transacción.
- **calculateNewStock()** (método privado centralizado):
  - `ENTRY` → `nuevoStock = stockActual + cantidad`
  - `EXIT` → valida `cantidad <= stockActual` (si no, `BadRequestException`), luego `nuevoStock = stockActual - cantidad`
  - `ADJUSTMENT` → el nuevo stock es exactamente el valor recibido (no calcula diferencias)

---

## Reglas para continuar (obligatorias)

- No cambiar la metodología.
- Prompts pequeños y precisos para la implementación.
- La arquitectura se define primero (rol Claude), luego se implementa (rol Claude VS Code).
- Validar cada checkpoint antes de avanzar.
- No modificar Material salvo corrección de errores.
- Todo cambio de stock debe realizarse mediante `InventoryMovement`.
- Toda modificación de inventario debe ejecutarse dentro de una transacción.

---

## Módulo de trazabilidad y auditoría — desglose preciso (19/07/2026)

Fuente literal: `05-modulos-del-sistema.md` y `gemini-code-1784071345471.md` (sección 9). Cuatro funciones especificadas, cada una vale 25% del módulo:

| Función especificada | Estado | % |
|---|---|---|
| Historial de movimientos por material | ✅ Completo (checkpoint 008) — `GET /inventory-movements?materialId=` | 25% |
| Historial de movimientos por usuario | ✅ Completo (checkpoint 008) — `GET /inventory-movements?createdBy=` | 25% |
| Filtros por fecha, tipo y responsable | ✅ Completo (checkpoint 008) — `?type=`, `?dateFrom=`, `?dateTo=`, combinables entre sí | 25% |
| Registros inmutables | Completo — verificado en dos capas: el controller no expone PUT/DELETE, y el service los rechaza con `ForbiddenException` si se invocan directamente | 25% |

**Total del módulo: 100% ✅ (cerrado el 21/07/2026, checkpoint 008)**.

## Checkpoint 008 — verificado (21/07/2026)

Backend validado con colección de Postman (`postman/ManteStock-008-Filters.postman_collection.json`, 10 requests) — todos en verde: filtro por `materialId` (exactamente los movimientos de ese material), por `createdBy` (coincidencia exacta), por `type`, por rango de fecha (`dateFrom`/`dateTo` incluyendo el día completo), y combinación de filtros. Frontend validado en navegador: columna "Responsable" visible en la tabla, formulario de filtros (`<form method="GET">`) cambia la URL con los query params correctos, "Limpiar filtros" vuelve a la lista completa. Pendiente de commitear.

---

## Checkpoint 008 — Trazabilidad y auditoría (arquitectura, 21/07/2026)

Completa las 3 funciones pendientes del módulo (ver desglose de 19/07/2026 más abajo): historial por material, historial por usuario, filtros por fecha/tipo/responsable. Las tres se resuelven con un solo mecanismo: `GET /inventory-movements` acepta query params opcionales (`materialId`, `type`, `createdBy`, `dateFrom`, `dateTo`). No se crea un endpoint aparte tipo `/materials/:id/movements` — un único endpoint filtrable cubre las tres funciones de la especificación.

Decisiones:
1. **`createdBy` como filtro**: coincidencia exacta (no búsqueda parcial), igual que el resto de la app no tiene búsquedas difusas en ningún lado todavía.
2. **`dateFrom`/`dateTo`**: se interpretan como fecha (no fecha+hora). `dateFrom` se ajusta a las 00:00:00 del día y `dateTo` a las 23:59:59.999, para que un filtro "de tal día a tal día" incluya el día completo (los `<input type="date">` del navegador solo mandan `YYYY-MM-DD`).
3. **Frontend**: formulario `<form method="GET">` nativo sobre `/inventory-movements`, sin JavaScript ni Client Component — al enviar, cambia la URL con los query params y el Server Component se re-renderiza filtrado. Consistente con el patrón `force-dynamic` que ya usa esta página.
4. **Alcance por rol**: sin cambios — el endpoint sigue abierto a cualquier usuario autenticado (no se agregó `@Roles()` aquí, misma decisión que en 007.3 para Materials/InventoryMovements).

## Decisión de alcance (21/07/2026)

**Módulo de Notificaciones: fuera del alcance de esta entrega.** Decisión explícita del usuario. Queda documentado como descartado, no como pendiente — no debe volver a aparecer en la lista de "próximos pasos" salvo que se reconsidere explícitamente. El alcance del MVP para la entrega del jueves queda en 5 módulos: Autenticación, Materiales, Inventory Movements, Trazabilidad/auditoría, y Consulta/Dashboard.

## Checkpoint 009 — Consulta y Dashboard (arquitectura, 21/07/2026)

Fuente literal: `05-modulos-del-sistema.md` y `gemini-code-1784071345471.md` (sección "Módulo de Consulta y Dashboard"). Funciones especificadas: vista general de stock, búsqueda y filtros de materiales, indicadores básicos (materiales con stock bajo).

Diseño:
1. **Backend — `GET /materials/summary`** (nuevo endpoint, mismo controller/service de Materials): devuelve `{ totalMaterials, totalStockUnits, lowStockCount, lowStockMaterials: Material[] }`. "Stock bajo" se define como `currentStock <= minimumStock` (no solo `<`, para que el punto exacto del mínimo ya cuente como alerta). **Debe declararse antes que `@Get(':id')` en el controller** — si no, Nest intenta interpretar "summary" como el `:id` y `ParseUUIDPipe` lo rechaza con 400.
2. **Backend — búsqueda en `GET /materials`**: acepta un query param opcional `search` (código o descripción, `ILike` parcial, no distingue mayúsculas/minúsculas). Esta función está especificada tanto en el módulo de catálogo de materiales como en el de Consulta/Dashboard — se implementa una sola vez en `GET /materials`, cubre ambas menciones de la especificación.
3. **Excepción al congelamiento de Material**: igual que con `createdBy` en 007.4, se toca `MaterialsController`/`MaterialsService` (módulo "congelado") porque la función está explícitamente pedida por la especificación de este checkpoint, no es una mejora fuera de alcance.
4. **Frontend — `/` pasa a ser el dashboard real**, reemplazando el placeholder estático. Vista con: tarjetas de indicadores (total de materiales, unidades totales en stock, cantidad con stock bajo) y una tabla de materiales con stock bajo.
5. **Cambio de decisión de 007.5**: la redirección post-login cambia de `/materials` a `/` (antes `/` era un placeholder sin contenido real, ahora es el dashboard — tiene sentido que sea el destino natural tras iniciar sesión). Se agrega un link "Dashboard" a la barra de navegación en `app/layout.tsx`.
6. **Búsqueda de materiales en el frontend**: se agrega un campo de búsqueda en `/materials` (mismo patrón `<form method="GET">` sin JavaScript que ya se usa en los filtros de `/inventory-movements`), no en el dashboard — tiene más sentido de uso ahí.

## Checkpoint 009 — verificado (21/07/2026)

Backend validado con colección de Postman (`postman/ManteStock-009-Dashboard.postman_collection.json`, 4 requests) — todos en verde: `GET /materials/summary` no lo confunde con `:id` (orden de rutas correcto), `lowStockCount` coincide con el largo del array, todos los `lowStockMaterials` cumplen `currentStock <= minimumStock`, la búsqueda parcial funciona sin distinguir mayúsculas, y una búsqueda sin resultados devuelve array vacío sin romper. Frontend validado en navegador: login redirige a `/` (dashboard) con las 3 tarjetas y la tabla de stock bajo, link "Dashboard" en la nav, búsqueda en `/materials` cambia la URL y filtra, "Limpiar" vuelve a la lista completa. Pendiente de commitear.

## Checkpoint 011 — Valor monetario de materiales (arquitectura, 24/07/2026)

Solicitado explícitamente por el profesor tras la presentación: los materiales deben tener un valor monetario, para que ante un intercambio (trueque de materiales entre áreas/proveedores) se pueda saber cuánto dinero se está entregando y cuánto se puede pedir a cambio.

Decisiones tomadas (usuario, 24/07/2026):

1. **Tipo de dato:** `unitValue` como entero (pesos colombianos, sin centavos) — consistente con que el resto de cantidades del sistema (`currentStock`, `minimumStock`, `quantity`) ya son `int`.
2. **Obligatoriedad:** opcional/`nullable`. Los 90 materiales ya cargados (checkpoint de carga de inventario, 22/07/2026) quedan con `unitValue: null` hasta que se editen; no se les asigna 0 automáticamente para no confundir "sin valor definido" con "vale cero".
3. **Dónde se muestra:**
   - Dashboard: nueva tarjeta "Valor total del inventario" = suma de `currentStock × (unitValue ?? 0)` de todos los materiales.
   - Tabla de Materiales: nueva columna con el valor unitario formateado como moneda (`—` si es `null`).
   - Formulario de registrar movimiento: al elegir un material y escribir una cantidad, se muestra en vivo el valor estimado de ese movimiento (`cantidad × unitValue` del material seleccionado) — cálculo del lado del cliente, sin llamada adicional al backend, para que el usuario sepa cuánto está entregando (EXIT) o cuánto está pidiendo (ENTRY) en un intercambio.

**Fuera de alcance de este checkpoint:** no se persiste el valor dentro de cada `InventoryMovement` (no hay "snapshot" histórico del valor al momento del movimiento) — si el valor unitario de un material cambia después, el historial no se ve afectado retroactivamente porque no guarda el valor, solo la cantidad. Se documenta como posible mejora futura si se necesita ese nivel de auditoría financiera.

**Excepción al congelamiento de Material:** igual que con `createdBy` (007.4) y `search`/`summary` (009), se vuelve a tocar el módulo "congelado" porque la función está explícitamente pedida, no es una mejora fuera de alcance.

**Estado:** implementado por Claude Code (24/07/2026) y verificado contra el código real (entidad, DTO, service, tipos de frontend, `MaterialForm.tsx`, `MaterialRow.tsx`/`MaterialTable.tsx`, dashboard, `InventoryMovementForm.tsx`) — coincide exactamente con el diseño de arriba, sin desviaciones a las reglas de negocio (`currentStock` sigue sin editable, `InventoryMovement` sin campos nuevos, sin `@Roles()` agregado). `tsc --noEmit` pasó limpio en backend y frontend. **Verificado en navegador (24/07/2026):** se editaron dos materiales (`103005` stock 6, `103011` stock 22) asignándoles `unitValue: 5000`. La tabla de Materiales mostró "$ 5.000" en ambos y "—" en el resto (sin valor definido). La tarjeta "Valor total del inventario" del Dashboard mostró $140.000, que coincide exactamente con el cálculo esperado (6×5000 + 22×5000 = 140.000) — confirma que `totalInventoryValue` no solo suma valores unitarios, sino que pondera correctamente por `currentStock` de cada material. Verificado también el estimado en vivo del formulario de movimiento con un material sin valor definido: muestra "Valor estimado: no disponible (material sin valor unitario definido)", no "$0" — distingue correctamente "sin definir" de "vale cero". **Pendiente:** colección de Postman y commitear.

## Checkpoint 012 — Rediseño visual: sidebar tipo SaaS (arquitectura, 24/07/2026)

Decisión del usuario, tras revisar 3 propuestas visuales (sidebar SaaS oscuro, industrial oscuro denso, corporativo claro con color): se elige el **sidebar SaaS**. Reemplaza el patrón de navegación horizontal (`app/layout.tsx`, del checkpoint 010) por un menú lateral fijo, oscuro, con iconos — sin tocar lógica de negocio ni rutas.

Decisiones de diseño (24/07/2026):

1. **Librería de iconos:** `lucide-react` (nueva dependencia del frontend) — liviana, se integra bien con Tailwind, no requiere configuración adicional.
2. **Estructura:** `app/layout.tsx` pasa a renderizar un layout de dos columnas: `<aside>` fijo (sidebar oscuro, ancho ~224px) + área de contenido a la derecha con una barra superior (usuario/rol + cerrar sesión) y el contenido de cada página debajo.
3. **Nuevo componente:** `components/layout/Sidebar.tsx` (Client Component, usa `usePathname` para resaltar la ruta activa) — se extrae del `layout.tsx` porque éste sigue siendo Server Component (necesita `getServerAuth()`). El layout le pasa `role` como prop para decidir si muestra el link "Usuarios" (solo ADMIN, misma regla ya existente).
4. **Iconos por sección del menú:** Dashboard (`LayoutDashboard`), Materiales (`Package`), Inventario (`ClipboardList`), Usuarios (`Users`).
5. **Dashboard (`app/page.tsx`):** cada tarjeta de indicador agrega un ícono dentro de un círculo de color (Materiales = azul, Unidades en stock = teal/verde, Stock bajo = ámbar, Valor del inventario = verde), replicando la propuesta elegida.
6. **Responsive:** fuera de alcance por ahora — el sidebar queda fijo, sin menú hamburguesa para móvil (la app se usa en escritorio). Se documenta como mejora futura si se necesita.

Es un cambio **puramente visual y de navegación** — no debe tocar llamadas a servicios, nombres de campos, ni lógica de ningún formulario o tabla ya construidos.

**Estado:** implementado por Claude Code (25/07/2026) y verificado contra el código real. Archivos tocados, confirmados por diff: `apps/frontend/components/layout/Sidebar.tsx` (nuevo), `apps/frontend/app/layout.tsx` (layout de dos columnas), `apps/frontend/app/page.tsx` (íconos en las 4 tarjetas), `apps/frontend/package.json` + `package-lock.json` (dependencia `lucide-react`). Ningún `*.service.ts`, formulario ni tabla existente fue modificado — confirmado por `git status` scoped. `npx tsc --noEmit` pasó limpio.

**Hallazgo menor, no bloqueante:** cada página sigue renderizando su propio `<main>`, que ahora queda anidado dentro del `<main className="flex-1">` de `layout.tsx` — dos elementos `<main>` anidados es inválido según el spec de HTML (un solo landmark por página). Es puramente semántico/accesibilidad, no visible para el usuario. Pendiente: cambiar el `<main>` interno de cada página por `<div>` en un follow-up menor.

**Pendiente:** verificación en navegador (ruta activa resaltada, link "Usuarios" oculto para no-admin, íconos, logout) y commit/push.

## Checkpoint 013 — Gráficas en el Dashboard (arquitectura, 25/07/2026)

Decisión del usuario, tras revisar 3 opciones de layout (torta+barras lado a lado, barra ancha+torta pequeña, donut+barras de stock crítico): se elige la **opción 2** — barra horizontal ancha de "Valor del inventario por categoría" + torta pequeña de "Distribución de materiales por categoría", en una fila nueva debajo de las 4 tarjetas existentes.

Decisiones de diseño (25/07/2026):

1. **Dato nuevo requerido — backend:** `GET /materials/summary` (mismo endpoint de checkpoint 009) se extiende con dos arrays nuevos:
   - `valueByCategory: { category: string; totalValue: number }[]` — suma de `currentStock × (unitValue ?? 0)` agrupada por `category`, ordenada de mayor a menor.
   - `materialCountByCategory: { category: string; count: number }[]` — cantidad de materiales por `category`.
   Se calcula en `MaterialsService.getSummary()` sobre el mismo array de materiales que ya se trae para `totalInventoryValue` — no es una query nueva a la base, es agregación en memoria sobre datos ya cargados.
2. **Librería de gráficas:** `chart.js` (sin `react-chartjs-2`, para no sumar una dependencia extra) — se usa directo con `useRef`+`useEffect` en un Client Component nuevo.
3. **Nuevo componente:** `components/dashboard/CategoryCharts.tsx` (Client Component, recibe `valueByCategory` y `materialCountByCategory` como props desde `app/page.tsx`, que sigue siendo Server Component). Contiene dos `<canvas>`: barra horizontal (`type: 'bar'`, `indexAxis: 'y'`) y torta (`type: 'pie'`).
4. **Ubicación:** nueva fila (`grid-template-columns: 2fr 1fr`, igual proporción que la opción elegida) debajo de la sección de tarjetas y antes de la tabla "Materiales con stock bajo".
5. **Categorías sin materiales o con `unitValue` nulo en todos sus materiales:** igual se incluyen en `materialCountByCategory` (cuentan materiales), pero su `totalValue` en `valueByCategory` da 0 — no se excluyen del array, así la torta y la barra siguen sumando el 100% de los materiales/valor real.

Es un cambio que sí toca el backend (`MaterialsService`, dentro del módulo "congelado" — misma excepción ya usada en `createdBy`/`search`/`summary`/`unitValue`) y agrega una dependencia nueva al frontend (`chart.js`). No cambia ningún endpoint existente más allá de agregar campos a la respuesta de `/materials/summary` (no rompe compatibilidad, solo agrega).

## Checkpoint 014 — Rediseño de contenido estilo iOS (arquitectura, 25/07/2026)

Decisión del usuario, tras revisar 5 mockups (3 "profesionales genéricos" descartados, 3 estilo iOS, combinación de 2 confirmada con el sidebar real): el **sidebar oscuro del checkpoint 012 se mantiene sin cambios** (estructura, ancho, colores, lógica de rol). Lo que cambia es únicamente el **contenido de `/` (dashboard)**, adoptando lenguaje visual iOS.

Decisiones de diseño (25/07/2026):

1. **Tipografía:** `font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', system-ui, sans-serif` en el área de contenido (no en el sidebar, que se queda como está). Se aplica vía una clase Tailwind custom o `style` inline en el contenedor del contenido — no se cambia la fuente global de toda la app, solo la del dashboard por ahora.
2. **Fondo del área de contenido:** `#F2F2F7` (gris "grouped list" de iOS) en vez de blanco — reemplaza el fondo blanco actual detrás de las tarjetas.
3. **Tarjetas de indicadores (4):** pasan de "borde gris fino" a `border-radius: 16px`, sin borde, fondo blanco sólido, con un círculo de color de fondo pastel detrás del ícono (mismo ícono lucide-react que ya existe, tamaño 18px). La tarjeta de "Valor total del inventario" usa un fondo con gradiente azul (`linear-gradient(180deg, #32ADE6, #0A84FF)`) y texto blanco — es la única tarjeta con tratamiento especial, para que destaque como el dato más importante del pedido del profesor.
4. **"Materiales con stock bajo":** dej a de ser una tabla HTML y pasa a ser una lista agrupada estilo iOS Ajustes — filas con ícono cuadrado redondeado (`border-radius: 7px`) de color ámbar, nombre + código del material, cantidad actual/mínima a la derecha, separador `0.5px solid #E5E5EA` entre filas (excepto la última), sin separador en la última fila. Mismo dato (`summary.lowStockMaterials`), solo cambia el marcado.
5. **Sección "Valor por categoría" (del checkpoint 013):** el `<canvas>` de Chart.js se reemplaza por una lista de barras horizontales simples hechas con `<div>` (no Chart.js) dentro de una tarjeta blanca redondeada — más fiel al estilo iOS y evita competir visualmente con el gráfico de barras de Chart.js que se ve "muy web". La torta de "Distribución de materiales por categoría" (también de 013) se mantiene aparte, sin cambios, o se decide en la implementación si conviene quitarla por redundancia con la lista de barras — **queda a criterio de la implementación, no es una regla estricta**.
6. **Encabezados de sección** ("MATERIALES CON STOCK BAJO", "VALOR POR CATEGORÍA"): texto pequeño (12px), gris `#8E8E93`, mayúsculas, con letter-spacing sutil — patrón estándar de iOS para agrupar listas.
7. **Fuera de alcance de este checkpoint:** no se toca el sidebar, no se tocan las páginas de Materiales/Inventario/Usuarios (quedan con el estilo Tailwind del checkpoint 010), no se cambia la fuente de esas otras páginas.

**Hallazgo registrado durante la revisión de mockups (25/07/2026, no bloqueante):** la gráfica real de "Valor del inventario por categoría" muestra categorías como "PRUEBA", "clavo", "1" — parecen materiales de prueba creados durante verificaciones manuales anteriores, no categorías reales del catálogo. Sigue visible tras el rediseño (confirmado en la captura de verificación de este checkpoint). Pendiente: revisar y limpiar esos materiales de prueba de la base (tarea aparte, no forma parte de este checkpoint).

**Estado:** implementado por Claude Code (25/07/2026) y verificado. Código real revisado (`app/page.tsx`, `components/dashboard/CategoryCharts.tsx`) — coincide exactamente con el diseño: contenedor `#F2F2F7` + fuente `-apple-system`, tarjetas `rounded-2xl` sin borde con círculos pastel, tarjeta de valor con degradado azul, lista agrupada de stock bajo con separador `0.5px` (omitido en la última fila), barras de "Valor por categoría" hechas con `<div>` (sin Chart.js), torta de distribución conservada y restyleada. `git status --porcelain` confirmó el alcance exacto (solo `materials.service.ts`, `layout.tsx`, `page.tsx`, `package.json`, `types/material.ts`, `package-lock.json`, `components/dashboard/`, `components/layout/` — nada fuera de lo esperado). `npx tsc --noEmit` en `apps/frontend` sin salida (limpio). **Verificado en navegador (25/07/2026):** captura confirma sidebar intacto, dashboard con el nuevo look iOS, barras y torta funcionando con datos reales, lista de stock bajo con los 2 materiales esperados. **Pendiente:** commit/push (junto con checkpoints 012 y 013, que tampoco se han subido).

## Próximo objetivo

Checkpoints 007 (Autenticación), 008 (Trazabilidad y auditoría) y 009 (Consulta y Dashboard) completos y verificados — commits pendientes de confirmar.

**Los 5 módulos del alcance de esta entrega (Materiales, Inventory Movements, Autenticación, Trazabilidad/auditoría, Consulta/Dashboard) están al 100%.** Notificaciones queda descartado (decisión del 21/07/2026, no es un pendiente).

**Decisión (22/07/2026): se subió el trabajo a GitHub, pero en una rama, no a `main`.** Se detectó una discrepancia con la metodología del curso (bitácora del profesor Andrés Sánchez, `ManteStock_Backup_2026-07-15.md`): exige Gitflow — nunca commitear directo a `main`, siempre rama + Pull Request + Code Review. Los 13 commits que estaban solo en `main` local se movieron a la rama `feature/checkpoints-007-010`, ya pusheada a `origin/feature/checkpoints-007-010`. `origin/main` sigue intacto (solo el commit inicial) — el merge a `main` vía Pull Request queda pendiente, a decidir cuándo hacerlo.

---

## Módulo de Autenticación y usuarios — arquitectura (19/07/2026)

Fuente literal: `05-modulos-del-sistema.md`, `gemini-code-1784071345471.md` (secciones 9 y 10).

Especificación citada:
- Funciones: login, logout, registro de usuarios, control de permisos por rol, bloqueo por intentos fallidos, integración con frontend.
- Roles: técnico, coordinador de compras, admin.
- Regla: el admin crea/edita/elimina cuentas. Política de contraseñas (longitud/complejidad) + recuperación. Bloqueo de 2 intentos fallidos, 5 minutos.
- RF08: autenticación + permisos diferenciados por rol. RNF02: contraseñas cifradas (hash+salt). RNF03: acciones críticas (entradas/salidas) protegidas por rol.

Estado previo: `AuthModule` era un stub — `POST /auth/login` aceptaba cualquier credencial no vacía y devolvía un token falso fijo (`'demo-token'`). Sin entidad `User`, sin persistencia, sin guards.

### Diseño

**Entidad `User`**: `id` (uuid), `username` (único), `passwordHash` (bcrypt), `role` (enum `TECNICO`/`COORDINADOR`/`ADMIN`), `failedLoginAttempts` (int, default 0), `lockedUntil` (timestamp nullable), `isActive` (boolean, default true — soft-delete, no borrado físico).

**Endpoints**:
- `POST /auth/login` (pública) — valida credenciales, aplica bloqueo tras 2 intentos fallidos por 5 min, devuelve JWT.
- `POST /auth/logout` (requiere JWT) — logout simple: el frontend descarta el token, sin lista negra en servidor (decisión tomada, ver abajo).
- `POST /users`, `PATCH /users/:id`, `DELETE /users/:id` (soft), `GET /users` — todos `@Roles(ADMIN)`.
- Materials e Inventory Movements — pasan a requerir JWT (antes estaban completamente abiertos; lo exige RNF03).

**Guards**: `JwtAuthGuard` (autenticación) + `RolesGuard`/`@Roles()` (autorización por rol).

### Decisiones tomadas (19/07/2026)

1. **Recuperación de contraseña**: sin infraestructura de email en el proyecto — el admin resetea la contraseña manualmente en vez de flujo de autoservicio por correo.
2. **`createdBy`**: se agrega ahora a `Material` (excepción justificada al congelamiento, ya que este era el objetivo explícito de construir Auth) e `InventoryMovement`.
3. **Logout**: simple (el frontend descarta el token), sin lista negra de tokens en el servidor — suficiente para el alcance del MVP.

### Decisiones tomadas (21/07/2026) — para 007.3

1. **Política de contraseñas** (creación y reseteo de usuarios): mínimo 8 caracteres, con al menos una mayúscula, una minúscula y un número. No se exige carácter especial obligatorio.
2. **Auto-bloqueo de admin**: un admin autenticado NO puede desactivarse/eliminarse a sí mismo vía `DELETE /users/:id`. El service debe rechazar ese caso explícitamente (400/403) para evitar quedarse sin ningún admin activo.

### Decisión tomada (21/07/2026) — para 007.4

**`createdBy`**: se guarda como texto plano (el `username` capturado en el momento de crear el registro), no como relación FK a `User.id`. Evita joins y el riesgo de exponer `passwordHash` al popular la relación; suficiente para trazabilidad del MVP (RF05). La columna es `nullable: true` en ambas entidades porque `synchronize: true` no puede rellenar retroactivamente los materiales/movimientos ya existentes en la base — para esos registros antiguos, `createdBy` queda en `null` (creados antes de que existiera trazabilidad por usuario).

### Decisiones tomadas (21/07/2026) — para 007.5

1. **Hallazgo verificado antes de diseñar 007.5**: el frontend está roto en este momento. `materials.service.ts` e `inventory-movements.service.ts` nunca envían header `Authorization`, y desde 007.2 esos endpoints exigen JWT — cualquier carga de `/materials` o `/inventory-movements` da 401. 007.5 no es una mejora opcional, es lo que reconecta el frontend con el backend.
2. **Almacenamiento del token**: cookie simple (no httpOnly), no `localStorage`. Es la única opción viable sin reescribir las páginas de listado (Server Components con `force-dynamic`) a Client Components — `localStorage` no es accesible en servidor, y el middleware de rutas protegidas de Next.js tampoco puede leerlo. Trade-off aceptado y documentado: una cookie legible por JS es tan vulnerable a XSS como `localStorage` (no es httpOnly), suficiente para el alcance del MVP. Revisar si el proyecto llega a producción real.
3. **Alcance de "UI condicionada por rol"**: como ningún endpoint de Materials/InventoryMovements está protegido por rol todavía (ver nota de 007.3: `@Roles()` no se agregó ahí a propósito), lo único que el frontend puede condicionar honestamente por rol es el acceso a `/users`, que sí es admin-only en el backend. Se agrega una página de solo lectura (`/users`, sin crear/editar/resetear) visible solo para ADMIN en la navegación, más `username`/`role` visibles en el header. CRUD completo de usuarios desde el frontend queda fuera de este checkpoint.
4. **Redirección post-login**: a `/materials`, no a `/` (la home actual es un placeholder estático).

### Corrección al registro (21/07/2026)

`handoff-mantestock-nuevo-chat.md` (archivo suelto, no commiteado) afirmaba que el checkpoint 007.3 estaba "en curso, prompt ya dado a Claude Code, falta ver el resultado". Se verificó el código real (`apps/backend/src`, `git log`) el 21/07/2026 y **007.3 no existe**: no hay `UsersModule`, `UsersController`, `RolesGuard` ni `@Roles()`, y `app.module.ts` no importa ningún módulo de usuarios. El último commit sigue siendo `e02ab6f` (007.2), del 18/07/2026. Se trata este hallazgo como corrección del estado real, no como avance — 007.3 se retoma desde cero con el prompt de esta sesión.

### Plan de checkpoints (007)

| Checkpoint | Contenido | Estado |
|---|---|---|
| 007.1 | Entidad `User`, hash de contraseña real (bcrypt), login real (reemplaza el stub), lockout de 2 intentos/5 min | ✅ Implementado y verificado con `curl` contra el servidor real (19/07/2026). Pendiente de verificación manual del usuario en Postman antes de commitear. |
| 007.2 | `JwtAuthGuard` + estrategia JWT; proteger Materials e Inventory Movements | ✅ Implementado y verificado con `curl` (sin token → 401, token inválido → 401, token válido → 200, arranque falla sin `JWT_SECRET`). Pendiente de verificación manual del usuario en Postman antes de commitear. |
| 007.3 | `RolesGuard`/`@Roles()`; CRUD de usuarios (admin-only); reseteo de contraseña por admin | ✅ Implementado, verificado (13/13 Postman) y commiteado (`a955cc6`, 21/07/2026). |
| 007.4 | `createdBy` en `Material` e `InventoryMovement` (requiere el usuario autenticado del request) | ✅ Implementado, verificado (6/6 Postman) y commiteado (`2f25759`, 21/07/2026). |
| 007.5 | Frontend: página de login, rutas protegidas, UI condicionada por rol | ✅ Implementado y verificado en navegador el 21/07/2026 (login, cookies, middleware de rutas protegidas, header condicionado por rol, bloqueo de `/users` para no-admin, creación de material y de movimiento de inventario como `tecnico1` de punta a punta). Pendiente de commitear. |

**Nota sobre bootstrap de usuarios:** no existe endpoint HTTP de registro todavía (por diseño, se deja para 007.3 con guard admin-only). El primer usuario admin se crea con el script `npm run seed:test-user` (acepta username/password/role por argumento) — necesario porque un endpoint admin-only no puede usarse antes de que exista un admin. Este script queda como herramienta de desarrollo/bootstrap, no como parte de la API pública.

**Pendiente de seguridad (no bloqueante en desarrollo):** el `.env` local usa `JWT_SECRET=change-me` (valor de `.env.example`) para poder probar 007.2. **Reemplazar por un secreto fuerte y único antes de cualquier despliegue a staging o producción.**

### Inmutabilidad de InventoryMovement — CONFIRMADO
RNF08 (documento técnico) es explícito: el historial de movimientos no debe ser editable ni eliminable. Esto reinterpreta `update()`/`remove()` en `InventoryMovementsService`: **no están pendientes de implementar, están bloqueados por diseño.**

- `InventoryMovementsController` (Checkpoint 006.5) expone únicamente **POST, GET, GET por ID**. No PUT, no DELETE.
- `update()`/`remove()` deben lanzar una excepción semántica de dominio (ej. `ForbiddenException('Los movimientos de inventario son inmutables')`) en vez de `NotImplementedException`.
- `@UpdateDateColumn()` en la entidad `InventoryMovement` debe eliminarse — es inconsistente con un registro inmutable.

### `quantity` / stock como `int` — diferido, no descartado
El documento técnico pide soporte de decimales (materiales en kg fraccionados), pero `Material.currentStock`/`minimumStock` e `InventoryMovement.quantity` son `int`. **Decisión: se mantiene `int` por ahora y NO se toca el módulo Material congelado.** Esto no es una aceptación permanente — se revisa y se migra a decimal específicamente cuando se implemente soporte real de materiales medidos por unidades fraccionables (kg, litros, etc.), probablemente junto con un campo de unidad de medida. Hasta entonces, el catálogo asume materiales contables en unidades enteras (piezas, cajas).

### Otros hallazgos de los documentos de especificación — registrados, no bloqueantes
Fuentes: `01-objetivo-y-alcance.md` a `05-modulos-del-sistema.md`, `gemini-code-1784071345471.md`.

- **Trazabilidad por usuario (RF05)**: ni `Material` ni `InventoryMovement` tienen `created_by`. Esperado en esta etapa — depende del módulo de autenticación/usuarios, aún no iniciado.
- **Categorías**: `Material.category` es un string simple; el modelo de datos original propone una entidad `Categories` separada con FK. Simplificación de MVP, aceptada por ahora.
- **Bloqueo de login**: 2 intentos fallidos → bloqueo de 5 min. Regla a implementar cuando se construya el módulo de autenticación (aún no iniciado).
- **RNFs generales** (rendimiento <2s, disponibilidad 99%, seguridad JWT/hash+salt): documentados en la especificación original, pendientes de verificar contra la implementación cuando corresponda.

## Bug encontrado durante la prueba manual de 007.5 (21/07/2026) — no relacionado con auth

Al probar el flujo completo en el navegador como `tecnico1`, crear un material falla con "No fue posible guardar el material." El login, las cookies y el bloqueo de `/users` por rol funcionaron correctamente — el bug es previo y ajeno a 007.5.

**Causa real**: `MaterialForm.tsx` envía `currentStock` en el body de `POST /materials`, pero `CreateMaterialDto` (backend) no tiene ese campo, y `main.ts` tiene `ValidationPipe({ forbidNonWhitelisted: true })` — rechaza con 400 cualquier propiedad fuera del DTO, para cualquier usuario. `UpdateMaterialDto` extiende el mismo DTO (`PartialType(CreateMaterialDto)`), así que **editar un material está igual de roto**, no solo crear. Nunca se había probado esta parte del frontend de punta a punta en navegador.

**Hallazgo adicional**: ni siquiera debería existir un campo "Stock actual" editable en el formulario de Material — la regla de negocio ya documentada dice "Todo cambio de stock debe realizarse mediante InventoryMovement". El campo se quita, no se corrige para que pase la validación.

**Corregido y verificado en navegador (21/07/2026)**: se quitó `currentStock` de `CreateMaterialDto` (frontend) y del formulario (crear y editar), y se agregó manejo de errores real (`extractErrorMessage`) en `materials.service.ts` + `MaterialForm.tsx`, igual que ya tenía `inventory-movements`. Confirmado por el usuario: crear y editar un material como `tecnico1` funciona.

## 007.5 — verificado en navegador (21/07/2026)

Probado manualmente por el usuario (no solo `next build`): login redirige correctamente, cookie de sesión funciona, middleware bloquea rutas sin sesión, header muestra username/role, link "Usuarios" solo visible para ADMIN, `/users` redirige si un no-admin intenta entrar por URL directa, logout limpia la sesión. Creación de material y de movimiento de inventario como `tecnico1` confirmadas de punta a punta (esto último ya incluye el fix del bug de Material de arriba). Pendiente de commitear.

Durante la verificación se encontró y corrigió un bug adicional (router cache del cliente): `LoginForm.tsx` y `LogoutButton.tsx` no llamaban `router.refresh()` antes de navegar, así que el header (en `app/layout.tsx`) seguía mostrando el estado viejo tras login/logout — mismo patrón que el bug ya documentado del 19/07/2026 en `MaterialForm`/`InventoryMovementForm`. Corregido agregando `router.refresh()` en ambos.

## Checkpoint 010 — Mejora visual del frontend (arquitectura, 21/07/2026)

Hasta ahora el frontend es HTML sin ningún estilo (cero CSS en todo `apps/frontend`). Decisión del usuario: mejorar la interfaz de **todas** las pantallas (no solo las de la demo), usando **Tailwind CSS** (instalación nueva, `tailwindcss@3` + `postcss` + `autoprefixer`, config estándar de Next.js App Router).

Es un cambio **puramente visual** — no debe tocar lógica, nombres de campos (`name`/`id` de inputs), llamadas a servicios, ni props de componentes. Solo se agregan `className` y se ajusta estructura de JSX para layout (envolver en `div`s, por ejemplo).

Sistema de diseño acordado (para que quede consistente entre archivos):
- Color primario: azul (`blue-600`). Peligro/eliminar: `red-600`. Éxito/entrada: `green-600`. Alerta/stock bajo: `amber-500`/`amber-600`.
- Botones: primario sólido azul, secundario con borde gris, peligro rojo — todos con estado `disabled` visualmente distinto.
- Tablas: encabezado gris claro, filas con hover, bordes redondeados.
- Formularios: labels arriba del input, inputs con borde y foco azul, errores en caja roja clara.
- Tarjetas del dashboard: fondo blanco, borde gris, sombra sutil.
- Filas de material con `currentStock <= minimumStock` resaltadas (fondo ámbar claro) en las tablas donde aplique — refuerzo visual del indicador de stock bajo.

## Pendientes por verificar (abiertos, sin confirmar aún)

- Ninguno crítico. Los dos pendientes anteriores (estado real de update/remove, y contenido de los documentos 01-05/gemini-code) quedaron resueltos y confirmados el 18/07/2026.

## Puntos abiertos de 007.3 (no bloqueantes, pendientes de decisión del usuario)

1. **Auto-degradación de rol**: `PATCH /users/:id` bloquea que un admin se desactive a sí mismo (`isActive:false`), pero NO bloquea que un admin se cambie su propio `role` a TECNICO/COORDINADOR. Si el único admin activo hace esto por error, queda en la misma situación que la protección de auto-bloqueo buscaba evitar. Sin decidir aún si vale la pena bloquearlo también.
2. **Código de estado de `/auth/login`**: devuelve `201` (default de Nest para `@Post()` sin `@HttpCode`), no `200`. Es válido, pero si se prefiere el convencional `200` para login, es un cambio de una línea. Sin decidir.

## 007.3 — verificado y commiteado (21/07/2026)

Validado con colección de Postman (`postman/ManteStock-007.3-Users.postman_collection.json`, 13 requests con tests automáticos) — 13/13 en verde. Cubre: rechazo por rol (403), rechazo por password débil (400), rechazo de autobloqueo de admin (400), ciclo completo de reset-password (clave vieja deja de servir, clave nueva funciona), y soft-delete (el registro no se borra físicamente, `isActive:false`). Commit `a955cc6`.

## 007.4 — verificado y commiteado (21/07/2026)

Validado con colección de Postman (`postman/ManteStock-007.4-CreatedBy.postman_collection.json`, 6 requests) — todos en verde. Cubre: `POST /materials` como `admin` devuelve `createdBy:"admin"`, `POST /inventory-movements` como `tecnico1` devuelve `createdBy:"tecnico1"`, el valor persiste al releer el material por id, y la lista completa de materiales no se rompe con registros antiguos en `createdBy:null`. Commit `2f25759`.
