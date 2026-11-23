import { useLayoutEffect, useMemo, useState, type ReactNode } from 'react';
import { defaultThemeId, themes, type Theme, type ThemeId } from './theme';
import { ThemeContext } from './themeContext';

const STORAGE_KEY = 'escape-room:theme';

const toKebab = (key: string) => key.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);

function readStoredTheme(): ThemeId {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && stored in themes) return stored as ThemeId;
  } catch {
    /* localStorage no disponible */
  }
  return defaultThemeId;
}

/** Vuelca los colores del tema como variables CSS en :root */
function applyTheme(theme: Theme) {
  const root = document.documentElement;
  for (const [key, value] of Object.entries(theme.colors)) {
    root.style.setProperty(`--color-${toKebab(key)}`, value);
  }
  theme.rooms.forEach((color, i) => root.style.setProperty(`--color-room-${i + 1}`, color));
  root.style.setProperty('--radius', `${theme.radius}px`);
  root.style.colorScheme = theme.scheme;
  root.dataset.theme = theme.id;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeId, setThemeId] = useState<ThemeId>(readStoredTheme);
  const theme: Theme = themes[themeId];

  useLayoutEffect(() => {
    applyTheme(theme);
    try {
      localStorage.setItem(STORAGE_KEY, themeId);
    } catch {
      /* ignore */
    }
  }, [theme, themeId]);

  const value = useMemo(() => ({ theme, themeId, setThemeId }), [theme, themeId]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
