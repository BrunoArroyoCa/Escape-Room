import type { DashboardSummary } from '../../types/models';
import { formatNumber, formatPercent } from '../../utils/format';
import { Icon } from '../ui/Icon';
import styles from './FiguresBand.module.css';

export type FigureTarget = 'history-all' | 'history-completed' | 'agenda';

interface FiguresBandProps {
  data?: DashboardSummary;
  /** Cada cifra lleva a las filas que la forman */
  onShow: (target: FigureTarget) => void;
}

/** Las cuatro cifras del negocio en una banda rayada; cada una abre su prueba */
export function FiguresBand({ data, onShow }: FiguresBandProps) {
  const figures: { label: string; value: string; note: string; target: FigureTarget; action: string }[] = data
    ? [
        {
          label: 'Partidas totales',
          value: formatNumber(data.totalGames),
          note: `${data.activeGames} en juego ahora`,
          target: 'history-all',
          action: 'Ver historial',
        },
        {
          label: 'Puntuación media',
          value: formatNumber(data.averageScore),
          note: `Éxito ${formatPercent(data.successRate)} de las finalizadas`,
          target: 'history-completed',
          action: 'Ver completadas',
        },
        {
          label: 'Ocupación hoy',
          value: `${data.reservationsToday}/${data.slotsToday}`,
          note: `${formatPercent(data.occupancy)} de las sesiones`,
          target: 'agenda',
          action: 'Ver agenda',
        },
        {
          label: 'Reservas hoy',
          value: formatNumber(data.reservationsToday),
          note: `${data.todayReservations.filter((r) => r.status === 'pending').length} pendientes de confirmar`,
          target: 'agenda',
          action: 'Ver agenda',
        },
      ]
    : [];

  return (
    <section className={styles.band} aria-label="Cifras del negocio">
      {data
        ? figures.map((f) => (
            <button key={f.label} type="button" className={styles.figure} onClick={() => onShow(f.target)}>
              <span className={styles.labelRow}>
                <span className="label">{f.label}</span>
                <span className={styles.sample}>Ejemplo</span>
              </span>
              <span className={styles.value}>{f.value}</span>
              <span className={styles.note}>{f.note}</span>
              <span className={styles.action} aria-hidden>
                {f.action} <Icon name="chevron" size={14} />
              </span>
            </button>
          ))
        : Array.from({ length: 4 }, (_, i) => <div key={i} className={styles.placeholder} />)}
    </section>
  );
}
