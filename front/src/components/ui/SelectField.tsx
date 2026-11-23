import { Select } from '@base-ui/react/select';
import type { ReactNode } from 'react';
import { Icon } from './Icon';
import styles from './SelectField.module.css';

export interface SelectOption<V extends string> {
  value: V;
  label: string;
  swatch?: string;
}

interface SelectFieldProps<V extends string> {
  label: string;
  options: SelectOption<V>[];
  value: V;
  onChange: (value: V) => void;
  hint?: ReactNode;
  /** Sin ancho mínimo, para barras de filtros estrechas */
  compact?: boolean;
}

export function SelectField<V extends string>({ label, options, value, onChange, hint, compact }: SelectFieldProps<V>) {
  const current = options.find((o) => o.value === value);
  return (
    <Select.Root items={options} value={value} onValueChange={(v) => v !== null && onChange(v as V)}>
      <div className={styles.field}>
        <Select.Label className="label">{label}</Select.Label>
        <Select.Trigger className={styles.trigger} data-compact={compact || undefined}>
          <Select.Value className={styles.value}>
            {() => (
              <>
                {current?.swatch && <i className={styles.swatch} style={{ background: current.swatch }} />}
                {current?.label}
              </>
            )}
          </Select.Value>
          <Select.Icon className={styles.icon}>
            <Icon name="down" />
          </Select.Icon>
        </Select.Trigger>
        {hint}
      </div>
      <Select.Portal>
        <Select.Positioner className={styles.positioner} sideOffset={-1} alignItemWithTrigger={false}>
          <Select.Popup className={styles.popup}>
            <Select.List>
              {options.map((o) => (
                <Select.Item key={o.value} value={o.value} className={styles.item}>
                  {o.swatch ? <i className={styles.swatch} style={{ background: o.swatch }} /> : <span />}
                  <Select.ItemText>{o.label}</Select.ItemText>
                  <Select.ItemIndicator className={styles.check}>
                    <Icon name="check" />
                  </Select.ItemIndicator>
                </Select.Item>
              ))}
            </Select.List>
          </Select.Popup>
        </Select.Positioner>
      </Select.Portal>
    </Select.Root>
  );
}
