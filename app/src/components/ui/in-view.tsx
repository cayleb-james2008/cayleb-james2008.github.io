'use client';
import { ReactNode, useRef } from 'react';
import {
  motion,
  useInView,
  useReducedMotion,
  Variant,
  Transition,
  UseInViewOptions,
} from 'motion/react';

export type InViewProps = {
  children: ReactNode;
  variants?: {
    hidden: Variant;
    visible: Variant;
  };
  transition?: Transition;
  viewOptions?: UseInViewOptions;
  as?: React.ElementType;
  once?: boolean;
};

// Local edit: the registry default was opacity only; this one adds an 8 px rise, on the house enter timing
// (250 ms, cubic-bezier(0.23, 1, 0.32, 1), references/motion.md section 4).
const defaultVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0 },
};
const defaultTransition: Transition = { duration: 0.25, ease: [0.23, 1, 0.32, 1] };

export function InView({
  children,
  variants = defaultVariants,
  transition = defaultTransition,
  viewOptions,
  as = 'div',
  once = true, // local edit: the registry default was false, which hides the region again when it scrolls out; it arrives once
}: InViewProps) {
  const ref = useRef(null);
  // local edit: the registry latched "seen" in onAnimationComplete, which also fires for the hidden state; the hook's own `once` does it
  const isInView = useInView(ref, { once, ...viewOptions });
  // local edit: under prefers-reduced-motion the region is simply there, no hidden state, no reveal
  const reduce = useReducedMotion();

  const MotionComponent = motion[as as keyof typeof motion] as typeof as;

  return (
    <MotionComponent
      ref={ref}
      initial={reduce ? 'visible' : 'hidden'}
      animate={reduce || isInView ? 'visible' : 'hidden'}
      variants={variants}
      transition={reduce ? { duration: 0 } : transition}
    >
      {children}
    </MotionComponent>
  );
}
