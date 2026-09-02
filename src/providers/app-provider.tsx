"use client";

import { ReactNode, useEffect } from "react";
import {
  isServer,
  QueryClient,
  QueryClientProvider,
  useQueryClient,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useRouter } from "@/i18n/navigation";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/stores/auth.store";
import { AUTH_EXPIRED_EVENT } from "@/libs/axios/axios-client";
import { Toaster } from "@/components/ui/sonner";
import { BrandLoadingScreen } from "@/components/shared/brand-loading-screen";

function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { staleTime: 30_000, retry: 1, refetchOnWindowFocus: false },
      mutations: { retry: 0 },
    },
  });
}

let browserQueryClient: QueryClient | undefined;

/** Server requests stay isolated; the browser cache survives locale-layout remounts. */
function getQueryClient() {
  if (isServer) return createQueryClient();
  browserQueryClient ??= createQueryClient();
  return browserQueryClient;
}

/** Khi mount (hoặc F5): thử dùng refresh cookie lấy access token mới. */
function AuthBootstrap() {
  const { setAccessToken, setReady } = useAuthStore();

  useEffect(() => {
    if (useAuthStore.getState().isReady) return;
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
  const queryClient = useQueryClient();
  useEffect(() => {
    const handler = () => {
      queryClient.clear();
      router.replace("/login");
    };
    window.addEventListener(AUTH_EXPIRED_EVENT, handler);
    return () => window.removeEventListener(AUTH_EXPIRED_EVENT, handler);
  }, [queryClient, router]);
  return null;
}

/** Prevents a blank or identity-flashing first paint while refresh bootstrap is unresolved. */
function AppStartupBoundary({ children }: { children: ReactNode }) {
  const isReady = useAuthStore((state) => state.isReady);
  return isReady ? <>{children}</> : <BrandLoadingScreen />;
}

export function AppProvider({ children }: { children: ReactNode }) {
  // defaults theo dự án mẫu: staleTime 30s, retry 1, không refetch on focus
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthBootstrap />
      <AuthExpiredListener />
      <AppStartupBoundary>{children}</AppStartupBoundary>
      <Toaster />
      {process.env.NODE_ENV === "development" ? (
        <ReactQueryDevtools initialIsOpen={false} />
      ) : null}
    </QueryClientProvider>
  );
}
