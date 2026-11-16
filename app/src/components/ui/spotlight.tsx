'use client';
import React, { useRef, useState, useCallback, useEffect } from 'react';
import { motion, useReducedMotion, useSpring, useTransform, SpringOptions } from 'motion/react';
import { cn } from '@/lib/utils';
import { useFinePointer } from '@/hooks/useFinePointer';

export type SpotlightProps = {
  className?: string;
  size?: number;
  springOptions?: SpringOptions;
};

// Local edit: the registry colours were zinc classes, a blur-xl glow and a dark-mode variant. The light is now the
// blue accent at 14 percent (--blue-soft, the token the selected states use) fading to nothing, with no blur.
// It lights the part that responds; it never carries content, so it is aria-hidden.
export function Spotlight({
  className,
  size = 200,
  springOptions = { bounce: 0 },
}: SpotlightProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [parentElement, setParentElement] = useState<HTMLElement | null>(null);
  // local edit: only where hover exists, and never under prefers-reduced-motion (a light that follows the pointer is travel)
  const reduce = useReducedMotion();
  const fine = useFinePointer();
  const active = fine && !reduce;

  const mouseX = useSpring(0, springOptions);
  const mouseY = useSpring(0, springOptions);

  const spotlightLeft = useTransform(mouseX, (x) => `${x - size / 2}px`);
  const spotlightTop = useTransform(mouseY, (y) => `${y - size / 2}px`);

  useEffect(() => {
    if (containerRef.current) {
      const parent = containerRef.current.parentElement;
      if (parent) {
        parent.style.position = 'relative';
        parent.style.overflow = 'hidden';
        setParentElement(parent);
      }
    }
  }, []);

  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      if (!parentElement) return;
      const { left, top } = parentElement.getBoundingClientRect();
      mouseX.set(event.clientX - left);
      mouseY.set(event.clientY - top);
    },
    [mouseX, mouseY, parentElement]
  );

  useEffect(() => {
    if (!parentElement || !active) return;

    const abortController = new AbortController();

    parentElement.addEventListener('mousemove', handleMouseMove, {
      signal: abortController.signal,
    });
    parentElement.addEventListener('mouseenter', () => setIsHovered(true), {
      signal: abortController.signal,
    });
    parentElement.addEventListener('mouseleave', () => setIsHovered(false), {
      signal: abortController.signal,
    });

    return () => {
      abortController.abort();
      setIsHovered(false);
    };
  }, [parentElement, handleMouseMove, active]);

  return (
    <motion.div
      ref={containerRef}
      aria-hidden
      data-spotlight={isHovered ? 'on' : 'off'}
      className={cn(
        'pointer-events-none absolute rounded-full motion-reduce:hidden',
        'bg-[radial-gradient(circle_at_center,var(--blue-soft),transparent_70%)] transition-opacity duration-200',
        isHovered ? 'opacity-100' : 'opacity-0',
        className
      )}
      style={{
        width: size,
        height: size,
        left: spotlightLeft,
        top: spotlightTop,
      }}
    />
  );
}
