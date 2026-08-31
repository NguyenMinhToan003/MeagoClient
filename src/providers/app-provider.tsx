'use client';

import { ReactNode, useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useRouter } from '@/i18n/navigation';
import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/stores/auth.store';
import { AUTH_EXPIRED_EVENT } from '@/libs/axios/axios-client';

/** Khi mount (hoặc F5): thử dùng refresh cookie lấy access token mới. */
function AuthBootstrap() {
  const { setAccessToken, setReady } = useAuthStore();

  useEffect(() => {
    authService
      .refresh()
      .then(({ accessToken }) => setAccessToken(accessToken))
      .catch(() => undefined) // chưa login — bình thường
      .finally(setReady);
  }, [setAccessToken, setReady]);

  return null;
}

/** Refresh token hết hạn/bị revoke giữa chừng → về /login. */
function AuthExpiredListener() {
  const router = useRouter();
  useEffect(() => {
    const handler = () => router.replace('/login');
    window.addEventListener(AUTH_EXPIRED_EVENT, handler);
    return () => window.removeEventListener(AUTH_EXPIRED_EVENT, handler);
  }, [router]);
  return null;
}

export function AppProvider({ children }: { children: ReactNode }) {
  // defaults theo dự án mẫu: staleTime 30s, retry 1, không refetch on focus
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { staleTime: 30_000, retry: 1, refetchOnWindowFocus: false },
          mutations: { retry: 0 },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <AuthBootstrap />
      <AuthExpiredListener />
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
