import { motion } from 'motion/react';
import { useNow } from '../../hooks/useNow';
import type { GameWithDetails } from '../../types/models';
import { formatDuration, puzzlesSolved } from '../../utils/format';
import { roomColor } from '../../utils/rooms';
import { AnimatedNumber } from '../ui/AnimatedNumber';
import { Avatar } from '../ui/Avatar';
import { Icon } from '../ui/Icon';
import { ProgressBar } from '../ui/ProgressBar';
import { Tooltip } from '../ui/Tooltip';
import styles from './LiveGameCard.module.css';

interface LiveGameCardProps {
  game: GameWithDetails;
  onSelect: (id: string) => void;
  compact?: boolean;
}

export function LiveGameCard({ game, onSelect, compact = false }: LiveGameCardProps) {
  const now = useNow(1000);
  const elapsed = (now - new Date(game.started_at).getTime()) / 1000;
  const limit = game.map.time_limit * 60;
  const remaining = limit - elapsed;
  const urgent = remaining < 10 * 60;
  const solved = puzzlesSolved(game.progress);
  const color = roomColor(game.id_map);

  return (
    <motion.button
      type="button"
      layout
      className={styles.card}
      data-compact={compact || undefined}
      style={{ ['--room' as string]: color }}
      onClick={() => onSelect(game.id_game)}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.985 }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
    >
      <div className={styles.glow} aria-hidden />
      <header className={styles.header}>
        <span className={styles.room}>
          <span className={styles.swatch} aria-hidden />
          {game.map.name}
        </span>
        <span className={`${styles.timer} tabular`} data-urgent={urgent || undefined}>
          <Icon name="clock" size={14} />
          {remaining > 0 ? formatDuration(remaining) : '00:00'}
        </span>
      </header>

      <div className={styles.team}>
        <Avatar name={game.team ?? game.user.name} size={compact ? 30 : 36} />
        <div>
          <strong>{game.team ?? 'Sin equipo'}</strong>
          <span>{game.user.name}</span>
        </div>
      </div>

      <div className={styles.puzzles} aria-label={`${solved} de 4 puzzles resueltos`}>
        {[0, 1, 2, 3].map((i) => (
          <Tooltip key={i} content={i < solved ? `Puzzle ${i + 1} resuelto` : `Puzzle ${i + 1} pendiente`}>
            <motion.span
              className={styles.puzzle}
              data-solved={i < solved || undefined}
              data-current={i === solved || undefined}
              initial={false}
              animate={i < solved ? { scale: [1, 1.25, 1] } : { scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <Icon name={i < solved ? 'unlock' : 'lock'} size={14} />
            </motion.span>
          </Tooltip>
        ))}
      </div>

      <ProgressBar value={game.progress} label="Progreso" color={color} segments={4} />

      <footer className={styles.footer}>
        <span className={styles.footLabel}>Puntuación</span>
        <span className={styles.score}>
          <AnimatedNumber value={game.score} duration={0.6} />
          <small>/ {game.map.max_score}</small>
        </span>
      </footer>
    </motion.button>
  );
}
