import { motion, type HTMLMotionProps } from 'motion/react';
import type { ReactNode } from 'react';
import styles from './Card.module.css';
import { cardVariants } from './motionPresets';

interface CardProps extends Omit<HTMLMotionProps<'section'>, 'title'> {
  title?: ReactNode;
  subtitle?: ReactNode;
  actions?: ReactNode;
  padded?: boolean;
}

export function Card({
  title,
  subtitle,
  actions,
  padded = true,
  className,
  children,
  ...rest
}: CardProps) {
  return (
    <motion.section
      variants={cardVariants}
      className={[styles.card, className].filter(Boolean).join(' ')}
      {...rest}
    >
      {(title || actions) && (
        <header className={styles.header}>
          <div>
            {title && <h2 className={styles.title}>{title}</h2>}
            {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
          </div>
          {actions && <div className={styles.actions}>{actions}</div>}
        </header>
      )}
      <div className={padded ? styles.body : undefined}>{children as ReactNode}</div>
    </motion.section>
  );
}
