'use client';

import { LoaderCircle, Plus, Save, Settings, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';

export function FoundationButtonDemo() {
  const t = useTranslations('Home.buttons');

  return (
    <div className="space-y-6">
      <section className="space-y-3">
        <h3 className="text-sm font-medium">{t('variants')}</h3>
        <div className="flex flex-wrap items-center gap-3">
          <Button><Save />{t('default')}</Button>
          <Button variant="solid"><Save />{t('solid')}</Button>
          <Button variant="outline-primary">{t('outlinePrimary')}</Button>
          <Button variant="secondary">{t('secondary')}</Button>
          <Button variant="outline">{t('outline')}</Button>
          <Button variant="ghost">{t('ghost')}</Button>
          <Button variant="destructive"><Trash2 />{t('destructive')}</Button>
          <Button variant="link">{t('link')}</Button>
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-medium">{t('sizes')}</h3>
        <div className="flex flex-wrap items-center gap-3">
          <Button size="xs"><Plus />XS</Button>
          <Button size="sm"><Plus />SM</Button>
          <Button size="default"><Plus />Default</Button>
          <Button size="lg"><Plus />Large</Button>
          <Button size="icon-xs" aria-label={t('settings')}><Settings /></Button>
          <Button size="icon-sm" aria-label={t('settings')}><Settings /></Button>
          <Button size="icon" aria-label={t('settings')}><Settings /></Button>
          <Button size="icon-lg" aria-label={t('settings')}><Settings /></Button>
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-medium">{t('states')}</h3>
        <div className="flex flex-wrap items-center gap-3">
          <Button disabled>{t('disabled')}</Button>
          <Button disabled aria-busy="true"><LoaderCircle className="animate-spin" />{t('loading')}</Button>
          <Button variant="solid" disabled>{t('solidDisabled')}</Button>
          <Button variant="outline-primary" disabled>{t('outlineDisabled')}</Button>
        </div>
      </section>
    </div>
  );
}
