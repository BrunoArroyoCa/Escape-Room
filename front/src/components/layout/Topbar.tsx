import type { ReactNode } from 'react';
import { adminExample } from '../../modelsExample';
import { Avatar } from '../ui/Avatar';
import { ThemeMenu } from './ThemeMenu';
import styles from './Topbar.module.css';

interface TopbarProps {
  title: string;
  subtitle?: ReactNode;
}

export function Topbar({ title, subtitle }: TopbarProps) {
  const today = new Intl.DateTimeFormat('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(new Date());

  return (
    <header className={styles.topbar}>
      <div className={styles.titles}>
        <p className={styles.eyebrow}>{today}</p>
        <h1 className={styles.title}>{title}</h1>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      </div>
      <div className={styles.actions}>
        <ThemeMenu />
        <div className={styles.user}>
          <Avatar name={adminExample.name} size={36} />
          <div className={styles.userText}>
            <strong>{adminExample.name}</strong>
            <span>{adminExample.email}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
