import { Progress } from '@base-ui/react/progress';
import type { CSSProperties } from 'react';
import styles from './ProgressBar.module.css';

interface ProgressBarProps {
  value: number;
  label?: string;
  /** Color del indicador (variable CSS). Por defecto el acento */
  color?: string;
  /** Marcas verticales en 25/50/75 (los 4 puzzles) */
  segments?: number;
  showValue?: boolean;
}

export function ProgressBar({ value, label, color, segments = 0, showValue = true }: ProgressBarProps) {
  return (
    <Progress.Root
      value={value}
      className={styles.root}
      style={color ? ({ '--bar-color': color } as CSSProperties) : undefined}
    >
      {(label || showValue) && (
        <div className={styles.head}>
          {label && <Progress.Label className={styles.label}>{label}</Progress.Label>}
          {showValue && <Progress.Value className={`${styles.value} tabular`} />}
        </div>
      )}
      <Progress.Track className={styles.track}>
        <Progress.Indicator className={styles.indicator} />
        {segments > 1 &&
          Array.from({ length: segments - 1 }, (_, i) => (
            <span
              key={i}
              className={styles.tick}
              style={{ left: `${((i + 1) / segments) * 100}%` }}
              aria-hidden
            />
          ))}
      </Progress.Track>
    </Progress.Root>
  );
}
