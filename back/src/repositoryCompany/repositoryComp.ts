import {
  gameTable,
  reservations,
  mapTable,
  puzzlesTable,
} from "../../src/db/schema.ts";
import { and, avg, count, desc, eq, gte, lt, ne, or, sql } from "drizzle-orm";
import { type MapModel } from "../../src/models/mapModel.ts";
import { type ReservationModel } from "../../src/models/reservtionModel.ts";
import { db } from "../index.ts";
import { user } from "../db/auth-schema.ts";

//Listar los mapas -> Que son las salas
export async function listarLosMapas() {
  const result = await db.select().from(mapTable);
  return result;
}

//Listar el hisotrial de las partidas totales
// TODO falta filtros
export async function historialDePartidas() {
  const result = await db
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
      or(
        eq(gameTable.status, "Abandonada"),
        eq(gameTable.status, "Completada"),
      ),
    )
    .orderBy(desc(gameTable.started_at));
  return result;
}

//Puntuacion media
export async function getAvgScoreGLOBAL() {
  const result = await db
    .select({
      avgScore: avg(gameTable.score).mapWith(Number),
    })
    .from(gameTable)
    .where(eq(gameTable.status, "Completada"));
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
        ne(reservations.status, "Cancelado"),
      ),
    );

  return result.length;
}

//DUDA AQUI TODO ---COMPLETADA ?
async function viewCurrentsMaps(id: string) {
  const result = await db
    .select({
      id_game: gameTable.id_game,
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
    .innerJoin(mapTable, eq(gameTable.id_map, mapTable.id_map))
    .innerJoin(user, eq(gameTable.id_user, user.id))
    .where(eq(gameTable.id_game, id));
  return result;
}

//Tasa de exito de las partidas compeltas y terminadas.
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
  return result;
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
    .where(eq(gameTable.status, "in Game"));
  return result;
}

//Contar el historial de partidas de una sala para no que este prohibido borrala por el historial
export async function checkDeSalaHistorial(id: string) {
  const result = await db
    .select({
      countPartidas: count(gameTable.id_game),
    })
    .from(gameTable)
    .innerJoin(
      reservations,
      eq(reservations.id_reservations, gameTable.id_reservations),
    )
    .innerJoin(mapTable, eq(gameTable.id_map, mapTable.id_map))
    .where(eq(mapTable.id_map, id));

  return result[0]?.countPartidas === 0;
}

//Listar los puzzles por id del mapa TODO

//Puntacion media, numero de partidas, tiempo medio, tasa de exito por sala   ---> sql`avg(extract(epoch from ${gameTable.ended_at} - ${gameTable.started_at})) / 60` ;  <-------- TODO

//Total de partidas globales.  TODO

// Una reserva por id, con sala y usuario, para el editor de reservas.
// TODO

//Comprobar si hay hueco en un horario si hay otra reserva en la misma sala con reserved_at que no este cancelada (si esta cancelada ponerla como si se puede mover)
// Comprobar si un hueco está ocupado: otra reserva en la misma sala y a la misma reserve_at, que no esté cancelada y con un id distinto de la que estás editando.
// TODO

//------------------------------------------------------------ METODOS DE DESTRUCCION ----------------------------------------------------------\\

//Crear un mapa nuevo que es crear una sala nnueva
//
// FALTA LOS PUZZLES hacerlo de forma atomica en una misma querie
//
export async function crearMapa(edit: MapModel) {
  const result = await db
    .insert(mapTable)
    .values({
      name: edit.name,
      difficulty: edit.dificulty,
      max_score: edit.max_score,
      time_limit: edit.time_limit,
      is_active: edit.is_active,
    })
    .returning();
  return result;
}

//Editar un mapa TODO usar Partial <>
export async function editMapa(edit: MapModel, id: string) {
  const result = await db
    .update(mapTable)
    .set({
      name: edit.name,
      difficulty: edit.dificulty,
      max_score: edit.max_score,
      time_limit: edit.time_limit,
      is_active: edit.is_active,
    })
    .where(eq(mapTable.id_map, id))
    .returning();
  return result;
}

//
//Editar los puzles TODO
//

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
      status: "Cancelled",
    })
    .where(eq(reservations.id_reservations, id))
    .returning();
  return result;
}

//Elimianr una sala o sea un mapa junto a sus puzzles
export async function eliminarMapaPuzzles(id: string) {
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
