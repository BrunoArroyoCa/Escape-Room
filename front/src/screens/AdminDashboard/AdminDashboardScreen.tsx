import { useRef, useState } from 'react';
import { ALL, AgendaMatrix, type AgendaFilters } from '../../components/dashboard/AgendaMatrix';
import { FiguresBand, type FigureTarget } from '../../components/dashboard/FiguresBand';
import { ALL_ROOMS, HistorySection, type HistoryFilters } from '../../components/dashboard/HistorySection';
import { TitleBlock } from '../../components/dashboard/TitleBlock';
import { FloorPlan } from '../../components/plan/FloorPlan';
import { SheetHost, type SheetTarget } from '../../components/sheets/SheetHost';
import { useQuery } from '../../hooks/useQuery';
import { getDashboard, getGames, getLiveGames, getMaps, getReservations } from '../../services/adminService';
import { addDays, fromDateKey, startOfDay, toDateKey } from '../../utils/dates';
import styles from './AdminDashboardScreen.module.css';

/** Intervalo de refresco del directo (GET /admin/games/live por polling) */
const LIVE_POLL_MS = 3000;

/** Rango [desde, hasta) del historial según el periodo elegido */
function historyRange(f: HistoryFilters): { from?: string; to?: string } {
  const today = startOfDay(new Date());
  switch (f.period) {
    case 'today':
      return { from: today.toISOString() };
    case '7d':
      return { from: addDays(today, -6).toISOString() };
    case '30d':
      return { from: addDays(today, -29).toISOString() };
    case 'range':
      return {
        from: f.from ? fromDateKey(f.from).toISOString() : undefined,
        to: f.to ? addDays(fromDateKey(f.to), 1).toISOString() : undefined,
      };
    default:
      return {};
  }
}

/**
 * Panel único de empresa: cifras, salas en directo, agenda e historial.
 * Todo se crea, edita o consulta en una hoja lateral al pulsarlo.
 */
export function AdminDashboardScreen() {
  const dashboard = useQuery(getDashboard, [], 15000);
  const maps = useQuery(getMaps, []);
  const live = useQuery(getLiveGames, [], LIVE_POLL_MS);
  const mapList = maps.data ?? [];
  const liveGames = live.data ?? [];

  /* Agenda: un día, con filtros de estado y sala */
  const [agenda, setAgenda] = useState<AgendaFilters>({ day: startOfDay(new Date()), status: ALL, mapId: ALL });
  // Si la sala filtrada se elimina, vuelve a "Todas"
  const agendaMap = agenda.mapId === ALL || mapList.some((m) => m.id_map === agenda.mapId) ? agenda.mapId : ALL;
  const reservations = useQuery(
    () =>
      getReservations({
        from: agenda.day.toISOString(),
        to: addDays(agenda.day, 1).toISOString(),
        status: agenda.status === ALL ? undefined : agenda.status,
        mapId: agendaMap === ALL ? undefined : agendaMap,
      }),
    [toDateKey(agenda.day), agenda.status, agendaMap],
  );

  /* Historial */
  const [filters, setFilters] = useState<HistoryFilters>({
    mapId: ALL_ROOMS,
    period: '30d',
    result: 'finished',
    from: toDateKey(addDays(new Date(), -6)),
    to: toDateKey(new Date()),
  });
  const historyMap =
    filters.mapId === ALL_ROOMS || mapList.some((m) => m.id_map === filters.mapId) ? filters.mapId : ALL_ROOMS;
  const history = useQuery(
    () =>
      getGames({
        status: filters.result,
        mapId: historyMap === ALL_ROOMS ? undefined : historyMap,
        ...historyRange(filters),
      }),
    [historyMap, filters.period, filters.result, filters.from, filters.to],
  );

  const [sheet, setSheet] = useState<SheetTarget | null>(null);
  const agendaRef = useRef<HTMLElement>(null);
  const historyRef = useRef<HTMLElement>(null);

  function showProof(target: FigureTarget) {
    if (target === 'agenda') {
      setAgenda({ day: startOfDay(new Date()), status: ALL, mapId: ALL });
      agendaRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      agendaRef.current?.focus({ preventScroll: true });
      return;
    }
    setFilters({ ...filters, mapId: ALL_ROOMS, period: 'all', result: target === 'history-completed' ? 'completed' : 'finished' });
    historyRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    historyRef.current?.focus({ preventScroll: true });
  }

  return (
    <div className={styles.screen}>
      <TitleBlock maps={mapList} />
      <main className={styles.sheet}>
        <FiguresBand data={dashboard.data} onShow={showProof} />

        <div className={styles.live}>
          <FloorPlan
            maps={mapList}
            live={liveGames}
            stats={dashboard.data?.rooms ?? []}
            today={dashboard.data?.todayReservations ?? []}
            onEditRoom={(id) => setSheet({ type: 'room', id })}
            onOpenGame={(id) => setSheet({ type: 'game', id })}
            onNewRoom={() => setSheet({ type: 'new-room' })}
          />
          <AgendaMatrix
            ref={agendaRef}
            maps={mapList}
            reservations={reservations.data ?? []}
            loading={reservations.loading}
            live={liveGames}
            filters={{ ...agenda, mapId: agendaMap }}
            onFilters={setAgenda}
            onOpen={(id) => setSheet({ type: 'reservation', id })}
          />
        </div>

        <HistorySection
          ref={historyRef}
          maps={mapList}
          games={history.data ?? []}
          loading={history.loading}
          filters={{ ...filters, mapId: historyMap }}
          onFilters={setFilters}
          onOpen={(id) => setSheet({ type: 'game', id })}
        />
      </main>

      <SheetHost target={sheet} maps={mapList} live={liveGames} onClose={() => setSheet(null)} onOpen={setSheet} />
    </div>
  );
}
