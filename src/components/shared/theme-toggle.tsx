'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useTranslations } from 'next-intl';

import { AnimatedIconToggle } from '@/components/shared/animated-icon-toggle';

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const t = useTranslations('SidebarNavigation');

  return (
    <AnimatedIconToggle
      pressed={resolvedTheme === 'dark'}
      onPressedChange={(dark) => setTheme(dark ? 'dark' : 'light')}
      label={t('toggleTheme')}
      onIcon={<Moon className="size-4" />}
      offIcon={<Sun className="size-4" />}
      className="size-9 border-amber-500/25 bg-amber-400/10 text-amber-600 hover:border-amber-500/40 hover:bg-amber-400/18 hover:text-amber-700 dark:border-indigo-400/30 dark:bg-indigo-400/10 dark:text-indigo-300 dark:hover:border-indigo-400/45 dark:hover:bg-indigo-400/16 dark:hover:text-indigo-200"
    />
  );
}
