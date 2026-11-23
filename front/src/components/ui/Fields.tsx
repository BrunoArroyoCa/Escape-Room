import { Field } from '@base-ui/react/field';
import { Input } from '@base-ui/react/input';
import { NumberField } from '@base-ui/react/number-field';
import { Switch } from '@base-ui/react/switch';
import { useState, type ReactNode } from 'react';
import styles from './Fields.module.css';

interface TextFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
  placeholder?: string;
  description?: ReactNode;
  required?: boolean;
}

export function TextField({ label, value, onChange, multiline, placeholder, description, required }: TextFieldProps) {
  // El error aparece tras salir del campo, no al abrir un formulario vacío
  const [touched, setTouched] = useState(false);
  const showError = required && touched && !value.trim();
  return (
    <Field.Root className={styles.field} invalid={showError} onBlur={() => setTouched(true)}>
      <Field.Label className="label">{label}</Field.Label>
      {multiline ? (
        <Field.Control
          render={<textarea rows={2} />}
          className={`${styles.input} ${styles.area}`}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange((e.target as unknown as HTMLTextAreaElement).value)}
        />
      ) : (
        <Input className={styles.input} value={value} placeholder={placeholder} onValueChange={onChange} />
      )}
      {description && <Field.Description className={styles.description}>{description}</Field.Description>}
      {showError && (
        <span className={styles.error} role="alert">
          Este campo no puede quedar vacío.
        </span>
      )}
    </Field.Root>
  );
}

interface NumberInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
}

export function NumberInput({ label, value, onChange, min, max, step = 1, unit }: NumberInputProps) {
  return (
    <Field.Root className={styles.field}>
      <Field.Label className="label">
        {label}
        {unit && <span className={styles.unitLabel}> ({unit})</span>}
      </Field.Label>
      <NumberField.Root
        locale="es-ES"
        value={value}
        min={min}
        max={max}
        step={step}
        onValueChange={(v) => v !== null && onChange(v)}
      >
        <NumberField.Group className={styles.number}>
          <NumberField.Decrement className={styles.stepper} aria-label={`Restar a ${label}`}>
            −
          </NumberField.Decrement>
          <NumberField.Input className={styles.numberInput} />
          <NumberField.Increment className={styles.stepper} aria-label={`Sumar a ${label}`}>
            +
          </NumberField.Increment>
        </NumberField.Group>
      </NumberField.Root>
    </Field.Root>
  );
}

interface SwitchFieldProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  on: string;
  off: string;
}

export function SwitchField({ label, checked, onChange, on, off }: SwitchFieldProps) {
  return (
    <Field.Root className={styles.switchRow}>
      <Field.Label className={styles.switchLabel}>
        <Switch.Root className={styles.switch} checked={checked} onCheckedChange={onChange}>
          <Switch.Thumb className={styles.thumb} />
        </Switch.Root>
        <span>
          <span className="label">{label}</span>
          <strong className={styles.switchState}>{checked ? on : off}</strong>
        </span>
      </Field.Label>
    </Field.Root>
  );
}

interface DateFieldProps {
  label: string;
  /** YYYY-MM-DD */
  value: string;
  onChange: (value: string) => void;
  min?: string;
  max?: string;
}

/** Fecha con el selector nativo del navegador (Base UI Input type="date") */
export function DateField({ label, value, onChange, min, max }: DateFieldProps) {
  return (
    <Field.Root className={styles.field}>
      <Field.Label className="label">{label}</Field.Label>
      <Input
        type="date"
        className={`${styles.input} ${styles.date}`}
        value={value}
        min={min}
        max={max}
        onValueChange={onChange}
      />
    </Field.Root>
  );
}
