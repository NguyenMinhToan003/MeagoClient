'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { LayoutGrid, Rows3 } from 'lucide-react';

import {
  SortableBoard,
  SortableHandle,
  type SortableBoardItems,
} from '@/lib/dnd';
import { Badge } from '@/components/ui/badge';
import { AnimatedIconToggle } from '@/components/shared/animated-icon-toggle';

type ColumnId = 'backlog' | 'ready' | 'doing' | 'done';
interface DemoTask {
  id: string;
  titleKey: 'outline' | 'cover' | 'record' | 'review' | 'publish';
}

const COLUMN_IDS: readonly ColumnId[] = ['backlog', 'ready', 'doing', 'done'];
const INITIAL_ITEMS: SortableBoardItems<ColumnId, DemoTask> = {
  backlog: [
    { id: 'task-outline', titleKey: 'outline' },
    { id: 'task-cover', titleKey: 'cover' },
  ],
  ready: [{ id: 'task-record', titleKey: 'record' }],
  doing: [{ id: 'task-review', titleKey: 'review' }],
  done: [{ id: 'task-publish', titleKey: 'publish' }],
};

export function FoundationSortableBoardDemo() {
  const t = useTranslations('Home.board');
  const [items, setItems] = useState(INITIAL_ITEMS);
  const [compact, setCompact] = useState(false);

  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <AnimatedIconToggle
          pressed={compact}
          onPressedChange={setCompact}
          label={compact ? t('density.comfortable') : t('density.compact')}
          offIcon={<Rows3 className="size-4" />}
          onIcon={<LayoutGrid className="size-4" />}
        />
      </div>
      <SortableBoard
        columnIds={COLUMN_IDS}
        items={items}
        onItemsChange={setItems}
        columnClassName={compact ? 'min-h-44 p-2' : undefined}
        itemLabel={(item) => t(`items.${item.titleKey}`)}
        movedMessage={(item, columnId, index) =>
          t('moved', {
            item: t(`items.${item.titleKey}`),
            column: t(`columns.${columnId}`),
            position: index + 1,
          })
        }
        renderColumnHeader={(columnId, count) => (
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-semibold">{t(`columns.${columnId}`)}</h3>
            <Badge variant="secondary">{count}</Badge>
          </div>
        )}
        renderItem={(item, { handleRef, isDragging }) => (
          <div className={compact ? 'flex items-center gap-1 p-1' : 'flex items-center gap-2 p-2'}>
            <SortableHandle
              ref={handleRef}
              aria-label={t('move', { item: t(`items.${item.titleKey}`) })}
              aria-pressed={isDragging}
            />
            <span className="text-sm font-medium">{t(`items.${item.titleKey}`)}</span>
          </div>
        )}
      />
    </div>
  );
}
