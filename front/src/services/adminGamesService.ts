/**
 * Servicio del panel de administración — "Dashboard y partidas".
 *
 * Cada función corresponde a un endpoint del back. De momento trabaja
 * con los datos de `modelsExample` (NO hace fetch). Cuando la API esté
 * lista, basta con sustituir el cuerpo de cada función por la llamada
 * HTTP indicada en el comentario; la firma y los tipos se mantienen.
 */
import {
  gamesExample,
  mapsExample,
  reservationsExample,
  SESSION_HOURS,
  usersExample,
} from '../modelsExample';
import type {
  DashboardSummary,
  Game,
  GamesQuery,
  GameWithDetails,
  MapRoom,
  ReservationWithDetails,
  RoomStats,
} from '../types/models';

/** Simula la latencia de red para poder ver estados de carga */
const LATENCY_MS = 450;
const delay = <T,>(value: T, ms = LATENCY_MS) =>
  new Promise<T>((resolve) => setTimeout(() => resolve(structuredClone(value)), ms));

const mapById = new Map(mapsExample.map((m) => [m.id_map, m]));
const userById = new Map(usersExample.map((u) => [u.id, u]));
const reservationById = new Map(reservationsExample.map((r) => [r.id_reservations, r]));

function withDetails(game: Game): GameWithDetails {
  const map = mapById.get(game.id_map)!;
  const user = userById.get(game.id_user)!;
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
    team: reservationById.get(game.id_reservations)?.team ?? null,
  };
}

const minutesBetween = (a: string, b: string) =>
  (new Date(b).getTime() - new Date(a).getTime()) / 60_000;

const avg = (xs: number[]) => (xs.length ? xs.reduce((s, x) => s + x, 0) / xs.length : 0);

const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

const toDateKey = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

/* ───────────────────────── Simulación "en vivo" ───────────────────────── */

/**
 * Estado mutable de las partidas en curso. En cada lectura avanza un poco
 * para imitar lo que haría el back (SSE o polling).
 */
const liveState = new Map(
  gamesExample
    .filter((g) => g.status === 'in_progress')
    .map((g) => [g.id_game, { progress: g.progress, score: g.score }]),
);

function tickLiveGames() {
  for (const [id, state] of liveState) {
    const game = gamesExample.find((g) => g.id_game === id)!;
    const map = mapById.get(game.id_map)!;
    if (Math.random() < 0.55) {
      state.progress = Math.min(99, state.progress + Math.round(Math.random() * 4));
      state.score = Math.min(
        map.max_score,
        state.score + Math.round(Math.random() * (map.max_score / 60)),
      );
    }
    game.progress = state.progress;
    game.score = state.score;
  }
}

/* ───────────────────────────── Endpoints ───────────────────────────── */

/** GET /admin/dashboard */
export async function getDashboard(): Promise<DashboardSummary> {
  const now = new Date();
  const finished = gamesExample.filter((g) => g.status !== 'in_progress');
  const completed = finished.filter((g) => g.status === 'completed');

  const rooms: RoomStats[] = mapsExample.map((map) => {
    const roomFinished = finished.filter((g) => g.id_map === map.id_map);
    const roomCompleted = roomFinished.filter((g) => g.status === 'completed');
    return {
      id_map: map.id_map,
      name: map.name,
      games: roomFinished.length,
      averageScore: Math.round(avg(roomCompleted.map((g) => g.score))),
      averageTime: Math.round(avg(roomCompleted.map((g) => minutesBetween(g.started_at, g.ended_at!)))),
      successRate: roomFinished.length ? roomCompleted.length / roomFinished.length : 0,
    };
  });

  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(now);
    d.setDate(d.getDate() - (6 - i));
    return {
      date: toDateKey(d),
      games: gamesExample.filter((g) => isSameDay(new Date(g.started_at), d)).length,
    };
  });

  const todayReservations: ReservationWithDetails[] = reservationsExample
    .filter((r) => isSameDay(new Date(r.reserve_at), now))
    .sort((a, b) => a.reserve_at.localeCompare(b.reserve_at))
    .map((r) => {
      const map = mapById.get(r.id_map)!;
      const user = userById.get(r.id_user)!;
      return {
        ...r,
        map: { id_map: map.id_map, name: map.name },
        user: { id: user.id, name: user.name },
      };
    });

  const activeToday = todayReservations.filter((r) => r.status !== 'cancelled');
  const slotsToday = mapsExample.filter((m) => m.is_active).length * SESSION_HOURS.length;

  return delay({
    totalGames: gamesExample.length,
    averageScore: Math.round(avg(completed.map((g) => g.score))),
    successRate: finished.length ? completed.length / finished.length : 0,
    occupancy: slotsToday ? activeToday.length / slotsToday : 0,
    reservationsToday: activeToday.length,
    slotsToday,
    activeGames: liveState.size,
    rooms,
    last7Days,
    todayReservations,
  });
}

/**
 * GET /admin/games?status=&map=&from=&to=
 * `status: 'finished'` agrupa completed + abandoned (historial).
 */
export async function getGames(query: GamesQuery = {}): Promise<GameWithDetails[]> {
  const { status, mapId, from, to } = query;
  const result = gamesExample
    .filter((g) => {
      if (status === 'finished') return g.status !== 'in_progress';
      return status ? g.status === status : true;
    })
    .filter((g) => (mapId ? g.id_map === mapId : true))
    .filter((g) => (from ? g.started_at >= from : true))
    .filter((g) => (to ? g.started_at <= to : true))
    .sort((a, b) => b.started_at.localeCompare(a.started_at))
    .map(withDetails);
  return delay(result);
}

/** GET /admin/games/{id} */
export async function getGameById(id: string): Promise<GameWithDetails | null> {
  const game = gamesExample.find((g) => g.id_game === id);
  return delay(game ? withDetails(game) : null, 250);
}

/**
 * GET /admin/games/live
 * Con 3 salas se consume por polling (ver hooks/useLiveGames).
 * Si el back expone SSE, aquí se abriría un EventSource.
 */
export async function getLiveGames(): Promise<GameWithDetails[]> {
  tickLiveGames();
  const live = gamesExample.filter((g) => g.status === 'in_progress').map(withDetails);
  return delay(live, 150);
}

/** GET /admin/maps (solo lo necesario para los filtros de partidas) */
export async function getMaps(): Promise<MapRoom[]> {
  return delay(mapsExample, 100);
}
