import { useNow } from '../../hooks/useNow';
import type { GameWithDetails } from '../../types/models';
import { formatDateTime, formatDuration, formatNumber, minutesBetween, puzzlesSolved } from '../../utils/format';
import { roomCode } from '../../utils/zones';
import { PuzzleCells } from '../plan/PuzzleCells';
import { Button } from '../ui/Button';
import styles from './Editors.module.css';

interface GameDetailProps {
  game: GameWithDetails;
  onEditRoom: (mapId: string) => void;
}

const statusText = { in_progress: 'En juego', completed: 'Completada', abandoned: 'Abandonada' } as const;

/** Detalle de una partida (GET /admin/games/{id}): puntuación final y tiempo */
export function GameDetail({ game, onEditRoom }: GameDetailProps) {
  const now = useNow(1000);
  const live = game.status === 'in_progress';
  const elapsedMin = live
    ? (now - new Date(game.started_at).getTime()) / 60_000
    : minutesBetween(game.started_at, game.ended_at!);
  const solved = puzzlesSolved(game.progress);

  return (
    <div className={styles.editor}>
      <div className={styles.score}>
        <span className="label">{live ? 'Puntuación actual' : 'Puntuación final'}</span>
        <strong>
          {formatNumber(game.score)}
          <small> / {formatNumber(game.map.max_score)} pts</small>
        </strong>
        <span className={styles.scoreState} data-status={game.status}>
          {statusText[game.status]}
        </span>
      </div>

      <dl className={styles.facts}>
        <div>
          <dt className="label">{live ? 'Tiempo jugado' : 'Tiempo total'}</dt>
          <dd>
            {live ? formatDuration(elapsedMin * 60) : `${Math.round(elapsedMin)} min`}
            <span> de {game.map.time_limit} min</span>
          </dd>
        </div>
        <div>
          <dt className="label">Puzzles</dt>
          <dd>
            {solved}
            <span> de 4</span>
          </dd>
        </div>
        <div>
          <dt className="label">Inicio</dt>
          <dd>{formatDateTime(game.started_at)}</dd>
        </div>
        <div>
          <dt className="label">Fin</dt>
          <dd>{game.ended_at ? formatDateTime(game.ended_at) : 'En curso'}</dd>
        </div>
        <div>
          <dt className="label">Jugador</dt>
          <dd>
            {game.user.name}
            <span> {game.user.email}</span>
          </dd>
        </div>
        <div>
          <dt className="label">Sala</dt>
          <dd>
            {game.map.name}
            <span> {roomCode(game.id_map)} · dificultad {game.map.difficulty}/5</span>
          </dd>
        </div>
      </dl>

      <PuzzleCells progress={game.progress} live={live} />

      <div className={styles.actions}>
        <Button onClick={() => onEditRoom(game.id_map)}>Editar esta sala</Button>
      </div>
    </div>
  );
}
