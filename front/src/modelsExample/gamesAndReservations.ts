/**
 * Datos de ejemplo para desarrollo (sin backend).
 *
 * Se generan de forma determinista (semilla fija) y relativos a la
 * fecha actual, para que siempre haya partidas "de hoy", historial de
 * los últimos 30 días y partidas en curso.
 */
import type { Game, Reservation } from '../types/models';
import { mapsExample } from './maps';
import { usersExample } from './users';

/* PRNG con semilla (mulberry32) para que los datos no cambien entre recargas */
function seeded(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rand = seeded(47);
const between = (min: number, max: number) => min + rand() * (max - min);
const pick = <T,>(arr: readonly T[]) => arr[Math.floor(rand() * arr.length)]!;

const teams = [
  'Los Descifradores',
  'Equipo Enigma',
  'Las Llaves Perdidas',
  'Código Rojo',
  'Los Insomnes',
  'Brújula Rota',
  'Mente Colmena',
  'Sin Salida',
  'Los Herejes',
  'Candado Dorado',
];

/** Horarios de sesión por sala */
export const SESSION_HOURS = [10, 12, 14, 16, 18, 20] as const;

let counter = 0;
const uuid = (prefix: string) =>
  `${prefix}-${(++counter).toString(16).padStart(4, '0')}-4a1b-9c2d-${Math.floor(rand() * 1e12)
    .toString(16)
    .padStart(12, '0')}`;

export const reservationsExample: Reservation[] = [];
export const gamesExample: Game[] = [];

const now = new Date();
const startOfToday = new Date(now);
startOfToday.setHours(0, 0, 0, 0);

// 30 días de historial, hoy y 7 días de reservas futuras
for (let dayOffset = 29; dayOffset >= -7; dayOffset--) {
  const day = new Date(startOfToday);
  day.setDate(day.getDate() - dayOffset);
  const isToday = dayOffset === 0;

  for (const map of mapsExample) {
    for (const hour of SESSION_HOURS) {
      // Más ocupación en fin de semana y por la tarde
      const weekend = day.getDay() === 0 || day.getDay() === 6;
      const baseChance = (weekend ? 0.75 : 0.42) + (hour >= 16 ? 0.15 : 0);
      if (rand() > baseChance && !isToday) continue;
      if (isToday && rand() > 0.8) continue;

      const reserveAt = new Date(day);
      reserveAt.setHours(hour, 0, 0, 0);
      const user = pick(usersExample);
      const team = rand() > 0.15 ? pick(teams) : null;
      const sessionEnd = new Date(reserveAt.getTime() + map.time_limit * 60_000);

      const reservation: Reservation = {
        id_reservations: uuid('r'),
        id_map: map.id_map,
        id_user: user.id,
        reserve_at: reserveAt.toISOString(),
        status: 'confirmed',
        team,
      };

      // Algunas reservas canceladas
      if (rand() < 0.07) {
        reservation.status = 'cancelled';
        reservationsExample.push(reservation);
        continue;
      }

      const inFuture = reserveAt > now;
      const running = reserveAt <= now && sessionEnd > now;

      if (inFuture) {
        reservation.status = rand() > 0.25 ? 'confirmed' : 'pending';
        reservationsExample.push(reservation);
        continue;
      }

      reservation.status = running ? 'confirmed' : 'completed';
      reservationsExample.push(reservation);

      const startedAt = new Date(reserveAt.getTime() + between(1, 6) * 60_000);

      if (running) {
        const elapsedRatio = (now.getTime() - startedAt.getTime()) / (map.time_limit * 60_000);
        const progress = Math.min(95, Math.round(elapsedRatio * between(70, 120)));
        gamesExample.push({
          id_game: uuid('g'),
          id_reservations: reservation.id_reservations,
          id_user: user.id,
          id_map: map.id_map,
          score: Math.round((progress / 100) * map.max_score * between(0.55, 0.8)),
          progress: Math.max(5, progress),
          started_at: startedAt.toISOString(),
          ended_at: null,
          status: 'in_progress',
        });
        continue;
      }

      const success = rand() < 0.68 - (map.difficulty - 3) * 0.08;
      const minutes = success
        ? between(map.time_limit * 0.55, map.time_limit * 0.98)
        : between(map.time_limit * 0.4, map.time_limit);
      const endedAt = new Date(startedAt.getTime() + minutes * 60_000);
      const timeBonus = 1 - minutes / map.time_limit;
      const progress = success ? 100 : pick([25, 50, 50, 75, 75]);
      const score = success
        ? Math.round(map.max_score * (0.6 + timeBonus * 0.8) * between(0.85, 1))
        : Math.round(map.max_score * (progress / 100) * between(0.3, 0.5));

      gamesExample.push({
        id_game: uuid('g'),
        id_reservations: reservation.id_reservations,
        id_user: user.id,
        id_map: map.id_map,
        score: Math.min(map.max_score, score),
        progress,
        started_at: startedAt.toISOString(),
        ended_at: endedAt.toISOString(),
        status: success ? 'completed' : 'abandoned',
      });
    }
  }
}

/* Garantiza al menos 2 partidas en vivo para que el panel nunca esté vacío en desarrollo */
const liveCount = gamesExample.filter((g) => g.status === 'in_progress').length;
for (let i = liveCount; i < 2; i++) {
  const map = mapsExample[i]!;
  const user = usersExample[i + 3]!;
  const startedAt = new Date(now.getTime() - between(8, 35) * 60_000);
  const reservation: Reservation = {
    id_reservations: uuid('r'),
    id_map: map.id_map,
    id_user: user.id,
    reserve_at: startedAt.toISOString(),
    status: 'confirmed',
    team: pick(teams),
  };
  reservationsExample.push(reservation);
  const progress = Math.round(between(15, 60));
  gamesExample.push({
    id_game: uuid('g'),
    id_reservations: reservation.id_reservations,
    id_user: user.id,
    id_map: map.id_map,
    score: Math.round((progress / 100) * map.max_score * 0.6),
    progress,
    started_at: startedAt.toISOString(),
    ended_at: null,
    status: 'in_progress',
  });
}

/*
 * Ejemplo forzado: la partida en curso de la tercera sala está en sus
 * últimos minutos, para poder ver en desarrollo el aviso rojo de "últimos
 * minutos" del plano. Con datos reales esto lo decide el reloj de la partida.
 */
{
  const map = mapsExample[2]!;
  const urgent = gamesExample.find((g) => g.status === 'in_progress' && g.id_map === map.id_map);
  if (urgent) {
    urgent.started_at = new Date(now.getTime() - (map.time_limit - 8.5) * 60_000).toISOString();
    urgent.progress = Math.max(urgent.progress, 75);
    urgent.score = Math.max(urgent.score, Math.round(map.max_score * 0.55));
  }
}
