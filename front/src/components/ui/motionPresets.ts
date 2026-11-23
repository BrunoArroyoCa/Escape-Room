/** Presets de animación (motion) compartidos por toda la app */

export const spring = { type: 'spring', stiffness: 260, damping: 26 } as const;

/** Hijo que entra escalonado dentro de un `staggerContainer` */
export const cardVariants = {
  hidden: { opacity: 0, y: 18, filter: 'blur(4px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: spring },
} as const;

export const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
} as const;

export const listItem = {
  hidden: { opacity: 0, x: -8 },
  show: { opacity: 1, x: 0, transition: spring },
  exit: { opacity: 0, x: 8, transition: { duration: 0.15 } },
} as const;

/** Transición entre pantallas */
export const screenTransition = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.18 } },
} as const;
