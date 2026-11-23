import { Tooltip as BaseTooltip } from '@base-ui/react/tooltip';
import type { ReactElement, ReactNode } from 'react';
import styles from './Tooltip.module.css';

interface TooltipProps {
  content: ReactNode;
  /** Elemento que dispara el tooltip; Base UI le inyecta las props vía `render` */
  children: ReactElement<Record<string, unknown>>;
  side?: 'top' | 'bottom' | 'left' | 'right';
}

export function Tooltip({ content, children, side = 'top' }: TooltipProps) {
  return (
    <BaseTooltip.Root>
      <BaseTooltip.Trigger delay={120} render={children} />
      <BaseTooltip.Portal>
        <BaseTooltip.Positioner side={side} sideOffset={8} className={styles.positioner}>
          <BaseTooltip.Popup className={styles.popup}>
            <BaseTooltip.Arrow className={styles.arrow} />
            {content}
          </BaseTooltip.Popup>
        </BaseTooltip.Positioner>
      </BaseTooltip.Portal>
    </BaseTooltip.Root>
  );
}

export const TooltipProvider = BaseTooltip.Provider;
