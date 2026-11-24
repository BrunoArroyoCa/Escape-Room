# Sprint 3 · Backlog del back (panel de empresa)

Pendientes para conectar el panel de empresa (`front/`) con el back.
Archivo principal: `back/src/repositoryCompany/repositoryComp.ts`.
Los tipos que espera el front están en `front/src/types/models.ts`.

Leyenda de prioridad:
- **P0**: error que ya existe en el código; hay que arreglarlo antes de conectar.
- **P1**: query que falta y que el front usa.
- **P2**: mejora o limpieza.

---

## 0. Base común

- [ ] **P0 · Unificar los estados.** Hoy están escritos de 5 formas distintas: `"Completada"`/`"Abandonada"`, `'completed'`/`'abandoned'`, `"in Game"`, `"Cancelado"` y `"Cancelled"`.
  - Crear `src/models/status.ts` con constantes y usarlas en todas las queries.
  - Valores del front:
    - partidas: `in_progress` · `completed` · `abandoned`;
    - reservas: `pending` · `confirmed` · `cancelled` · `completed`.
- [ ] **P0 · `MapModel`: renombrar `dificulty` → `difficulty`.** El front manda `difficulty`, así que `crearMapa`/`editMapa` reciben `undefined` y el insert falla (`NOT NULL`).
- [ ] **P1 · Mover `db` de `src/index.ts` a `src/db/client.ts`.** Cuando `index.ts` sea el servidor habrá un import circular (repositorio → index → services → repositorio). Actualizar también `src/lib/auth.ts`.
- [ ] **P2 · Limpiar imports.** `../../src/db/schema.ts` → `../db/schema.ts`, y quitar de `index.ts` los imports sin usar.

## 1. Dashboard y partidas

| Endpoint | Query |
|---|---|
| `GET /admin/dashboard` | total, media, tasa de éxito, salas activas, stats por sala, reservas de hoy, partidas en curso |
| `GET /admin/games?status&map&from&to` | `historialDePartidas` |
| `GET /admin/games/{id}` | `viewCurrentsMaps` |
| `GET /admin/games/live` | `partidasEnCurso` |

- [ ] **P0 · `viewCurrentsMaps` (detalle de partida).**
  - Falta `innerJoin(reservations, …)`: selecciona `reservations.team` sin ese join y Postgres da *missing FROM-clause entry*.
  - Añadir `export` e `id_map` al select.
  - Renombrarla, por ejemplo `partidaPorId`.
- [ ] **P1 · `historialDePartidas`: filtros opcionales** `status` (`finished` = completadas + abandonadas), `mapId`, `from`, `to`.
  - Montar el `where` con `and(...)` y poner cada condición solo si viene el filtro.
- [ ] **P1 · Total de partidas globales:** `select({ total: count() }).from(gameTable)`.
- [ ] **P1 · Estadísticas por sala:** `groupBy(gameTable.id_map)` con:
  - nº de partidas terminadas;
  - puntuación media (solo completadas);
  - tiempo medio en minutos: ``sql`avg(extract(epoch from ${gameTable.ended_at} - ${gameTable.started_at})) / 60` ``;
  - tasa de éxito (completadas / terminadas).
- [ ] **P1 · `countReservationNow`: devolver `result` (la lista), no `result.length`.**
  - El plano necesita las reservas de hoy para mostrar la siguiente de cada sala; el conteo se hace en el service.
- [ ] **P2 · `numeroSalasActivas`:** devolver el número (`result[0]?.total ?? 0`), no `[{ total }]`.
- [ ] **P2 · `tasaDeExitoGLOBAL`:** devuelve 0–100 y el front espera 0–1. Convertir en el service o en la query.

## 2. Salas y puzzles

| Endpoint | Query |
|---|---|
| `GET /admin/maps` | `listarLosMapas` ✔ |
| `GET /admin/maps/{id}` | sala + 4 puzzles |
| `POST /admin/maps` | `crearMapa` |
| `PUT /admin/maps/{id}` | `editMapa` |
| `PUT /admin/maps/{id}/puzzles/{index}` | editar puzzle |
| `DELETE /admin/maps/{id}` | `checkDeSalaHistorial` + `eliminarMapaPuzzles` |

- [ ] **P1 · Sala por id con sus 4 puzzles** ordenados por `index1_4`:
  - `db.query.mapTable.findFirst({ where: { id_map: id }, with: { puzzles: true } })`.
- [ ] **P1 · `crearMapa` con los 4 puzzles en una transacción.**
  - Insertar el mapa, coger el `id_map` del `returning()` e insertar los puzzles con `index1_4` 1–4.
  - Mismo patrón que `eliminarMapaPuzzles`.
- [ ] **P1 · Editar puzzle:**
  - `update(puzzlesTable).set({ title, message, solution, hint })`;
  - `where(and(eq(puzzlesTable.id_map, idMap), eq(puzzlesTable.index1_4, index)))`.
- [ ] **P1 · `checkDeSalaHistorial`: contar también las reservas** de la sala, porque su clave foránea también impide borrarla.
  - Quitar los `innerJoin` innecesarios: basta `where(eq(gameTable.id_map, id))`.
- [ ] **P1 · `eliminarMapaPuzzles`: llamar antes a `checkDeSalaHistorial`** (aquí o en el service) y devolver un error claro en vez del error de clave foránea.
- [ ] **P2 · `editMapa`:** recibir `Partial<MapModel>`, porque el front solo manda lo que cambia.

## 3. Agenda de reservas

| Endpoint | Query |
|---|---|
| `GET /admin/reservations?from&to&status&map` | listar reservas con filtros |
| `GET /admin/reservations/{id}` | reserva por id |
| `PUT /admin/reservations/{id}` | `actualizarReservacion` + comprobar hueco |
| `DELETE /admin/reservations/{id}` | `eliminarReservacion` (cancela) |

- [ ] **P1 · Listar reservas con filtros opcionales** `from`, `to`, `status` y `mapId`.
  - Joins a sala (`id_map`, `name`) y usuario (`id`, `name`), `orderBy(reservations.reserve_at)`.
  - Puede ser la versión general de `countReservationNow`: el dashboard la llama con hoy y la agenda con cualquier día.
- [ ] **P1 · Reserva por id** con sala y usuario (para el editor de reservas).
- [ ] **P1 · Comprobar si el hueco está ocupado:** otra reserva con el mismo `id_map` y `reserve_at`, `status ≠ cancelled` e `id ≠` la que se edita.
- [ ] **P2 · `actualizarReservacion`:** recibir `Partial<ReservationModel>` (el front puede mandar `team: null`).

## 4. Opcional

- [ ] **P2 · `GET /admin/users`:** listar usuarios (`id`, `name`, `email`, `role`).

## 5. Después de las queries

- [ ] Capa service (`src/servicesCompany/`): componer la respuesta de cada endpoint con la forma de `front/src/types/models.ts`.
- [ ] Endpoints Express en `/admin/*`, protegidos con Better Auth (`role = admin`).
- [ ] Servidor en `src/index.ts`.
- [ ] En el front, cambiar el cuerpo de cada función de `front/src/services/adminService.ts` por el `fetch` a su endpoint.
- [ ] Zona horaria: el front ya manda `from`/`to` en ISO; usarlos en lugar de `setHours` en el servidor.
