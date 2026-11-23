import { forwardRef } from 'react';
import { SESSION_HOURS } from '../../services/adminService';
import type { GameWithDetails, MapRoom, ReservationStatus, ReservationWithDetails } from '../../types/models';
import { addDays, formatLongDay, isSameDay, startOfDay } from '../../utils/dates';
import { roomCode, zoneColor } from '../../utils/zones';
import { Icon } from '../ui/Icon';
import { SelectField } from '../ui/SelectField';
import styles from './AgendaMatrix.module.css';

export type StatusFilter = 'all' | ReservationStatus;
export const ALL = 'all';

export interface AgendaFilters {
  day: Date;
  status: StatusFilter;
  mapId: string;
}

interface AgendaMatrixProps {
  maps: MapRoom[];
  reservations: ReservationWithDetails[];
  live: GameWithDetails[];
  filters: AgendaFilters;
  onFilters: (f: AgendaFilters) => void;
  onOpen: (reservationId: string) => void;
  loading?: boolean;
}

const statusLabel: Record<ReservationStatus, string> = {
  pending: 'Pendiente',
  confirmed: 'Confirmada',
  cancelled: 'Cancelada',
  completed: 'Jugada',
};

/** Agenda de un día como horario: filas por sesión, columnas por sala (GET /admin/reservations) */
export const AgendaMatrix = forwardRef<HTMLElement, AgendaMatrixProps>(function AgendaMatrix(
  { maps, reservations, live, filters, onFilters, onOpen, loading },
  ref,
) {
  const now = new Date();
  const today = startOfDay(now);
  const isToday = isSameDay(filters.day, now);
  const isPastDay = filters.day < today;
  const currentHour = now.getHours();
  const liveIds = new Set(live.map((g) => g.id_reservations));
  const columns = filters.mapId === ALL ? maps : maps.filter((m) => m.id_map === filters.mapId);
  const shift = (n: number) => onFilters({ ...filters, day: addDays(filters.day, n) });

  return (
    <section ref={ref} className={styles.agenda} aria-labelledby="agenda-title" tabIndex={-1}>
      <div className={styles.head}>
        <h2 id="agenda-title" className={styles.title}>
          Agenda
        </h2>
        <div className={styles.dayNav} role="group" aria-label="Cambiar de día">
          <button type="button" className={styles.navBtn} onClick={() => shift(-1)} aria-label="Día anterior">
            <Icon name="chevron" style={{ transform: 'rotate(180deg)' }} />
          </button>
          <button
            type="button"
            className={styles.todayBtn}
            onClick={() => onFilters({ ...filters, day: today })}
            disabled={isToday}
          >
            Hoy
          </button>
          <button type="button" className={styles.navBtn} onClick={() => shift(1)} aria-label="Día siguiente">
            <Icon name="chevron" />
          </button>
        </div>
      </div>
      <p className={styles.day} aria-live="polite">
        {formatLongDay(filters.day)}
      </p>
      <div className={styles.filters}>
        <SelectField
          compact
          label="Estado"
          value={filters.status}
          onChange={(status) => onFilters({ ...filters, status })}
          options={[
            { value: 'all', label: 'Todos' },
            { value: 'pending', label: 'Pendientes' },
            { value: 'confirmed', label: 'Confirmadas' },
            { value: 'cancelled', label: 'Canceladas' },
            { value: 'completed', label: 'Jugadas' },
          ]}
        />
        <SelectField
          compact
          label="Sala"
          value={filters.mapId}
          onChange={(mapId) => onFilters({ ...filters, mapId })}
          options={[
            { value: ALL, label: 'Todas' },
            ...maps.map((m) => ({ value: m.id_map, label: m.name, swatch: zoneColor(m.id_map) })),
          ]}
        />
      </div>
      <div className={styles.scroller}>
        <table className={styles.table} aria-busy={loading}>
          <thead>
            <tr>
              <th scope="col" className={styles.hourHead}>
                <span className="sr-only">Hora</span>
              </th>
              {columns.map((m) => (
                <th key={m.id_map} scope="col" style={{ ['--zone' as string]: zoneColor(m.id_map) }}>
                  <span className={styles.roomHead} title={m.name}>
                    <i className={styles.swatch} aria-hidden />
                    {roomCode(m.id_map)}
                    <span className="sr-only">, {m.name}</span>
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {SESSION_HOURS.map((hour) => {
              const past = isPastDay || (isToday && hour + 1 < currentHour);
              const isNow = isToday && hour <= currentHour && currentHour < hour + 2;
              return (
                <tr key={hour} data-now={isNow || undefined}>
                  <th scope="row" className={styles.hour}>
                    {String(hour).padStart(2, '0')}:00
                  </th>
                  {columns.map((m) => {
                    const slot = reservations.filter(
                      (r) => r.id_map === m.id_map && new Date(r.reserve_at).getHours() === hour,
                    );
                    const active = slot.find((r) => r.status !== 'cancelled') ?? slot[0];
                    const playing = active && liveIds.has(active.id_reservations);
                    return (
                      <td key={m.id_map} style={{ ['--zone' as string]: zoneColor(m.id_map) }}>
                        {active ? (
                          <button
                            type="button"
                            className={styles.booking}
                            data-status={playing ? 'live' : active.status}
                            data-past={past || undefined}
                            onClick={() => onOpen(active.id_reservations)}
                          >
                            <span className={styles.team}>{active.team ?? active.user.name}</span>
                            <span className={styles.state}>
                              {playing ? 'En juego' : statusLabel[active.status]}
                            </span>
                          </button>
                        ) : (
                          <span className={styles.free}>
                            {!m.is_active ? 'Cerrada' : past ? '—' : filters.status === ALL ? 'Libre' : ''}
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {!loading && reservations.length === 0 && (
        <p className={styles.empty}>Ninguna reserva con estos filtros este día.</p>
      )}
    </section>
  );
});
