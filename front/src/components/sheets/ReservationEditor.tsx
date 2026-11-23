import { useState } from 'react';
import { cancelReservation, isSlotTaken, SESSION_HOURS, updateReservation } from '../../services/adminService';
import type { MapRoom, ReservationStatus, ReservationWithDetails } from '../../types/models';
import { formatDateTime } from '../../utils/format';
import { zoneColor } from '../../utils/zones';
import { Button } from '../ui/Button';
import { fromDateKey, startOfDay, toDateKey } from '../../utils/dates';
import { DateField, TextField } from '../ui/Fields';
import { Segmented } from '../ui/Segmented';
import { SelectField } from '../ui/SelectField';
import { useToast } from '../ui/useToast';
import styles from './Editors.module.css';

interface ReservationEditorProps {
  reservation: ReservationWithDetails;
  maps: MapRoom[];
  /** La sesión ya está en juego: no se puede mover ni cancelar */
  locked: boolean;
  onDone: () => void;
}

const atHour = (dateKey: string, hour: number) => {
  const d = fromDateKey(dateKey);
  d.setHours(hour, 0, 0, 0);
  return d.toISOString();
};

/** Reorganizar o cancelar una reserva (PUT / DELETE /admin/reservations/{id}) */
export function ReservationEditor({ reservation, maps, locked, onDone }: ReservationEditorProps) {
  const toast = useToast();
  const [mapId, setMapId] = useState(reservation.id_map);
  const [day, setDay] = useState(toDateKey(new Date(reservation.reserve_at)));
  const [hour, setHour] = useState(String(new Date(reservation.reserve_at).getHours()));
  const [status, setStatus] = useState<ReservationStatus>(reservation.status);
  const [team, setTeam] = useState(reservation.team ?? '');
  const [confirmCancel, setConfirmCancel] = useState(false);

  const reserveAt = atHour(day, Number(hour));
  const taken = isSlotTaken(mapId, reserveAt, reservation.id_reservations);
  const todayKey = toDateKey(startOfDay(new Date()));
  const inPast = new Date(reserveAt) < new Date() && reserveAt !== reservation.reserve_at;
  const invalidDay = !day;
  const closedRoom = !maps.find((m) => m.id_map === mapId)?.is_active;
  const dirty =
    mapId !== reservation.id_map ||
    reserveAt !== reservation.reserve_at ||
    status !== reservation.status ||
    team !== (reservation.team ?? '');
  const cancelled = reservation.status === 'cancelled';
  const editable = !locked && !cancelled && reservation.status !== 'completed';

  async function save() {
    await updateReservation(reservation.id_reservations, {
      id_map: mapId,
      reserve_at: reserveAt,
      status,
      team: team.trim() || null,
    });
    toast.add({ title: 'Reserva actualizada', description: `${team || reservation.user.name} · ${formatDateTime(reserveAt)}` });
    onDone();
  }

  async function cancel() {
    await cancelReservation(reservation.id_reservations);
    toast.add({ title: 'Reserva cancelada', description: `${reservation.team ?? reservation.user.name} · el hueco queda libre` });
    onDone();
  }

  return (
    <div className={styles.editor}>
      <dl className={styles.facts}>
        <div>
          <dt className="label">Reservó</dt>
          <dd>{reservation.user.name}</dd>
        </div>
        <div>
          <dt className="label">Sesión actual</dt>
          <dd>{formatDateTime(reservation.reserve_at)}</dd>
        </div>
      </dl>

      {!editable && (
        <p className={styles.notice}>
          {locked
            ? 'La sesión está en juego: no se puede mover ni cancelar hasta que termine.'
            : cancelled
              ? 'Esta reserva está cancelada.'
              : 'Esta sesión ya se jugó.'}
        </p>
      )}

      <fieldset className={styles.group} disabled={!editable}>
        <legend className={styles.legend}>Reorganizar</legend>
        <SelectField
          label="Sala"
          value={mapId}
          onChange={setMapId}
          options={maps.map((m) => ({
            value: m.id_map,
            label: m.is_active ? m.name : `${m.name} (cerrada)`,
            swatch: zoneColor(m.id_map),
          }))}
        />
        <DateField label="Día" value={day} min={todayKey} onChange={setDay} />
        <Segmented
          label="Hora"
          value={hour}
          onChange={setHour}
          options={SESSION_HOURS.map((h) => ({ value: String(h), label: `${h}:00` }))}
        />
        {(taken || closedRoom || inPast) && (
          <p className={styles.warning} role="alert">
            {closedRoom
              ? 'Esa sala está cerrada y no admite reservas.'
              : inPast
                ? 'Esa sesión ya ha pasado. Elige una fecha y hora futuras.'
                : 'Ya hay otra reserva en esa sala a esa hora. Elige otro hueco.'}
          </p>
        )}
        <Segmented
          label="Estado"
          value={status === 'pending' ? 'pending' : 'confirmed'}
          onChange={(v) => setStatus(v)}
          options={[
            { value: 'pending', label: 'Pendiente' },
            { value: 'confirmed', label: 'Confirmada' },
          ]}
        />
        <TextField label="Equipo" value={team} onChange={setTeam} placeholder="Sin nombre de equipo" />
      </fieldset>

      {editable && (
        <div className={styles.danger}>
          {confirmCancel ? (
            <>
              <p>¿Cancelar la reserva de {reservation.team ?? reservation.user.name}? El hueco quedará libre.</p>
              <div className={styles.dangerActions}>
                <Button onClick={() => setConfirmCancel(false)}>No, mantener</Button>
                <Button variant="markup" onClick={cancel}>
                  Sí, cancelar reserva
                </Button>
              </div>
            </>
          ) : (
            <Button variant="markup" onClick={() => setConfirmCancel(true)}>
              Cancelar reserva
            </Button>
          )}
        </div>
      )}

      <div className={styles.actions}>
        <span className={styles.status}>{dirty ? 'Cambios sin guardar' : 'Sin cambios'}</span>
        <Button onClick={onDone}>Cerrar</Button>
        <Button
          variant="solid"
          disabled={!editable || !dirty || taken || closedRoom || inPast || invalidDay}
          onClick={save}
        >
          Guardar reserva
        </Button>
      </div>
    </div>
  );
}
