import type { IconName } from '../components/ui/Icon';

export type AdminRoute = 'dashboard' | 'games' | 'maps' | 'reservations' | 'users';

export interface NavItem {
  id: AdminRoute;
  label: string;
  icon: IconName;
  /** Pantallas aún no implementadas */
  disabled?: boolean;
}

export const adminNav: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
  { id: 'games', label: 'Partidas', icon: 'games' },
  { id: 'maps', label: 'Salas y puzzles', icon: 'door', disabled: true },
  { id: 'reservations', label: 'Reservas', icon: 'calendar', disabled: true },
  { id: 'users', label: 'Usuarios', icon: 'users', disabled: true },
];
