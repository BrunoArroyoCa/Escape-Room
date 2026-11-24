import {
  gameTable,
  reservations,
  mapTable,
  puzzlesTable,
} from "../../src/db/schema.ts";
import {
  and,
  avg,
  count,
  desc,
  eq,
  gte,
  lt,
  ne,
  or,
  sql,
  inArray,
} from "drizzle-orm";
import { type MapModel } from "../../src/models/mapModel.ts";
import { type ReservationModel } from "../../src/models/reservtionModel.ts";
import { db } from "../index.ts";
import { user } from "../db/auth-schema.ts";
import { PARTIDA, RESERVAS } from "../models/status.ts";

//Listar los mapas -> Que son las salas
export async function listarLosMapas() {
  const result = await db.select().from(mapTable);
  return result;
}

//Listar el hisotrial de las partidas totales
// TODO falta filtros
//
//  historialDePartidas: filtros opcionales status (finished = completadas + abandonadas), mapId, from, to.
//  Montar el where con and(...) y poner cada condición solo si viene el filtro.

export interface HistorialFilters {
  status?: string;
  mapId?: string;
  from?: Date;
  to?: Date;
}

export async function historialDePartidas(filters: HistorialFilters = {}) {
  const { status, mapId, from, to } = filters;

  const statusCondition = status
    ? status === "finished"
      ? inArray(gameTable.status, [PARTIDA.completed, PARTIDA.abandoned])
      : eq(gameTable.status, status)
    : undefined;

  return await db
    .select({
      id_game: gameTable.id_game,
      id_map: mapTable.id_map,
      progress: gameTable.progress,
      id_user: user.id,
      nameUser: user.name,
      team: reservations.team,
      reservedAt: reservations.reserve_at,
      email: user.email,
      nameMap: mapTable.name,
      maxScore: mapTable.max_score,
      dificulty: mapTable.difficulty,
      status: gameTable.status,
      score: gameTable.score,
      startedAt: gameTable.started_at,
      endedAt: gameTable.ended_at,
    })
    .from(gameTable)
    .innerJoin(mapTable, eq(mapTable.id_map, gameTable.id_map))
    .innerJoin(user, eq(user.id, gameTable.id_user))
    .innerJoin(
      reservations,
      eq(reservations.id_reservations, gameTable.id_reservations),
    )
    .where(
      and(
        statusCondition,
        mapId ? eq(gameTable.id_map, mapId) : undefined,
        from ? gte(gameTable.started_at, from) : undefined,
        to ? lt(gameTable.started_at, to) : undefined,
      ),
    )
    .orderBy(desc(gameTable.started_at));
}

//Puntuacion media
export async function getAvgScoreGLOBAL() {
  const result = await db
    .select({
      avgScore: avg(gameTable.score).mapWith(Number),
    })
    .from(gameTable)
    .where(eq(gameTable.status, PARTIDA.completed));
  return result;
}

//Listar las reservas
// Aqui necesito la lista de todas las reservas que
// hay de un dia.
//
export async function countReservationNow(fechaHoy: Date) {
  const startOfDay = new Date(fechaHoy);
  startOfDay.setHours(0, 0, 0, 0);

  const startNextDay = new Date(startOfDay);
  startNextDay.setDate(startNextDay.getDate() + 1);
  const result = await db
    .select({
      id_reserv: reservations.id_reservations,
      id_map: mapTable.id_map,
      nameMap: mapTable.name,
      nameUser: user.name,
      reservedAt: reservations.reserve_at,
      status: reservations.status,
      team: reservations.team,
    })
    .from(reservations)
    .innerJoin(user, eq(reservations.id_user, user.id))
    .innerJoin(mapTable, eq(reservations.id_map, mapTable.id_map))
    .where(
      and(
        gte(reservations.reserve_at, startOfDay),
        lt(reservations.reserve_at, startNextDay),
        ne(reservations.status, RESERVAS.cancelled),
      ),
    );

  return result;
}

