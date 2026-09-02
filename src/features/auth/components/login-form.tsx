'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { LoaderCircle, LogIn } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input, PasswordInput } from '@/components/ui/input';
import { useLogin } from '@/hooks/use-auth';
import { Link, useRouter } from '@/i18n/navigation';
import { AuthApiError, getAuthErrorKey } from './auth-api-error';

export function LoginForm() {
  const t = useTranslations('Auth');
  const router = useRouter();
  const login = useLogin();
  const schema = z.object({
    email: z.string().trim().email(t('validation.email')).max(254, t('validation.emailTooLong')),
    password: z.string().min(1, t('validation.passwordRequired')).max(128, t('validation.passwordTooLong')),
  });
  type Values = z.infer<typeof schema>;
  const form = useForm<Values>({ resolver: zodResolver(schema), defaultValues: { email: '', password: '' } });
  const apiError = login.error ? t(`errors.${getAuthErrorKey(login.error, 'login')}`) : undefined;

  async function submit(values: Values) {
    try {
      await login.mutateAsync(values);
      router.replace('/');
      router.refresh();
    } catch {
      // The mutation state renders the localized API error in this form.
    }
  }

  return (
    <Card className="gap-5 border-border/80 py-7 shadow-none">
      <CardHeader className="px-7">
        <CardTitle className="text-2xl tracking-tight">{t('login.title')}</CardTitle>
        <CardDescription className="leading-6">{t('login.description')}</CardDescription>
      </CardHeader>
      <CardContent className="px-7">
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(submit)} noValidate>
            <AuthApiError message={apiError} />
            <FormField control={form.control} name="email" render={({ field }) => (
              <FormItem>
                <FormLabel>{t('fields.email')}</FormLabel>
                <FormControl><Input type="email" autoComplete="email" placeholder="you@meago.vn" allowClear {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="password" render={({ field }) => (
              <FormItem>
                <FormLabel>{t('fields.password')}</FormLabel>
                <FormControl><PasswordInput autoComplete="current-password" placeholder={t('fields.passwordPlaceholder')} {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <Button type="submit" variant="solid" className="mt-2 w-full" disabled={login.isPending}>
              {login.isPending ? <LoaderCircle className="animate-spin" aria-hidden="true" /> : <LogIn aria-hidden="true" />}
              {login.isPending ? t('login.submitting') : t('login.submit')}
            </Button>
          </form>
        </Form>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          {t('login.noAccount')}{' '}
          <Link href="/register" className="font-medium text-brand-foreground underline-offset-4 hover:underline">{t('login.register')}</Link>
        </p>
      </CardContent>
    </Card>
  );
}
