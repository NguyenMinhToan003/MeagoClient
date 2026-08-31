'use client';

import type { ReactNode } from 'react';
import { useSortable } from '@dnd-kit/react/sortable';

import { cn } from '@/lib/utils';
import type { SortableItemState } from '../core/dnd.types';

interface SortableItemProps {
  id: string;
  index: number;
  disabled: boolean;
  label: string;
  className?: string;
  children: (state: Omit<SortableItemState, 'handleLabel'>) => ReactNode;
}

export function SortableItem({ children, className, disabled, id, index, label }: SortableItemProps) {
  const { ref, handleRef, isDragging, isDropTarget } = useSortable({
    id,
    index,
    disabled,
    data: { itemId: id, label },
  });

  return (
    <div
      ref={ref}
      data-dragging={isDragging || undefined}
      data-drop-target={isDropTarget || undefined}
      role="listitem"
      aria-label={label}
      className={cn('relative data-[dragging=true]:z-10 data-[dragging=true]:opacity-80', className)}
    >
      {children({ handleRef, isDragging, isDropTarget })}
    </div>
  );
}
