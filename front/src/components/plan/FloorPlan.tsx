import { useNow } from '../../hooks/useNow';
import type { GameWithDetails, MapRoom, ReservationWithDetails, RoomStats } from '../../types/models';
import { formatDuration, formatNumber, formatPercent, formatTime, puzzlesSolved } from '../../utils/format';
import { roomCode, zoneColor, zoneIndex } from '../../utils/zones';
import { Icon } from '../ui/Icon';
import { PuzzleCells } from './PuzzleCells';
import styles from './FloorPlan.module.css';

interface FloorPlanProps {
  maps: MapRoom[];
  live: GameWithDetails[];
  stats: RoomStats[];
  today: ReservationWithDetails[];
  onEditRoom: (mapId: string) => void;
  onOpenGame: (gameId: string) => void;
  onNewRoom: () => void;
}

/** Planta del local: las salas como recintos con su partida en directo dibujada dentro */
export function FloorPlan({ maps, live, stats, today, onEditRoom, onOpenGame, onNewRoom }: FloorPlanProps) {
  const now = useNow(1000);
  return (
    <section className={styles.plan} aria-labelledby="plan-title">
      <h2 id="plan-title" className="sr-only">
        Planta del local: salas en directo
      </h2>
      <div className={styles.walls} style={{ ['--rooms' as string]: Math.max(1, maps.length) }}>
        {maps.map((map) => {
          const game = live.find((g) => g.id_map === map.id_map);
          const stat = stats.find((s) => s.id_map === map.id_map);
          const next = today.find(
            (r) => r.id_map === map.id_map && r.status !== 'cancelled' && new Date(r.reserve_at).getTime() > now,
          );
          return (
            <Room
              key={map.id_map}
              map={map}
              game={game}
              stat={stat}
              next={next}
              now={now}
              onEditRoom={onEditRoom}
              onOpenGame={onOpenGame}
            />
          );
        })}
      </div>
      <div className={styles.planFoot}>
        <span>
          {maps.length} {maps.length === 1 ? 'sala' : 'salas'}
          {maps.some((m) => !m.is_active) && ` · ${maps.filter((m) => !m.is_active).length} cerrada`}
        </span>
        <button type="button" className={styles.edit} onClick={onNewRoom}>
          <Icon name="plus" size={14} />
          Nueva sala
        </button>
      </div>
    </section>
  );
}

interface RoomProps {
  map: MapRoom;
  game?: GameWithDetails;
  stat?: RoomStats;
  next?: ReservationWithDetails;
  now: number;
  onEditRoom: (mapId: string) => void;
  onOpenGame: (gameId: string) => void;
}

function Room({ map, game, stat, next, now, onEditRoom, onOpenGame }: RoomProps) {
  const remaining = game ? map.time_limit * 60 - (now - new Date(game.started_at).getTime()) / 1000 : 0;
  const urgent = game && remaining < 10 * 60;
  const solved = game ? puzzlesSolved(game.progress) : 0;

  return (
    <article
      className={styles.room}
      style={{ ['--zone' as string]: zoneColor(map.id_map) }}
      data-closed={!map.is_active || undefined}
      aria-label={`${roomCode(map.id_map)}, ${map.name}`}
    >
      <header className={styles.head}>
        <h3 className={styles.name}>
          <span className={styles.tag} aria-label={roomCode(map.id_map)}>
            {String(zoneIndex(map.id_map)).padStart(2, '0')}
          </span>
          {/* Espacio duro antes de un número final: "Laboratorio 47" no se parte */}
          <span className={styles.nameText}>{map.name.replace(/ (\d+)$/, '\u00a0$1')}</span>
        </h3>
        <button
          type="button"
          className={styles.edit}
          onClick={() => onEditRoom(map.id_map)}
          aria-label={`Editar sala ${map.name}`}
        >
          <Icon name="pencil" size={14} />
          <span className={styles.editLabel}>Editar sala</span>
        </button>
      </header>

      {game ? (
        <button type="button" className={styles.game} onClick={() => onOpenGame(game.id_game)}>
          <span className={styles.team}>
            <strong>{game.team ?? 'Sin equipo'}</strong>
            <span>{game.user.name}</span>
          </span>
          <span className={styles.clockRow}>
            <span className={styles.clock} data-urgent={urgent || undefined}>
              {remaining > 0 ? formatDuration(remaining) : '00:00'}
            </span>
            <span className={styles.clockNote}>
              {urgent ? 'Últimos minutos' : `quedan de ${map.time_limit} min`}
            </span>
          </span>
          <PuzzleCells progress={game.progress} live />
          <span className={styles.gameFoot}>
            <span>
              Puzzle {Math.min(4, solved + 1)} de 4
            </span>
            <span>
              <strong>{formatNumber(game.score)}</strong> / {formatNumber(map.max_score)} pts
            </span>
          </span>
        </button>
      ) : (
        <div className={styles.idle}>
          <p className={styles.idleState}>{map.is_active ? 'Sala libre' : 'Sala cerrada'}</p>
          <p className={styles.idleNext}>
            {next ? (
              <>
                Próxima sesión <strong>{formatTime(next.reserve_at)}</strong> · {next.team ?? next.user.name}
              </>
            ) : (
              'Sin más sesiones hoy'
            )}
          </p>
          <PuzzleCells progress={0} />
        </div>
      )}

      {stat && stat.games === 0 && (
        <p className={styles.legend}>Sin partidas todavía</p>
      )}
      {stat && stat.games > 0 && (
        <dl className={styles.legend} aria-label="Medias de la sala (datos de ejemplo)">
          <div>
            <dt>Media</dt>
            <dd>{formatNumber(stat.averageScore)} pts</dd>
          </div>
          <div>
            <dt>Éxito</dt>
            <dd>{formatPercent(stat.successRate)}</dd>
          </div>
          <div>
            <dt>Tiempo medio</dt>
            <dd>{stat.averageTime} min</dd>
          </div>
          <div className={styles.sample}>Ejemplo</div>
        </dl>
      )}

      <svg className={styles.door} viewBox="0 0 48 30" aria-hidden="true">
        <rect x="0" y="24" width="48" height="6" className={styles.doorGap} />
        <path d="M2 27 L2 3" className={styles.doorLeaf} />
        <path d="M2 3 A24 24 0 0 1 26 27" className={styles.doorSwing} />
      </svg>
    </article>
  );
}
