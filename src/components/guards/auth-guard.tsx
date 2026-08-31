"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "@/i18n/navigation";
import { useAuthStore } from "@/stores/auth.store";
import { useMe } from "@/hooks/use-auth";

/**
 * Bọc các page cần đăng nhập. Chờ AuthBootstrap refresh xong (isReady),
 * chưa có token → đẩy về /login.
 */
export function AuthGuard({
  children,
  fallback = null,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  const router = useRouter();
  const { accessToken, isReady } = useAuthStore();
  useMe(); // nạp user + permissions vào store khi có token

  useEffect(() => {
    if (isReady && !accessToken) router.replace("/login");
  }, [isReady, accessToken, router]);

  if (!isReady || !accessToken) return <>{fallback}</>;
  return <>{children}</>;
}
