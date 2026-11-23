import { Toggle } from '@base-ui/react/toggle';
import { ToggleGroup } from '@base-ui/react/toggle-group';
import styles from './Segmented.module.css';

interface SegmentedProps<V extends string> {
  label: string;
  options: { value: V; label: string }[];
  value: V;
  onChange: (value: V) => void;
}

/** Selección única (Base UI ToggleGroup) con casillas contiguas, como una leyenda de plano */
export function Segmented<V extends string>({ label, options, value, onChange }: SegmentedProps<V>) {
  return (
    <div className={styles.field}>
      <span className="label" aria-hidden>
        {label}
      </span>
      <ToggleGroup
        aria-label={label}
        value={[value]}
        onValueChange={(next) => next[0] && onChange(next[0] as V)}
        className={styles.group}
      >
        {options.map((o) => (
          <Toggle key={o.value} value={o.value} className={styles.item}>
            {o.label}
          </Toggle>
        ))}
      </ToggleGroup>
    </div>
  );
}
