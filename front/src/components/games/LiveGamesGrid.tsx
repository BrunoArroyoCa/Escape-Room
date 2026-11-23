import { AnimatePresence } from 'motion/react';
import type { GameWithDetails } from '../../types/models';
import { EmptyState } from '../ui/EmptyState';
import { Skeleton } from '../ui/Skeleton';
import { LiveGameCard } from './LiveGameCard';
import styles from './LiveGamesGrid.module.css';

interface LiveGamesGridProps {
  games: GameWithDetails[];
  loading: boolean;
  onSelect: (id: string) => void;
  compact?: boolean;
}

export function LiveGamesGrid({ games, loading, onSelect, compact }: LiveGamesGridProps) {
  if (loading) {
    return (
      <div className={styles.grid} data-compact={compact || undefined}>
        {[0, 1, 2].map((i) => (
          <Skeleton key={i} height={compact ? 230 : 260} radius={14} />
        ))}
      </div>
    );
  }

  if (games.length === 0) {
    return (
      <EmptyState icon="games" title="No hay partidas en curso">
        Cuando un equipo empiece a jugar aparecerá aquí en tiempo real.
      </EmptyState>
    );
  }

  return (
    <div className={styles.grid} data-compact={compact || undefined}>
      <AnimatePresence>
        {games.map((g) => (
          <LiveGameCard key={g.id_game} game={g} onSelect={onSelect} compact={compact} />
        ))}
      </AnimatePresence>
    </div>
  );
}
