import { useState } from 'react';
import { useQuery } from '../../hooks/useQuery';
import { getGameById, getMapById, getReservationById } from '../../services/adminService';
import type { GameWithDetails, MapRoom } from '../../types/models';
import { zoneColor } from '../../utils/zones';
import { Sheet } from '../ui/Sheet';
import { GameDetail } from './GameDetail';
import { ReservationEditor } from './ReservationEditor';
import { RoomEditor } from './RoomEditor';
import styles from './Editors.module.css';

export type SheetTarget =
  | { type: 'new-room' }
  | { type: 'room'; id: string }
  | { type: 'reservation'; id: string }
  | { type: 'game'; id: string };

interface SheetHostProps {
  target: SheetTarget | null;
  maps: MapRoom[];
  live: GameWithDetails[];
  onClose: () => void;
  onOpen: (target: SheetTarget) => void;
}

/** Una sola hoja lateral para todo lo que se pulsa en el panel */
export function SheetHost({ target, maps, live, onClose, onOpen }: SheetHostProps) {
  // Conserva el contenido mientras la hoja se cierra
  const [shown, setShown] = useState(target);
  if (target && target !== shown) setShown(target);
  const subject = useSubject(shown);

  return (
    <Sheet
      open={target !== null}
      onOpenChange={(o) => !o && onClose()}
      kind={kindLabel[shown?.type ?? 'room']}
      title={subject.title}
      zone={subject.mapId ? zoneColor(subject.mapId) : undefined}
    >
      {shown?.type === 'new-room' && <RoomEditor room={null} onDone={onClose} />}
      {shown?.type === 'room' && <RoomBody key={shown.id} id={shown.id} onDone={onClose} />}
      {shown?.type === 'reservation' && (
        <ReservationBody key={shown.id} id={shown.id} maps={maps} live={live} onDone={onClose} />
      )}
      {shown?.type === 'game' && (
        <GameBody key={shown.id} id={shown.id} onEditRoom={(id) => onOpen({ type: 'room', id })} />
      )}
    </Sheet>
  );
}

const kindLabel = {
  'new-room': 'Crear sala',
  room: 'Editar sala',
  reservation: 'Editar reserva',
  game: 'Partida',
} as const;

/** Título y sala de lo que se muestra en la hoja */
function useSubject(target: SheetTarget | null): { title: string; mapId?: string } {
  const { data } = useQuery(async () => {
    if (!target) return null;
    if (target.type === 'new-room') return { title: 'Nueva sala' };
    if (target.type === 'room') {
      const m = await getMapById(target.id);
      return m && { title: m.name, mapId: m.id_map };
    }
    if (target.type === 'reservation') {
      const r = await getReservationById(target.id);
      return r && { title: r.team ?? r.user.name, mapId: r.id_map };
    }
    const g = await getGameById(target.id);
    return g && { title: g.team ?? 'Sin equipo', mapId: g.id_map };
  }, [target]);
  return data ?? { title: target ? '…' : '' };
}

function Loading() {
  return <p className={styles.status}>Cargando…</p>;
}

function RoomBody({ id, onDone }: { id: string; onDone: () => void }) {
  // Solo la primera carga: el formulario no debe reiniciarse con cada cambio
  const [room, setRoom] = useState<Awaited<ReturnType<typeof getMapById>>>(null);
  const q = useQuery(() => getMapById(id), [id]);
  if (!room && q.data) setRoom(q.data);
  if (!room) return <Loading />;
  return (
    <div style={{ ['--zone' as string]: zoneColor(id) }}>
      <RoomEditor room={room} onDone={onDone} />
    </div>
  );
}

function ReservationBody({
  id,
  maps,
  live,
  onDone,
}: {
  id: string;
  maps: MapRoom[];
  live: GameWithDetails[];
  onDone: () => void;
}) {
  const [res, setRes] = useState<Awaited<ReturnType<typeof getReservationById>>>(null);
  const q = useQuery(() => getReservationById(id), [id]);
  if (!res && q.data) setRes(q.data);
  if (!res) return <Loading />;
  return (
    <ReservationEditor
      reservation={res}
      maps={maps}
      locked={live.some((g) => g.id_reservations === id)}
      onDone={onDone}
    />
  );
}

function GameBody({ id, onEditRoom }: { id: string; onEditRoom: (mapId: string) => void }) {
  // Se refresca cada 3 s por si la partida sigue en juego
  const { data } = useQuery(() => getGameById(id), [id], 3000);
  if (!data) return <Loading />;
  return <GameDetail game={data} onEditRoom={onEditRoom} />;
}
