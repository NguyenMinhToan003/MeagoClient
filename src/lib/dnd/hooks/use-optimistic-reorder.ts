"use client";

import { useCallback, useRef, useState } from "react";

import type { ReorderResult } from "../core/dnd.types";

interface OptimisticReorderOptions<TItem> {
  items: readonly TItem[];
  commit: (result: ReorderResult<TItem>) => Promise<void>;
  onError?: (error: unknown) => void;
}

export function useOptimisticReorder<TItem>({
  items,
  commit,
  onError,
}: OptimisticReorderOptions<TItem>) {
  const [optimistic, setOptimistic] = useState<{
    source: readonly TItem[];
    value: readonly TItem[];
  }>(() => ({
    source: items,
    value: items,
  }));
  const optimisticItems =
    optimistic.source === items ? optimistic.value : items;
  const operationId = useRef(0);
  const commitQueue = useRef<Promise<void> | null>(null);
  const [pendingCount, setPendingCount] = useState(0);

  const reorder = useCallback(
    async (result: ReorderResult<TItem>) => {
      const currentOperation = ++operationId.current;
      const snapshot = optimisticItems;
      setOptimistic({ source: items, value: result.items });
      setPendingCount((count) => count + 1);

    const queuedCommit = (commitQueue.current ?? Promise.resolve()).then(() => commit(result));
      commitQueue.current = queuedCommit.catch(() => undefined);
      try {
        await queuedCommit;
      } catch (error) {
        // An older failed request must never roll back a newer optimistic operation.
        if (operationId.current === currentOperation) {
          setOptimistic({ source: items, value: snapshot });
        }
        onError?.(error);
      } finally {
        setPendingCount((count) => Math.max(0, count - 1));
      }
    },
    [commit, items, onError, optimisticItems],
  );

  return { items: optimisticItems, reorder, isPending: pendingCount > 0 };
}
