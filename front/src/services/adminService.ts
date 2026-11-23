/**
 * Servicio del panel de administración.
 *
 * Cada función corresponde a un endpoint del back y está documentada con él.
 * De momento trabaja sobre una copia en memoria de `modelsExample` (NO hace
 * fetch). Cuando la API exista, sustituye el cuerpo de cada función por la
 * llamada HTTP; las firmas y los tipos se mantienen y la UI no cambia.
 *
 * Las mutaciones notifican a los suscriptores (`subscribe`) para que las
 * vistas vuelvan a pedir los datos, igual que harían tras un PUT real.
 */
import {
  gamesExample,
  mapsExample,
  puzzlesExample,
  reservationsExample,
  SESSION_HOURS as SESSION_HOURS_EXAMPLE,
  usersExample,
} from '../modelsExample';
import type {
  DashboardSummary,
  MapCreate,
  ReservationsQuery,
  Game,
  GamesQuery,
  GameWithDetails,
  MapRoom,
  MapUpdate,
  MapWithPuzzles,
  Puzzle,
  PuzzleUpdate,
  Reservation,
  ReservationUpdate,
  ReservationWithDetails,
  RoomStats,
} from '../types/models';

/* ───────────── Base de datos en memoria ───────────── */

const db = {
  maps: structuredClone(mapsExample) as MapRoom[],
  puzzles: structuredClone(puzzlesExample) as Puzzle[],
  reservations: structuredClone(reservationsExample) as Reservation[],
  games: structuredClone(gamesExample) as Game[],
  users: usersExample,
};

/** Horarios de sesión de cada sala */
export const SESSION_HOURS = SESSION_HOURS_EXAMPLE;

/**
 * Orden fijo de cada sala (para su color y su número). Se asigna al crearla y
 * no se reutiliza al eliminar otra, así ninguna sala cambia de color.
 */
const roomOrder = new Map(db.maps.map((m, i) => [m.id_map, i + 1]));
let nextOrder = db.maps.length + 1;
export const roomNumber = (id_map: string) => roomOrder.get(id_map) ?? 0;

const listeners = new Set<() => void>();

/** Se llama tras cada cambio de datos. Devuelve la función para desuscribirse. */
export function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
const notify = () => listeners.forEach((l) => l());

const LATENCY_MS = 180;
const respond = <T,>(value: T, ms = LATENCY_MS) =>
  new Promise<T>((resolve) => setTimeout(() => resolve(structuredClone(value)), ms));

/* ───────────── Utilidades ───────────── */

const mapOf = (id: string) => db.maps.find((m) => m.id_map === id)!;
const userOf = (id: string) => db.users.find((u) => u.id === id)!;

function withDetails(game: Game): GameWithDetails {
  const map = mapOf(game.id_map);
  const user = userOf(game.id_user);
  return {
    ...game,
    map: {
      id_map: map.id_map,
      name: map.name,
      difficulty: map.difficulty,
      max_score: map.max_score,
      time_limit: map.time_limit,
    },
    user: { id: user.id, name: user.name, email: user.email },
    team: db.reservations.find((r) => r.id_reservations === game.id_reservations)?.team ?? null,
  };
}

function reservationDetails(r: Reservation): ReservationWithDetails {
  const map = mapOf(r.id_map);
  const user = userOf(r.id_user);
  return { ...r, map: { id_map: map.id_map, name: map.name }, user: { id: user.id, name: user.name } };
}

const minutes = (from: string, to: string) => (new Date(to).getTime() - new Date(from).getTime()) / 60_000;
const avg = (xs: number[]) => (xs.length ? xs.reduce((s, x) => s + x, 0) / xs.length : 0);
const sameDay = (a: Date, b: Date) => a.toDateString() === b.toDateString();

/* ───────────── Simulación en vivo ───────────── */

/** Avanza las partidas en curso, como llegaría del juego por SSE o polling */
function tickLiveGames() {
  for (const game of db.games) {
    if (game.status !== 'in_progress') continue;
    const map = mapOf(game.id_map);
    if (Math.random() < 0.35) {
      game.progress = Math.min(99, game.progress + Math.round(Math.random() * 6));
      game.score = Math.min(map.max_score, game.score + Math.round(Math.random() * (map.max_score / 50)));
    }
  }
}

/* ───────────── Dashboard y partidas ───────────── */

/** GET /admin/dashboard */
export async function getDashboard(): Promise<DashboardSummary> {
  const now = new Date();
  const finished = db.games.filter((g) => g.status !== 'in_progress');
  const completed = finished.filter((g) => g.status === 'completed');

  const rooms: RoomStats[] = db.maps.map((map) => {
    const all = finished.filter((g) => g.id_map === map.id_map);
    const ok = all.filter((g) => g.status === 'completed');
    return {
      id_map: map.id_map,
      name: map.name,
      games: all.length,
      averageScore: Math.round(avg(ok.map((g) => g.score))),
      averageTime: Math.round(avg(ok.map((g) => minutes(g.started_at, g.ended_at!)))),
      successRate: all.length ? ok.length / all.length : 0,
    };
  });

  const todayReservations = db.reservations
    .filter((r) => sameDay(new Date(r.reserve_at), now))
    .sort((a, b) => a.reserve_at.localeCompare(b.reserve_at))
    .map(reservationDetails);
  const active = todayReservations.filter((r) => r.status !== 'cancelled');
  const slotsToday = db.maps.filter((m) => m.is_active).length * SESSION_HOURS.length;

  return respond({
    totalGames: db.games.length,
    averageScore: Math.round(avg(completed.map((g) => g.score))),
    successRate: finished.length ? completed.length / finished.length : 0,
    occupancy: slotsToday ? active.length / slotsToday : 0,
    reservationsToday: active.length,
    slotsToday,
    activeGames: db.games.filter((g) => g.status === 'in_progress').length,
    rooms,
    todayReservations,
  });
}

