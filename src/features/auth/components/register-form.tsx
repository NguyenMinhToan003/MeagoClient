'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { LoaderCircle, UserPlus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input, PasswordInput } from '@/components/ui/input';
import { useRegister } from '@/hooks/use-auth';
import { Link, useRouter } from '@/i18n/navigation';
import { AuthApiError, getAuthErrorKey } from './auth-api-error';

export function RegisterForm() {
  const t = useTranslations('Auth');
  const router = useRouter();
  const register = useRegister();
  const schema = z.object({
    displayName: z.string().trim().min(1, t('validation.displayNameRequired')).max(100, t('validation.displayNameTooLong')),
    email: z.string().trim().email(t('validation.email')).max(254, t('validation.emailTooLong')),
    password: z.string().min(8, t('validation.passwordMin')).max(128, t('validation.passwordTooLong')),
    confirmPassword: z.string().min(1, t('validation.confirmPasswordRequired')),
  }).refine((values) => values.password === values.confirmPassword, {
    path: ['confirmPassword'], message: t('validation.passwordMismatch'),
  });
  type Values = z.infer<typeof schema>;
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { displayName: '', email: '', password: '', confirmPassword: '' },
  });
  const apiError = register.error ? t(`errors.${getAuthErrorKey(register.error, 'register')}`) : undefined;

  async function submit(values: Values) {
    const payload = {
      displayName: values.displayName,
      email: values.email,
      password: values.password,
    };
    try {
      await register.mutateAsync(payload);
      toast.success(t('register.success'));
      router.replace('/login');
    } catch {
      // The mutation state renders the localized API error in this form.
    }
  }

  return (
    <Card className="gap-5 border-border/80 py-7 shadow-none">
      <CardHeader className="px-7">
        <CardTitle className="text-2xl tracking-tight">{t('register.title')}</CardTitle>
        <CardDescription className="leading-6">{t('register.description')}</CardDescription>
      </CardHeader>
      <CardContent className="px-7">
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(submit)} noValidate>
            <AuthApiError message={apiError} />
            <FormField control={form.control} name="displayName" render={({ field }) => (
              <FormItem><FormLabel>{t('fields.displayName')}</FormLabel><FormControl><Input autoComplete="name" placeholder={t('fields.displayNamePlaceholder')} allowClear {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="email" render={({ field }) => (
              <FormItem><FormLabel>{t('fields.email')}</FormLabel><FormControl><Input type="email" autoComplete="email" placeholder="you@meago.vn" allowClear {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="password" render={({ field }) => (
              <FormItem><FormLabel>{t('fields.password')}</FormLabel><FormControl><PasswordInput autoComplete="new-password" placeholder={t('fields.newPasswordPlaceholder')} {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="confirmPassword" render={({ field }) => (
              <FormItem><FormLabel>{t('fields.confirmPassword')}</FormLabel><FormControl><PasswordInput autoComplete="new-password" placeholder={t('fields.confirmPasswordPlaceholder')} {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <Button type="submit" variant="solid" className="mt-2 w-full" disabled={register.isPending}>
              {register.isPending ? <LoaderCircle className="animate-spin" aria-hidden="true" /> : <UserPlus aria-hidden="true" />}
              {register.isPending ? t('register.submitting') : t('register.submit')}
            </Button>
          </form>
        </Form>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          {t('register.hasAccount')}{' '}
          <Link href="/login" className="font-medium text-brand-foreground underline-offset-4 hover:underline">{t('register.login')}</Link>
        </p>
      </CardContent>
    </Card>
  );
}
