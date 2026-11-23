import { useNow } from '../../hooks/useNow';
import { Badge } from '../ui/Badge';
import { Tooltip } from '../ui/Tooltip';

/** Insignia "En vivo" con el tiempo desde la última actualización del polling */
export function LiveIndicator({ lastUpdate, intervalMs }: { lastUpdate: Date | null; intervalMs: number }) {
  const now = useNow(1000);
  const seconds = lastUpdate ? Math.max(0, Math.round((now - lastUpdate.getTime()) / 1000)) : null;
  return (
    <Tooltip content={`Se actualiza cada ${intervalMs / 1000} s`}>
      <span tabIndex={0}>
        <Badge tone="success" dot="pulse">
          En vivo{seconds !== null && ` · hace ${seconds}s`}
        </Badge>
      </span>
    </Tooltip>
  );
}
