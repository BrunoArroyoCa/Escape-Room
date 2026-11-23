import type { ReactNode } from 'react';
import type { AdminRoute } from '../../config/navigation';
import { Sidebar } from './Sidebar';
import styles from './AdminLayout.module.css';

interface AdminLayoutProps {
  current: AdminRoute;
  onNavigate: (route: AdminRoute) => void;
  children: ReactNode;
}

export function AdminLayout({ current, onNavigate, children }: AdminLayoutProps) {
  return (
    <div className={styles.layout}>
      <Sidebar current={current} onNavigate={onNavigate} />
      <main className={styles.main}>{children}</main>
    </div>
  );
}
