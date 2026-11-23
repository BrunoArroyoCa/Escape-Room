import { Accordion } from '@base-ui/react/accordion';
import { useState } from 'react';
import { createMap, deleteMap, mapUsage, updateMap, updatePuzzle } from '../../services/adminService';
import type { MapWithPuzzles, Puzzle } from '../../types/models';
import { Button } from '../ui/Button';
import { NumberInput, SwitchField, TextField } from '../ui/Fields';
import { Icon } from '../ui/Icon';
import { useToast } from '../ui/useToast';
import styles from './Editors.module.css';

interface RoomEditorProps {
  /** null = sala nueva */
  room: MapWithPuzzles | null;
  onDone: () => void;
}

/** Plantilla de una sala nueva: campos vacíos y 4 puzzles por rellenar */
const blankRoom: MapWithPuzzles = {
  id_map: '',
  name: '',
  difficulty: 3,
  time_limit: 60,
  max_score: 1000,
  is_active: true,
  puzzles: [1, 2, 3, 4].map((i) => ({
    id_puzzles: '',
    id_map: '',
    index1_4: i,
    title: '',
    message: '',
    solution: '',
    hint: null,
  })),
};

/**
 * Crear (POST /admin/maps), editar (PUT /admin/maps/{id} y /puzzles/{index})
 * o eliminar (DELETE /admin/maps/{id}) una sala.
 */
