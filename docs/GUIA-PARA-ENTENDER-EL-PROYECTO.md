# ManteStock, explicado sin tecnicismos

Este documento es para alguien que **no programa** y **no ha instalado nada de esto**, pero quiere entender qué es ManteStock, para qué sirve y cómo está armado por dentro. No enseña a instalarlo ni a programarlo — solo a entenderlo.

---

## 1. ¿Qué problema resuelve?

En muchas áreas de mantenimiento industrial, el control de repuestos e insumos se lleva en hojas de Excel y mensajes de WhatsApp. Eso genera problemas conocidos:

- Nadie sabe con certeza cuánto stock hay realmente de cada cosa.
- Se compra material que ya había, porque no había visibilidad.
- No queda registro claro de quién sacó qué material y cuándo.
- Si hay una auditoría, no hay forma confiable de reconstruir la historia.

**ManteStock reemplaza ese control manual disperso por un sistema único**, donde cada entrada y salida de material queda registrada, con fecha, cantidad y responsable — y nadie puede borrar ni alterar ese historial después.

---

## 2. ¿Cómo está hecho, en términos simples?

Piensa en un restaurante:

| Parte del restaurante | Parte de ManteStock | Qué hace |
|---|---|---|
| El salón donde te sientas, el menú que lees, el mesero que te atiende | **Frontend** | Es lo que ves y con lo que interactúas en el navegador: los formularios, los botones, las tablas. |
| La cocina, donde se preparan los platos según reglas fijas | **Backend** | Es el programa que aplica las reglas del negocio: valida que no se pueda sacar más stock del que hay, calcula el nuevo stock, revisa quién tiene permiso de hacer qué. |
| La despensa, donde se guardan los ingredientes | **Base de datos** | Es donde queda guardada la información de verdad: los materiales, los movimientos, los usuarios. Si el sistema se apaga y se prende, los datos siguen ahí. |

El frontend nunca guarda información por su cuenta — siempre le pide permiso y datos al backend, y el backend es el único que habla con la base de datos. Esa separación existe para que las reglas (por ejemplo, "no se puede sacar más stock del que hay") se apliquen siempre, sin importar desde dónde se use el sistema.

---

## 3. ¿Quién lo usa y qué puede hacer cada uno?

El sistema reconoce tres tipos de usuario (roles). Todos necesitan iniciar sesión con usuario y contraseña para entrar.

| Rol | Qué puede hacer |
|---|---|
| **Técnico** | Consultar el inventario, registrar entradas/salidas/ajustes de material, dar de alta materiales nuevos. |
| **Coordinador de compras** | Lo mismo que el Técnico — hoy no hay tareas exclusivas de este rol en el sistema. |
| **Administrador** | Todo lo anterior, más la gestión de las cuentas de usuario: crear usuarios, cambiarles el rol, desactivarlos, resetear contraseñas. |

Si alguien escribe mal su contraseña dos veces seguidas, el sistema bloquea esa cuenta por 5 minutos, como medida de seguridad contra intentos de adivinar contraseñas.

---

## 4. ¿Qué funciones tiene el sistema hoy?

| Función | En palabras simples |
|---|---|
| **Catálogo de materiales** | Una lista de todos los repuestos/insumos, cada uno con un código único, para que nunca se registre el mismo material dos veces con nombres distintos. |
| **Movimientos de inventario** | El registro de cada entrada (llegó material), salida (se usó material) o ajuste (corrección manual del stock). Es la única forma de cambiar el stock — no se puede "editar" el número directamente. |
| **Autenticación y usuarios** | El sistema de login, con roles y bloqueo por intentos fallidos. |
| **Trazabilidad y auditoría** | La posibilidad de consultar y filtrar todo el historial de movimientos — por material, por persona, por tipo o por fecha — para poder reconstruir qué pasó. |
| **Dashboard** | Una pantalla de inicio con un resumen: cuántos materiales hay, cuánto stock total, y cuáles están en un nivel bajo y necesitan reposición. |

Una función que se pensó al inicio del proyecto — **notificaciones automáticas** (avisar cuando el stock baja) — se descartó a propósito para esta entrega, no está pendiente, quedó fuera del alcance por decisión explícita.

---

## 5. Un dato importante que no es "código roto"

Algunas cosas de gestión de usuarios (crear un usuario nuevo, cambiarle el rol, resetear su contraseña) **todavía no tienen botones en la pantalla** — solo se pueden hacer con una herramienta técnica (Postman) que envía peticiones directas al backend. No es un error: fue una decisión consciente de priorizar el tiempo en otras partes primero. Está documentado como pendiente, no como algo roto.

---

## 6. Glosario básico

| Palabra | Qué significa aquí |
|---|---|
| **Frontend** | La parte visual del sistema, lo que se ve en el navegador. |
| **Backend** | El programa que corre "detrás de escena" y aplica las reglas del negocio. |
| **Base de datos** | Donde se guarda la información de forma permanente. |
| **API** | La forma en la que el frontend le "pide cosas" al backend (por ejemplo: "dame la lista de materiales", "registra esta salida"). |
| **Repositorio (repo)** | El lugar donde vive todo el código del proyecto, con el historial de cada cambio (en este caso, GitHub). |
| **Rama (branch)** | Una copia paralela del código donde se puede trabajar sin afectar la versión "oficial" hasta que se revisa y se aprueba. |
| **Checkpoint** | Un punto de avance del proyecto ya terminado y comprobado, antes de seguir con lo siguiente. |

---

## 7. Estado actual (resumen)

Los 5 módulos descritos en la sección 4 están completos y fueron probados de forma real (no solo revisados en el código): con una herramienta de pruebas de API (Postman) y usándolos directamente en el navegador. El trabajo está subido a GitHub en una rama de trabajo, en revisión antes de integrarse a la versión oficial del proyecto — así lo exige la metodología del curso.
