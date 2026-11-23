/**
 * Tipos del dominio. Reflejan las tablas de back/src/db/schema.ts
 * tal como llegarán serializadas en JSON (fechas como string ISO).
 */

export type GameStatus = 'in_progress' | 'completed' | 'abandoned';
export type ReservationStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';
export type UserRole = 'player' | 'admin';

/** map_table */
export interface MapRoom {
  id_map: string;
  name: string;
  /** 1 (fácil) – 5 (muy difícil) */
  difficulty: number;
  max_score: number;
  /** Minutos */
  time_limit: number;
  is_active: boolean;
}

/** user (Better Auth) */
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

/** puzzles_table */
export interface Puzzle {
  id_puzzles: string;
  id_map: string;
  /** 1 – 4 */
  index1_4: number;
  title: string;
  message: string;
  solution: string;
  hint: string | null;
}

/** reservations */
export interface Reservation {
  id_reservations: string;
  id_map: string;
  id_user: string;
  reserve_at: string;
  status: ReservationStatus;
  team: string | null;
}

/** game_table */
export interface Game {
  id_game: string;
  id_reservations: string;
  id_user: string;
  id_map: string;
  score: number;
  /** 0 – 100. Cada puzzle resuelto suma 25 */
  progress: number;
  started_at: string;
  ended_at: string | null;
  status: GameStatus;
}

/* ───────────── Vistas compuestas que devolverá la API ───────────── */

/** Partida con su sala, jugador y equipo ya resueltos (GET /admin/games) */
export interface GameWithDetails extends Game {
  map: Pick<MapRoom, 'id_map' | 'name' | 'difficulty' | 'max_score' | 'time_limit'>;
  user: Pick<User, 'id' | 'name' | 'email'>;
  team: string | null;
}

export interface ReservationWithDetails extends Reservation {
  map: Pick<MapRoom, 'id_map' | 'name'>;
  user: Pick<User, 'id' | 'name'>;
}

export interface RoomStats {
  id_map: string;
  name: string;
  games: number;
  averageScore: number;
  /** Minutos */
  averageTime: number;
  /** 0 – 1 */
  successRate: number;
}

/** GET /admin/dashboard */
export interface DashboardSummary {
  totalGames: number;
  averageScore: number;
  /** 0 – 1 */
  successRate: number;
  /** 0 – 1: reservas activas de hoy / huecos disponibles hoy */
  occupancy: number;
  reservationsToday: number;
  slotsToday: number;
  activeGames: number;
  rooms: RoomStats[];
  todayReservations: ReservationWithDetails[];
}

/** GET /admin/maps/{id}: sala con sus 4 puzzles */
export interface MapWithPuzzles extends MapRoom {
  puzzles: Puzzle[];
}

/** Lo editable de una sala (PUT /admin/maps/{id}) */
export type MapUpdate = Partial<Omit<MapRoom, 'id_map'>>;

/** Lo editable de un puzzle (PUT /admin/maps/{id}/puzzles/{index}) */
export type PuzzleUpdate = Partial<Pick<Puzzle, 'title' | 'message' | 'solution' | 'hint'>>;

/** Lo editable de una reserva (PUT /admin/reservations/{id}) */
export type ReservationUpdate = Partial<Pick<Reservation, 'reserve_at' | 'id_map' | 'status' | 'team'>>;

/** Sala nueva (POST /admin/maps) con sus 4 puzzles */
export interface MapCreate extends Omit<MapRoom, 'id_map'> {
  puzzles: Pick<Puzzle, 'title' | 'message' | 'solution' | 'hint'>[];
}

/** GET /admin/reservations?from=&to=&status=&map= */
export interface ReservationsQuery {
  /** ISO, inclusivo */
  from?: string;
  /** ISO, exclusivo */
  to?: string;
  status?: ReservationStatus;
  mapId?: string;
}

export interface GamesQuery {
  status?: GameStatus | 'finished';
  mapId?: string;
  /** ISO */
  from?: string;
  /** ISO */
  to?: string;
}
