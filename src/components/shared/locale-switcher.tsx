'use client';

import { Languages } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import type { AppLocale } from '@/i18n/routing';
import { Button } from '@/components/ui/button';

export function LocaleSwitcher() {
  const locale = useLocale() as AppLocale;
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations('Navigation');
  const nextLocale: AppLocale = locale === 'vi' ? 'en' : 'vi';

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className="h-9"
      aria-label={t('language')}
      onClick={() => router.replace(pathname, { locale: nextLocale, scroll: false })}
    >
      <Languages aria-hidden="true" />
      {nextLocale.toUpperCase()}
    </Button>
  );
}
