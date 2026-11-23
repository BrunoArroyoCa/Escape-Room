import { roomNumber } from '../services/adminService';

/**
 * Color de zona de una sala → variable CSS (config/theme.ts).
 * Salas 1–3: --zone-N. De la 4 en adelante: --zone-extra (gris), y su
 * número de sala la identifica. El número es fijo desde que se crea la sala.
 */
export const zoneIndex = (id_map: string) => roomNumber(id_map);
export const zoneColor = (id_map: string) => {
  const n = roomNumber(id_map);
  return n >= 1 && n <= 3 ? `var(--zone-${n})` : 'var(--zone-extra)';
};
/** "Sala 01" */
export const roomCode = (id_map: string) => `Sala ${String(roomNumber(id_map)).padStart(2, '0')}`;
