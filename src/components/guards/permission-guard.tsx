'use client';

import { ReactNode } from 'react';
import { usePermission } from '@/hooks/use-permission';

/**
 * Ẩn/hiện UI theo permission (pattern PermissionGuard của dự án mẫu).
 *
 * <PermissionGuard required={['story:create']}><CreateButton /></PermissionGuard>
 * <PermissionGuard resource="story">
 *   {({ canCreate }) => canCreate && <CreateButton />}
 * </PermissionGuard>
 */
interface IProps {
  required?: string[];
  resource?: string;
  fallback?: ReactNode;
  children: ReactNode | ((perms: { canCreate: boolean; canRead: boolean; canManage: boolean }) => ReactNode);
}

export function PermissionGuard({ required, resource, fallback = null, children }: IProps) {
  const { can, forResource } = usePermission();

  if (typeof children === 'function') {
    return <>{children(forResource(resource ?? ''))}</>;
  }
  if (required && !can(...required)) return <>{fallback}</>;
  return <>{children}</>;
}
