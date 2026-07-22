# Análisis técnico del backend

Este documento resume el estado actual del backend del repositorio "Proyecto_Inventario-main" (servicio identificado como `mante-stock-backend`). Está basado exclusivamente en el código fuente presente en `apps/backend/src`.

# 1. Resumen general
- Arquitectura utilizada: Arquitectura modular típica de NestJS (módulos, controladores, servicios).
- Framework: NestJS ([apps/backend/src/app.module.ts](apps/backend/src/app.module.ts)).
- ORM: TypeORM (configurado vía `TypeOrmModule` en [apps/backend/src/app.module.ts](apps/backend/src/app.module.ts) y configuración adicional en [apps/backend/src/database/typeorm.config.ts](apps/backend/src/database/typeorm.config.ts)).
- Base de datos: PostgreSQL (configuración por URL o por host/port en el archivo de configuración).
- Dependencias importantes (extraídas del código):
  - `@nestjs/common`, `@nestjs/core`, `@nestjs/config`, `@nestjs/typeorm`
  - `typeorm`
  - `passport-jwt`, `passport`, `@nestjs/passport`
  - `jsonwebtoken`
- Organización del proyecto:
  - Estructura modular dentro de `apps/backend/src/` con módulos `auth` y `materials`, y un `AppController` con endpoints de estado.
  - `TypeOrmModule` se inicializa en `AppModule`.
  - `main.ts` arranca la app usando Nest y habilita CORS en el puerto 3001.

# 2. Estructura del proyecto

Raíz del backend: `apps/backend/src/`

- [apps/backend/src/app.module.ts](apps/backend/src/app.module.ts)
  - Módulo raíz que importa `ConfigModule`, `TypeOrmModule` y registra `AuthModule` y `MaterialsModule`.
- [apps/backend/src/main.ts](apps/backend/src/main.ts)
  - Punto de entrada que arranca NestJS y habilita CORS.
- [apps/backend/src/app.controller.ts](apps/backend/src/app.controller.ts)
  - Controlador con endpoints públicos de salud/raíz (`/` y `/health`).
- auth/
  - [apps/backend/src/auth/auth.module.ts](apps/backend/src/auth/auth.module.ts)
    - Define `AuthModule` e importa la entidad `User` para TypeORM.
  - [apps/backend/src/auth/auth.controller.ts](apps/backend/src/auth/auth.controller.ts)
    - Endpoints `/auth/login` y `/auth/register`.
  - [apps/backend/src/auth/auth.service.ts](apps/backend/src/auth/auth.service.ts)
    - Lógica de creación de usuario y validación de login; genera JWT usando `jsonwebtoken`.
  - [apps/backend/src/auth/jwt.strategy.ts](apps/backend/src/auth/jwt.strategy.ts)
    - Strategy JWT para Passport/JWT (extrae token de Authorization bearer).
  - [apps/backend/src/auth/jwt-auth.guard.ts](apps/backend/src/auth/jwt-auth.guard.ts)
    - Guard que aplica la estrategia JWT (`AuthGuard('jwt')`).
  - [apps/backend/src/auth/user.entity.ts](apps/backend/src/auth/user.entity.ts)
    - Entidad TypeORM `User` (tabla `users`).
- database/
  - [apps/backend/src/database/typeorm.config.ts](apps/backend/src/database/typeorm.config.ts)
    - Registro de configuración del DB (host/port/usuario/contraseña o URL).
- materials/
  - [apps/backend/src/materials/materials.module.ts](apps/backend/src/materials/materials.module.ts)
    - Módulo para materiales.
  - [apps/backend/src/materials/materials.controller.ts](apps/backend/src/materials/materials.controller.ts)
    - Controlador con rutas protegidas por JWT (`/materials`).
  - [apps/backend/src/materials/materials.service.ts](apps/backend/src/materials/materials.service.ts)
    - Implementación del servicio de materiales (en memoria).

