import { useEffect, useState, type DependencyList } from 'react';
import { subscribe } from '../services/adminService';

interface Settled<T> {
  key: string;
  data?: T;
  error: Error | null;
}

/**
 * Pide datos al servicio y los vuelve a pedir cuando cambian las
 * dependencias, cuando hay una mutación (subscribe) o cada `pollMs`.
 * Las dependencias deben ser serializables (ids, filtros…).
 */
export function useQuery<T>(fn: () => Promise<T>, deps: DependencyList, pollMs?: number) {
  const key = JSON.stringify(deps);
  const [version, setVersion] = useState(0);
  const [settled, setSettled] = useState<Settled<T> | null>(null);

  useEffect(() => subscribe(() => setVersion((v) => v + 1)), []);

  useEffect(() => {
    if (!pollMs) return;
    const id = setInterval(() => setVersion((v) => v + 1), pollMs);
    return () => clearInterval(id);
  }, [pollMs]);

  useEffect(() => {
    let cancelled = false;
    fn().then(
      (data) => !cancelled && setSettled({ key, data, error: null }),
      (e: unknown) =>
        !cancelled &&
        setSettled((prev) => ({ key, data: prev?.data, error: e instanceof Error ? e : new Error(String(e)) })),
    );
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, version]);

  const current = settled?.key === key;
  return {
    /** Conserva el último dato mientras se recarga para no parpadear */
    data: settled?.data,
    /** Primera carga para estas dependencias */
    loading: !current,
    error: current ? settled.error : null,
  };
}
