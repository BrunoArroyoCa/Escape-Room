import { forwardRef, useState } from 'react';
import type { GameStatus, GameWithDetails, MapRoom } from '../../types/models';
import { formatDateTime, formatNumber, minutesBetween } from '../../utils/format';
import { zoneColor } from '../../utils/zones';
import { Button } from '../ui/Button';
import { Icon } from '../ui/Icon';
import { DateField } from '../ui/Fields';
import { Segmented } from '../ui/Segmented';
import { SelectField } from '../ui/SelectField';
import styles from './HistorySection.module.css';

export type Period = 'today' | '7d' | '30d' | 'all' | 'range';
export type Result = 'finished' | 'completed' | 'abandoned';

export interface HistoryFilters {
  mapId: string;
  period: Period;
  result: Result;
  /** YYYY-MM-DD, solo con period = 'range' */
  from: string;
  to: string;
}

export const ALL_ROOMS = 'all';

interface HistorySectionProps {
  maps: MapRoom[];
  games: GameWithDetails[];
  loading: boolean;
  filters: HistoryFilters;
  onFilters: (f: HistoryFilters) => void;
  onOpen: (gameId: string) => void;
}

const PAGE = 25;

const resultLabel: Record<GameStatus, string> = {
  completed: 'Completada',
  abandoned: 'Abandonada',
  in_progress: 'En juego',
};

/** Historial de partidas con filtros por sala, periodo y resultado */
export const HistorySection = forwardRef<HTMLElement, HistorySectionProps>(function HistorySection(
  { maps, games, loading, filters, onFilters, onOpen },
  ref,
) {
  const [shown, setShown] = useState(PAGE);
  const [lastFilters, setLastFilters] = useState(filters);
  if (lastFilters !== filters) {
    setLastFilters(filters);
    setShown(PAGE);
  }

  const completed = games.filter((g) => g.status === 'completed');
  const best = completed.reduce((m, g) => Math.max(m, g.score), 0);

  return (
    <section ref={ref} className={styles.section} aria-labelledby="history-title" tabIndex={-1}>
      <div className={styles.head}>
        <h2 id="history-title" className={styles.title}>
          Historial de partidas
        </h2>
        <dl className={styles.totals}>
          <div>
            <dt>Partidas</dt>
            <dd>{formatNumber(games.length)}</dd>
          </div>
          <div>
            <dt>Completadas</dt>
            <dd>{formatNumber(completed.length)}</dd>
          </div>
          <div>
            <dt>Mejor</dt>
            <dd>{formatNumber(best)} pts</dd>
          </div>
        </dl>
      </div>

      <div className={styles.filters}>
        <SelectField
          label="Sala"
          value={filters.mapId}
          onChange={(mapId) => onFilters({ ...filters, mapId })}
          options={[
            { value: ALL_ROOMS, label: 'Todas las salas' },
            ...maps.map((m) => ({ value: m.id_map, label: m.name, swatch: zoneColor(m.id_map) })),
          ]}
        />
        <Segmented
          label="Periodo"
          value={filters.period}
          onChange={(period) => onFilters({ ...filters, period })}
          options={[
            { value: 'today', label: 'Hoy' },
            { value: '7d', label: '7 días' },
            { value: '30d', label: '30 días' },
            { value: 'all', label: 'Todo' },
            { value: 'range', label: 'Fechas' },
          ]}
        />
        {filters.period === 'range' && (
          <div className={styles.range}>
            <DateField
              label="Desde"
              value={filters.from}
              max={filters.to || undefined}
              onChange={(from) => onFilters({ ...filters, from })}
            />
            <DateField
              label="Hasta"
              value={filters.to}
              min={filters.from || undefined}
              onChange={(to) => onFilters({ ...filters, to })}
            />
          </div>
        )}
        <Segmented
          label="Resultado"
          value={filters.result}
          onChange={(result) => onFilters({ ...filters, result })}
          options={[
            { value: 'finished', label: 'Todas' },
            { value: 'completed', label: 'Completadas' },
            { value: 'abandoned', label: 'Abandonadas' },
          ]}
        />
      </div>

      <div className={styles.scroller}>
        <table className={styles.table} aria-busy={loading}>
          <thead>
            <tr>
              <th scope="col">Inicio</th>
              <th scope="col">Sala</th>
              <th scope="col">Equipo</th>
              <th scope="col">Resultado</th>
              <th scope="col" className={styles.num}>
                Tiempo
              </th>
              <th scope="col" className={styles.num}>
                Puntos
              </th>
              <th scope="col">
                <span className="sr-only">Abrir</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {games.slice(0, shown).map((g) => {
              const mins = g.ended_at ? Math.round(minutesBetween(g.started_at, g.ended_at)) : null;
              return (
                <tr
                  key={g.id_game}
                  className={styles.row}
                  style={{ ['--zone' as string]: zoneColor(g.id_map) }}
                  onClick={() => onOpen(g.id_game)}
                >
                  <td className={styles.date}>{formatDateTime(g.started_at)}</td>
                  <td>
                    <span className={styles.room}>
                      <i aria-hidden />
                      {g.map.name}
                    </span>
                  </td>
                  <td>
                    <span className={styles.team}>
                      <i className={styles.teamSwatch} aria-hidden />
                      {g.team ?? 'Sin equipo'}
                    </span>
                    <span className={styles.player}>{g.user.name}</span>
                  </td>
                  <td>
                    <span className={styles.result} data-status={g.status}>
                      {resultLabel[g.status]}
                    </span>
                    <span className={styles.mobileMeta}>
                      <strong>{formatNumber(g.score)} pts</strong>
                      {mins !== null && ` · ${mins} min`}
                    </span>
                  </td>
                  <td className={styles.num}>
                    {mins !== null ? `${mins} min` : '—'}
                    <span className={styles.player}>de {g.map.time_limit}</span>
                  </td>
                  <td className={styles.num}>
                    <strong>{formatNumber(g.score)}</strong>
                    {/* Escala fija en toda la tabla: 1200 pts (el máximo de las salas) = longitud completa */}
                    <span className={styles.ramp} aria-hidden>
                      <i style={{ width: `${Math.min(100, (g.score / 1200) * 100)}%` }} />
                    </span>
                  </td>
                  <td className={styles.open}>
                    <button
                      type="button"
                      className={styles.openBtn}
                      aria-label={`Ver partida de ${g.team ?? g.user.name}, ${formatDateTime(g.started_at)}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpen(g.id_game);
                      }}
                    >
                      <Icon name="chevron" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {!loading && games.length === 0 && (
          <p className={styles.empty}>
            Ninguna partida con estos filtros. Prueba con otra sala o un periodo más amplio.
          </p>
        )}
      </div>

      {games.length > shown && (
        <div className={styles.more}>
          <span>
            Mostrando {shown} de {games.length}
          </span>
          <Button onClick={() => setShown((s) => s + PAGE)}>Mostrar {Math.min(PAGE, games.length - shown)} más</Button>
        </div>
      )}
    </section>
  );
});
