'use client';

import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type PageItem = number | 'ellipsis-start' | 'ellipsis-end';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  labels: {
    navigation: string;
    previous: string;
    next: string;
    page: (page: number) => string;
    more: string;
  };
  className?: string;
}

function getPageItems(currentPage: number, totalPages: number): PageItem[] {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, index) => index + 1);
  if (currentPage <= 4) return [1, 2, 3, 4, 5, 'ellipsis-end', totalPages];
  if (currentPage >= totalPages - 3) {
    return [1, 'ellipsis-start', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
  }
  return [1, 'ellipsis-start', currentPage - 1, currentPage, currentPage + 1, 'ellipsis-end', totalPages];
}

export function Pagination({ className, currentPage, labels, onPageChange, totalPages }: PaginationProps) {
  if (totalPages < 1) return null;

  const safeCurrentPage = Math.min(Math.max(currentPage, 1), totalPages);

  return (
    <nav aria-label={labels.navigation} className={cn('flex w-full justify-center', className)}>
      <ul className="flex items-center gap-1">
        <li>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={safeCurrentPage === 1}
            aria-label={labels.previous}
            onClick={() => onPageChange(safeCurrentPage - 1)}
          >
            <ChevronLeft aria-hidden="true" />
            <span className="hidden sm:inline">{labels.previous}</span>
          </Button>
        </li>
        {getPageItems(safeCurrentPage, totalPages).map((item) => (
          <li key={item}>
            {typeof item === 'number' ? (
              <Button
                type="button"
                variant={item === safeCurrentPage ? 'solid' : 'ghost'}
                size="icon-sm"
                aria-label={labels.page(item)}
                aria-current={item === safeCurrentPage ? 'page' : undefined}
                onClick={() => onPageChange(item)}
              >
                {item}
              </Button>
            ) : (
              <span className="flex size-8 items-center justify-center" aria-label={labels.more}>
                <MoreHorizontal aria-hidden="true" className="size-4" />
              </span>
            )}
          </li>
        ))}
        <li>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={safeCurrentPage === totalPages}
            aria-label={labels.next}
            onClick={() => onPageChange(safeCurrentPage + 1)}
          >
            <span className="hidden sm:inline">{labels.next}</span>
            <ChevronRight aria-hidden="true" />
          </Button>
        </li>
      </ul>
    </nav>
  );
}
