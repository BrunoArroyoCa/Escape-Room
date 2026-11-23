import { useEffect, useState } from 'react';
import { getLiveGames } from '../services/adminGamesService';
import type { GameWithDetails } from '../types/models';

export const LIVE_POLL_MS = 3000;

/**
 * Partidas en curso con actualización periódica (polling).
 * Equivale a consumir GET /admin/games/live.
 */
export function useLiveGames(intervalMs = LIVE_POLL_MS) {
  const [games, setGames] = useState<GameWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      const data = await getLiveGames();
      if (cancelled) return;
      setGames(data);
      setLastUpdate(new Date());
      setLoading(false);
    };
    void load();
    const id = setInterval(load, intervalMs);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [intervalMs]);

  return { games, loading, lastUpdate };
}
