import type { MapRoom } from '../../types/models';
import { roomColor } from '../../utils/rooms';
import { SegmentedControl } from '../ui/SegmentedControl';
import { Select, type SelectOption } from '../ui/Select';
import styles from './GamesFilters.module.css';

export type PeriodFilter = 'today' | '7d' | '30d' | 'all';
export type ResultFilter = 'finished' | 'completed' | 'abandoned';

export interface HistoryFilters {
  mapId: string;
  period: PeriodFilter;
  result: ResultFilter;
}

export const ALL_MAPS = 'all';

interface GamesFiltersProps {
  maps: MapRoom[];
  value: HistoryFilters;
  onChange: (value: HistoryFilters) => void;
}

const periodOptions: { value: PeriodFilter; label: string }[] = [
  { value: 'today', label: 'Hoy' },
  { value: '7d', label: '7 días' },
  { value: '30d', label: '30 días' },
  { value: 'all', label: 'Todo' },
];

const resultOptions: { value: ResultFilter; label: string }[] = [
  { value: 'finished', label: 'Todas' },
  { value: 'completed', label: 'Completadas' },
  { value: 'abandoned', label: 'Abandonadas' },
];

export function GamesFilters({ maps, value, onChange }: GamesFiltersProps) {
  const mapOptions: SelectOption<string>[] = [
    { value: ALL_MAPS, label: 'Todas las salas' },
    ...maps.map((m) => ({
      value: m.id_map,
      label: m.name,
      adornment: <span className={styles.swatch} style={{ background: roomColor(m.id_map) }} />,
    })),
  ];

  return (
    <div className={styles.filters} role="search" aria-label="Filtros del historial">
      <Select
        label="Sala"
        options={mapOptions}
        value={value.mapId}
        onChange={(mapId) => onChange({ ...value, mapId })}
      />
      <SegmentedControl
        label="Periodo"
        options={periodOptions}
        value={value.period}
        onChange={(period) => onChange({ ...value, period })}
      />
      <SegmentedControl
        label="Resultado"
        options={resultOptions}
        value={value.result}
        onChange={(result) => onChange({ ...value, result })}
      />
    </div>
  );
}
