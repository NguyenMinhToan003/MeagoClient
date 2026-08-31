"use client";

import { useMe } from "./use-auth";

/**
 * Check permission dạng "resource:action" từ user hiện tại
 * (đồng bộ với @RequirePermissions phía server).
 */
export function usePermission() {
  const { data: user } = useMe();
  const granted = new Set(user?.permissions ?? []);

  const can = (...required: string[]) => required.every((p) => granted.has(p));

  return {
    can,
    /** tiện cho CRUD UI: canManage('story') → story:manage */
    forResource: (resource: string) => ({
      canCreate: can(`${resource}:create`),
      canRead: can(`${resource}:read`),
      canManage: can(`${resource}:manage`),
    }),
  };
}
