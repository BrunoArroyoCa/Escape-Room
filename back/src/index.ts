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

