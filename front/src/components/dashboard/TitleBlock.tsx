import { useNow } from '../../hooks/useNow';
import type { MapRoom } from '../../types/models';
import { zoneColor, zoneIndex } from '../../utils/zones';
import styles from './TitleBlock.module.css';

/** Cabecera como cajetín de plano: nombre, hoja, fecha, hora en vivo y origen de los datos */
export function TitleBlock({ maps }: { maps: MapRoom[] }) {
  const now = new Date(useNow(1000));
  const raw = new Intl.DateTimeFormat('es-ES', { weekday: 'long', day: 'numeric', month: 'long' }).format(now);
  const date = raw.charAt(0).toUpperCase() + raw.slice(1);
  const time = new Intl.DateTimeFormat('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(now);

  return (
    <header className={styles.block}>
      <div className={styles.brand}>
        <h1>Escape Room</h1>
        <span>Panel de empresa</span>
      </div>
      <div className={styles.drawing}>
        <p className={styles.drawingTitle}>
          Planta del local · {maps.length} {maps.length === 1 ? 'sala' : 'salas'}
        </p>
        <ul className={styles.zones} aria-label="Leyenda de zonas">
          {maps.map((m) => (
            <li key={m.id_map}>
              <i style={{ background: zoneColor(m.id_map) }} aria-hidden />
              {String(zoneIndex(m.id_map)).padStart(2, '0')} {m.name}
            </li>
          ))}
        </ul>
      </div>
      <dl className={styles.cells}>
        <div>
          <dt className="label">Hoja</dt>
          <dd>A-01</dd>
        </div>
        <div>
          <dt className="label">Fecha</dt>
          <dd className={styles.date}>{date}</dd>
        </div>
        <div>
          <dt className="label">Hora</dt>
          <dd>
            <time dateTime={now.toISOString()}>{time}</time>
          </dd>
        </div>
        <div className={styles.data}>
          <dt className="label">Datos</dt>
          <dd>De ejemplo</dd>
        </div>
      </dl>
    </header>
  );
}