export function RoomEditor({ room: existing, onDone }: RoomEditorProps) {
  const toast = useToast();
  const isNew = existing === null;
  const room = existing ?? blankRoom;
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [map, setMap] = useState(() => ({
    name: room.name,
    difficulty: room.difficulty,
    time_limit: room.time_limit,
    max_score: room.max_score,
    is_active: room.is_active,
  }));
  const [puzzles, setPuzzles] = useState<Puzzle[]>(room.puzzles);
  const [saving, setSaving] = useState(false);

  const changedPuzzles = puzzles.filter((p) => {
    const original = room.puzzles.find((o) => o.index1_4 === p.index1_4)!;
    return (['title', 'message', 'solution', 'hint'] as const).some((k) => (p[k] ?? '') !== (original[k] ?? ''));
  });
  const mapChanged = (Object.keys(map) as (keyof typeof map)[]).some((k) => map[k] !== room[k]);
  const invalid = !map.name.trim() || puzzles.some((p) => !p.title.trim() || !p.solution.trim());
  const dirty = isNew || mapChanged || changedPuzzles.length > 0;
  const usage = isNew ? { games: 0, reservations: 0 } : mapUsage(room.id_map);
  const deletable = usage.games === 0 && usage.reservations === 0;

  const setPuzzle = (index: number, changes: Partial<Puzzle>) =>
    setPuzzles((list) => list.map((p) => (p.index1_4 === index ? { ...p, ...changes } : p)));

  async function save() {
    setSaving(true);
    if (isNew) {
      await createMap({
        ...map,
        puzzles: puzzles.map((p) => ({
          title: p.title,
          message: p.message,
          solution: p.solution,
          hint: p.hint?.trim() ? p.hint : null,
        })),
      });
      setSaving(false);
      toast.add({ title: 'Sala creada', description: `${map.name} ya aparece en la planta y en la agenda` });
      onDone();
      return;
    }
    if (mapChanged) await updateMap(room.id_map, map);
    for (const p of changedPuzzles) {
      await updatePuzzle(room.id_map, p.index1_4, {
        title: p.title,
        message: p.message,
        solution: p.solution,
        hint: p.hint?.trim() ? p.hint : null,
      });
    }
    setSaving(false);
    toast.add({ title: 'Sala guardada', description: `${map.name} · cambios aplicados a los datos de ejemplo` });
    onDone();
  }

  async function remove() {
    await deleteMap(room.id_map);
    toast.add({ title: 'Sala eliminada', description: room.name });
    onDone();
  }

  return (
    <div className={styles.editor}>
      <fieldset className={styles.group}>
        <legend className={styles.legend}>Sala</legend>
        <TextField label="Nombre" value={map.name} onChange={(name) => setMap({ ...map, name })} required />
        <div className={styles.row3}>
          <NumberInput
            label="Dificultad"
            value={map.difficulty}
            min={1}
            max={5}
            unit="1–5"
            onChange={(difficulty) => setMap({ ...map, difficulty })}
          />
          <NumberInput
            label="Tiempo límite"
            value={map.time_limit}
            min={15}
            max={180}
            step={5}
            unit="min"
            onChange={(time_limit) => setMap({ ...map, time_limit })}
          />
          <NumberInput
            label="Puntuación máx."
            value={map.max_score}
            min={100}
            max={5000}
            step={50}
            onChange={(max_score) => setMap({ ...map, max_score })}
          />
        </div>
        <SwitchField
          label="Reservas"
          checked={map.is_active}
          onChange={(is_active) => setMap({ ...map, is_active })}
          on="Sala abierta: se puede reservar"
          off="Sala cerrada: no admite reservas"
        />
      </fieldset>

      <fieldset className={styles.group}>
        <legend className={styles.legend}>Puzzles y pistas</legend>
        <Accordion.Root className={styles.accordion} multiple={false}>
          {puzzles.map((p) => (
            <Accordion.Item key={p.index1_4} value={p.index1_4} className={styles.item}>
              <Accordion.Header className={styles.itemHead}>
                <Accordion.Trigger className={styles.trigger}>
                  <span className={styles.index}>{p.index1_4}</span>
                  <span className={styles.itemTitle}>{p.title || 'Sin título'}</span>
                  {changedPuzzles.some((c) => c.index1_4 === p.index1_4) && (
                    <span className={styles.changed}>Editado</span>
                  )}
                  <Icon name="down" className={styles.chev} />
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Panel className={styles.panel}>
                <div className={styles.panelInner}>
                  <TextField
                    label="Título"
                    value={p.title}
                    onChange={(title) => setPuzzle(p.index1_4, { title })}
                    required
                  />
                  <TextField
                    label="Mensaje al pulsar el objeto"
                    value={p.message}
                    multiline
                    onChange={(message) => setPuzzle(p.index1_4, { message })}
                  />
                  <TextField
                    label="Solución"
                    value={p.solution}
                    onChange={(solution) => setPuzzle(p.index1_4, { solution })}
                    required
                  />
                  <TextField
                    label="Pista"
                    value={p.hint ?? ''}
                    multiline
                    placeholder="Sin pista: el equipo no podrá pedir ayuda en este puzzle"
                    onChange={(hint) => setPuzzle(p.index1_4, { hint })}
                  />
                </div>
              </Accordion.Panel>
            </Accordion.Item>
          ))}
        </Accordion.Root>
      </fieldset>

      {!isNew && (
        <div className={styles.danger}>
          {deletable ? (
            confirmDelete ? (
              <>
                <p>¿Eliminar {room.name} y sus 4 puzzles? No se puede deshacer.</p>
                <div className={styles.dangerActions}>
                  <Button onClick={() => setConfirmDelete(false)}>No, mantener</Button>
                  <Button variant="markup" onClick={remove}>
                    Sí, eliminar sala
                  </Button>
                </div>
              </>
            ) : (
              <Button variant="markup" onClick={() => setConfirmDelete(true)}>
                Eliminar sala
              </Button>
            )
          ) : (
            <p>
              No se puede eliminar: tiene {usage.games} partidas y {usage.reservations} reservas en su historial.
              Para dejar de usarla, ciérrala con el interruptor de reservas; el historial se conserva.
            </p>
          )}
        </div>
      )}

      <div className={styles.actions}>
        <span className={styles.status}>
          {invalid
            ? isNew
              ? 'Falta: nombre, y título y solución de cada puzzle'
              : 'Revisa los campos marcados'
            : isNew
              ? 'Sala nueva'
              : dirty
                ? 'Cambios sin guardar'
                : 'Sin cambios'}
        </span>
        <Button onClick={onDone}>Cancelar</Button>
        <Button variant="solid" disabled={!dirty || invalid || saving} onClick={save}>
          {saving ? 'Guardando…' : isNew ? 'Crear sala' : 'Guardar sala'}
        </Button>
      </div>
    </div>
  );
}
