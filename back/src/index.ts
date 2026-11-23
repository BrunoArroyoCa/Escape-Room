import { drizzle } from "drizzle-orm/bun-sql";
import { relations } from "./db/relations.ts";
import { authRelations } from "./db/auth-schema.ts";
import { gameTable, reservations, mapTable } from "../src/db/schema.ts";
import { and, eq, or } from "drizzle-orm";
import { type MapModel } from "../src/models/mapModel.ts";
import { type ReservationModel } from "../src/models/reservtionModel.ts";

export const db = drizzle(process.env.DATABASE_URL!, {
  relations: { ...relations, ...authRelations },
});

/*
Obtener las metricas globales como
- reservas totales,
- tasa de exito,
- puntaciones medias y tiempos por sala


Gestion de salas y puzzles
- obtener todos los mapas
- ver el detalle de una sala especifica con los 4 puzzles y sus pistas
- Editar parametros de la sala como dificultad
- Modificar las pistas

Gestion de Agenda y reservas
- listar todas las reservas
- reorganizar las reservas
- cancelar las reservas
*/

async function getAllReservations() {
  const result = await db
    .select()
    .from(reservations)
    .leftJoin(
      gameTable,
      eq(reservations.id_reservations, gameTable.id_reservations),
    );
  return result;
}

async function progressView() {
  const result = await db
    .select({
      id: gameTable.id_game,
      progress: gameTable.progress,
      score: gameTable.score,
      startAt: gameTable.started_at,
    })
    .from(gameTable)
    .where(eq(gameTable.status, "in progress"));
  return result;
}

async function historicalGames() {
  const result = await db
    .select()
    .from(gameTable)
    .where(
      or(eq(gameTable.status, "completed"), eq(gameTable.status, "abandoned")),
    );
  return result;
}

//......................................................

async function getAllMaps() {
  const result = await db.select().from(mapTable);
  return result;
}

async function createNewMap(newMap: MapModel) {
  await db
    .insert(mapTable)
    .values({
      name: newMap.name,
      difficulty: newMap.dificulty,
      max_score: newMap.max_score,
      time_limit: newMap.time_limit,
      is_active: newMap.is_active,
    })
    .returning();
}

async function editParameterFromMap(id: string, newMap: MapModel) {
  const result = await db
    .update(mapTable)
    .set({
      name: newMap.name,
      difficulty: newMap.dificulty,
      max_score: newMap.max_score,
      time_limit: newMap.time_limit,
      is_active: newMap.is_active,
    })
    .where(eq(mapTable.id_map, id))
    .returning();
  return result;
}

//Me falta la funcion de modificar

//......................................................

async function getAllReservationsNoGameTable() {
  const result = await db.select().from(reservations);
  return result;
}

async function modifyReservstion(id: string, newReserv: ReservationModel) {
  const result = await db
    .update(reservations)
    .set({
      id_map: newReserv.id_map,
      id_user: newReserv.id_user,
      reserve_at: newReserv.reserve_at,
      status: newReserv.status,
      team: newReserv.team,
    })
    .where(eq(reservations.id_reservations, id))
    .returning();
  return result;
}

async function deleteReservation(id: string) {
  const result = await db
    .delete(reservations)
    .where(eq(reservations.id_reservations, id))
    .returning();
  return result;
}
