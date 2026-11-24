import {
  estadisticasPorSala,
  getAvgScoreGLOBAL,
  listarLosMapas,
  numeroSalasActivas,
  partidasEnCurso,
  tasaDeExitoGLOBAL,
  totalPartidas,
} from "../repositoryCompany/repositoryComp.ts";
import { RESERVAS } from "../models/status.ts";
import { listarAgenda } from "./reservationsService.ts";

//Sesiones por sala y día (10, 12, 14, 16, 18 y 20 h)
const SESIONES_POR_DIA = 6;

//GET /admin/dashboard: resumen global, por sala y de hoy (DashboardSummary)
export async function obtenerDashboard() {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const manana = new Date(hoy);
  manana.setDate(hoy.getDate() + 1);

  const [total, [media], tasa, salasActivas, stats, mapas, reservasHoy, enCurso] =
    await Promise.all([
      totalPartidas(),
      getAvgScoreGLOBAL(),
      tasaDeExitoGLOBAL(),
      numeroSalasActivas(),
      estadisticasPorSala(),
      listarLosMapas(),
      listarAgenda({ from: hoy, to: manana }),
      partidasEnCurso(),
    ]);

  const activasHoy = reservasHoy.filter((r) => r.status !== RESERVAS.cancelled);
  const slotsToday = (salasActivas ?? 0) * SESIONES_POR_DIA;

  return {
    totalGames: total,
    averageScore: Math.round(media?.avgScore ?? 0),
    successRate: tasa / 100,
    occupancy: slotsToday ? activasHoy.length / slotsToday : 0,
    reservationsToday: activasHoy.length,
    slotsToday,
    activeGames: enCurso.length,
    //Las salas sin partidas no salen en las estadísticas: se completan con 0
    rooms: mapas.map((m) => {
      const s = stats.find((x) => x.id_map === m.id_map);
      return {
        id_map: m.id_map,
        name: m.name,
        games: s?.partidas ?? 0,
        averageScore: Math.round(s?.puntuacionMedia ?? 0),
        averageTime: Math.round(s?.tiempoMedio ?? 0),
        successRate: s && s.partidas ? s.completadas / s.partidas : 0,
      };
    }),
    todayReservations: reservasHoy,
  };
}
