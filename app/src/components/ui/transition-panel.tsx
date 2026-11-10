'use client';
import {
  AnimatePresence,
  Transition,
  Variant,
  motion,
  MotionProps,
  useReducedMotion,
} from 'motion/react';
import { cn } from '@/lib/utils';

export type TransitionPanelProps = {
  children: React.ReactNode[];
  className?: string;
  transition?: Transition;
  activeIndex: number;
  variants?: { enter: Variant; center: Variant; exit: Variant };
} & MotionProps;

// Local edit: the registry gave no variants and no timing, so a caller that passed none got a panel that did not move
// and warned. Defaults are a 250 ms fade with an 8 px rise on enter (house enter timing, references/motion.md
// section 4); the old view leaves with a plain fade. Under prefers-reduced-motion the view changes at once.
const defaultVariants = {
  enter: { opacity: 0, y: 8 },
  center: { opacity: 1, y: 0 },
  exit: { opacity: 0 },
};
const defaultTransition: Transition = { duration: 0.25, ease: [0.23, 1, 0.32, 1] };

export function TransitionPanel({
  children,
  className,
  transition = defaultTransition,
  variants = defaultVariants,
  activeIndex,
  ...motionProps
}: TransitionPanelProps) {
  const reduce = useReducedMotion();
  return (
    <div className={cn('relative', className)}>
      <AnimatePresence
        initial={false}
        mode='popLayout'
        custom={motionProps.custom}
      >
        <motion.div
          key={activeIndex}
          variants={variants}
          transition={reduce ? { duration: 0 } : transition}
          initial='enter'
          animate='center'
          exit='exit'
          {...motionProps}
        >
          {children[activeIndex]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