Explicación de cada módulo:
- `AuthModule`: Gestiona usuarios y autenticación JWT. Provee creación de usuario en `onModuleInit` (se crea un `admin` por defecto si no existe).
- `MaterialsModule`: CRUD de materiales, pero implementado en memoria (array JS en `MaterialsService`), no persiste en la base de datos.
- `Database/config`: Centraliza parámetros de conexión a PostgreSQL aunque `AppModule` usa una configuración inline; el archivo `typeorm.config.ts` existe para una alternativa registrada vía `registerAs`.

# 3. Módulos implementados

- Nombre: `AuthModule`  
  - Estado: Completo (registro y login funcionales según el código).  
  - Responsabilidad: Gestión de usuarios y autenticación JWT.  
  - Dependencias: `TypeOrmModule` (User entity), `ConfigService`, `jsonwebtoken`.

- Nombre: `MaterialsModule`  
  - Estado: Parcial (CRUD funcional en memoria, pero sin persistencia en BD).  
  - Responsabilidad: Exponer endpoints CRUD para materiales.  
  - Dependencias: Ninguna externa (implementación interna in-memory), dependencia de guard JWT para protección de rutas.

- Nombre: `AppModule`  
  - Estado: Completo (monta la app, DB y módulos).  
  - Responsabilidad: Configuración general (env, TypeORM, importar módulos).  
  - Dependencias: `ConfigModule`, `TypeOrmModule`, `AuthModule`, `MaterialsModule`.

# 4. Endpoints existentes

Todas las rutas encontradas en el backend:

- GET /
  - Controlador: `AppController` ([apps/backend/src/app.controller.ts](apps/backend/src/app.controller.ts))
  - Servicio utilizado: Ninguno (respuesta estática)
  - Descripción: Estado general de la API.
  - Parámetros: ninguno
  - Respuesta: JSON con `status`, `service`, `message`, `timestamp`.

- GET /health
  - Controlador: `AppController`
  - Servicio utilizado: Ninguno
  - Descripción: Endpoint de salud.
  - Parámetros: ninguno
  - Respuesta: JSON con `status`, `service`, `timestamp`.

- POST /auth/login
  - Controlador: `AuthController` ([apps/backend/src/auth/auth.controller.ts](apps/backend/src/auth/auth.controller.ts))
  - Servicio utilizado: `AuthService` ([apps/backend/src/auth/auth.service.ts](apps/backend/src/auth/auth.service.ts))
  - Descripción: Valida credenciales y devuelve JWT + datos del usuario.
  - Parámetros (body): `{ username: string, password: string }` (ambos obligatorios, lanza BadRequest si faltan)
  - Respuesta: `{ accessToken: string, user: { id, username, role } }` o 401 si inválidas.

- POST /auth/register
  - Controlador: `AuthController`
  - Servicio utilizado: `AuthService`
  - Descripción: Crea un nuevo usuario en la tabla `users`.
  - Parámetros (body): `{ username: string, password: string, role?: string }` (username y password obligatorios)
  - Respuesta: `{ id, username, role }` del usuario creado o 400 si ya existe.

- GET /materials
  - Controlador: `MaterialsController` ([apps/backend/src/materials/materials.controller.ts](apps/backend/src/materials/materials.controller.ts))
  - Servicio utilizado: `MaterialsService` ([apps/backend/src/materials/materials.service.ts](apps/backend/src/materials/materials.service.ts))
  - Descripción: Lista todos los materiales (datos en memoria).
  - Parámetros: ninguno (HEADERS: requiere `Authorization: Bearer <token>`)
  - Respuesta: Array de objetos material.

- GET /materials/:id
  - Controlador: `MaterialsController`
  - Servicio utilizado: `MaterialsService`
  - Descripción: Devuelve un material por `id`.
  - Parámetros: `:id` en la ruta (string)
  - Respuesta: Objeto material o `undefined` si no existe.

