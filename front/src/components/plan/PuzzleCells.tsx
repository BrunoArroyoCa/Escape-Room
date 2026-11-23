import { puzzlesSolved } from '../../utils/format';
import { Icon } from '../ui/Icon';
import styles from './PuzzleCells.module.css';

interface PuzzleCellsProps {
  /** 0 – 100 */
  progress: number;
  /** Partida en curso: marca el puzzle actual con trama */
  live?: boolean;
  size?: 'lg' | 'sm';
}

/**
 * Los 4 puzzles de una sala como casillas del plano.
 * Resuelto: relleno del color de zona (entra con un barrido al resolverse).
 * Actual: trama diagonal. Pendiente: solo contorno.
 */
export function PuzzleCells({ progress, live = false, size = 'lg' }: PuzzleCellsProps) {
  const solved = puzzlesSolved(progress);
  return (
    <ol className={styles.cells} data-size={size} aria-label={`${solved} de 4 puzzles resueltos`}>
      {[1, 2, 3, 4].map((n) => {
        const isSolved = n <= solved;
        const isCurrent = live && n === solved + 1;
        return (
          <li
            key={n}
            className={styles.cell}
            data-solved={isSolved || undefined}
            data-current={isCurrent || undefined}
          >
            <span className={styles.num}>{n}</span>
            <Icon name={isSolved ? 'unlock' : 'lock'} size={size === 'lg' ? 16 : 13} className={styles.icon} />
            <span className="sr-only">{isSolved ? 'resuelto' : isCurrent ? 'en curso' : 'pendiente'}</span>
          </li>
        );
      })}
    </ol>
  );
}
