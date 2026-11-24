import {
  historialDePartidas,
  partidaPorID,
  partidasEnCurso,
  type HistorialFilters,
} from "../repositoryCompany/repositoryComp.ts";

//Partidas con su sala y jugador anidados, como las espera el front (GameWithDetails)

//GET /admin/games
export async function listarPartidas(filters: HistorialFilters) {
  const rows = await historialDePartidas(filters);
  return rows.map((r) => ({
    id_game: r.id_game,
    id_map: r.id_map,
    id_user: r.id_user,
    score: r.score,
    progress: r.progress,
    status: r.status,
    started_at: r.startedAt,
    ended_at: r.endedAt,
    team: r.team,
    map: {
      id_map: r.id_map,
      name: r.nameMap,
      difficulty: r.dificulty,
      max_score: r.maxScore,
    },
    user: { id: r.id_user, name: r.nameUser, email: r.email },
  }));
}

//GET /admin/games/live
export async function listarPartidasEnCurso() {
  const rows = await partidasEnCurso();
  return rows.map((r) => ({
    id_game: r.id_game,
    id_reservations: r.id_reserv,
    id_map: r.id_map,
    score: r.score,
    progress: r.progress,
    started_at: r.startAt,
    team: r.team,
    map: {
      id_map: r.id_map,
      name: r.name,
      max_score: r.maxScore,
      time_limit: r.timeLimit,
    },
    user: { name: r.user_name },
  }));
}

//GET /admin/games/:id
export async function obtenerPartida(id: string) {
  const [r] = await partidaPorID(id);
  if (!r) return null;
  return {
    id_game: r.id_game,
    id_map: r.id_map,
    id_user: r.id_user,
    score: r.score,
    progress: r.progess,
    status: r.status,
    started_at: r.startedAt,
    ended_at: r.endedAt,
    team: r.team,
    map: {
      id_map: r.id_map,
      name: r.name_map,
      difficulty: r.dificulty,
      max_score: r.maxScore,
      time_limit: r.timeLimit,
    },
    user: { id: r.id_user, name: r.nameUser, email: r.email },
  };
}
