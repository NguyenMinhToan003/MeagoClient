'use client';

import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

export function useLoadMoreSentinel(loadMore: () => void, enabled = true) {
  const { ref, inView } = useInView({ rootMargin: '400px 0px', fallbackInView: false });

  useEffect(() => {
    if (enabled && inView) loadMore();
  }, [enabled, inView, loadMore]);

  return ref;
}
