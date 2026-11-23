import { Toast } from '@base-ui/react/toast';
import type { ReactNode } from 'react';
import styles from './Toasts.module.css';

/** Avisos de confirmación tras guardar (Base UI Toast), uno a la vez */
export function ToastProvider({ children }: { children: ReactNode }) {
  return (
    <Toast.Provider limit={1} timeout={3500}>
      {children}
      <Toast.Portal>
        <Toast.Viewport className={styles.viewport}>
          <ToastList />
        </Toast.Viewport>
      </Toast.Portal>
    </Toast.Provider>
  );
}

function ToastList() {
  const { toasts } = Toast.useToastManager();
  return toasts.map((t) => (
    <Toast.Root key={t.id} toast={t} className={styles.toast}>
      <Toast.Content className={styles.content}>
        <Toast.Title className={styles.title} />
        <Toast.Description className={styles.description} />
      </Toast.Content>
      <Toast.Close className={styles.close} aria-label="Cerrar aviso">
        Cerrar
      </Toast.Close>
    </Toast.Root>
  ));
}