- POST /materials
  - Controlador: `MaterialsController`
  - Servicio utilizado: `MaterialsService`
  - Descripción: Crea un nuevo material (en memoria).
  - Parámetros (body): `{ code, description, category, unitOfMeasure, minimumStock }`
  - Respuesta: Material creado (incluye `id` y `currentStock: 0`).

- PUT /materials/:id
  - Controlador: `MaterialsController`
  - Servicio utilizado: `MaterialsService`
  - Descripción: Actualiza un material existente (en memoria).
  - Parámetros: `:id` (ruta) y body con campos opcionales.
  - Respuesta: Material actualizado o `null` si no existe.

- DELETE /materials/:id
  - Controlador: `MaterialsController`
  - Servicio utilizado: `MaterialsService`
  - Descripción: Elimina un material por `id` (en memoria).
  - Parámetros: `:id`
  - Respuesta: Material eliminado o `null` si no existe.

Notas:
- Todas las rutas bajo `/materials` están protegidas por `JwtAuthGuard`. (`@UseGuards(JwtAuthGuard)` en [apps/backend/src/materials/materials.controller.ts](apps/backend/src/materials/materials.controller.ts)).
- `/auth/*` y `/` no usan guard.

# 5. Servicios

- `AuthService` ([apps/backend/src/auth/auth.service.ts](apps/backend/src/auth/auth.service.ts))
  - Métodos:
    - `onModuleInit()`
      - Qué hace: Verifica existencia de usuario `admin`; si no existe, crea uno con `username: 'admin', password: 'admin', role: 'coordinator'`.
      - Recibe: ninguno
      - Retorna: Promise<void>
    - `createUser(username: string, password: string, role = 'coordinator')`
      - Qué hace: Verifica usuario existente, crea y guarda un nuevo `User` usando el repositorio TypeORM.
      - Recibe: `username`, `password`, `role` (opcional)
      - Retorna: objeto con `{ id, username, role }` del usuario creado.
      - Observación: No hay hashing de password; se almacena plaintext.
    - `validateLogin(username: string, password: string)`
      - Qué hace: Busca usuario por `username` y `password`; si encuentra, genera un JWT con `jsonwebtoken.sign(...)` usando `JWT_SECRET` del `ConfigService`.
      - Recibe: `username`, `password`
      - Retorna: `{ accessToken, user: { id, username, role } }` o lanza `UnauthorizedException` si falla.
  - Dependencias: `userRepository` (TypeORM), `ConfigService`.

- `MaterialsService` ([apps/backend/src/materials/materials.service.ts](apps/backend/src/materials/materials.service.ts))
  - Estado: Implementación in-memory.
  - Métodos:
    - `findAll()`
      - Qué hace: Devuelve el array `materials`.
      - Retorna: `materials[]`
    - `findOne(id: string)`
      - Qué hace: Busca y devuelve el material con `id`.
      - Retorna: material o `undefined`.
    - `create(data: any)`
      - Qué hace: Crea un nuevo material con `id` secuencial como string y `currentStock: 0`, lo agrega al array.
      - Recibe: objeto con campos del material.
      - Retorna: el nuevo material.
    - `update(id: string, data: any)`
      - Qué hace: Actualiza los campos del material existente en el array.
      - Retorna: el material actualizado o `null` si no existía.
    - `remove(id: string)`
      - Qué hace: Elimina del array el material con `id`.
      - Retorna: el material eliminado o `null`.

# 6. Controladores

- `AppController` ([apps/backend/src/app.controller.ts](apps/backend/src/app.controller.ts))
  - Endpoints:
    - `GET /` → `root()` — devuelve estado estático JSON.
    - `GET /health` → `health()` — devuelve estado de salud JSON.
  - Validaciones: no aplica.
  - Guards: ninguno.
  - Decoradores: `@Controller()`, `@Get()`.
  - DTOs: ninguno.

