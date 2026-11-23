import { ScrollArea as BaseScrollArea } from '@base-ui/react/scroll-area';
import type { CSSProperties, ReactNode } from 'react';
import styles from './ScrollArea.module.css';

interface ScrollAreaProps {
  children: ReactNode;
  maxHeight?: CSSProperties['maxHeight'];
  className?: string;
}

export function ScrollArea({ children, maxHeight, className }: ScrollAreaProps) {
  return (
    <BaseScrollArea.Root className={[styles.root, className].filter(Boolean).join(' ')}>
      <BaseScrollArea.Viewport className={styles.viewport} style={{ maxHeight }}>
        <BaseScrollArea.Content>{children}</BaseScrollArea.Content>
      </BaseScrollArea.Viewport>
      <BaseScrollArea.Scrollbar className={styles.scrollbar} orientation="vertical">
        <BaseScrollArea.Thumb className={styles.thumb} />
      </BaseScrollArea.Scrollbar>
      <BaseScrollArea.Scrollbar className={styles.scrollbar} orientation="horizontal">
        <BaseScrollArea.Thumb className={styles.thumb} />
      </BaseScrollArea.Scrollbar>
    </BaseScrollArea.Root>
  );
}
