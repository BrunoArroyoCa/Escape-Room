import { motion } from 'motion/react';
import type { ReactNode } from 'react';
import { Icon, type IconName } from './Icon';

interface EmptyStateProps {
  icon?: IconName;
  title: string;
  children?: ReactNode;
}

export function EmptyState({ icon = 'empty', title, children }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      style={{
        display: 'grid',
        justifyItems: 'center',
        gap: '0.5rem',
        padding: '2.5rem 1rem',
        textAlign: 'center',
        color: 'var(--color-text-muted)',
      }}
    >
      <Icon name={icon} size={30} />
      <p style={{ color: 'var(--color-text)', fontWeight: 600 }}>{title}</p>
      {children && <p style={{ fontSize: '0.85rem', maxWidth: '28ch' }}>{children}</p>}
    </motion.div>
  );
}