- `AuthController` ([apps/backend/src/auth/auth.controller.ts](apps/backend/src/auth/auth.controller.ts))
  - Endpoints:
    - `POST /auth/login`
      - Validaciones: valida que `username` y `password` estén presentes; lanza `BadRequestException` si faltan.
      - Usa: `AuthService.validateLogin`.
      - DTOs (locales dentro del archivo): `LoginDto`, `RegisterDto`.
    - `POST /auth/register`
      - Validaciones: similares al login; llama `AuthService.createUser`.
  - Guards: ninguno.
  - Decoradores: `@Controller('auth')`, `@Post(...)`, `@Body()`.

- `MaterialsController` ([apps/backend/src/materials/materials.controller.ts](apps/backend/src/materials/materials.controller.ts))
  - Endpoints:
    - `GET /materials` → `findAll()`
    - `GET /materials/:id` → `findOne(id)`
    - `POST /materials` → `create(body)`
    - `PUT /materials/:id` → `update(id, body)`
    - `DELETE /materials/:id` → `remove(id)`
  - Validaciones: no hay validadores explícitos (p. ej. `class-validator`) — sólo tipos en DTOs locales, pero no se usan pipes de validación.
  - Guards: `JwtAuthGuard` aplicado al controlador (todas las rutas protegidas).
  - Decoradores: `@Controller('materials')`, `@UseGuards(JwtAuthGuard)`, `@Get`, `@Post`, `@Put`, `@Delete`, `@Param`, `@Body`.
  - DTOs utilizados: `CreateMaterialDto`, `UpdateMaterialDto` (definidos localmente en el archivo, pero no son clases validadas por `class-validator`).

# 7. Base de datos

Entidades encontradas:
- Entidad: `User`
  - Archivo: [apps/backend/src/auth/user.entity.ts](apps/backend/src/auth/user.entity.ts)
  - Campos:
    - `id` — tipo: `uuid` (PrimaryGeneratedColumn('uuid')) — Llave primaria.
    - `username` — tipo: `varchar(50)`, `unique: true`.
    - `password` — tipo: `varchar(255)`.
    - `role` — tipo: `varchar(50)`, default `'coordinator'`.
    - `createdAt` — tipo: `timestamp` (`CreateDateColumn`).
  - Relaciones: ninguna definida.
  - Restricciones: `username` único; `id` UUID PK.
- Observación sobre otras entidades: No se encontraron entidades TypeORM para `materials` ni otras tablas; materiales están en memoria (no en BD).

Cómo está diseñada la base de datos:
- Solo la entidad `User` está mapeada a la base de datos (`users`). `TypeOrmModule.forRoot` está configurado para autoLoadEntities, por lo que `User` será sincronizada en BD si `synchronize` está habilitado (por defecto activado cuando NODE_ENV != 'production').
- No hay migraciones, ni entidades adicionales en el código. Por tanto, la base de datos solo almacena usuarios; materiales no se persisten.

# 8. Autenticación

Implementación observada:
- JWT:
  - Generación: `AuthService.validateLogin` usa `sign` de `jsonwebtoken` con payload `{ sub: user.id, username, role }` y `expiresIn: '1h'`. Se obtiene `JWT_SECRET` del `ConfigService` (`process.env.JWT_SECRET`). Archivo: [apps/backend/src/auth/auth.service.ts](apps/backend/src/auth/auth.service.ts).
  - Validación: `JwtStrategy` (Passport) configura `secretOrKey` como `configService.get<string>('JWT_SECRET') || 'change-me'` (ver [apps/backend/src/auth/jwt.strategy.ts](apps/backend/src/auth/jwt.strategy.ts)). Extrae token de Authorization Bearer y valida expiración.
- Guards:
  - `JwtAuthGuard` extiende `AuthGuard('jwt')` y se aplica en `MaterialsController` mediante `@UseGuards(JwtAuthGuard)`.
