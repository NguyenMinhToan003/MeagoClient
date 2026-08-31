'use client';

import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { GripVertical } from 'lucide-react';

import { cn } from '@/lib/utils';

export const SortableHandle = forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement>>(
  function SortableHandle({ children, className, type = 'button', ...props }, ref) {
    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          'touch-none cursor-grab rounded-sm p-2 text-muted-foreground outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring active:cursor-grabbing disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        {...props}
      >
        {children ?? <GripVertical aria-hidden="true" className="size-4" />}
      </button>
    );
  },
);
