/** Utilidades de fecha local (sin zona horaria en las claves) */

export const startOfDay = (d: Date) => {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
};

export const addDays = (d: Date, n: number) => {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
};

/** Date → "YYYY-MM-DD" en hora local (para <input type="date">) */
export const toDateKey = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

/** "YYYY-MM-DD" → Date a las 00:00 locales */
export const fromDateKey = (key: string) => {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y!, (m ?? 1) - 1, d ?? 1);
};

export const isSameDay = (a: Date, b: Date) => a.toDateString() === b.toDateString();

/** "Martes, 24 de noviembre" */
export const formatLongDay = (d: Date) => {
  const s = new Intl.DateTimeFormat('es-ES', { weekday: 'long', day: 'numeric', month: 'long' }).format(d);
  return s.charAt(0).toUpperCase() + s.slice(1);
};
