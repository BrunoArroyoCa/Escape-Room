const LOCALE = 'es-ES';

export const formatNumber = (n: number) => new Intl.NumberFormat(LOCALE).format(Math.round(n));

export const formatPercent = (ratio: number, digits = 0) =>
  new Intl.NumberFormat(LOCALE, { style: 'percent', maximumFractionDigits: digits }).format(ratio);

export const formatTime = (iso: string) =>
  new Intl.DateTimeFormat(LOCALE, { hour: '2-digit', minute: '2-digit' }).format(new Date(iso));

export const formatDate = (iso: string) =>
  new Intl.DateTimeFormat(LOCALE, { day: '2-digit', month: 'short' }).format(new Date(iso));

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export const formatDateTime = (iso: string) =>
  capitalize(new Intl.DateTimeFormat(LOCALE, {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso)));

export const formatWeekday = (dateKey: string) =>
  new Intl.DateTimeFormat(LOCALE, { weekday: 'short' }).format(new Date(`${dateKey}T12:00:00`));

/** 3725 s → "62:05" */
export function formatDuration(totalSeconds: number) {
  const s = Math.max(0, Math.floor(totalSeconds));
  const m = Math.floor(s / 60);
  return `${String(m).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
}

export const minutesBetween = (fromIso: string, toIso: string) =>
  (new Date(toIso).getTime() - new Date(fromIso).getTime()) / 60_000;

export const puzzlesSolved = (progress: number) => Math.min(4, Math.floor(progress / 25));

export const initials = (name: string) =>
  name
    .split(' ')
    .slice(0, 2)
    .map((p) => p[0])
    .join('')
    .toUpperCase();
