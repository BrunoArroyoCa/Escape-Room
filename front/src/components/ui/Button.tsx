import { Button as BaseButton } from '@base-ui/react/button';
import type { ComponentProps } from 'react';
import styles from './Button.module.css';

type Variant = 'solid' | 'line' | 'markup' | 'bare';

interface ButtonProps extends Omit<ComponentProps<typeof BaseButton>, 'className'> {
  variant?: Variant;
  className?: string;
}

export function Button({ variant = 'line', className, ...props }: ButtonProps) {
  return <BaseButton className={[styles.button, styles[variant], className].filter(Boolean).join(' ')} {...props} />;
}

