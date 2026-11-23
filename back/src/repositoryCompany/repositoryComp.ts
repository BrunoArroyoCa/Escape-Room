import {
  gameTable,
  reservations,
  mapTable,
  puzzlesTable,
} from "../../src/db/schema.ts";
import { and, avg, count, eq, or } from "drizzle-orm";
import { type MapModel } from "../../src/models/mapModel.ts";
import { type ReservationModel } from "../../src/models/reservtionModel.ts";
import { db } from "../index.ts";
import { user } from "../db/auth-schema.ts";

//Listar los mapas -> Que son las salas
async function listarLosMapas() {
  const result = await db.select().from(mapTable);
  return result;
}

//Listar el hisotrial de las partidas totales
async function historialDePartidas() {
  const result = await db
    .select({
      id_game: gameTable.id_game,
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
    );
  return result;
}

//Puntuacion media
async function getAvgScore() {
  const result = await db
    .select({
      avgScore: avg(gameTable.score).mapWith(Number),
    })
    .from(gameTable)
    .where(
      or(
        eq(gameTable.status, "Completada"),
        eq(gameTable.status, "Abandonada"),
      ),
    );
  return result;
}

//Listar las reservas
async function countReservationNow(fechaHoy: Date) {
  const result = await db
    .select({
      countReservation: count(reservations.id_reservations),
    })
    .from(reservations)
    .where(eq(reservations.reserve_at, fechaHoy));
  return fechaHoy;
}

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
      name_map: mapTable.name,
      timeLimit: mapTable.time_limit,
      dificulty: mapTable.difficulty,
      maxScore: mapTable.max_score,
      is_active: mapTable.is_active,
      id_puzzle: puzzlesTable.id_puzzles,
      index1_4: puzzlesTable.index1_4,
      title: puzzlesTable.title,
      message: puzzlesTable.message,
      solution: puzzlesTable.solution,
      hint: puzzlesTable.hint,
    })
    .from(gameTable)
    .innerJoin(mapTable, eq(gameTable.id_map, mapTable.id_map))
    .innerJoin(puzzlesTable, eq(mapTable.id_map, puzzlesTable.id_map))
    .innerJoin(user, eq(gameTable.id_user, user.id))
    .where(eq(gameTable.id_game, id));
  return result;
}

//------------------------------------------------------------ METODOS DE DESTRUCCION ----------------------------------------------------------\\

//Crear un mapa nuevo que es crear una sala nnueva
async function crearMapa(edit: MapModel) {
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

//Editar un mapa
async function editMapa(edit: MapModel, id: string) {
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

//Editar los puzles
//
//

//re organizar o modificar una reservacion
async function actualizarReservacion(reserv: ReservationModel, id: string) {
  const result = await db
    .update(reservations)
    .set({
      reserve_at: reserv.reserve_at,
      id_map: reserv.id_map,
      status: reserv.status,
    })
    .where(eq(reservations.id_reservations, id))
    .returning();
  return result;
}

// borrar una reservacion

async function eliminarReservacion(id: string) {
  const result = await db
    .delete(reservations)
    .where(eq(reservations.id_reservations, id))
    .returning();
  return result;
}
