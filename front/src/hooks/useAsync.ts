import { useCallback, useEffect, useState, type DependencyList } from 'react';

interface AsyncState<T> {
  /** Último dato recibido (se conserva mientras se recarga) */
  data: T | undefined;
  loading: boolean;
  error: Error | null;
  reload: () => void;
}

interface Settled<T> {
  request: string;
  data?: T;
  error: Error | null;
}

/**
 * Ejecuta una función asíncrona cuando cambian sus dependencias y expone
 * data / loading / error. Ignora respuestas que llegan tarde.
 */
export function useAsync<T>(fn: () => Promise<T>, deps: DependencyList): AsyncState<T> {
  const [nonce, setNonce] = useState(0);
  // Clave de la petición actual: cambia con las dependencias o al recargar.
  // Las dependencias deben ser valores serializables (ids, filtros…).
  const request = `${JSON.stringify(deps)}#${nonce}`;
  const [settled, setSettled] = useState<Settled<T> | null>(null);

  useEffect(() => {
    let cancelled = false;
    fn().then(
      (data) => !cancelled && setSettled({ request, data, error: null }),
      (e: unknown) =>
        !cancelled &&
        setSettled((prev) => ({
          request,
          data: prev?.data,
          error: e instanceof Error ? e : new Error(String(e)),
        })),
    );
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [request]);

  const reload = useCallback(() => setNonce((n) => n + 1), []);

  return {
    data: settled?.data,
    loading: settled?.request !== request,
    error: settled?.request === request ? settled.error : null,
    reload,
  };
}