- Strategies:
  - `JwtStrategy` (Passport Strategy) implementa `validate(payload)` devolviendo `{ id, username, role }`. Este objeto será adjuntado a `request.user` por Passport.
- Login:
  - Endpoint `/auth/login` busca al usuario por `username` y `password` en BD (no hay hashing), y si coincide genera `accessToken`.
- Usuarios:
  - Entidad `User` en BD; `AuthService.onModuleInit()` crea un usuario por defecto `admin` si no existe (`username: 'admin', password: 'admin', role: 'coordinator'`).
  - Registro: `/auth/register` crea usuarios usando TypeORM repository.
- Roles/Permisos:
  - El campo `role` existe en `User` y se incluye en el JWT payload pero no hay lógica de autorización basada en roles en el código (no hay Guards o decoradores de roles). Solo se usa para incluir en token y retorno.
- Flujo completo de autenticación (basado en código):
  1. El frontend llama `POST /auth/login` con `{ username, password }`.
  2. `AuthService.validateLogin` busca en la BD un usuario con `username` y `password`.
  3. Si existe, se crea un JWT firmado con `JWT_SECRET` y se retorna `{ accessToken, user }`.
  4. El frontend incluye `Authorization: Bearer <accessToken>` en solicitudes a rutas protegidas (`/materials`).
  5. `JwtStrategy` valida el token; si es válido, `request.user` contiene `{ id, username, role }`. `JwtAuthGuard` permite acceso a controladores protegidos.
- Observaciones de seguridad (basadas en código, no supuestas):
  - Las contraseñas se almacenan y comparan en texto plano (no hay hashing).
  - `JWT_SECRET` puede faltar; `JwtStrategy` usa `'change-me'` por defecto si no está configurado, lo cual reduce seguridad si no se establece correctamente.
  - No hay controles de expiración adicionales ni refresh tokens.

# 9. Flujo del sistema

Estado actual, flujo de uso (según código):
- Arranque:
  - `main.ts` crea la app Nest y escucha en puerto 3001; CORS habilitado.
  - `AppModule` inicializa `TypeOrmModule` con Postgres; `AuthModule.onModuleInit` crea usuario `admin` si no existe.
- Uso:
  1. Un cliente puede consultar `GET /` o `GET /health` sin autenticación.
  2. Para acceder a rutas protegidas (`/materials`), el cliente debe:
     - `POST /auth/login` o `POST /auth/register` (si crea usuario).
     - Recibir `accessToken`.
     - Incluir `Authorization: Bearer <token>` en el header.
  3. El cliente consume `/materials` (GET, POST, PUT, DELETE). El controlador delega a `MaterialsService` que mantiene un array en memoria; las operaciones afectan sólo ese array en la ejecución actual (no hay persistencia).
- Persistencia:
  - Usuarios persisten en PostgreSQL via TypeORM.
  - Materiales NO persisten: datos temporales en memoria.

# 10. Funcionalidades implementadas

- ✓ Endpoints de estado: `GET /`, `GET /health`.
- ✓ Registro de usuarios: `POST /auth/register`.
- ✓ Login con JWT: `POST /auth/login` (genera accessToken).
- ✓ Strategy y Guard JWT: `JwtStrategy`, `JwtAuthGuard`.
- ✓ Persistencia de usuarios en PostgreSQL (entidad `User` y TypeORM config existe).
- ✓ Creación automática de usuario `admin` en `AuthService.onModuleInit`.
- ✓ CRUD de materiales (en memoria): `GET/POST/PUT/DELETE /materials`.
- ✓ Configuración TypeORM y uso de env vars para DB y JWT.

# 11. Funcionalidades faltantes / módulos NO existentes

