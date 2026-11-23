import { motion } from 'motion/react';
import { useMemo, useState } from 'react';
import { GameDetailDialog } from '../../../components/games/GameDetailDialog';
import {
  ALL_MAPS,
  GamesFilters,
  type HistoryFilters,
  type PeriodFilter,
} from '../../../components/games/GamesFilters';
import { GamesHistoryTable } from '../../../components/games/GamesHistoryTable';
import { LiveGamesGrid } from '../../../components/games/LiveGamesGrid';
import { LiveIndicator } from '../../../components/games/LiveIndicator';
import { Topbar } from '../../../components/layout/Topbar';
import { Card } from '../../../components/ui/Card';
import { staggerContainer } from '../../../components/ui/motionPresets';
import { TabPanel, Tabs } from '../../../components/ui/Tabs';
import { useAsync } from '../../../hooks/useAsync';
import { LIVE_POLL_MS, useLiveGames } from '../../../hooks/useLiveGames';
import { getGames, getMaps } from '../../../services/adminGamesService';
import { formatNumber } from '../../../utils/format';
import styles from './GamesScreen.module.css';

type GamesTab = 'live' | 'history';

function periodStart(period: PeriodFilter): string | undefined {
  if (period === 'all') return undefined;
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  if (period === '7d') d.setDate(d.getDate() - 6);
  if (period === '30d') d.setDate(d.getDate() - 29);
  return d.toISOString();
}

/**
 * Partidas — GET /admin/games?status=in_progress (en vivo)
 *          — GET /admin/games?status=completed&map=&from= (historial)
 */
export function GamesScreen() {
  const [tab, setTab] = useState<GamesTab>('live');
  const [filters, setFilters] = useState<HistoryFilters>({ mapId: ALL_MAPS, period: '30d', result: 'finished' });
  const [selectedGame, setSelectedGame] = useState<string | null>(null);

  const live = useLiveGames();
  const { data: maps = [] } = useAsync(getMaps, []);
  const history = useAsync(
    () =>
      getGames({
        status: filters.result,
        mapId: filters.mapId === ALL_MAPS ? undefined : filters.mapId,
        from: periodStart(filters.period),
      }),
    [filters.mapId, filters.period, filters.result],
  );

  const summary = useMemo(() => {
    const games = history.data ?? [];
    const completed = games.filter((g) => g.status === 'completed');
    return {
      total: games.length,
      completed: completed.length,
      best: completed.reduce((max, g) => Math.max(max, g.score), 0),
    };
  }, [history.data]);

  return (
    <div className={styles.screen}>
      <Topbar title="Partidas" subtitle="Sigue las partidas en curso y consulta el historial." />

      <Tabs
        aria-label="Tipo de partidas"
        value={tab}
        onChange={setTab}
        items={[
          {
            value: 'live',
            label: (
              <>
                En curso <span className={styles.count}>{live.games.length}</span>
              </>
            ),
          },
          { value: 'history', label: 'Historial' },
        ]}
      >
        <TabPanel value="live">
          <motion.div variants={staggerContainer} initial="hidden" animate="show">
            <Card
              title="Partidas activas"
              subtitle="Toca una partida para ver su detalle"
              actions={<LiveIndicator lastUpdate={live.lastUpdate} intervalMs={LIVE_POLL_MS} />}
            >
              <LiveGamesGrid games={live.games} loading={live.loading} onSelect={setSelectedGame} />
            </Card>
          </motion.div>
        </TabPanel>

        <TabPanel value="history">
          <motion.div
            className={styles.history}
            variants={staggerContainer}
            initial="hidden"
            animate="show"
          >
            <Card padded>
              <div className={styles.toolbar}>
                <GamesFilters maps={maps} value={filters} onChange={setFilters} />
                <dl className={styles.summary}>
                  <div>
                    <dt>Partidas</dt>
                    <dd className="tabular">{formatNumber(summary.total)}</dd>
                  </div>
                  <div>
                    <dt>Completadas</dt>
                    <dd className="tabular">{formatNumber(summary.completed)}</dd>
                  </div>
                  <div>
                    <dt>Mejor puntuación</dt>
                    <dd className="tabular">{formatNumber(summary.best)}</dd>
                  </div>
                </dl>
              </div>
            </Card>
            <Card padded={false}>
              <GamesHistoryTable
                games={history.data ?? []}
                loading={history.loading && !history.data}
                onSelect={setSelectedGame}
              />
            </Card>
          </motion.div>
        </TabPanel>
      </Tabs>

      <GameDetailDialog gameId={selectedGame} onClose={() => setSelectedGame(null)} />
    </div>
  );
}
