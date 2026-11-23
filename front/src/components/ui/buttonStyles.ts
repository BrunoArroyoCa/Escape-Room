import styles from './Button.module.css';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';
export type ButtonSize = 'sm' | 'md';

/** Clases de botón, reutilizables para dar ese aspecto a triggers de Base UI */
export const buttonClass = (
  variant: ButtonVariant = 'secondary',
  size: ButtonSize = 'md',
  iconOnly = false,
  extra?: string,
) =>
  [styles.button, styles[variant], styles[size], iconOnly && styles.iconOnly, extra]
    .filter(Boolean)
    .join(' ');