Basado únicamente en el código (no se inventa nada):
- Persistencia de materiales en BD (no existe: materiales están en memoria).
- Módulos típicos de gestión de inventario/estructuras/presupuestos/dashboard/reportes/usuarios avanzados (no hay código para ellos).
- Validaciones y DTOs formales con `class-validator` y `ValidationPipe` (no presentes).
- Control de roles/autorization (guards por rol) — solo existe campo `role` pero no lógica de autorización.
- Hashing de contraseñas (bcrypt u otro) y manejo seguro de contraseñas.
- Migrations para la DB (no hay).
- Manejo de errores estandarizado y respuesta consistente (solo excepciones básicas en controller/service).
- Tests automatizados.

# 12. APIs listas para consumir

APIs que el frontend puede consumir inmediatamente (según el código):
- `GET /` — estado
- `GET /health` — health
- `POST /auth/login` — obtener `accessToken`
- `POST /auth/register` — crear usuario
- `GET /materials` — listar materiales (requiere Authorization Bearer token)
- `GET /materials/:id` — obtener material por id (requiere token)
- `POST /materials` — crear material (requiere token)
- `PUT /materials/:id` — actualizar material (requiere token)
- `DELETE /materials/:id` — eliminar material (requiere token)

Notas útiles:
- Para consumir `/materials`, el frontend debe autenticar primero con `/auth/login`.
- Los materiales son in-memory: se pueden consumir (CRUD) pero los cambios no se persisten entre reinicios del servidor.

# 13. Recomendaciones para construir el frontend

Propuesta basada exclusivamente en las APIs existentes:

- Arquitectura del frontend:
  - Aplicación SPA (por ejemplo Next.js/React, ya hay un `apps/frontend` en repo) con manejo de rutas y almacenado de token en memoria/HttpOnly cookie según preferencia de seguridad.
  - Cliente debe: login → almacenar `accessToken` → incluir `Authorization: Bearer <token>` en llamadas a `/materials`.

- Vistas que pueden construirse ya:
  - Login: formulario que llama `POST /auth/login`.
  - Registro de usuario: formulario que llama `POST /auth/register`.
  - Lista de Materiales: tabla que llama `GET /materials` (requiere token).
  - Detalle de Material: vista que llama `GET /materials/:id`.
  - Formulario Crear/Editar Material: usa `POST /materials` y `PUT /materials/:id`.
  - Eliminar Material: acción que hace `DELETE /materials/:id`.

- Vistas que dependen de backend inexistente:
  - Dashboard con métricas persistentes (no hay endpoints).
  - Inventario persistente con movimientos históricos (no hay endpoints).
  - Gestión avanzada de usuarios con roles y autorización (solo existe creación/login básico).
  - Reportes y exportes (no hay endpoints).

- Componentes reutilizables sugeridos:
  - `AuthForm` (login/register).
  - `ProtectedRoute` / HOC que comprueba token y redirige al login.
  - `MaterialsTable` (lista con paginación/acciones: edit/delete).
  - `MaterialForm` (create/edit).
  - `ApiClient` centralizado para incluir `Authorization` header y manejar errores 401.
  - `Alert/Toast` para mostrar errores/confirmaciones.
  - `HealthIndicator` (consumir `GET /health`).

- Módulos a implementar primero (prioridad):
  1. Autenticación en frontend: Login, almacenamiento de token y flujo de redirect.
  2. CRUD de Materiales (lista, detalle, crear, editar, borrar) — permite validar UX básico.
  3. Manejo de sesión y expiración del token (logout y renovación de login).
  4. Integración de páginas adicionales cuando la API se amplíe (dashboard, reportes).
- Consideraciones:
  - Documentar que los materiales son volátiles (en-memory). Si el frontend espera persistencia, coordinar con backend para persistir (crear entidad TypeORM y endpoints persistentes).
  - Tratar contraseñas con cuidado: el backend no hashea contraseñas; en producción, hay que exigir hashing y seguridad.

# 14. Estado del proyecto (estimación basada únicamente en el código actual)

