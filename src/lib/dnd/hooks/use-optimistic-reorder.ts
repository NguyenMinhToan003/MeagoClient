'use client';

import { useCallback, useState } from 'react';

import type { ReorderResult } from '../core/dnd.types';

interface OptimisticReorderOptions<TItem> {
  items: readonly TItem[];
  commit: (result: ReorderResult<TItem>) => Promise<void>;
  onError?: (error: unknown) => void;
}

export function useOptimisticReorder<TItem>({ items, commit, onError }: OptimisticReorderOptions<TItem>) {
  const [optimistic, setOptimistic] = useState<{ source: readonly TItem[]; value: readonly TItem[] }>(() => ({
    source: items,
    value: items,
  }));
  const optimisticItems = optimistic.source === items ? optimistic.value : items;

  const reorder = useCallback(async (result: ReorderResult<TItem>) => {
    const snapshot = optimisticItems;
    setOptimistic({ source: items, value: result.items });
    try {
      await commit(result);
    } catch (error) {
      setOptimistic({ source: items, value: snapshot });
      onError?.(error);
    }
  }, [commit, items, onError, optimisticItems]);

  return { items: optimisticItems, reorder };
}
