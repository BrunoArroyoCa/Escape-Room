import { Avatar as BaseAvatar } from '@base-ui/react/avatar';
import { initials } from '../../utils/format';
import styles from './Avatar.module.css';

interface AvatarProps {
  name: string;
  src?: string;
  size?: number;
}

export function Avatar({ name, src, size = 32 }: AvatarProps) {
  return (
    <BaseAvatar.Root className={styles.root} style={{ width: size, height: size, fontSize: size * 0.38 }}>
      {src && <BaseAvatar.Image src={src} alt={name} className={styles.image} />}
      <BaseAvatar.Fallback className={styles.fallback}>{initials(name)}</BaseAvatar.Fallback>
    </BaseAvatar.Root>
  );
}
