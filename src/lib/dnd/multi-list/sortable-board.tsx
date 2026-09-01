'use client';

import { useRef, useState, type ReactNode } from 'react';
import { CollisionPriority } from '@dnd-kit/abstract';
import { move } from '@dnd-kit/helpers';
import {
  DragDropProvider,
  DragOverlay,
  useDroppable,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/react';
import { isSortable, useSortable } from '@dnd-kit/react/sortable';

import { cn } from '@/lib/utils';
import { createDndSensors } from '../core/dnd-sensors';
import type { DndActivationPolicy } from '../core/dnd.types';

const ITEM_TYPE = 'meago-board-item';

export interface SortableBoardItem {
  id: string;
}

export type SortableBoardItems<TColumnId extends string, TItem extends SortableBoardItem> = Record<
  TColumnId,
  TItem[]
>;

interface SortableBoardProps<TColumnId extends string, TItem extends SortableBoardItem> {
  columnIds: readonly TColumnId[];
  items: SortableBoardItems<TColumnId, TItem>;
  onItemsChange: (items: SortableBoardItems<TColumnId, TItem>) => void;
  renderColumnHeader: (columnId: TColumnId, itemCount: number) => ReactNode;
  renderItem: (
    item: TItem,
    state: { handleRef: (element: Element | null) => void; isDragging: boolean },
  ) => ReactNode;
  itemLabel: (item: TItem) => string;
  movedMessage: (item: TItem, columnId: TColumnId, index: number) => string;
  activation?: DndActivationPolicy;
  className?: string;
  columnClassName?: string;
}

export function SortableBoard<TColumnId extends string, TItem extends SortableBoardItem>({
  activation,
  className,
  columnClassName,
  columnIds,
  itemLabel,
  items,
  movedMessage,
  onItemsChange,
  renderColumnHeader,
  renderItem,
}: SortableBoardProps<TColumnId, TItem>) {
  const snapshot = useRef(items);
  const [announcement, setAnnouncement] = useState('');
  const [activeItem, setActiveItem] = useState<TItem | null>(null);

  const handleDragStart = (event: DragStartEvent) => {
    snapshot.current = items;
    const source = event.operation.source;
    if (!isSortable(source) || source.group == null) return;

    const columnId = String(source.group) as TColumnId;
    setActiveItem(items[columnId]?.[source.index] ?? null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveItem(null);
    const source = event.operation.source;
    if (event.canceled) {
      onItemsChange(snapshot.current);
      return;
    }

    if (!isSortable(source) || source.group == null) return;
    const columnId = String(source.group) as TColumnId;
    const item = items[columnId]?.[source.index];
    if (item) setAnnouncement(movedMessage(item, columnId, source.index));
  };

  return (
    <DragDropProvider
      sensors={createDndSensors(activation)}
      onDragStart={handleDragStart}
      onDragOver={(event) => {
        if (event.operation.source?.type !== ITEM_TYPE) return;
        onItemsChange(move(items, event) as SortableBoardItems<TColumnId, TItem>);
      }}
      onDragEnd={handleDragEnd}
    >
      <div className={cn('grid gap-3 sm:grid-cols-2 xl:grid-cols-4', className)}>
        {columnIds.map((columnId) => (
          <SortableBoardColumn
            key={columnId}
            id={columnId}
            className={columnClassName}
            header={renderColumnHeader(columnId, items[columnId].length)}
          >
            {items[columnId].map((item, index) => (
              <SortableBoardCard
                key={item.id}
                columnId={columnId}
                id={item.id}
                index={index}
                label={itemLabel(item)}
              >
                {(state) => renderItem(item, state)}
              </SortableBoardCard>
            ))}
          </SortableBoardColumn>
        ))}
      </div>
      <DragOverlay dropAnimation={{ duration: 180, easing: 'ease-out' }}>
        {activeItem ? (
          <article className="rounded-md border border-primary/25 bg-background shadow-lg ring-1 ring-primary/10">
            {renderItem(activeItem, { handleRef: () => undefined, isDragging: true })}
          </article>
        ) : null}
      </DragOverlay>
      <p className="sr-only" role="status" aria-live="polite">
        {announcement}
      </p>
    </DragDropProvider>
  );
}

function SortableBoardColumn({
  children,
  className,
  header,
  id,
}: {
  children: ReactNode;
  className?: string;
  header: ReactNode;
  id: string;
}) {
  const { ref, isDropTarget } = useDroppable({
    id,
    type: 'meago-board-column',
    accept: ITEM_TYPE,
    collisionPriority: CollisionPriority.Low,
  });

  return (
    <section
      ref={ref}
      aria-label={String(id)}
      data-drop-target={isDropTarget || undefined}
      className={cn(
        'min-h-52 rounded-lg border bg-muted/40 p-3 transition-colors data-[drop-target=true]:border-primary data-[drop-target=true]:bg-primary/5',
        className,
      )}
    >
      <header className="mb-3">{header}</header>
      <div className="flex min-h-32 flex-col gap-2">{children}</div>
    </section>
  );
}

function SortableBoardCard({
  children,
  columnId,
  id,
  index,
  label,
}: {
  children: (state: {
    handleRef: (element: Element | null) => void;
    isDragging: boolean;
  }) => ReactNode;
  columnId: string;
  id: string;
  index: number;
  label: string;
}) {
  const { ref, handleRef, isDragging } = useSortable({
    id,
    index,
    group: columnId,
    type: ITEM_TYPE,
    accept: ITEM_TYPE,
    data: { label },
  });

  return (
    <article
      ref={ref}
      aria-label={label}
      data-dragging={isDragging || undefined}
      className="rounded-md border bg-background shadow-sm transition-[opacity,box-shadow] data-[dragging=true]:opacity-35 data-[dragging=true]:shadow-none"
    >
      {children({ handleRef, isDragging })}
    </article>
  );
}
