'use client';

import { motion, SpringOptions, useReducedMotion, useScroll, useSpring } from 'motion/react';
import { cn } from '@/lib/utils';
import { RefObject } from 'react';

export type ScrollProgressProps = {
  className?: string;
  springOptions?: SpringOptions;
  containerRef?: RefObject<HTMLElement | null>;
};

const DEFAULT_SPRING_OPTIONS: SpringOptions = {
  stiffness: 200,
  damping: 50,
  restDelta: 0.001,
};

// Local edit: the bar is a decoration of the scroll bar the page already has, so it is aria-hidden; the caller sets
// position and colour (a fixed top bar in the blue accent on a page, or sticky inside a scroll region). Under
// prefers-reduced-motion the bar is tied to the scroll position itself, with no spring behind it (a spring on a
// motion value is not reached by MotionConfig).
export function ScrollProgress({
  className,
  springOptions,
  containerRef,
}: ScrollProgressProps) {
  // local edit: the registry also passed layoutEffect, an option Motion 14's useScroll does not have (a type error)
  const { scrollYProgress } = useScroll({ container: containerRef });
  const reduce = useReducedMotion();

  const spring = useSpring(scrollYProgress, {
    ...DEFAULT_SPRING_OPTIONS,
    ...(springOptions ?? {}),
  });
  const scaleX = reduce ? scrollYProgress : spring;

  return (
    <motion.div
      aria-hidden
      data-scroll-bar
      className={cn('inset-x-0 top-0 h-1 origin-left', className)}
      style={{
        scaleX,
      }}
    />
  );
}
