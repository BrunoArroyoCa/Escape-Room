import { Dialog } from '@base-ui/react/dialog';
import type { ReactNode } from 'react';
import { Icon } from './Icon';
import styles from './Sheet.module.css';

interface SheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Nombre accesible de la hoja: qué se está viendo o editando */
  kind: string;
  title: ReactNode;
  /** Color de zona de la sala relacionada */
  zone?: string;
  children: ReactNode;
  footer?: ReactNode;
}

/**
 * Hoja lateral (Base UI Dialog) donde se ve y edita lo pulsado en el panel,
 * sin salir de la pantalla. Entra desde la derecha como una hoja de detalle.
 */
export function Sheet({ open, onOpenChange, kind, title, zone, children, footer }: SheetProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Backdrop className={styles.backdrop} />
        <Dialog.Popup className={styles.sheet} style={zone ? { ['--zone' as string]: zone } : undefined}>
          <header className={styles.head}>
            <Dialog.Title className={styles.title}>
              <i className={styles.swatch} aria-hidden />
              <span className="sr-only">{kind}: </span>
              {title}
            </Dialog.Title>
            <Dialog.Close className={styles.close} aria-label="Cerrar">
              <Icon name="close" size={18} />
            </Dialog.Close>
          </header>
          <div className={styles.body}>{children}</div>
          {footer && <footer className={styles.foot}>{footer}</footer>}
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export const SheetClose = Dialog.Close;
