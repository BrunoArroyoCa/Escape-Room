import { motion } from 'motion/react';
import type { ReservationWithDetails } from '../../types/models';
import { formatTime } from '../../utils/format';
import { roomColor } from '../../utils/rooms';
import { ReservationStatusBadge } from '../games/StatusBadge';
import { EmptyState } from '../ui/EmptyState';
import { listItem } from '../ui/motionPresets';
import { ScrollArea } from '../ui/ScrollArea';
import styles from './TodayReservations.module.css';

interface TodayReservationsProps {
  reservations: ReservationWithDetails[];
}

export function TodayReservations({ reservations }: TodayReservationsProps) {
  if (reservations.length === 0) {
    return <EmptyState icon="calendar" title="Sin reservas hoy" />;
  }

  const now = new Date().toISOString();
  const nextId = reservations.find((r) => r.reserve_at > now && r.status !== 'cancelled')?.id_reservations;

  return (
    <ScrollArea maxHeight="22rem">
      <motion.ol
        className={styles.timeline}
        initial="hidden"
        animate="show"
        variants={{ show: { transition: { staggerChildren: 0.04, delayChildren: 0.3 } } }}
      >
        {reservations.map((r) => (
          <motion.li
            key={r.id_reservations}
            variants={listItem}
            className={styles.item}
            data-past={r.reserve_at < now || undefined}
            data-next={r.id_reservations === nextId || undefined}
            data-cancelled={r.status === 'cancelled' || undefined}
            style={{ ['--room' as string]: roomColor(r.id_map) }}
          >
            <time className={`${styles.time} tabular`} dateTime={r.reserve_at}>
              {formatTime(r.reserve_at)}
            </time>
            <span className={styles.node} aria-hidden />
            <div className={styles.info}>
              <span className={styles.team}>{r.team ?? r.user.name}</span>
              <span className={styles.room}>{r.map.name}</span>
            </div>
            {r.id_reservations === nextId ? (
              <span className={styles.nextTag}>Siguiente</span>
            ) : (
              <ReservationStatusBadge status={r.status} />
            )}
          </motion.li>
        ))}
      </motion.ol>
    </ScrollArea>
  );
}
