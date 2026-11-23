import type { CSSProperties } from 'react';
import styles from './Skeleton.module.css';

export function Skeleton({ width = '100%', height = 16, radius }: { width?: CSSProperties['width']; height?: CSSProperties['height']; radius?: number }) {
  return <span className={styles.skeleton} style={{ width, height, borderRadius: radius }} aria-hidden />;
}
