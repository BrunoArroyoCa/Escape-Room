import { useLayoutEffect, type ReactNode } from 'react';
import { theme } from './theme';

/** Vuelca config/theme.ts como variables CSS en :root */
export function ThemeProvider({ children }: { children: ReactNode }) {
  useLayoutEffect(() => {
    const root = document.documentElement.style;
    const { zones, extraZone, ...colors } = theme;
    for (const [key, value] of Object.entries(colors)) root.setProperty(`--${key}`, value);
    zones.forEach((c, i) => root.setProperty(`--zone-${i + 1}`, c));
    root.setProperty('--zone-extra', extraZone);
  }, []);
  return <>{children}</>;
}
