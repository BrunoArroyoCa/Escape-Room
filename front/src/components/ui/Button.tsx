import { Button as BaseButton } from '@base-ui/react/button';
import type { ComponentProps } from 'react';
import { buttonClass, type ButtonSize, type ButtonVariant } from './buttonStyles';

interface ButtonProps extends Omit<ComponentProps<typeof BaseButton>, 'className'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  iconOnly?: boolean;
  className?: string;
}

export function Button({ variant, size, iconOnly, className, ...props }: ButtonProps) {
  return <BaseButton className={buttonClass(variant, size, iconOnly, className)} {...props} />;
}
