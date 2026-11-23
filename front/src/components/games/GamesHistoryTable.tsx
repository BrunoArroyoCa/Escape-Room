import { AnimatePresence, motion } from 'motion/react';
import type { GameWithDetails } from '../../types/models';
import { formatDateTime, formatNumber, minutesBetween } from '../../utils/format';
import { roomColor } from '../../utils/rooms';
import { EmptyState } from '../ui/EmptyState';
import { Icon } from '../ui/Icon';
import { ScrollArea } from '../ui/ScrollArea';
import { Skeleton } from '../ui/Skeleton';
import { GameStatusBadge } from './StatusBadge';
import styles from './GamesHistoryTable.module.css';

interface GamesHistoryTableProps {
  games: GameWithDetails[];
  loading: boolean;
  onSelect: (id: string) => void;
}

export function GamesHistoryTable({ games, loading, onSelect }: GamesHistoryTableProps) {
  if (!loading && games.length === 0) {
    return (
      <EmptyState icon="search" title="Sin resultados">
        Prueba con otra sala o un periodo más amplio.
      </EmptyState>
    );
  }

  return (
    <ScrollArea maxHeight="36rem">
      <table className={styles.table}>
        <thead>
          <tr>
            <th scope="col">Fecha</th>
            <th scope="col">Sala</th>
            <th scope="col">Equipo</th>
            <th scope="col">Resultado</th>
            <th scope="col" className={styles.num}>
              Tiempo
            </th>
            <th scope="col" className={styles.num}>
              Puntuación
            </th>
            <th scope="col">
              <span className="sr-only">Ver detalle</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {loading
            ? Array.from({ length: 6 }, (_, i) => (
                <tr key={i}>
                  {Array.from({ length: 7 }, (_, j) => (
                    <td key={j}>
                      <Skeleton height={14} width={j === 6 ? 16 : '80%'} />
                    </td>
                  ))}
                </tr>
              ))
            : null}
          <AnimatePresence initial={false}>
            {!loading &&
              games.map((g, i) => {
                const minutes = g.ended_at ? Math.round(minutesBetween(g.started_at, g.ended_at)) : null;
                return (
                  <motion.tr
                    key={g.id_game}
                    layout="position"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0, transition: { delay: Math.min(i, 12) * 0.025 } }}
                    exit={{ opacity: 0 }}
                    className={styles.row}
                    style={{ ['--room' as string]: roomColor(g.id_map) }}
                    onClick={() => onSelect(g.id_game)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onSelect(g.id_game);
                      }
                    }}
                    tabIndex={0}
                    aria-label={`Ver partida de ${g.team ?? g.user.name} en ${g.map.name}`}
                  >
                    <td className={`${styles.date} tabular`}>{formatDateTime(g.started_at)}</td>
                    <td>
                      <span className={styles.room}>
                        <span className={styles.swatch} aria-hidden />
                        {g.map.name}
                      </span>
                    </td>
                    <td>
                      <div className={styles.team}>
                        <strong>{g.team ?? 'Sin equipo'}</strong>
                        <span>{g.user.name}</span>
                      </div>
                    </td>
                    <td>
                      <GameStatusBadge status={g.status} />
                    </td>
                    <td className={`${styles.num} tabular`}>
                      {minutes !== null ? `${minutes} min` : '—'}
                      <span className={styles.sub}>de {g.map.time_limit}</span>
                    </td>
                    <td className={`${styles.num} tabular`}>
                      <span className={styles.score}>{formatNumber(g.score)}</span>
                      <span className={styles.scoreBar} aria-hidden>
                        <span style={{ width: `${(g.score / g.map.max_score) * 100}%` }} />
                      </span>
                    </td>
                    <td className={styles.chevron}>
                      <Icon name="chevronRight" size={16} />
                    </td>
                  </motion.tr>
                );
              })}
          </AnimatePresence>
        </tbody>
      </table>
    </ScrollArea>
  );
}
