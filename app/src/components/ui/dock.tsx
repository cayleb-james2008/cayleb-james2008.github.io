'use client';

// Motion Primitives Dock (motion-primitives.com/c/dock.json), copied in 2026-11-10 and edited locally.
// The edits are listed in STACK.lock.md. In short: magnification is off by default (it grew the keys with a
// spring on width and the panel with a spring on height, which ignored reduced motion and broke the "no
// scale on hover" floor), DockItem is a real <button> (the registry copy was a div with role=button,
// aria-haspopup and no key handler), the toolbar role is gone (the house dock is a <nav>), and the colours
// come from the tokens. The label bubble above a hovered or focused key is the library's own.

import {
  motion,
  MotionValue,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type SpringOptions,
  AnimatePresence,
} from 'motion/react';
import {
  Children,
  cloneElement,
  createContext,
  isValidElement,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { cn } from '@/lib/utils';

const DEFAULT_DISTANCE = 150;
const BASE_WIDTH = 40;

export type DockProps = {
  children: React.ReactNode;
  className?: string;
  distance?: number;
  /** Width a key grows to under the pointer. 0 (the default) turns magnification off. */
  magnification?: number;
  spring?: SpringOptions;
};

export type DockItemProps = {
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
  'aria-label'?: string;
  'aria-current'?: 'page' | 'true' | undefined;
  'data-dock-key'?: string;
};

export type DockLabelProps = { className?: string; children: React.ReactNode };
export type DockIconProps = { className?: string; children: React.ReactNode };

type DocContextType = {
  mouseX: MotionValue;
  spring: SpringOptions;
  magnification: number;
  distance: number;
};

const DockContext = createContext<DocContextType | undefined>(undefined);

function useDock() {
  const context = useContext(DockContext);
  if (!context) throw new Error('useDock must be used within a Dock');
  return context;
}

function Dock({
  children,
  className,
  spring = { mass: 0.1, stiffness: 150, damping: 12 },
  magnification = 0,
  distance = DEFAULT_DISTANCE,
}: DockProps) {
  const mouseX = useMotionValue(Infinity);
  const magnify = magnification > BASE_WIDTH;
  return (
    <div
      onMouseMove={magnify ? ({ pageX }) => mouseX.set(pageX) : undefined}
      onMouseLeave={magnify ? () => mouseX.set(Infinity) : undefined}
      className={cn('mx-auto flex w-fit items-center gap-1', className)}
    >
      <DockContext.Provider value={{ mouseX, spring, distance, magnification }}>
        {children}
      </DockContext.Provider>
    </div>
  );
}

function DockItem({ children, className, onClick, ...aria }: DockItemProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const { distance, magnification, mouseX, spring } = useDock();
  const reduce = useReducedMotion(); // local edit: the width spring is a useSpring, which MotionConfig does not reach
  const magnify = magnification > BASE_WIDTH && !reduce;
  const isHovered = useMotionValue(0);

  const mouseDistance = useTransform(mouseX, (val) => {
    const domRect = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - domRect.x - domRect.width / 2;
  });
  const widthTransform = useTransform(mouseDistance, [-distance, 0, distance], [BASE_WIDTH, magnification, BASE_WIDTH]);
  const width = useSpring(widthTransform, spring);

  return (
    <motion.button
      ref={ref}
      type="button"
      style={magnify ? { width } : undefined}
      onHoverStart={() => isHovered.set(1)}
      onHoverEnd={() => isHovered.set(0)}
      onFocus={() => isHovered.set(1)}
      onBlur={() => isHovered.set(0)}
      className={cn('relative inline-flex items-center justify-center', className)}
      onClick={onClick}
      {...aria}
    >
      {Children.map(children, (child) => (isValidElement(child) ? cloneElement(child as React.ReactElement<Record<string, unknown>>, { width, isHovered }) : child))}
    </motion.button>
  );
}

function DockLabel({ children, className, ...rest }: DockLabelProps) {
  const isHovered = (rest as Record<string, unknown>)['isHovered'] as MotionValue<number>;
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const unsubscribe = isHovered.on('change', (latest) => setIsVisible(latest === 1));
    return () => unsubscribe();
  }, [isHovered]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: 1, y: -10 }}
          exit={{ opacity: 0, y: 0 }}
          transition={{ duration: 0.2 }}
          className={cn(
            'pointer-events-none absolute -top-8 left-1/2 w-fit whitespace-pre rounded-md bg-ink-button px-2 py-0.5 text-xs text-ink-button-fg',
            className,
          )}
          role="tooltip"
          style={{ x: '-50%' }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function DockIcon({ children, className, ...rest }: DockIconProps) {
  const width = (rest as Record<string, unknown>)['width'] as MotionValue<number>;
  const { magnification } = useDock();
  const widthTransform = useTransform(width, (val) => val / 2);
  const reduce = useReducedMotion();
  const magnify = magnification > BASE_WIDTH && !reduce;
  return (
    <motion.div style={magnify ? { width: widthTransform } : undefined} className={cn('flex items-center justify-center', className)}>
      {children}
    </motion.div>
  );
}

export { Dock, DockIcon, DockItem, DockLabel };
