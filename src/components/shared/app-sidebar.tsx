'use client';

import { useEffect, useMemo, useState, useSyncExternalStore } from 'react';
import { ChevronRight, Menu, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useTranslations } from 'next-intl';

import { AnimatedIconToggle } from '@/components/shared/animated-icon-toggle';
import { MeagoLogo } from '@/components/shared/meago-logo';
import {
  appNavigationItems,
  filterNavigationByPermissions,
} from '@/components/shared/app-navigation.config';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/utils';

const SIDEBAR_COLLAPSED_STORAGE_KEY = 'meago.sidebar.collapsed';
const SIDEBAR_COLLAPSED_EVENT = 'meago:sidebar-collapsed-change';
let inMemorySidebarCollapsed = false;

function subscribeToSidebarPreference(onStoreChange: () => void) {
  window.addEventListener('storage', onStoreChange);
  window.addEventListener(SIDEBAR_COLLAPSED_EVENT, onStoreChange);
  return () => {
    window.removeEventListener('storage', onStoreChange);
    window.removeEventListener(SIDEBAR_COLLAPSED_EVENT, onStoreChange);
  };
}

function getSidebarPreferenceSnapshot() {
  try {
    return window.localStorage.getItem(SIDEBAR_COLLAPSED_STORAGE_KEY) === 'true';
  } catch {
    return inMemorySidebarCollapsed;
  }
}

function getSidebarPreferenceServerSnapshot() {
  return false;
}

interface NavigationContentProps {
  collapsed?: boolean;
  activeSection: string;
  onNavigate?: () => void;
  onRequestExpand?: () => void;
}

