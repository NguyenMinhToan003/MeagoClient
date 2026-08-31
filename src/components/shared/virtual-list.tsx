'use client';

import { useRef, type ReactNode } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';

import { cn } from '@/lib/utils';

interface VirtualListProps<TItem> {
  items: TItem[];
  estimateSize: number;
  getItemKey: (item: TItem) => string;
  renderItem: (item: TItem, index: number) => ReactNode;
  className?: string;
  overscan?: number;
}

/** Virtualizes already-loaded data; pagination and fetching remain the owning feature's responsibility. */
export function VirtualList<TItem>({ items, estimateSize, getItemKey, renderItem, className, overscan = 6 }: VirtualListProps<TItem>) {
  const viewportRef = useRef<HTMLDivElement>(null);
  // TanStack Virtual owns imperative measurement functions; React Compiler must not memoize this hook result.
  // eslint-disable-next-line react-hooks/incompatible-library
  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => viewportRef.current,
    estimateSize: () => estimateSize,
    getItemKey: (index) => getItemKey(items[index]),
    overscan,
  });

  return (
    <div ref={viewportRef} className={cn('relative overflow-auto', className)}>
      <div className="relative w-full" style={{ height: virtualizer.getTotalSize() }}>
        {virtualizer.getVirtualItems().map((virtualItem) => (
          <div
            key={virtualItem.key}
            className="absolute left-0 top-0 w-full"
            style={{ transform: `translateY(${virtualItem.start}px)` }}
          >
            {renderItem(items[virtualItem.index], virtualItem.index)}
          </div>
        ))}
      </div>
    </div>
  );
}
