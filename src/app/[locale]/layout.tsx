import type { Metadata } from 'next';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';

import { GlobalCommandPalette } from '@/components/shared/global-command-palette';
import { AppProvider } from '@/providers/app-provider';
import { routing } from '@/i18n/routing';
import '../globals.css';

export const metadata: Metadata = {
  title: 'Meago',
  description: 'Nền tảng chia sẻ audio và truyện',
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider>
          <AppProvider>
            <GlobalCommandPalette />
            {children}
          </AppProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