function NavigationContent({
  activeSection,
  collapsed = false,
  onNavigate,
  onRequestExpand,
}: NavigationContentProps) {
  const t = useTranslations('SidebarNavigation');
  const shouldReduceMotion = useReducedMotion();
  const items = useMemo(() => filterNavigationByPermissions(appNavigationItems), []);
  const [openGroups, setOpenGroups] = useState<ReadonlySet<string>>(
    () => new Set(['capabilities']),
  );

  const toggleGroup = (groupId: string) => {
    if (collapsed) {
      onRequestExpand?.();
      return;
    }

    setOpenGroups((current) => {
      const next = new Set(current);
      if (next.has(groupId)) next.delete(groupId);
      else next.add(groupId);
      return next;
    });
  };

  return (
    <nav aria-label={t('label')} className="flex flex-1 flex-col overflow-y-auto px-2 py-3">
      <div className="flex flex-col gap-1">
      {items.map(({ children, href, icon: Icon, id, labelKey }) => {
        if (children) {
          const containsActiveItem = children.some((child) => child.id === activeSection);
          const open = openGroups.has(id) && !collapsed;

          return (
            <div key={id}>
              <button
                type="button"
                title={t(labelKey)}
                aria-expanded={open}
                aria-controls={`navigation-group-${id}`}
                onClick={() => toggleGroup(id)}
                className={cn(
                  'focus-visible:ring-ring flex min-h-10 w-full items-center gap-3 rounded-md px-3 text-sm font-medium outline-none transition-colors focus-visible:ring-2',
                  containsActiveItem ? 'text-foreground' : 'text-muted-foreground',
                  'hover:bg-accent hover:text-accent-foreground',
                  collapsed && 'mx-auto size-10 min-h-10 justify-center gap-0 p-0',
                )}
              >
                <Icon aria-hidden="true" className="size-4 shrink-0" />
                {!collapsed && (
                  <>
                    <span className="min-w-0 flex-1 truncate text-left">{t(labelKey)}</span>
                    <ChevronRight
                      aria-hidden="true"
                      className={cn('size-4 transition-transform duration-200', open && 'rotate-90')}
                    />
                  </>
                )}
              </button>
              <AnimatePresence initial={false}>
                {open && (
                  <motion.div
                    id={`navigation-group-${id}`}
                    key={id}
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    exit={{ height: 0 }}
                    transition={
                      shouldReduceMotion
                        ? { duration: 0.01 }
                        : { duration: 0.18, ease: 'easeOut' }
                    }
                    className="overflow-hidden"
                  >
                    <div className="relative ml-5 space-y-1 border-l pl-2 pt-1">
                      {children.map(({ href: childHref, icon: ChildIcon, id: childId, labelKey: childLabelKey }) => {
                        const active = activeSection === childId;
                        return (
                          <a
                            key={childId}
                            href={childHref}
                            title={t(childLabelKey)}
                            aria-current={active ? 'location' : undefined}
                            onClick={onNavigate}
                            className={cn(
                              'focus-visible:ring-ring flex min-h-9 items-center gap-3 rounded-md px-3 text-sm outline-none transition-colors focus-visible:ring-2',
                              active
                                ? 'bg-primary text-primary-foreground font-medium'
                                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                            )}
                          >
                            <ChildIcon aria-hidden="true" className="size-4 shrink-0" />
                            <span className="min-w-0 flex-1 truncate">{t(childLabelKey)}</span>
                          </a>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        }

        const active = activeSection === id;
        return (
          <a
            key={id}
            href={href}
            title={t(labelKey)}
            aria-current={active ? 'location' : undefined}
            onClick={onNavigate}
            className={cn(
              'focus-visible:ring-ring flex min-h-10 items-center gap-3 rounded-md px-3 text-sm font-medium outline-none transition-colors focus-visible:ring-2',
              active ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
              collapsed && 'mx-auto size-10 min-h-10 justify-center gap-0 p-0',
            )}
          >
            <Icon aria-hidden="true" className="size-4 shrink-0" />
            {!collapsed && <span className="min-w-0 flex-1 truncate">{t(labelKey)}</span>}
          </a>
        );
      })}
      </div>
    </nav>
  );
}

function useActiveSection() {
  const [activeSection, setActiveSection] = useState('overview');

  useEffect(() => {
    const updateFromHash = () => setActiveSection(window.location.hash.slice(1) || 'overview');
    updateFromHash();
    window.addEventListener('hashchange', updateFromHash);
    return () => window.removeEventListener('hashchange', updateFromHash);
  }, []);

  return activeSection;
}

export function AppSidebar() {
  const t = useTranslations('SidebarNavigation');
  const activeSection = useActiveSection();
  const collapsed = useSyncExternalStore(
    subscribeToSidebarPreference,
    getSidebarPreferenceSnapshot,
    getSidebarPreferenceServerSnapshot,
  );

  const changeCollapsed = (next: boolean) => {
    inMemorySidebarCollapsed = next;
    try {
      window.localStorage.setItem(SIDEBAR_COLLAPSED_STORAGE_KEY, String(next));
    } catch {
      // Storage có thể bị chặn trong private mode; sidebar vẫn giữ khả năng thao tác.
    }
    window.dispatchEvent(new Event(SIDEBAR_COLLAPSED_EVENT));
  };

  return (
    <aside
      className={cn(
        'bg-background sticky top-0 hidden h-svh shrink-0 border-r transition-[width] duration-200 lg:flex lg:flex-col',
        collapsed ? 'w-16' : 'w-64',
      )}
    >
      <div className={cn('flex h-14 items-center gap-2 border-b px-3', collapsed && 'justify-center px-2')}>
        <Link
          href="/"
          aria-label={t('overview')}
          title={collapsed ? t('overview') : undefined}
          className="flex min-w-0 items-center gap-2 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
        >
          <MeagoLogo aria-hidden="true" className="h-7 w-9 shrink-0" />
          {!collapsed && <span className="leading-none text-base font-semibold tracking-tight">Meago</span>}
        </Link>
      </div>
      <NavigationContent
        collapsed={collapsed}
        activeSection={activeSection}
        onRequestExpand={() => changeCollapsed(false)}
      />
      <Separator />
      <div className={cn('flex p-3', collapsed ? 'justify-center' : 'justify-end')}>
        <AnimatedIconToggle
          pressed={collapsed}
          onPressedChange={changeCollapsed}
          label={collapsed ? t('expand') : t('collapse')}
          onIcon={<PanelLeftOpen className="size-4" />}
          offIcon={<PanelLeftClose className="size-4" />}
          className={collapsed ? 'size-10' : undefined}
        />
      </div>
    </aside>
  );
}

export function MobileAppNavigation() {
  const t = useTranslations('SidebarNavigation');
  const activeSection = useActiveSection();
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button type="button" variant="ghost" size="icon" aria-label={t('open')} className="shrink-0 lg:hidden">
            <Menu aria-hidden="true" />
          </Button>
        </DialogTrigger>
        <DialogContent
          showCloseButton
          className="top-0 left-0 h-svh max-w-72 translate-x-0 translate-y-0 content-start rounded-none border-y-0 border-l-0 p-0"
        >
          <div className="flex h-14 items-center gap-2 border-b px-3">
            <Link
              href="/"
              aria-label={t('overview')}
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
            >
              <MeagoLogo aria-hidden="true" className="h-7 w-9 shrink-0" />
              <DialogTitle className="leading-none">Meago</DialogTitle>
            </Link>
            <DialogDescription className="sr-only">{t('description')}</DialogDescription>
          </div>
          <NavigationContent activeSection={activeSection} onNavigate={() => setOpen(false)} />
        </DialogContent>
    </Dialog>
  );
}
