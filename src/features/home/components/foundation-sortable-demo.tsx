'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

import { SortableHandle, SortableList } from '@/lib/dnd';

interface DemoItem { id: string }

const INITIAL_ITEMS: DemoItem[] = [{ id: 'upload' }, { id: 'process' }, { id: 'publish' }];

export function FoundationSortableDemo() {
  const t = useTranslations('Home.dnd');
  const [items, setItems] = useState(INITIAL_ITEMS);

  return (
    <SortableList
      items={items}
      getItemId={(item) => item.id}
      onReorder={({ items: reordered }) => setItems(reordered)}
      accessibility={{
        dragHandleLabel: (item) => t('move', { item: t(`items.${item.id}`) }),
        itemLabel: (item) => t(`items.${item.id}`),
        movedMessage: ({ item, toIndex }) => t('moved', { item: t(`items.${item.id}`), position: toIndex + 1 }),
      }}
      className="gap-2"
    >
      {(item, { handleLabel, handleRef, isDragging }) => (
        <div className="flex items-center gap-2 rounded-md border bg-background p-2 shadow-sm">
          <SortableHandle ref={handleRef} aria-label={handleLabel} aria-pressed={isDragging} />
          <span className="text-sm font-medium">{t(`items.${item.id}`)}</span>
        </div>
      )}
    </SortableList>
  );
}
