import { motion } from 'motion/react';
import type { RoomStats } from '../../types/models';
import { formatNumber, formatPercent } from '../../utils/format';
import { roomColor } from '../../utils/rooms';
import { Tooltip } from '../ui/Tooltip';
import styles from './RoomPerformance.module.css';

interface RoomPerformanceProps {
  rooms: RoomStats[];
}

/** Puntuación media, tasa de éxito y tiempo medio por sala */
export function RoomPerformance({ rooms }: RoomPerformanceProps) {
  const maxScore = Math.max(1, ...rooms.map((r) => r.averageScore));

  return (
    <ul className={styles.list}>
      {rooms.map((room, i) => (
        <li key={room.id_map} className={styles.row} style={{ ['--room' as string]: roomColor(room.id_map) }}>
          <div className={styles.head}>
            <span className={styles.name}>
              <span className={styles.swatch} aria-hidden />
              {room.name}
            </span>
            <span className={`${styles.score} tabular`}>
              {formatNumber(room.averageScore)} <small>pts</small>
            </span>
          </div>
          <Tooltip content={`Puntuación media de las partidas completadas: ${formatNumber(room.averageScore)} pts`}>
            <div className={styles.track} tabIndex={0} aria-label={`Puntuación media ${room.averageScore}`}>
              <motion.div
                className={styles.fill}
                initial={{ width: 0 }}
                animate={{ width: `${(room.averageScore / maxScore) * 100}%` }}
                transition={{ type: 'spring', stiffness: 90, damping: 18, delay: 0.25 + i * 0.1 }}
              />
            </div>
          </Tooltip>
          <dl className={styles.meta}>
            <div>
              <dt>Éxito</dt>
              <dd className="tabular">{formatPercent(room.successRate)}</dd>
            </div>
            <div>
              <dt>Tiempo medio</dt>
              <dd className="tabular">{room.averageTime} min</dd>
            </div>
            <div>
              <dt>Partidas</dt>
              <dd className="tabular">{room.games}</dd>
            </div>
          </dl>
        </li>
      ))}
    </ul>
  );
}
