import { mapsExample } from '../modelsExample';

/**
 * Color de identidad de una sala → variable CSS --color-room-N (definida en el tema).
 * El orden es fijo (el de la lista de salas), nunca depende de filtros, así
 * cada sala conserva su color en toda la app.
 *
 * TODO(API): cuando exista GET /admin/maps, construir este orden con esa respuesta.
 */
const order = new Map(mapsExample.map((m, i) => [m.id_map, i]));

export function roomColor(id_map: string): string {
  const i = order.get(id_map) ?? 0;
  return `var(--color-room-${(i % 3) + 1})`;
}