//DUDA AQUI TODO ---COMPLETADA ?
export async function partidaPorID(id: string) {
  const result = await db
    .select({
      id_game: gameTable.id_game,
      id_map: mapTable.id_map,
      score: gameTable.score,
      status: gameTable.status,
      startedAt: gameTable.started_at,
      endedAt: gameTable.ended_at,
      progess: gameTable.progress,
      id_user: user.id,
      nameUser: user.name,
      team: reservations.team,
      email: user.email,
      name_map: mapTable.name,
      timeLimit: mapTable.time_limit,
      dificulty: mapTable.difficulty,
      maxScore: mapTable.max_score,
      is_active: mapTable.is_active,
    })
    .from(gameTable)
    .innerJoin(
      reservations,
      eq(reservations.id_reservations, gameTable.id_reservations),
    )
    .innerJoin(mapTable, eq(gameTable.id_map, mapTable.id_map))
    .innerJoin(user, eq(gameTable.id_user, user.id))
    .where(eq(gameTable.id_game, id));
  return result;
}

//Tasa de exito de las partidas compeltas y terminadas.
//
export async function tasaDeExitoGLOBAL(): Promise<number> {
  const [result] = await db
    .select({
      completadas:
        sql<number>`count(*) filter (where ${gameTable.status} = 'completed')`.mapWith(
          Number,
        ),
      abandonadas:
        sql<number>`count(*) filter (where ${gameTable.status} = 'abandoned')`.mapWith(
          Number,
        ),
    })
    .from(gameTable);
  const totalFinalizadas = result!.completadas + result!.abandonadas;
  if (totalFinalizadas === 0) return 0;
  return Number(((result!.completadas / totalFinalizadas) * 100).toFixed(2));
}

//Listar las salas ocupadas
export async function numeroSalasActivas() {
  const result = await db
    .select({ total: count() })
    .from(mapTable)
    .where(eq(mapTable.is_active, true));
  return result[0]?.total;
}

//Listar las partidas en curso
export async function partidasEnCurso() {
  const result = await db
    .select({
      id_game: gameTable.id_game,
      id_reserv: reservations.id_reservations,
      id_map: mapTable.id_map,
      score: gameTable.score,
      progress: gameTable.progress,
      startAt: gameTable.started_at,
      timeLimit: mapTable.time_limit,
      name: mapTable.name,
      user_name: user.name,
      team: reservations.team,
      maxScore: mapTable.max_score,
    })
    .from(gameTable)
    .innerJoin(
      reservations,
      eq(reservations.id_reservations, gameTable.id_reservations),
    )
    .innerJoin(user, eq(user.id, gameTable.id_user))
    .innerJoin(mapTable, eq(gameTable.id_map, mapTable.id_map))
    .where(eq(gameTable.status, PARTIDA.in_progress));
  return result;
}

//Comprobar si una sala se puede borrar: no puede tener partidas ni reservas (claves foráneas)
//Devuelve true si se puede borrar
export async function checkDeSalaHistorial(id: string) {
  const [partidas] = await db
    .select({ total: count() })
    .from(gameTable)
    .where(eq(gameTable.id_map, id));
  const [reservas] = await db
    .select({ total: count() })
    .from(reservations)
    .where(eq(reservations.id_map, id));

  return (partidas?.total ?? 0) === 0 && (reservas?.total ?? 0) === 0;
}

export async function totalPartidas() {
  const [result] = await db.select({ total: count() }).from(gameTable);
  return result?.total ?? 0;
}

export async function estadisticasPorSala() {
  return await db
    .select({
      id_map: gameTable.id_map,
      partidas: count(),
      completadas:
        sql<number>`count(*) filter (where ${gameTable.status} = ${PARTIDA.completed})`.mapWith(
          Number,
        ),
      puntuacionMedia:
        sql<number>`avg(${gameTable.score}) filter (where ${gameTable.status} = ${PARTIDA.completed})`.mapWith(
          Number,
        ),
      tiempoMedio:
        sql<number>`avg(extract(epoch from ${gameTable.ended_at} - ${gameTable.started_at}) / 60) filter (where ${gameTable.status} = ${PARTIDA.completed})`.mapWith(
          Number,
        ),
    })
    .from(gameTable)
    .where(
      or(
        eq(gameTable.status, PARTIDA.completed),
        eq(gameTable.status, PARTIDA.abandoned),
      ),
    )
    .groupBy(gameTable.id_map);
}

