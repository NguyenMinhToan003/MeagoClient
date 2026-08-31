'use client';

import { useState } from 'react';
import { move } from '@dnd-kit/helpers';
import type { DragEndEvent } from '@dnd-kit/react';

import { cn } from '@/lib/utils';
import { MeagoDndProvider } from '../core/dnd-provider';
import type { SortableListProps } from '../core/dnd.types';
import { SortableItem } from './sortable-item';

export function SortableList<TItem>({
  accessibility,
  activation,
  children,
  className,
  disabled = false,
  getItemId,
  itemClassName,
  items,
  movement,
  onReorder,
  onReorderError,
  orientation = 'vertical',
}: SortableListProps<TItem>) {
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const [announcement, setAnnouncement] = useState('');

  const handleDragEnd = (event: DragEndEvent) => {
    if (event.canceled || !event.operation.source || !event.operation.target) return;

    const ids = items.map(getItemId);
    const itemId = String(event.operation.source.id);
    const fromIndex = ids.indexOf(itemId);
    const reorderedIds = move(ids, event);
    const toIndex = reorderedIds.indexOf(itemId);
    if (fromIndex < 0 || toIndex < 0 || fromIndex === toIndex) return;

    const byId = new Map(items.map((item) => [getItemId(item), item]));
    const reorderedItems = reorderedIds.map((id) => byId.get(String(id))).filter((item): item is TItem => item !== undefined);
    const result = { item: items[fromIndex], itemId, fromIndex, toIndex, items: reorderedItems };
    setAnnouncement(accessibility.movedMessage(result));
    void Promise.resolve(onReorder(result)).catch((error: unknown) => onReorderError?.(error, result));
  };

  return (
    <MeagoDndProvider
      activation={activation}
      container={container}
      movement={movement}
      onDragEnd={handleDragEnd}
      orientation={orientation}
    >
      <div
        ref={setContainer}
        role="list"
        className={cn(
          orientation === 'grid' && 'grid',
          orientation !== 'grid' && 'flex',
          orientation === 'vertical' && 'flex-col',
          orientation === 'horizontal' && 'flex-row',
          className,
        )}
      >
        {items.map((item, index) => (
          <SortableItem key={getItemId(item)} id={getItemId(item)} index={index} label={accessibility.itemLabel(item)} disabled={disabled} className={itemClassName}>
            {(state) => children(item, { ...state, handleLabel: accessibility.dragHandleLabel(item) })}
          </SortableItem>
        ))}
      </div>
      <p className="sr-only" role="status" aria-live="polite">{announcement}</p>
    </MeagoDndProvider>
  );
}
