'use client';

import type { ReactNode } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';

import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AnimatedIconToggleProps {
  pressed: boolean;
  onPressedChange: (pressed: boolean) => void;
  label: string;
  onIcon: ReactNode;
  offIcon: ReactNode;
  className?: string;
  disabled?: boolean;
}

export function AnimatedIconToggle({
  className,
  disabled,
  label,
  offIcon,
  onIcon,
  onPressedChange,
  pressed,
}: AnimatedIconToggleProps) {
  const shouldReduceMotion = useReducedMotion();
  const transition = { duration: shouldReduceMotion ? 0.01 : 0.16, ease: 'easeOut' as const };

  return (
    <motion.button
      type="button"
      aria-label={label}
      aria-pressed={pressed}
      title={label}
      disabled={disabled}
      onClick={() => onPressedChange(!pressed)}
      whileHover={shouldReduceMotion || disabled ? undefined : { scale: 1.04 }}
      whileTap={shouldReduceMotion || disabled ? undefined : { scale: 0.94 }}
      className={cn(
        buttonVariants({ variant: 'outline', size: 'icon' }),
        'relative overflow-hidden',
        className,
      )}
    >
      <AnimatePresence initial={false} mode="wait">
        <motion.span
          key={pressed ? 'on' : 'off'}
          aria-hidden="true"
          className="absolute inset-0 flex items-center justify-center"
          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, rotate: -35, scale: 0.65 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, rotate: 35, scale: 0.65 }}
          transition={transition}
        >
          {pressed ? onIcon : offIcon}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );
}

