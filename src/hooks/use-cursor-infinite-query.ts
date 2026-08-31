'use client';

import { useMemo } from 'react';
import { useInfiniteQuery, type QueryKey } from '@tanstack/react-query';

export interface CursorPage<TItem, TCursor = string> {
  items: TItem[];
  nextCursor: TCursor | null;
  previousCursor?: TCursor | null;
}

interface CursorInfiniteQueryOptions<TItem, TCursor> {
  queryKey: QueryKey;
  queryFn: (context: { cursor: TCursor | null; signal: AbortSignal }) => Promise<CursorPage<TItem, TCursor>>;
  initialCursor?: TCursor | null;
  enabled?: boolean;
  staleTime?: number;
  maxPages?: number;
}

/** Standard cursor paging; viewport observation and DOM virtualization stay separate. */
export function useCursorInfiniteQuery<TItem, TCursor = string, TError = Error>({
  enabled,
  initialCursor = null,
  maxPages,
  queryFn,
  queryKey,
  staleTime,
}: CursorInfiniteQueryOptions<TItem, TCursor>) {
  const query = useInfiniteQuery<
    CursorPage<TItem, TCursor>,
    TError,
    { pages: CursorPage<TItem, TCursor>[]; pageParams: (TCursor | null)[] },
    QueryKey,
    TCursor | null
  >({
    queryKey,
    queryFn: ({ pageParam, signal }) => queryFn({ cursor: pageParam as TCursor | null, signal }),
    initialPageParam: initialCursor,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    getPreviousPageParam: (firstPage) => firstPage.previousCursor ?? undefined,
    maxPages,
    enabled,
    staleTime,
  });

  const items = useMemo(() => query.data?.pages.flatMap((page) => page.items) ?? [], [query.data]);
  return { ...query, items };
}