Backend:
███████░░░ 70%
Frontend:
██░░░░░░░░ 20%
Base de datos:
██████░░░░ 60%  (entidad `User` y TypeORM config existe; falta entidades adicionales y migraciones)
Autenticación:
██████████ 100%  (login, register, JWT strategy y guard implementados — aunque con riesgos de seguridad como passwords en texto)
Materiales:
██████░░░░ 60%  (CRUD implementado pero solo en memoria — funcionalidad parcial)
Estructuras:
░░░░░░░░░░ 0%
Inventario:
░░░░░░░░░░ 0%
Usuarios:
███░░░░░░░ 30%  (registro y persistencia básica de usuarios implementados; falta gestión avanzada)
Reportes:
░░░░░░░░░░ 0%

## Roadmap recomendado (orden ideal, basado en el código existente)
1. Reforzar seguridad de autenticación:
   - Implementar hashing seguro de contraseñas (bcrypt) en `AuthService.createUser` y `validateLogin`.
   - Validar y requerir `JWT_SECRET` en configuración de entorno (no usar 'change-me').
2. Persistir materiales:
   - Añadir entidad TypeORM `Material` y migraciones.
   - Actualizar `MaterialsService` para usar repositorio TypeORM en lugar del array in-memory.
3. Añadir validaciones robustas:
   - Usar `class-validator` y habilitar `ValidationPipe` global para DTOs (`CreateMaterialDto`, `UpdateMaterialDto`).
4. Añadir control de roles/autorización:
   - Implementar Guards y Decoradores para autorización por roles aprovechando el campo `role`.
5. Crear endpoints adicionales necesarios por el frontend:
   - Endpoints para movimientos de inventario, reportes y otros módulos según requisitos futuros.
6. Añadir tests y CI:
   - Pruebas unitarias y e2e para auth y materials, y pipeline de integración.

Notas finales y limitaciones:
- Todo lo anterior se basa exclusivamente en el código dentro de `apps/backend/src`. No se realizaron cambios en el proyecto.
- Puntos críticos detectados (se deben corregir antes de producción): contraseñas en texto plano, `JWT_SECRET` por defecto, materiales in-memory sin persistencia.
- Archivos clave analizados:
  - [apps/backend/src/app.module.ts](apps/backend/src/app.module.ts)
  - [apps/backend/src/main.ts](apps/backend/src/main.ts)
  - [apps/backend/src/app.controller.ts](apps/backend/src/app.controller.ts)
  - [apps/backend/src/auth/auth.module.ts](apps/backend/src/auth/auth.module.ts)
  - [apps/backend/src/auth/auth.controller.ts](apps/backend/src/auth/auth.controller.ts)
  - [apps/backend/src/auth/auth.service.ts](apps/backend/src/auth/auth.service.ts)
  - [apps/backend/src/auth/jwt.strategy.ts](apps/backend/src/auth/jwt.strategy.ts)
  - [apps/backend/src/auth/jwt-auth.guard.ts](apps/backend/src/auth/jwt-auth.guard.ts)
  - [apps/backend/src/auth/user.entity.ts](apps/backend/src/auth/user.entity.ts)
  - [apps/backend/src/database/typeorm.config.ts](apps/backend/src/database/typeorm.config.ts)
  - [apps/backend/src/materials/materials.module.ts](apps/backend/src/materials/materials.module.ts)
  - [apps/backend/src/materials/materials.controller.ts](apps/backend/src/materials/materials.controller.ts)
  - [apps/backend/src/materials/materials.service.ts](apps/backend/src/materials/materials.service.ts)

---

Si quieres, puedo:
- Actualizar el `README.md` con un resumen corto y comandos para ejecutar el backend.
- Generar tests básicos para `AuthService` y `MaterialsService`.
- Implementar la persistencia de `Material` como propuesta (crear entidad y actualizar el servicio).

Dime cuál prefieres y lo hago a continuación.
