import type { LucideIcon } from 'lucide-react';
import { Bell, Blocks, Columns3, FileInput, Home, ListEnd, Table2 } from 'lucide-react';

interface AppNavigationItemBase {
  id: string;
  icon: LucideIcon;
  labelKey: 'overview' | 'capabilities' | 'data' | 'infinite' | 'feedback' | 'board' | 'forms';
  requiredPermissions?: readonly string[];
}

export interface AppNavigationLink extends AppNavigationItemBase {
  href: `#${string}`;
  children?: never;
}

export interface AppNavigationGroup extends AppNavigationItemBase {
  href?: never;
  children: readonly AppNavigationLink[];
}

export type AppNavigationItem = AppNavigationLink | AppNavigationGroup;

export const appNavigationItems: readonly AppNavigationItem[] = [
  { id: 'overview', href: '#overview', icon: Home, labelKey: 'overview' },
  {
    id: 'capabilities',
    icon: Blocks,
    labelKey: 'capabilities',
    children: [
      { id: 'data', href: '#data', icon: Table2, labelKey: 'data' },
      { id: 'infinite', href: '#infinite', icon: ListEnd, labelKey: 'infinite' },
      { id: 'feedback', href: '#feedback', icon: Bell, labelKey: 'feedback' },
      { id: 'board', href: '#board', icon: Columns3, labelKey: 'board' },
    ],
  },
  { id: 'form', href: '#form', icon: FileInput, labelKey: 'forms' },
] as const;

export function filterNavigationByPermissions(
  items: readonly AppNavigationItem[],
  grantedPermissions?: ReadonlySet<string>,
) {
  const isGranted = ({ requiredPermissions }: AppNavigationItem) =>
    !requiredPermissions?.length ||
    (grantedPermissions !== undefined &&
      requiredPermissions.every((permission) => grantedPermissions.has(permission)));

  return items.flatMap<AppNavigationItem>((item) => {
    if (!isGranted(item)) return [];
    if (!item.children) return [item];

    const children = item.children.filter(isGranted);
    return children.length ? [{ ...item, children }] : [];
  });
}
