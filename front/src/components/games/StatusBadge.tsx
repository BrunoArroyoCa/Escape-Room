import type { GameStatus, ReservationStatus } from '../../types/models';
import { Badge, type BadgeTone } from '../ui/Badge';

const gameStatus: Record<GameStatus, { label: string; tone: BadgeTone }> = {
  in_progress: { label: 'En curso', tone: 'accent' },
  completed: { label: 'Completada', tone: 'success' },
  abandoned: { label: 'Abandonada', tone: 'danger' },
};

const reservationStatus: Record<ReservationStatus, { label: string; tone: BadgeTone }> = {
  pending: { label: 'Pendiente', tone: 'warning' },
  confirmed: { label: 'Confirmada', tone: 'info' },
  cancelled: { label: 'Cancelada', tone: 'danger' },
  completed: { label: 'Jugada', tone: 'neutral' },
};

export function GameStatusBadge({ status }: { status: GameStatus }) {
  const s = gameStatus[status];
  return (
    <Badge tone={s.tone} dot={status === 'in_progress' ? 'pulse' : true}>
      {s.label}
    </Badge>
  );
}

export function ReservationStatusBadge({ status }: { status: ReservationStatus }) {
  const s = reservationStatus[status];
  return (
    <Badge tone={s.tone} dot>
      {s.label}
    </Badge>
  );
}
