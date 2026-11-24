import {
  actualizarReservacion,
  eliminarReservacion,
  huecoOcupado,
  listarReservas,
  reservaPorId,
  type ReservasFilters,
} from "../repositoryCompany/repositoryComp.ts";
import { RESERVAS } from "../models/status.ts";
import { ConflictError } from "./errors.ts";

//Agenda de reservas

type ReservaRow = Awaited<ReturnType<typeof listarReservas>>[number];
type CambiosReserva = Parameters<typeof actualizarReservacion>[0];

//Reserva con su sala y usuario anidados, como la espera el front (ReservationWithDetails)
function aReserva(r: ReservaRow) {
  return {
    id_reservations: r.id_reserv,
    id_map: r.id_map,
    id_user: r.id_user,
    reserve_at: r.reservedAt,
    status: r.status,
    team: r.team,
    map: { id_map: r.id_map, name: r.nameMap },
    user: { id: r.id_user, name: r.nameUser },
  };
}

//GET /admin/reservations
export async function listarAgenda(filters: ReservasFilters) {
  const rows = await listarReservas(filters);
  return rows.map(aReserva);
}

//GET /admin/reservations/:id
export async function obtenerReserva(id: string) {
  const r = await reservaPorId(id);
  return r ? aReserva(r) : null;
}

//PUT /admin/reservations/:id: comprueba que el nuevo hueco esté libre antes de guardar
export async function editarReserva(id: string, cambios: CambiosReserva) {
  const actual = await reservaPorId(id);
  if (!actual) return null;

  const idMap = cambios.id_map ?? actual.id_map;
  const reserveAt = cambios.reserve_at ?? actual.reservedAt;
  const status = cambios.status ?? actual.status;

  if (
    status !== RESERVAS.cancelled &&
    (await huecoOcupado(idMap, reserveAt, id))
  ) {
    throw new ConflictError("Esa sala ya tiene una reserva a esa hora.");
  }

  const [reserva] = await actualizarReservacion(cambios, id);
  return reserva ?? null;
}

//DELETE /admin/reservations/:id: cancela la reserva (no la borra)
export async function cancelarReserva(id: string) {
  const [reserva] = await eliminarReservacion(id);
  return reserva ?? null;
}
