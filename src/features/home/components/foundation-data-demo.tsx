'use client';

import { useMemo } from 'react';
import { useTranslations } from 'next-intl';

import { DataTable, type DataTableColumn } from '@/components/shared/data-table';
import { VirtualList } from '@/components/shared/virtual-list';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useCursorInfiniteQuery } from '@/hooks/use-cursor-infinite-query';
import { useInfiniteLoadMore } from '@/hooks/use-infinite-load-more';

interface DemoStory {
  id: string;
  title: string;
  status: 'draft' | 'review' | 'published';
  chapters: number;
}

const STORIES: DemoStory[] = [
  { id: 'story-1', title: 'Hành trình phương Nam', status: 'published', chapters: 24 },
  { id: 'story-2', title: 'Đêm trên đồi gió', status: 'review', chapters: 12 },
  { id: 'story-3', title: 'Những lá thư chưa gửi', status: 'draft', chapters: 8 },
];

const statusBadgeVariants = {
  draft: 'neutral',
  review: 'warning',
  published: 'success',
} as const;

const ACTIVITY_ITEMS = Array.from({ length: 120 }, (_, index) => ({
  id: `activity-${index + 1}`,
  position: index + 1,
}));

const FEED_ITEMS = Array.from({ length: 24 }, (_, index) => ({
  id: `feed-${index + 1}`,
  position: index + 1,
}));

export function FoundationDataDemo() {
  const t = useTranslations('Home.dataDemo');
  const columns = useMemo<DataTableColumn<DemoStory>[]>(
    () => [
      { accessorKey: 'title', header: t('table.columns.title') },
      {
        accessorKey: 'status',
        header: t('table.columns.status'),
        cell: ({ row }) => (
          <Badge variant={statusBadgeVariants[row.original.status]}>
            {t(`statuses.${row.original.status}`)}
          </Badge>
        ),
      },
      { accessorKey: 'chapters', header: t('table.columns.chapters') },
    ],
    [t],
  );

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="space-y-3">
        <div>
          <h3 className="font-semibold">{t('table.title')}</h3>
          <p className="text-muted-foreground text-sm">{t('table.description')}</p>
        </div>
        <div className="overflow-hidden rounded-md border bg-background">
          <DataTable
            columns={columns}
            data={STORIES}
            emptyMessage={t('table.empty')}
            getRowId={(row) => row.id}
          />
        </div>
      </section>

      <section className="space-y-3">
        <div>
          <h3 className="font-semibold">{t('virtual.title')}</h3>
          <p className="text-muted-foreground text-sm">{t('virtual.description')}</p>
        </div>
        <VirtualList
          items={ACTIVITY_ITEMS}
          estimateSize={44}
          getItemKey={(item) => item.id}
          className="h-64 rounded-md border bg-background"
          renderItem={(item) => (
            <div className="flex h-11 items-center justify-between border-b px-3 text-sm">
              <span>{t('virtual.item', { position: item.position })}</span>
              <Badge variant="outline">#{item.position}</Badge>
            </div>
          )}
        />
      </section>
    </div>
  );
}

export function FoundationInfiniteDemo() {
  const t = useTranslations('Home.dataDemo.infinite');
  const query = useCursorInfiniteQuery({
    queryKey: ['foundation', 'cursor-feed'],
    staleTime: Number.POSITIVE_INFINITY,
    queryFn: async ({ cursor, signal }) => {
      await abortableDelay(900, signal);
      const start = cursor ? Number(cursor) : 0;
      const items = FEED_ITEMS.slice(start, start + 6);
      const next = start + items.length;
      return { items, nextCursor: next < FEED_ITEMS.length ? String(next) : null };
    },
  });
  const sentinelRef = useInfiniteLoadMore({
    fetchNextPage: query.fetchNextPage,
    hasNextPage: Boolean(query.hasNextPage),
    isFetchingNextPage: query.isFetchingNextPage,
  });

  return (
    <div className="space-y-3">
      <div className="max-h-72 space-y-2 overflow-y-auto rounded-md border bg-muted/20 p-2">
        {query.isPending
          ? Array.from({ length: 4 }, (_, index) => <InfiniteItemSkeleton key={index} />)
          : query.items.map((item) => (
              <article key={item.id} className="rounded-md border bg-background p-3 text-sm shadow-sm">
                <p className="font-medium">{t('item', { position: item.position })}</p>
                <p className="text-muted-foreground">Cursor ID: {item.id}</p>
              </article>
            ))}
        {query.isFetchingNextPage
          ? Array.from({ length: 2 }, (_, index) => <InfiniteItemSkeleton key={`next-${index}`} />)
          : null}
        <div ref={sentinelRef} className="h-1" aria-hidden="true" />
      </div>
      <div className="flex min-h-10 items-center justify-center">
        {query.isFetchingNextPage || query.isPending ? (
          <span className="text-muted-foreground text-sm">{t('loading')}</span>
        ) : query.hasNextPage ? (
          <Button type="button" variant="outline" onClick={() => void query.fetchNextPage()}>
            {t('loadMore')}
          </Button>
        ) : (
          <span className="text-muted-foreground text-sm">{t('complete')}</span>
        )}
      </div>
    </div>
  );
}

function InfiniteItemSkeleton() {
  return (
    <div className="space-y-2 rounded-md border bg-background p-3">
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-3 w-1/3" />
    </div>
  );
}

function abortableDelay(duration: number, signal: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    const onAbort = () => {
      window.clearTimeout(timeout);
      reject(signal.reason);
    };
    const timeout = window.setTimeout(() => {
      signal.removeEventListener('abort', onAbort);
      resolve();
    }, duration);
    signal.addEventListener('abort', onAbort, { once: true });
  });
}
