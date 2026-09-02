'use client';

import { Headphones, ShieldCheck, Sparkles } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { ReactNode } from 'react';

import { LocaleSwitcher } from '@/components/shared/locale-switcher';
import { MeagoLogo } from '@/components/shared/meago-logo';
import { ThemeToggle } from '@/components/shared/theme-toggle';

export function AuthShell({ children }: { children: ReactNode }) {
  const t = useTranslations('Auth.shell');

  return (
    <main className="relative grid min-h-svh overflow-hidden bg-background lg:grid-cols-[minmax(0,1fr)_minmax(30rem,0.82fr)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,color-mix(in_oklab,var(--primary)_12%,transparent),transparent_35%)]" />

      <section className="relative hidden border-r bg-brand-soft/35 p-12 lg:flex lg:flex-col lg:justify-between xl:p-16">
        <Brand />
        <div className="max-w-xl space-y-8">
          <div className="space-y-4">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-background/70 px-3 py-1 text-sm font-medium text-brand-foreground">
              <Sparkles className="size-4" aria-hidden="true" />
              {t('eyebrow')}
            </span>
            <h1 className="text-4xl font-semibold tracking-tight xl:text-5xl">{t('title')}</h1>
            <p className="max-w-lg text-lg leading-8 text-muted-foreground">{t('description')}</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Benefit icon={<Headphones />} title={t('audioTitle')} description={t('audioDescription')} />
            <Benefit icon={<ShieldCheck />} title={t('secureTitle')} description={t('secureDescription')} />
          </div>
        </div>
        <p className="text-sm text-muted-foreground">{t('footer')}</p>
      </section>

      <section className="relative flex min-h-svh flex-col px-5 py-5 sm:px-8 lg:px-12">
        <div className="flex h-12 items-center justify-between lg:justify-end">
          <div className="lg:hidden"><Brand /></div>
          <div className="flex items-center gap-2">
            <LocaleSwitcher />
            <ThemeToggle />
          </div>
        </div>
        <div className="flex flex-1 items-center justify-center py-10">
          <div className="w-full max-w-md">{children}</div>
        </div>
      </section>
    </main>
  );
}

function Brand() {
  return (
    <div className="flex items-center gap-2.5 font-semibold" aria-label="Meago">
      <MeagoLogo className="h-9 w-11" aria-hidden="true" />
      <span className="text-lg">Meago</span>
    </div>
  );
}

function Benefit({ icon, title, description }: { icon: ReactNode; title: string; description: string }) {
  return (
    <div className="rounded-xl border bg-background/65 p-4 backdrop-blur-sm">
      <div className="mb-3 text-primary [&_svg]:size-5">{icon}</div>
      <p className="font-medium">{title}</p>
      <p className="mt-1 text-sm leading-6 text-muted-foreground">{description}</p>
    </div>
  );
}
