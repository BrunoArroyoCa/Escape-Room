import type { ReactNode } from 'react';
import { AnimatedNumber } from '../ui/AnimatedNumber';
import { Card } from '../ui/Card';
import { Icon, type IconName } from '../ui/Icon';
import { Skeleton } from '../ui/Skeleton';
import styles from './StatCard.module.css';

interface StatCardProps {
  label: string;
  icon: IconName;
  value?: number;
  format?: (n: number) => string;
  hint?: ReactNode;
  /** Contenido a la derecha (anillo, mini gráfico…) */
  aside?: ReactNode;
  loading?: boolean;
}

export function StatCard({ label, icon, value, format, hint, aside, loading }: StatCardProps) {
  return (
    <Card className={styles.card} whileHover={{ y: -3 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
      <div className={styles.inner}>
        <div className={styles.content}>
          <span className={styles.label}>
            <span className={styles.icon}>
              <Icon name={icon} size={16} />
            </span>
            {label}
          </span>
          <span className={styles.value}>
            {loading || value === undefined ? (
              <Skeleton width={110} height={34} />
            ) : (
              <AnimatedNumber value={value} format={format} />
            )}
          </span>
          {hint && <span className={styles.hint}>{loading ? <Skeleton width={140} height={14} /> : hint}</span>}
        </div>
        {aside && !loading && <div className={styles.aside}>{aside}</div>}
      </div>
    </Card>
  );
}
