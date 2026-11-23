import { animate, useMotionValue, useTransform, motion } from 'motion/react';
import { useEffect } from 'react';

interface AnimatedNumberProps {
  value: number;
  format?: (n: number) => string;
  duration?: number;
}

/** Número que "cuenta" hasta su valor y se re-anima al cambiar */
export function AnimatedNumber({ value, format = (n) => Math.round(n).toString(), duration = 1.1 }: AnimatedNumberProps) {
  const mv = useMotionValue(0);
  const text = useTransform(mv, (v) => format(v));

  useEffect(() => {
    const controls = animate(mv, value, { duration, ease: [0.22, 1, 0.36, 1] });
    return () => controls.stop();
  }, [mv, value, duration]);

  return <motion.span className="tabular">{text}</motion.span>;
}
