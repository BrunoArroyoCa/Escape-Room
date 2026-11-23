import { motion } from 'motion/react';
import { useState } from 'react';
import { RoomPerformance } from '../../../components/dashboard/RoomPerformance';
import { StatCard } from '../../../components/dashboard/StatCard';
import { TodayReservations } from '../../../components/dashboard/TodayReservations';
import { WeeklyActivityChart } from '../../../components/dashboard/WeeklyActivityChart';
import { GameDetailDialog } from '../../../components/games/GameDetailDialog';
import { LiveGamesGrid } from '../../../components/games/LiveGamesGrid';
import { LiveIndicator } from '../../../components/games/LiveIndicator';
import { Topbar } from '../../../components/layout/Topbar';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Icon } from '../../../components/ui/Icon';
import { staggerContainer } from '../../../components/ui/motionPresets';
import { RingMeter } from '../../../components/ui/RingMeter';
import { Skeleton } from '../../../components/ui/Skeleton';
import { useAsync } from '../../../hooks/useAsync';
import { LIVE_POLL_MS, useLiveGames } from '../../../hooks/useLiveGames';
import { getDashboard } from '../../../services/adminGamesService';
import { formatNumber, formatPercent } from '../../../utils/format';
import styles from './DashboardScreen.module.css';

interface DashboardScreenProps {
  onSeeAllGames: () => void;
}

/** Resumen del negocio — GET /admin/dashboard + GET /admin/games/live */
export function DashboardScreen({ onSeeAllGames }: DashboardScreenProps) {
  const { data, loading } = useAsync(getDashboard, []);
  const live = useLiveGames();
  const [selectedGame, setSelectedGame] = useState<string | null>(null);

  return (
    <div className={styles.screen}>
      <Topbar title="Dashboard" subtitle="Resumen del negocio y actividad de las salas en tiempo real." />

      <motion.div className={styles.kpis} variants={staggerContainer} initial="hidden" animate="show">
        <StatCard
          label="Partidas totales"
          icon="games"
          value={data?.totalGames}
          format={formatNumber}
          loading={loading}
          hint={data && `${live.games.length} en curso ahora mismo`}
        />
        <StatCard
          label="Puntuación media"
          icon="trophy"
          value={data?.averageScore}
          format={(n) => `${formatNumber(n)} pts`}
          loading={loading}
          hint={data && `Tasa de éxito ${formatPercent(data.successRate)}`}
        />
        <StatCard
          label="Ocupación de hoy"
          icon="door"
          value={data ? data.occupancy * 100 : undefined}
          format={(n) => `${Math.round(n)}%`}
          loading={loading}
          hint={data && `${data.reservationsToday} de ${data.slotsToday} sesiones`}
          aside={data && <RingMeter value={data.occupancy} label="Ocupación de hoy" size={64} stroke={8} showValue={false} />}
        />
        <StatCard
          label="Reservas del día"
          icon="calendar"
          value={data?.reservationsToday}
          loading={loading}
          hint={
            data &&
            `${data.todayReservations.filter((r) => r.reserve_at > new Date().toISOString() && r.status !== 'cancelled').length} pendientes de jugar`
          }
        />
      </motion.div>

      <motion.div className={styles.grid} variants={staggerContainer} initial="hidden" animate="show">
        <Card
          className={styles.live}
          title="Partidas en curso"
          subtitle="Progreso y puntuación en vivo"
          actions={
            <>
              <LiveIndicator lastUpdate={live.lastUpdate} intervalMs={LIVE_POLL_MS} />
              <Button size="sm" variant="ghost" onClick={onSeeAllGames}>
                Ver todas <Icon name="chevronRight" size={14} />
              </Button>
            </>
          }
        >
          <LiveGamesGrid games={live.games} loading={live.loading} onSelect={setSelectedGame} compact />
        </Card>

        <Card className={styles.agenda} title="Agenda de hoy" subtitle="Reservas por hora" padded>
          {loading || !data ? (
            <div className={styles.skeletonList}>
              {Array.from({ length: 6 }, (_, i) => (
                <Skeleton key={i} height={36} />
              ))}
            </div>
          ) : (
            <TodayReservations reservations={data.todayReservations} />
          )}
        </Card>

        <Card className={styles.activity} title="Partidas por día" subtitle="Últimos 7 días">
          {loading || !data ? <Skeleton height={190} /> : <WeeklyActivityChart data={data.last7Days} />}
        </Card>

        <Card className={styles.rooms} title="Rendimiento por sala" subtitle="Partidas finalizadas">
          {loading || !data ? (
            <div className={styles.skeletonList}>
              {Array.from({ length: 3 }, (_, i) => (
                <Skeleton key={i} height={52} />
              ))}
            </div>
          ) : (
            <RoomPerformance rooms={data.rooms} />
          )}
        </Card>
      </motion.div>

      <GameDetailDialog gameId={selectedGame} onClose={() => setSelectedGame(null)} />
    </div>
  );
}
