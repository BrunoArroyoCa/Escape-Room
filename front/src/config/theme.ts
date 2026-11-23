/**
 * ─────────────────────────────────────────────────────────────
 *  CONFIGURACIÓN DE TEMA
 * ─────────────────────────────────────────────────────────────
 *  Aquí se definen TODOS los colores de la aplicación.
 *
 *  - Para cambiar un color: edita el valor hexadecimal del tema.
 *  - Para crear un tema nuevo: copia uno existente dentro de `themes`,
 *    cámbiale la clave y los colores. Aparecerá automáticamente en el
 *    selector de tema del topbar.
 *  - Para cambiar el tema por defecto: modifica `defaultThemeId`.
 *
 *  Cada clave de `colors` se convierte en una variable CSS:
 *    surfaceRaised  →  --color-surface-raised
 *  y los componentes solo consumen esas variables, nunca hex directos.
 *
 *  `rooms` son los colores de identidad de cada sala (gráficas, chips).
 *  Están validados para daltonismo contra el `surface` de su tema;
 *  si los cambias, mantén una luminosidad parecida entre ellos.
 */

export interface ThemeColors {
  /** Fondo general de la app */
  bg: string;
  /** Tarjetas, paneles */
  surface: string;
  /** Elementos elevados: popups, hover de filas */
  surfaceRaised: string;
  /** Bordes y separadores */
  border: string;
  /** Texto principal */
  text: string;
  /** Texto secundario */
  textMuted: string;
  /** Color de marca / acciones principales */
  accent: string;
  /** Texto sobre `accent` */
  accentContrast: string;
  /** Estados */
  success: string;
  warning: string;
  danger: string;
  info: string;
}

export interface Theme {
  id: string;
  label: string;
  scheme: 'dark' | 'light';
  colors: ThemeColors;
  /** Colores de identidad por sala, en orden fijo */
  rooms: [string, string, string];
  /** Radio base de las esquinas (px) */
  radius: number;
}

export const themes = {
  linterna: {
    id: 'linterna',
    label: 'Linterna',
    scheme: 'dark',
    radius: 14,
    colors: {
      bg: '#0E0D12',
      surface: '#16151C',
      surfaceRaised: '#1F1D27',
      border: '#2B2935',
      text: '#EDEAE3',
      textMuted: '#9A94A6',
      accent: '#F2A541',
      accentContrast: '#1A1206',
      success: '#4FD1A5',
      warning: '#F2C14E',
      danger: '#F2545B',
      info: '#7AA2F7',
    },
    rooms: ['#C97E22', '#4C8DF0', '#C95BC0'],
  },
  abismo: {
    id: 'abismo',
    label: 'Abismo',
    scheme: 'dark',
    radius: 14,
    colors: {
      bg: '#061012',
      surface: '#0D1B1E',
      surfaceRaised: '#13262A',
      border: '#1F363B',
      text: '#E3F1EF',
      textMuted: '#80A3A1',
      accent: '#2DD4BF',
      accentContrast: '#032521',
      success: '#5EE38F',
      warning: '#F5C451',
      danger: '#FF6B6B',
      info: '#7AB8FF',
    },
    rooms: ['#C97E22', '#4C8DF0', '#C95BC0'],
  },
  pergamino: {
    id: 'pergamino',
    label: 'Pergamino',
    scheme: 'light',
    radius: 14,
    colors: {
      bg: '#F4EFE6',
      surface: '#FFFDF8',
      surfaceRaised: '#F8F3EA',
      border: '#E3DACB',
      text: '#1F1A14',
      textMuted: '#6E6455',
      accent: '#B4561F',
      accentContrast: '#FFF8F0',
      success: '#1E8A5F',
      warning: '#A86A00',
      danger: '#C2362F',
      info: '#2F6FD1',
    },
    rooms: ['#B5651D', '#2F6FD1', '#A1459A'],
  },
} satisfies Record<string, Theme>;

export type ThemeId = keyof typeof themes;

export const defaultThemeId: ThemeId = 'linterna';
