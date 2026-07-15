# ManteStock

ManteStock es una solución web para la gestión de inventario en ambientes de mantenimiento industrial. El objetivo principal es centralizar el control de materiales, evitar inconsistencias de stock, registrar trazabilidad de movimientos y facilitar la toma de decisiones operativas con información confiable.

## Visión
Actualmente, muchas áreas de mantenimiento siguen usando hojas de cálculo y mensajes informales para registrar salidas y entradas de repuestos. Esto genera falta de visibilidad, compras duplicadas, errores en el stock y ausencia de trazabilidad.

ManteStock busca reemplazar ese flujo manual por una herramienta web con una única fuente de verdad para el inventario.

## Stack tecnológico
- Frontend: Next.js
- Backend: NestJS
- Base de datos: PostgreSQL
- Autenticación: JWT / sesiones con control por roles
- Persistencia y ORM: TypeORM
- Entorno local: Node.js 20.x, npm y PostgreSQL local

## Objetivos del MVP
- Registrar materiales y repuestos
- Registrar entradas y salidas de inventario
- Validar que no exista stock negativo
- Mantener trazabilidad completa por usuario y fecha/hora
- Consultar stock disponible en tiempo real
- Diferenciar permisos por rol entre técnico y coordinador

## Estructura del proyecto
- `apps/frontend`: aplicación web construida con Next.js
- `apps/backend`: API REST construida con NestJS
- `.env`: variables de entorno locales
- `docker-compose.yml`: configuración para levantar PostgreSQL local

## Requisitos previos
- Node.js 20.x
- npm
- PostgreSQL local o Docker Desktop

> Importante: para evitar incompatibilidades en Windows con Next.js 14, se recomienda usar Node.js 20.x.

## Configuración local
1. Copia el archivo `.env.example` a `.env`
2. Ajusta las variables para tu entorno local
3. Instala las dependencias:

```powershell
npm install
```

4. Levanta PostgreSQL local:

```powershell
npm run docker:up
```

## Ejecución del proyecto
### Backend
```powershell
npm run dev:backend
```

### Frontend
```powershell
npm run dev:frontend
```

## Variables de entorno
Ejemplo de configuración básica:

```env
POSTGRES_DB=mante_stock
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_PORT=5432
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/mante_stock
JWT_SECRET=change-me
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## Rutas principales
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:3001`
- Health check del backend: `http://localhost:3001/health`

## Estado del proyecto
El proyecto se encuentra en fase inicial de construcción del MVP, con la base del entorno local configurada y la estructura de frontend y backend preparada para continuar con la implementación de autenticación, materiales y movimientos de inventario.

## Licencia
Este proyecto se distribuye con fines de desarrollo y validación funcional en el contexto del MVP definido para ManteStock.

