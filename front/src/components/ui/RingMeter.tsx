import { Meter } from '@base-ui/react/meter';
import { motion } from 'motion/react';
import styles from './RingMeter.module.css';

interface RingMeterProps {
  /** 0 – 1 */
  value: number;
  label: string;
  size?: number;
  stroke?: number;
  /** Muestra el porcentaje en el centro */
  showValue?: boolean;
}

/**
 * Indicador circular construido sobre Base UI Meter (role="meter",
 * aria-valuenow…) con un anillo SVG animado con motion.
 */
export function RingMeter({ value, label, size = 88, stroke = 9, showValue = true }: RingMeterProps) {
  const r = (size - stroke) / 2;
  const circumference = 2 * Math.PI * r;
  const pct = Math.round(Math.min(1, Math.max(0, value)) * 100);

  return (
    <Meter.Root value={pct} className={styles.root} style={{ width: size, height: size }}>
      <Meter.Label className="sr-only">{label}</Meter.Label>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden>
        <circle className={styles.track} cx={size / 2} cy={size / 2} r={r} strokeWidth={stroke} />
        <motion.circle
          className={styles.indicator}
          cx={size / 2}
          cy={size / 2}
          r={r}
          strokeWidth={stroke}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference * (1 - pct / 100) }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <Meter.Value className={showValue ? `${styles.value} tabular` : 'sr-only'}>
        {(_, v) => `${v}%`}
      </Meter.Value>
    </Meter.Root>
  );
}