/** GET /admin/games?status=&map=&from=&to=  ('finished' = completed + abandoned) */
export async function getGames(query: GamesQuery = {}): Promise<GameWithDetails[]> {
  const { status, mapId, from, to } = query;
  const result = db.games
    .filter((g) => (status === 'finished' ? g.status !== 'in_progress' : status ? g.status === status : true))
    .filter((g) => !mapId || g.id_map === mapId)
    .filter((g) => !from || g.started_at >= from)
    .filter((g) => !to || g.started_at <= to)
    .sort((a, b) => b.started_at.localeCompare(a.started_at))
    .map(withDetails);
  return respond(result);
}

/** GET /admin/games/{id} */
export async function getGameById(id: string): Promise<GameWithDetails | null> {
  const game = db.games.find((g) => g.id_game === id);
  return respond(game ? withDetails(game) : null);
}

/** GET /admin/games/live (consumido por polling; con SSE sería un EventSource) */
export async function getLiveGames(): Promise<GameWithDetails[]> {
  tickLiveGames();
  return respond(db.games.filter((g) => g.status === 'in_progress').map(withDetails), 80);
}

/* ───────────── Salas y puzzles ───────────── */

/** GET /admin/maps */
export async function getMaps(): Promise<MapRoom[]> {
  return respond(db.maps, 60);
}

/** GET /admin/maps/{id} */
export async function getMapById(id: string): Promise<MapWithPuzzles | null> {
  const map = db.maps.find((m) => m.id_map === id);
  if (!map) return respond(null);
  const puzzles = db.puzzles.filter((p) => p.id_map === id).sort((a, b) => a.index1_4 - b.index1_4);
  return respond({ ...map, puzzles });
}

/** POST /admin/maps: crea una sala con sus 4 puzzles */
export async function createMap(data: MapCreate): Promise<MapRoom> {
  const { puzzles, ...fields } = data;
  const id_map = crypto.randomUUID();
  const map: MapRoom = { id_map, ...fields };
  db.maps.push(map);
  roomOrder.set(id_map, nextOrder++);
  puzzles.forEach((p, i) =>
    db.puzzles.push({ id_puzzles: crypto.randomUUID(), id_map, index1_4: i + 1, ...p }),
  );
  notify();
  return respond(map);
}

/** Cuántas partidas y reservas cuelgan de una sala (impiden borrarla) */
export function mapUsage(id: string) {
  return {
    games: db.games.filter((g) => g.id_map === id).length,
    reservations: db.reservations.filter((r) => r.id_map === id).length,
  };
}

/**
 * DELETE /admin/maps/{id}. Como en la base de datos, una sala con partidas o
 * reservas no se puede borrar (claves foráneas): hay que cerrarla.
 */
export async function deleteMap(id: string): Promise<void> {
  const usage = mapUsage(id);
  if (usage.games || usage.reservations) {
    throw new Error('La sala tiene partidas o reservas; ciérrala en lugar de eliminarla.');
  }
  db.maps = db.maps.filter((m) => m.id_map !== id);
  db.puzzles = db.puzzles.filter((p) => p.id_map !== id);
  notify();
  return respond(undefined);
}

/** PUT /admin/maps/{id} */
export async function updateMap(id: string, changes: MapUpdate): Promise<MapRoom> {
  const map = mapOf(id);
  Object.assign(map, changes);
  notify();
  return respond(map);
}

/** PUT /admin/maps/{id}/puzzles/{index} */
export async function updatePuzzle(mapId: string, index: number, changes: PuzzleUpdate): Promise<Puzzle> {
  const puzzle = db.puzzles.find((p) => p.id_map === mapId && p.index1_4 === index)!;
  Object.assign(puzzle, changes);
  notify();
  return respond(puzzle);
}

/* ───────────── Reservas ───────────── */

/** GET /admin/reservations?from=&to=&status=&map= */
export async function getReservations(query: ReservationsQuery = {}): Promise<ReservationWithDetails[]> {
  const { from, to, status, mapId } = query;
  const result = db.reservations
    .filter((r) => (!from || r.reserve_at >= from) && (!to || r.reserve_at < to))
    .filter((r) => !status || r.status === status)
    .filter((r) => !mapId || r.id_map === mapId)
    .sort((a, b) => a.reserve_at.localeCompare(b.reserve_at))
    .map(reservationDetails);
  return respond(result, 90);
}

/** GET /admin/reservations/{id} (detalle para editar) */
export async function getReservationById(id: string): Promise<ReservationWithDetails | null> {
  const r = db.reservations.find((x) => x.id_reservations === id);
  return respond(r ? reservationDetails(r) : null, 60);
}

/** PUT /admin/reservations/{id}: cambia hora, sala o estado */
export async function updateReservation(id: string, changes: ReservationUpdate): Promise<Reservation> {
  const r = db.reservations.find((x) => x.id_reservations === id)!;
  Object.assign(r, changes);
  notify();
  return respond(r);
}

/** DELETE /admin/reservations/{id}: cancela la reserva (se conserva como cancelada) */
export async function cancelReservation(id: string): Promise<Reservation> {
  return updateReservation(id, { status: 'cancelled' });
}

/** ¿Hay otra reserva activa en esa sala y hora? Para avisar antes de guardar. */
export function isSlotTaken(mapId: string, reserveAt: string, exceptId: string) {
  return db.reservations.some(
    (r) =>
      r.id_reservations !== exceptId &&
      r.id_map === mapId &&
      r.status !== 'cancelled' &&
      r.reserve_at === reserveAt,
  );
}
