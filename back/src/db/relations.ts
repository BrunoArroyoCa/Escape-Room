import { defineRelations } from "drizzle-orm";
import * as schema from "./schema.ts";
import { user } from "./auth-schema.ts";

export const relations = defineRelations({ ...schema, user }, (r) => ({
  puzzlesTable: {
    map: r.one.mapTable({ from: r.puzzlesTable.id_map, to: r.mapTable.id_map }),
  },
  reservations: {
    map: r.one.mapTable({ from: r.reservations.id_map, to: r.mapTable.id_map }),
    user: r.one.user({ from: r.reservations.id_user, to: r.user.id }),
  },
  gameTable: {
    reservation: r.one.reservations({
      from: r.gameTable.id_reservations,
      to: r.reservations.id_reservations,
    }),
    user: r.one.user({ from: r.gameTable.id_user, to: r.user.id }),
    map: r.one.mapTable({ from: r.gameTable.id_map, to: r.mapTable.id_map }),
  },
  mapTable: {
    puzzles: r.many.puzzlesTable({
      from: r.mapTable.id_map,
      to: r.puzzlesTable.id_map,
    }),
    reservations: r.many.reservations({
      from: r.mapTable.id_map,
      to: r.reservations.id_map,
    }),
  },
}));
