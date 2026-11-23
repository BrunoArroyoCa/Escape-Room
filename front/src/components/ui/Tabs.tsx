import { Tabs as BaseTabs } from '@base-ui/react/tabs';
import type { ComponentProps, ReactNode } from 'react';
import styles from './Tabs.module.css';

interface TabItem<V extends string> {
  value: V;
  label: ReactNode;
}

interface TabsProps<V extends string> {
  value: V;
  onChange: (value: V) => void;
  items: TabItem<V>[];
  'aria-label'?: string;
  children: ReactNode;
}

/** Tabs con indicador deslizante (Base UI Tabs.Indicator usa CSS vars de posición) */
export function Tabs<V extends string>({ value, onChange, items, children, ...rest }: TabsProps<V>) {
  return (
    <BaseTabs.Root value={value} onValueChange={(v) => onChange(v as V)} className={styles.root}>
      <BaseTabs.List className={styles.list} aria-label={rest['aria-label']}>
        {items.map((item) => (
          <BaseTabs.Tab key={item.value} value={item.value} className={styles.tab}>
            {item.label}
          </BaseTabs.Tab>
        ))}
        <BaseTabs.Indicator className={styles.indicator} />
      </BaseTabs.List>
      {children}
    </BaseTabs.Root>
  );
}

export function TabPanel(props: ComponentProps<typeof BaseTabs.Panel>) {
  return <BaseTabs.Panel className={styles.panel} {...props} />;
}
