'use client';

import { Search } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { OPEN_COMMAND_PALETTE_EVENT } from '@/components/shared/global-command-palette';
import { LocaleSwitcher } from '@/components/shared/locale-switcher';
import { MobileAppNavigation } from '@/components/shared/app-sidebar';
import { ThemeToggle } from '@/components/shared/theme-toggle';
import { UserAvatar } from '@/components/shared/user-avatar';
import { Button } from '@/components/ui/button';
import { Kbd, KbdGroup } from '@/components/ui/kbd';

export function AppTopbar() {
  const t = useTranslations('SidebarNavigation');

  return (
    <header className="bg-background/95 sticky top-0 z-40 flex h-14 items-center gap-2.5 border-b px-3 backdrop-blur sm:px-4">
      <MobileAppNavigation />
      <Button
        type="button"
        variant="outline"
        aria-label={t('topSearch')}
        onClick={() => window.dispatchEvent(new Event(OPEN_COMMAND_PALETTE_EVENT))}
        className="text-muted-foreground hover:text-foreground h-9 min-w-0 flex-1 justify-start sm:max-w-md"
      >
        <Search aria-hidden="true" className="size-4" />
        <span className="truncate">{t('topSearch')}</span>
        <KbdGroup className="ml-auto hidden sm:inline-flex" aria-label={t('commandShortcut')}>
          <Kbd>Ctrl</Kbd>
          <span aria-hidden="true">+</span>
          <Kbd>K</Kbd>
        </KbdGroup>
      </Button>
      <div className="ml-auto shrink-0">
        <LocaleSwitcher />
      </div>
      <ThemeToggle />
      <UserAvatar />
    </header>
  );
}