//Una sala por id con sus 4 puzzles ordenados
export async function salaConPuzzles(id: string) {
  const result = await db.query.mapTable.findFirst({
    where: { id_map: id },
    with: { puzzles: { orderBy: { index1_4: "asc" } } },
  });
  return result ?? null;
}

// Una reserva por id, con sala y usuario, para el editor de reservas.
// TODO

//Comprobar si hay hueco en un horario si hay otra reserva en la misma sala con reserved_at que no este cancelada (si esta cancelada ponerla como si se puede mover)
// Comprobar si un hueco está ocupado: otra reserva en la misma sala y a la misma reserve_at, que no esté cancelada y con un id distinto de la que estás editando.
// TODO

//------------------------------------------------------------ METODOS DE DESTRUCCION ----------------------------------------------------------\\

//Lo editable de un puzzle
type PuzzleInput = {
  title: string;
  message: string;
  solution: string;
  hint: string | null;
};

//Crear un mapa nuevo (una sala) con sus 4 puzzles, todo en una transacción
export async function crearMapa(edit: MapModel, puzzles: PuzzleInput[]) {
  return await db.transaction(async (tx) => {
    const [mapa] = await tx
      .insert(mapTable)
      .values({
        name: edit.name,
        difficulty: edit.difficulty,
        max_score: edit.max_score,
        time_limit: edit.time_limit,
        is_active: edit.is_active,
      })
      .returning();
    const nuevosPuzzles = await tx
      .insert(puzzlesTable)
      .values(
        puzzles.map((p, i) => ({ ...p, id_map: mapa!.id_map, index1_4: i + 1 })),
      )
      .returning();
    return { map: mapa, puzzles: nuevosPuzzles };
  });
}

//Editar un mapa (solo los campos que llegan)
export async function editMapa(edit: Partial<MapModel>, id: string) {
  const result = await db
    .update(mapTable)
    .set(edit)
    .where(eq(mapTable.id_map, id))
    .returning();
  return result;
}

//Editar un puzzle de una sala por su posición (1-4)
export async function editarPuzzle(
  idMap: string,
  index: number,
  edit: Partial<PuzzleInput>,
) {
  const result = await db
    .update(puzzlesTable)
    .set(edit)
    .where(
      and(eq(puzzlesTable.id_map, idMap), eq(puzzlesTable.index1_4, index)),
    )
    .returning();
  return result;
}

//re organizar o modificar una reservacion
//
//  Tal vez utilziar PARTIAL<> TODO
//
export async function actualizarReservacion(
  reserv: ReservationModel,
  id: string,
) {
  const result = await db
    .update(reservations)
    .set({
      reserve_at: reserv.reserve_at,
      id_map: reserv.id_map,
      status: reserv.status,
      team: reserv.team,
    })
    .where(eq(reservations.id_reservations, id))
    .returning();
  return result;
}

// borrar una reservacion
export async function eliminarReservacion(id: string) {
  const result = await db
    .update(reservations)
    .set({
      status: RESERVAS.cancelled,
    })
    .where(eq(reservations.id_reservations, id))
    .returning();
  return result;
}

//Elimianr una sala o sea un mapa junto a sus puzzles
export async function eliminarMapaPuzzles(id: string) {
  if (!(await checkDeSalaHistorial(id))) {
    throw new Error(
      "La sala tiene partidas o reservas; ciérrala en lugar de eliminarla.",
    );
  }
  return await db.transaction(async (txt) => {
    const deletePuzzles = await txt
      .delete(puzzlesTable)
      .where(eq(puzzlesTable.id_map, id))
      .returning();
    const deleteMapa = await txt
      .delete(mapTable)
      .where(eq(mapTable.id_map, id))
      .returning();
    return { map: deleteMapa, puzzles: deletePuzzles };
  });
}
