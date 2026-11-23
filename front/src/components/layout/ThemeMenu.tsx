import { Menu } from '@base-ui/react/menu';
import { themes, type ThemeId } from '../../config/theme';
import { useTheme } from '../../config/themeContext';
import { buttonClass } from '../ui/buttonStyles';
import { Icon } from '../ui/Icon';
import styles from './ThemeMenu.module.css';

/** Selector de tema (Base UI Menu + RadioGroup). Lee los temas de config/theme.ts */
export function ThemeMenu() {
  const { themeId, setThemeId } = useTheme();

  return (
    <Menu.Root>
      <Menu.Trigger className={buttonClass('secondary', 'md', true)} aria-label="Cambiar tema">
        <Icon name="palette" />
      </Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner className={styles.positioner} sideOffset={8} align="end">
          <Menu.Popup className={styles.popup}>
            <Menu.Group>
              <Menu.GroupLabel className={styles.groupLabel}>Tema</Menu.GroupLabel>
              <Menu.RadioGroup value={themeId} onValueChange={(v) => setThemeId(v as ThemeId)}>
                {Object.values(themes).map((t) => (
                  <Menu.RadioItem key={t.id} value={t.id} className={styles.item} closeOnClick>
                    <span className={styles.swatches} aria-hidden>
                      <span style={{ background: t.colors.bg }} />
                      <span style={{ background: t.colors.surfaceRaised }} />
                      <span style={{ background: t.colors.accent }} />
                    </span>
                    {t.label}
                    <Menu.RadioItemIndicator className={styles.indicator}>
                      <Icon name="check" size={16} />
                    </Menu.RadioItemIndicator>
                  </Menu.RadioItem>
                ))}
              </Menu.RadioGroup>
            </Menu.Group>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
}
