import type { ReactNode } from 'react';
import styles from './Badge.module.css';

export type BadgeTone = 'neutral' | 'accent' | 'success' | 'warning' | 'danger' | 'info';

interface BadgeProps {
  tone?: BadgeTone;
  /** Muestra un punto; `pulse` lo anima (estado en vivo) */
  dot?: boolean | 'pulse';
  children: ReactNode;
}

export function Badge({ tone = 'neutral', dot = false, children }: BadgeProps) {
  return (
    <span className={`${styles.badge} ${styles[tone]}`}>
      {dot && <span className={`${styles.dot} ${dot === 'pulse' ? styles.pulse : ''}`} aria-hidden />}
      {children}
    </span>
  );
}
