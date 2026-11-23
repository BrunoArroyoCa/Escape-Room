import { Dialog } from '@base-ui/react/dialog';
import type { ReactNode } from 'react';
import { Icon } from './Icon';
import { buttonClass } from './buttonStyles';
import styles from './Modal.module.css';

interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: ReactNode;
  description?: ReactNode;
  /** Franja superior decorativa (p. ej. color de la sala) */
  accentColor?: string;
  children: ReactNode;
}

/** Diálogo modal basado en Base UI Dialog, animado con transiciones CSS */
export function Modal({ open, onOpenChange, title, description, accentColor, children }: ModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Backdrop className={styles.backdrop} />
        <Dialog.Popup
          className={styles.popup}
          style={accentColor ? { ['--modal-accent' as string]: accentColor } : undefined}
        >
          <header className={styles.header}>
            <div>
              <Dialog.Title className={styles.title}>{title}</Dialog.Title>
              {description && (
                <Dialog.Description className={styles.description}>{description}</Dialog.Description>
              )}
            </div>
            <Dialog.Close className={buttonClass('ghost', 'sm', true)} aria-label="Cerrar">
              <Icon name="close" size={18} />
            </Dialog.Close>
          </header>
          <div className={styles.body}>{children}</div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
