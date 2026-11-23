import { motion } from 'motion/react';
import { adminNav, type AdminRoute } from '../../config/navigation';
import { Icon } from '../ui/Icon';
import { Tooltip } from '../ui/Tooltip';
import styles from './Sidebar.module.css';

interface SidebarProps {
  current: AdminRoute;
  onNavigate: (route: AdminRoute) => void;
}

export function Sidebar({ current, onNavigate }: SidebarProps) {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        <motion.span
          className={styles.logo}
          initial={{ rotate: -90, scale: 0.6, opacity: 0 }}
          animate={{ rotate: 0, scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 14 }}
        >
          <Icon name="key" size={20} />
        </motion.span>
        <div className={styles.brandText}>
          <strong>Escape Room</strong>
          <span>Panel de empresa</span>
        </div>
      </div>

      <nav aria-label="Navegación principal">
        <p className={styles.section}>Gestión</p>
        <ul className={styles.list}>
          {adminNav.map((item) => {
            const active = item.id === current;
            const button = (
              <button
                type="button"
                className={styles.link}
                data-active={active || undefined}
                aria-current={active ? 'page' : undefined}
                aria-disabled={item.disabled || undefined}
                onClick={() => !item.disabled && onNavigate(item.id)}
              >
                {active && (
                  <motion.span
                    layoutId="sidebar-active"
                    className={styles.activeBg}
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  />
                )}
                <Icon name={item.icon} size={18} className={styles.linkIcon} />
                <span className={styles.linkLabel}>{item.label}</span>
                {item.disabled && <Icon name="lock" size={14} className={styles.lock} />}
              </button>
            );
            return (
              <li key={item.id}>
                {item.disabled ? (
                  <Tooltip content="Próximamente" side="right">
                    {button}
                  </Tooltip>
                ) : (
                  button
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      <div className={styles.footer}>
        <span className={styles.footerDot} />
        Modo desarrollo · datos de ejemplo
      </div>
    </aside>
  );
}
