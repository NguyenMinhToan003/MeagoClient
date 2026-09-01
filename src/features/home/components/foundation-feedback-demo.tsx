'use client';

import { toast } from 'sonner';
import { CircleAlert, CircleCheck, Info, LoaderCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

export function FoundationFeedbackDemo() {
  const t = useTranslations('Home.feedback');

  const showPromiseToast = () => {
    toast.promise(new Promise<string>((resolve) => window.setTimeout(() => resolve(t('promise.result')), 900)), {
      loading: t('promise.loading'),
      success: (result) => result,
      error: t('promise.error'),
    });
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="space-y-3">
        <h3 className="font-semibold">{t('toast.title')}</h3>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" onClick={() => toast.success(t('toast.success'))}>
            <CircleCheck aria-hidden="true" />{t('toast.successAction')}
          </Button>
          <Button type="button" onClick={() => toast.info(t('toast.info'))}>
            <Info aria-hidden="true" />{t('toast.infoAction')}
          </Button>
          <Button type="button" variant="outline" onClick={() => toast.error(t('toast.error'))}>
            <CircleAlert aria-hidden="true" />{t('toast.errorAction')}
          </Button>
          <Button type="button" variant="outline" onClick={showPromiseToast}>
            <LoaderCircle aria-hidden="true" />{t('promise.action')}
          </Button>
        </div>
      </section>

      <section className="space-y-3" aria-label={t('skeleton.title')}>
        <h3 className="font-semibold">{t('skeleton.title')}</h3>
        <div className="flex items-center gap-3 rounded-md border bg-background p-3">
          <Skeleton className="size-11 shrink-0 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-4/5" />
          </div>
        </div>
      </section>
    </div>
  );
}
