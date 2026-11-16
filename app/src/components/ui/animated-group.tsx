'use client';
import { ReactNode } from 'react';
import { motion, useReducedMotion, Variants } from 'motion/react';
import React from 'react';

// Local edit: the registry also shipped zoom, flip, bounce, rotate, swing, scale and blur presets (springs with
// bounce, a rotation, a filter). Each is decoration with no cause, so only the two that carry a cause are kept:
// the pieces arrive in order (fade), and rise a few pixels as they do (slide).
export type PresetType = 'fade' | 'slide';

export type AnimatedGroupProps = {
  children: ReactNode;
  className?: string;
  variants?: {
    container?: Variants;
    item?: Variants;
  };
  preset?: PresetType;
  as?: React.ElementType;
  asChild?: React.ElementType;
};

// The registry's stagger, 0.1 s per child (references/motion.md section 3).
const defaultContainerVariants: Variants = {
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

// Local edit: the house enter timing, 250 ms cubic-bezier(0.23, 1, 0.32, 1), instead of the default transform spring.
const ENTER = { duration: 0.25, ease: [0.23, 1, 0.32, 1] } as const;

const defaultItemVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: ENTER },
};

const presetVariants: Record<PresetType, Variants> = {
  fade: {},
  slide: {
    hidden: { y: 8 },
    visible: { y: 0 },
  },
};

const addDefaultVariants = (variants: Variants) => ({
  hidden: { ...defaultItemVariants.hidden, ...variants.hidden },
  visible: { ...defaultItemVariants.visible, ...variants.visible },
});

function AnimatedGroup({
  children,
  className,
  variants,
  preset,
  as = 'div',
  asChild = 'div',
}: AnimatedGroupProps) {
  const selectedVariants = {
    item: addDefaultVariants(preset ? presetVariants[preset] : {}),
    container: addDefaultVariants(defaultContainerVariants),
  };
  const containerVariants = variants?.container || selectedVariants.container;
  const itemVariants = variants?.item || selectedVariants.item;
  // local edit: under prefers-reduced-motion the pieces are there at once, in order, with no stagger
  const reduce = useReducedMotion();

  const MotionComponent = React.useMemo(
    () => motion.create(as as keyof React.JSX.IntrinsicElements),
    [as]
  );
  const MotionChild = React.useMemo(
    () => motion.create(asChild as keyof React.JSX.IntrinsicElements),
    [asChild]
  );

  return (
    <MotionComponent
      initial={reduce ? false : 'hidden'}
      animate='visible'
      variants={containerVariants}
      className={className}
    >
      {React.Children.map(children, (child, index) => (
        <MotionChild key={index} variants={itemVariants}>
          {child}
        </MotionChild>
      ))}
    </MotionComponent>
  );
}

export { AnimatedGroup };
