'use client';

import type { ReactNode } from 'react';
import { Home, Languages } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';

import { usePathname, useRouter } from '@/i18n/navigation';
import type { AppLocale } from '@/i18n/routing';

export interface AppCommand {
  id: string;
  label: string;
  icon: ReactNode;
  shortcut?: string;
  run: () => void;
}

/** Registry for commands that are available everywhere in the application. */
export function useGlobalCommands(): AppCommand[] {
  const locale = useLocale() as AppLocale;
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations('Navigation');

  return [
    {
      id: 'navigate-home',
      label: t('home'),
      icon: <Home aria-hidden="true" />,
      run: () => router.push('/'),
    },
    {
      id: 'switch-locale',
      label: t('language'),
      icon: <Languages aria-hidden="true" />,
      shortcut: locale === 'vi' ? 'EN' : 'VI',
      run: () => router.replace(pathname, { locale: locale === 'vi' ? 'en' : 'vi' }),
    },
  ];
}
