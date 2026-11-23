import { motion } from 'motion/react';
import type { DailyActivity } from '../../types/models';
import { formatWeekday } from '../../utils/format';
import { Tooltip } from '../ui/Tooltip';
import styles from './WeeklyActivityChart.module.css';

interface WeeklyActivityChartProps {
  data: DailyActivity[];
}

/**
 * Partidas por día (últimos 7 días). Serie única → sin leyenda;
 * etiqueta directa solo en el máximo y en hoy; tooltip por barra.
 */
export function WeeklyActivityChart({ data }: WeeklyActivityChartProps) {
  const max = Math.max(1, ...data.map((d) => d.games));
  const peakIndex = data.findIndex((d) => d.games === max);
  const todayIndex = data.length - 1;

  return (
    <div className={styles.chart}>
      <div className={styles.plot} role="group" aria-label="Partidas por día, últimos 7 días">
        <div className={styles.gridLayer} aria-hidden>
          {[0.5, 1].map((g) => (
            <span key={g} className={styles.grid} style={{ bottom: `${g * 100}%` }} />
          ))}
        </div>
        {data.map((d, i) => {
          const showLabel = i === peakIndex || i === todayIndex;
          return (
            <Tooltip
              key={d.date}
              content={
                <>
                  <strong>{d.games}</strong> partidas ·{' '}
                  {new Intl.DateTimeFormat('es-ES', { weekday: 'long', day: 'numeric' }).format(
                    new Date(`${d.date}T12:00:00`),
                  )}
                </>
              }
            >
              <button type="button" className={styles.hit} aria-label={`${d.games} partidas el ${d.date}`}>
                {showLabel && (
                  <motion.span
                    className={`${styles.valueLabel} tabular`}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + i * 0.05 }}
                  >
                    {d.games}
                  </motion.span>
                )}
                <motion.span
                  className={styles.bar}
                  data-today={i === todayIndex || undefined}
                  initial={{ height: 0 }}
                  animate={{ height: `${(d.games / max) * 100}%` }}
                  transition={{ type: 'spring', stiffness: 140, damping: 18, delay: 0.15 + i * 0.05 }}
                />
              </button>
            </Tooltip>
          );
        })}
      </div>
      <div className={styles.axis} aria-hidden>
        {data.map((d, i) => (
          <span key={d.date} data-today={i === todayIndex || undefined}>
            {i === todayIndex ? 'Hoy' : formatWeekday(d.date)}
          </span>
        ))}
      </div>
    </div>
  );
}
