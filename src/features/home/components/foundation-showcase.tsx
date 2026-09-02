'use client';

import { Command, Headphones, Library, Map, ShieldCheck } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { OPEN_COMMAND_PALETTE_EVENT } from '@/components/shared/global-command-palette';
import { LocaleSwitcher } from '@/components/shared/locale-switcher';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { FoundationEmailForm } from './foundation-email-form';
import { FoundationButtonDemo } from './foundation-button-demo';
import { FoundationSortableBoardDemo } from './foundation-sortable-board-demo';
import { FoundationDataDemo, FoundationInfiniteDemo } from './foundation-data-demo';
import { FoundationFeedbackDemo } from './foundation-feedback-demo';
import { FoundationAvatarDemo } from './foundation-avatar-demo';
import { FoundationInputPaginationDemo } from './foundation-input-pagination-demo';
import { createProductTour } from '@/lib/onboarding/create-product-tour';

const foundations = [
  { icon: Headphones, key: 'audio' },
  { icon: Library, key: 'ui' },
  { icon: ShieldCheck, key: 'security' },
] as const;

export function FoundationShowcase() {
  const t = useTranslations('Home');
  const startTour = () => {
    createProductTour([
      { element: '[data-tour="locale"]', popover: { title: t('tour.locale.title'), description: t('tour.locale.description') } },
      { element: '[data-tour="form"]', popover: { title: t('tour.form.title'), description: t('tour.form.description') } },
      { element: '[data-tour="data"]', popover: { title: t('tour.data.title'), description: t('tour.data.description') } },
      { element: '[data-tour="feedback"]', popover: { title: t('tour.feedback.title'), description: t('tour.feedback.description') } },
      { element: '[data-tour="infinite"]', popover: { title: t('tour.infinite.title'), description: t('tour.infinite.description') } },
      { element: '[data-tour="board"]', popover: { title: t('tour.board.title'), description: t('tour.board.description') } },
    ]).drive();
  };

  return (
    <main id="overview" className="min-h-svh scroll-mt-14 bg-muted/30 px-3 py-8 sm:px-5 lg:px-6 lg:py-9">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <header className="space-y-3">
          <div className="flex items-center justify-between gap-4">
            <Badge variant="secondary">{t('badge')}</Badge><div data-tour="locale"><LocaleSwitcher /></div>
          </div>
          <div className="max-w-2xl space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight">{t('title')}</h1>
            <p className="text-muted-foreground text-base">{t('description')}</p>
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
        <Card id="form" className="max-w-xl scroll-mt-20" data-tour="form">
          <CardHeader><CardTitle>{t('form.title')}</CardTitle><CardDescription>{t('form.description')}</CardDescription></CardHeader>
          <CardContent className="space-y-4">
            <FoundationEmailForm />
            <Button type="button" onClick={() => window.dispatchEvent(new Event(OPEN_COMMAND_PALETTE_EVENT))}>
              <Command aria-hidden="true" />{t('openCommands')}
            </Button>
            <Button type="button" onClick={startTour}>
              <Map aria-hidden="true" />{t('startTour')}
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t('buttons.title')}</CardTitle>
            <CardDescription>{t('buttons.description')}</CardDescription>
          </CardHeader>
          <CardContent><FoundationButtonDemo /></CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t('controls.title')}</CardTitle>
            <CardDescription>{t('controls.description')}</CardDescription>
          </CardHeader>
          <CardContent><FoundationInputPaginationDemo /></CardContent>
        </Card>
        <Card id="data" className="scroll-mt-20" data-tour="data">
          <CardHeader><CardTitle>{t('dataDemo.title')}</CardTitle><CardDescription>{t('dataDemo.description')}</CardDescription></CardHeader>
          <CardContent><FoundationDataDemo /></CardContent>
        </Card>
        <Card id="infinite" className="scroll-mt-20" data-tour="infinite">
          <CardHeader><CardTitle>{t('dataDemo.infinite.title')}</CardTitle><CardDescription>{t('dataDemo.infinite.description')}</CardDescription></CardHeader>
          <CardContent><FoundationInfiniteDemo /></CardContent>
        </Card>
        <Card id="feedback" className="scroll-mt-20" data-tour="feedback">
          <CardHeader><CardTitle>{t('feedback.title')}</CardTitle><CardDescription>{t('feedback.description')}</CardDescription></CardHeader>
          <CardContent><FoundationFeedbackDemo /></CardContent>
        </Card>
        <Card id="board" className="scroll-mt-20" data-tour="board">
          <CardHeader><CardTitle>{t('board.title')}</CardTitle><CardDescription>{t('board.description')}</CardDescription></CardHeader>
          <CardContent><FoundationSortableBoardDemo /></CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t('avatars.title')}</CardTitle>
            <CardDescription>{t('avatars.description')}</CardDescription>
          </CardHeader>
          <CardContent><FoundationAvatarDemo /></CardContent>
        </Card>
      </div>
    </main>
  );
}
