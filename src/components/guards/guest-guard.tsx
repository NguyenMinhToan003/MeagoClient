'use client';

import { useEffect, type ReactNode } from 'react';

import { BrandLoadingScreen } from '@/components/shared/brand-loading-screen';
import { useRouter } from '@/i18n/navigation';
import { useAuthStore } from '@/stores/auth.store';

/** Keeps authenticated users out of guest-only routes after refresh bootstrap finishes. */
export function GuestGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const accessToken = useAuthStore((state) => state.accessToken);
  const isReady = useAuthStore((state) => state.isReady);

  useEffect(() => {
    if (isReady && accessToken) router.replace('/');
  }, [accessToken, isReady, router]);

  if (!isReady || accessToken) {
    return <BrandLoadingScreen />;
  }

  return <>{children}</>;
}
