import { Toggle } from '@base-ui/react/toggle';
import { ToggleGroup } from '@base-ui/react/toggle-group';
import { motion } from 'motion/react';
import { useId } from 'react';
import styles from './SegmentedControl.module.css';

interface SegmentedControlProps<V extends string> {
  label: string;
  options: { value: V; label: string }[];
  value: V;
  onChange: (value: V) => void;
}

/** Selección única sobre Base UI ToggleGroup con pastilla animada (motion layoutId) */
export function SegmentedControl<V extends string>({
  label,
  options,
  value,
  onChange,
}: SegmentedControlProps<V>) {
  const layoutId = useId();
  return (
    <div className={styles.field}>
      <span className={styles.label} aria-hidden>
        {label}
      </span>
      <ToggleGroup
        aria-label={label}
        value={[value]}
        onValueChange={(next) => {
          // Evita deseleccionar: siempre hay una opción activa
          const v = next[0];
          if (v) onChange(v as V);
        }}
        className={styles.group}
      >
        {options.map((opt) => (
          <Toggle key={opt.value} value={opt.value} className={styles.toggle}>
            {opt.value === value && (
              <motion.span
                layoutId={layoutId}
                className={styles.pill}
                transition={{ type: 'spring', stiffness: 420, damping: 34 }}
              />
            )}
            <span className={styles.text}>{opt.label}</span>
          </Toggle>
        ))}
      </ToggleGroup>
    </div>
  );
}
