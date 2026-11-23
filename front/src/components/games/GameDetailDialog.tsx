import { motion } from 'motion/react';
import { useState } from 'react';
import { useAsync } from '../../hooks/useAsync';
import { getGameById } from '../../services/adminGamesService';
import { formatDateTime, formatNumber, formatPercent, minutesBetween, puzzlesSolved } from '../../utils/format';
import { roomColor } from '../../utils/rooms';
import { Avatar } from '../ui/Avatar';
import { Icon } from '../ui/Icon';
import { Modal } from '../ui/Modal';
import { ProgressBar } from '../ui/ProgressBar';
import { Skeleton } from '../ui/Skeleton';
import { GameStatusBadge } from './StatusBadge';
import styles from './GameDetailDialog.module.css';

interface GameDetailDialogProps {
  gameId: string | null;
  onClose: () => void;
}

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 26 } },
} as const;

/** Detalle de partida — GET /admin/games/{id} */
export function GameDetailDialog({ gameId, onClose }: GameDetailDialogProps) {
  // Conserva la última partida mostrada para que el contenido no cambie
  // mientras se reproduce la animación de cierre.
  const [shownId, setShownId] = useState(gameId);
  if (gameId !== null && gameId !== shownId) setShownId(gameId);

  const { data: game, loading } = useAsync(
    () => (shownId ? getGameById(shownId) : Promise.resolve(null)),
    [shownId],
  );

  const open = gameId !== null;
  const ready = !loading && game;

  const minutes = game
    ? Math.round(minutesBetween(game.started_at, game.ended_at ?? new Date().toISOString()))
    : 0;
  const solved = game ? puzzlesSolved(game.progress) : 0;

  return (
    <Modal
      open={open}
      onOpenChange={(o) => !o && onClose()}
      title={ready ? (game.team ?? 'Sin equipo') : 'Cargando partida…'}
      description={ready ? `${game.map.name} · ${formatDateTime(game.started_at)}` : ' '}
      accentColor={game ? roomColor(game.id_map) : undefined}
    >
      {!ready ? (
        <div className={styles.loading}>
          <Skeleton height={90} radius={12} />
          <Skeleton height={14} width="60%" />
          <Skeleton height={60} radius={12} />
        </div>
      ) : (
        <motion.div
          className={styles.content}
          variants={stagger}
          initial="hidden"
          animate="show"
          style={{ ['--room' as string]: roomColor(game.id_map) }}
        >
          <motion.div variants={item} className={styles.hero}>
            <div className={styles.heroMain}>
              <span className={styles.heroLabel}>Puntuación final</span>
              <span className={`${styles.heroValue} tabular`}>
                {formatNumber(game.score)}
                <small>/ {formatNumber(game.map.max_score)}</small>
              </span>
            </div>
            <GameStatusBadge status={game.status} />
          </motion.div>

          <motion.dl variants={item} className={styles.stats}>
            <div>
              <dt>
                <Icon name="clock" size={14} /> Tiempo
              </dt>
              <dd className="tabular">
                {minutes} <small>/ {game.map.time_limit} min</small>
              </dd>
            </div>
            <div>
              <dt>
                <Icon name="key" size={14} /> Puzzles
              </dt>
              <dd className="tabular">
                {solved} <small>/ 4</small>
              </dd>
            </div>
            <div>
              <dt>
                <Icon name="trophy" size={14} /> Rendimiento
              </dt>
              <dd className="tabular">{formatPercent(game.score / game.map.max_score)}</dd>
            </div>
          </motion.dl>

          <motion.div variants={item}>
            <ProgressBar value={game.progress} label="Progreso de la sala" color={roomColor(game.id_map)} segments={4} />
          </motion.div>

          <motion.div variants={item} className={styles.player}>
            <Avatar name={game.user.name} size={40} />
            <div>
              <strong>{game.user.name}</strong>
              <span>{game.user.email}</span>
            </div>
            <span className={styles.difficulty} aria-label={`Dificultad ${game.map.difficulty} de 5`}>
              {Array.from({ length: 5 }, (_, i) => (
                <Icon
                  key={i}
                  name="star"
                  size={14}
                  fill={i < game.map.difficulty ? 'currentColor' : 'none'}
                  data-on={i < game.map.difficulty || undefined}
                />
              ))}
            </span>
          </motion.div>

          <motion.ul variants={item} className={styles.timeline}>
            <li>
              <span>Inicio</span>
              <time className="tabular">{formatDateTime(game.started_at)}</time>
            </li>
            <li>
              <span>Fin</span>
              <time className="tabular">{game.ended_at ? formatDateTime(game.ended_at) : 'En curso'}</time>
            </li>
          </motion.ul>
        </motion.div>
      )}
    </Modal>
  );
}
