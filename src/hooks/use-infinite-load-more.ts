'use client';

import { useCallback } from 'react';

import { useLoadMoreSentinel } from './use-load-more-sentinel';

interface InfiniteLoadMoreInput {
  fetchNextPage: (options?: { cancelRefetch?: boolean }) => Promise<unknown>;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  enabled?: boolean;
}

/** Connects an infinite query to Intersection Observer without duplicate page requests. */
export function useInfiniteLoadMore({ enabled = true, fetchNextPage, hasNextPage, isFetchingNextPage }: InfiniteLoadMoreInput) {
  const canLoad = enabled && hasNextPage && !isFetchingNextPage;
  const loadMore = useCallback(() => {
    if (canLoad) void fetchNextPage({ cancelRefetch: false });
  }, [canLoad, fetchNextPage]);

  return useLoadMoreSentinel(loadMore, canLoad);
}
