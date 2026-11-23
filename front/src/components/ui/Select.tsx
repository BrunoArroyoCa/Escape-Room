import { Select as BaseSelect } from '@base-ui/react/select';
import type { ReactNode } from 'react';
import { Icon } from './Icon';
import styles from './Select.module.css';

export interface SelectOption<V extends string> {
  value: V;
  label: string;
  /** Contenido opcional a la izquierda (p. ej. color de sala) */
  adornment?: ReactNode;
}

interface SelectProps<V extends string> {
  label: string;
  options: SelectOption<V>[];
  value: V;
  onChange: (value: V) => void;
  /** Oculta visualmente la etiqueta (sigue disponible para lectores de pantalla) */
  hideLabel?: boolean;
}

export function Select<V extends string>({ label, options, value, onChange, hideLabel }: SelectProps<V>) {
  return (
    <BaseSelect.Root
      items={options}
      value={value}
      onValueChange={(v) => {
        if (v !== null) onChange(v as V);
      }}
    >
      <div className={styles.field}>
        <BaseSelect.Label className={hideLabel ? 'sr-only' : styles.label}>{label}</BaseSelect.Label>
        <BaseSelect.Trigger className={styles.trigger}>
          <BaseSelect.Value className={styles.value}>
            {(v: V) => {
              const opt = options.find((o) => o.value === v);
              return (
                <>
                  {opt?.adornment}
                  {opt?.label}
                </>
              );
            }}
          </BaseSelect.Value>
          <BaseSelect.Icon className={styles.icon}>
            <Icon name="chevronDown" size={16} />
          </BaseSelect.Icon>
        </BaseSelect.Trigger>
      </div>
      <BaseSelect.Portal>
        <BaseSelect.Positioner className={styles.positioner} sideOffset={6} alignItemWithTrigger={false}>
          <BaseSelect.Popup className={styles.popup}>
            <BaseSelect.List className={styles.list}>
              {options.map((opt) => (
                <BaseSelect.Item key={opt.value} value={opt.value} className={styles.item}>
                  <span className={styles.itemLeading}>{opt.adornment}</span>
                  <BaseSelect.ItemText>{opt.label}</BaseSelect.ItemText>
                  <BaseSelect.ItemIndicator className={styles.indicator}>
                    <Icon name="check" size={16} />
                  </BaseSelect.ItemIndicator>
                </BaseSelect.Item>
              ))}
            </BaseSelect.List>
          </BaseSelect.Popup>
        </BaseSelect.Positioner>
      </BaseSelect.Portal>
    </BaseSelect.Root>
  );
}
