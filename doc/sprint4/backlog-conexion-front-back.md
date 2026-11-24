# Sprint 4 · Backlog: conectar el panel de empresa con el back

Viene del sprint 3, donde quedaron hechas las queries (`back/src/repositoryCompany/repositoryComp.ts`), los servicios (`back/src/servicesCompany/`) y los endpoints (`back/index.ts`).
Los tipos que espera el front están en `front/src/types/models.ts`.

Leyenda de prioridad:
- **P0**: bloquea la conexión.
- **P1**: necesario para que todo funcione bien.
- **P2**: mejora u opcional.

---

## 1. Probar el back con la base de datos

- [ ] **P0 · Probar todos los endpoints con Postgres encendido.** Hasta ahora solo se comprobó que compilan y que el servidor arranca.
  - Levantar la base: `docker compose up -d` (desde la raíz).
  - Arrancar el back: `cd back && bun index.ts` (puerto 3000).
  - Probar los 14 endpoints con datos reales, incluidos los 409 (borrar una sala con historial, mover una reserva a un hueco ocupado).

## 2. Conectar el front

- [ ] **P0 · CORS.** El front (5173) y el back (3000) están en puertos distintos y el navegador bloqueará las peticiones.
  - Lo más simple: `server.proxy` en `front/vite.config.ts` que mande `/admin` a `http://localhost:3000`.
- [ ] **P0 · Cambiar el cuerpo de cada función de `front/src/services/adminService.ts` por el `fetch`** a su endpoint. Cada función ya lleva su endpoint escrito encima.
- [ ] **P1 · Recargar tras guardar.** Ahora el front se entera de los cambios por `subscribe`/`notify` del mock; con la API hay que volver a pedir los datos después de cada `POST`/`PUT`/`DELETE`.

## 3. Respuestas de la API

- [ ] **P1 · Campos que faltan para la forma exacta del front:**
  - `historialDePartidas`: añadir `id_reservations` y `time_limit` al `select`;
  - `partidasEnCurso`: añadir `id_user`, `email` y `status` al `select`.
- [ ] **P1 · IDs mal formados devuelven 500 en vez de 404.** Postgres rechaza un id que no es UUID antes de buscar (p. ej. `/admin/games/no-existe`).
  - Validar el formato UUID en las rutas con `:id` y responder 404.
- [ ] **P2 · Zona horaria del dashboard.** `obtenerDashboard` calcula "hoy" con `setHours`, en la hora del servidor. Si el servidor no está en la hora de España, el día no coincidirá con el del front.
  - Opción: que el front mande `from`/`to` también al dashboard, como ya hace con la agenda.
- [ ] **P2 · `countReservationNow` ya no se usa** (el dashboard usa `listarReservas`). Borrarla.

## 4. Autenticación

- [ ] **P1 · Montar Better Auth en el servidor:** `app.all("/api/auth/*splat", toNodeHandler(auth))` (Express 5).
- [ ] **P1 · Proteger `/admin/*`** con un middleware que lea la sesión de Better Auth y compruebe `role === "admin"` (401 sin sesión, 403 si no es admin).
- [ ] **P1 · Login en el front** para poder entrar al panel. Hasta tenerlo, el middleware de admin bloquearía el panel.

## 5. Opcional

- [ ] **P2 · `GET /admin/users`:** listar usuarios (`id`, `name`, `email`, `role`). Necesita query, servicio y endpoint.
