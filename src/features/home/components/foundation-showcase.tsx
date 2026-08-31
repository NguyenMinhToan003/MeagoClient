'use client';

import { Command, Headphones, Library, ShieldCheck } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { OPEN_COMMAND_PALETTE_EVENT } from '@/components/shared/global-command-palette';
import { LocaleSwitcher } from '@/components/shared/locale-switcher';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { FoundationEmailForm } from './foundation-email-form';
import { FoundationSortableDemo } from './foundation-sortable-demo';

const foundations = [
  { icon: Headphones, key: 'audio' },
  { icon: Library, key: 'ui' },
  { icon: ShieldCheck, key: 'security' },
] as const;

export function FoundationShowcase() {
  const t = useTranslations('Home');
  return (
    <main className="min-h-svh bg-muted/30 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        <header className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <Badge variant="secondary">{t('badge')}</Badge><LocaleSwitcher />
          </div>
          <div className="max-w-2xl space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{t('title')}</h1>
            <p className="text-muted-foreground text-base sm:text-lg">{t('description')}</p>
          </div>
        </header>
        <Separator />
        <section className="grid gap-4 md:grid-cols-3">
          {foundations.map(({ icon: Icon, key }) => (
            <Card key={key}><CardHeader>
              <Icon aria-hidden="true" className="text-primary size-5" />
              <CardTitle>{t(`foundations.${key}.title`)}</CardTitle>
              <CardDescription>{t(`foundations.${key}.description`)}</CardDescription>
            </CardHeader></Card>
          ))}
        </section>
        <Card className="max-w-xl">
          <CardHeader><CardTitle>{t('form.title')}</CardTitle><CardDescription>{t('form.description')}</CardDescription></CardHeader>
          <CardContent className="space-y-4">
            <FoundationEmailForm />
            <Button type="button" onClick={() => window.dispatchEvent(new Event(OPEN_COMMAND_PALETTE_EVENT))}>
              <Command aria-hidden="true" />{t('openCommands')}
            </Button>
          </CardContent>
        </Card>
        <Card className="max-w-xl">
          <CardHeader><CardTitle>{t('dnd.title')}</CardTitle><CardDescription>{t('dnd.description')}</CardDescription></CardHeader>
          <CardContent><FoundationSortableDemo /></CardContent>
        </Card>
      </div>
    </main>
  );
}
