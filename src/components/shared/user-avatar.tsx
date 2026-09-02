'use client';

import { useTranslations } from 'next-intl';
import { ChevronRight, LogIn, LogOut, Settings, UserRound } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { useLogout, useMe } from '@/hooks/use-auth';
import { Link, useRouter } from '@/i18n/navigation';
import { useAuthStore } from '@/stores/auth.store';

interface UserAvatarProps {
  imageUrl?: string | null;
  displayName?: string | null;
}

interface NameAvatarProps extends UserAvatarProps {
  className?: string;
}

const FALLBACK_NAME = 'Meago';
const GUEST_NAME = 'Guest';
const AUTHENTICATED_FALLBACK_NAME = 'Meago User';

const avatarColorClasses = [
  'bg-teal-100 text-teal-800 dark:bg-teal-900/65 dark:text-teal-100',
  'bg-sky-100 text-sky-800 dark:bg-sky-900/65 dark:text-sky-100',
  'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/65 dark:text-indigo-100',
  'bg-violet-100 text-violet-800 dark:bg-violet-900/65 dark:text-violet-100',
  'bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-900/65 dark:text-fuchsia-100',
  'bg-rose-100 text-rose-800 dark:bg-rose-900/65 dark:text-rose-100',
  'bg-orange-100 text-orange-800 dark:bg-orange-900/65 dark:text-orange-100',
  'bg-amber-100 text-amber-800 dark:bg-amber-900/65 dark:text-amber-100',
  'bg-lime-100 text-lime-800 dark:bg-lime-900/65 dark:text-lime-100',
  'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/65 dark:text-emerald-100',
] as const;

function normalizeName(displayName?: string | null) {
  return displayName?.trim().replace(/\s+/g, ' ') || FALLBACK_NAME;
}

function getInitials(displayName?: string | null) {
  const parts = normalizeName(displayName).split(' ');
  const selectedParts = parts.length === 1 ? parts : [parts[0], parts.at(-1)!];

  return selectedParts
    .map((part) => Array.from(part)[0])
    .join('')
    .slice(0, 2)
    .toLocaleUpperCase();
}

function getAvatarColorClass(displayName?: string | null) {
  const normalizedName = normalizeName(displayName).toLocaleLowerCase();
  const hash = Array.from(normalizedName).reduce(
    (value, character) => (value * 31 + character.codePointAt(0)!) >>> 0,
    0,
  );

  return avatarColorClasses[hash % avatarColorClasses.length];
}

export function NameAvatar({ className, displayName, imageUrl }: NameAvatarProps) {
  return (
    <Avatar className={className}>
      {imageUrl ? <AvatarImage src={imageUrl} alt={normalizeName(displayName)} /> : null}
      <AvatarFallback className={getAvatarColorClass(displayName)}>{getInitials(displayName)}</AvatarFallback>
    </Avatar>
  );
}

export function UserAvatar({ displayName, imageUrl }: UserAvatarProps) {
  const isReady = useAuthStore((state) => state.isReady);
  const accessToken = useAuthStore((state) => state.accessToken);
  const currentUser = useMe();
  const logout = useLogout();
  const router = useRouter();
  const t = useTranslations('SidebarNavigation');
  if (!isReady) {
    return (
      <span className="flex size-10 shrink-0 overflow-hidden rounded-full border border-primary/60 dark:border-primary/80">
        <Skeleton className="size-full rounded-full" aria-label={t('loadingUser')} />
      </span>
    );
  }

  // Identity data is locale-independent: preserve BE values and keep one stable guest identity.
  const resolvedName = displayName || currentUser.data?.displayName || (accessToken ? AUTHENTICATED_FALLBACK_NAME : GUEST_NAME);
  const resolvedEmail = currentUser.data?.email;

  async function handleLogout() {
    try {
      await logout.mutateAsync();
    } finally {
      router.replace('/login');
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button type="button" variant="ghost" size="icon-lg" aria-label={t('account')} className="rounded-full">
          <NameAvatar className="size-9" displayName={resolvedName} imageUrl={imageUrl} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={8} className="w-72 rounded-xl p-1.5 shadow-lg">
        <DropdownMenuLabel className="flex items-center gap-3 rounded-lg px-2.5 py-3 font-normal">
          <NameAvatar className="size-11" displayName={resolvedName} imageUrl={imageUrl} />
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-semibold" title={resolvedName}>{resolvedName}</span>
            <span className="text-muted-foreground block truncate text-xs" title={resolvedEmail}>{resolvedEmail || t('notSignedIn')}</span>
            {accessToken ? (
              <span className="mt-1 flex items-center gap-1.5 text-[11px] text-brand-foreground">
                <span className="size-1.5 rounded-full bg-primary" aria-hidden="true" />{t('signedIn')}
              </span>
            ) : null}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {accessToken ? (
          <>
            <DropdownMenuLabel className="px-2.5 pb-1 pt-1.5 text-xs font-medium text-muted-foreground">{t('accountSection')}</DropdownMenuLabel>
            <DropdownMenuItem className="h-10 rounded-md px-2.5" disabled>
              <UserRound /><span>{t('profile')}</span><MenuStatus>{t('comingSoon')}</MenuStatus>
            </DropdownMenuItem>
            <DropdownMenuItem className="h-10 rounded-md px-2.5" disabled>
              <Settings /><span>{t('settings')}</span><MenuStatus>{t('comingSoon')}</MenuStatus>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" className="h-10 rounded-md px-2.5" disabled={logout.isPending} onSelect={() => void handleLogout()}>
              <LogOut /><span>{logout.isPending ? t('loggingOut') : t('logout')}</span>
            </DropdownMenuItem>
          </>
        ) : (
          <DropdownMenuItem asChild className="h-10 rounded-md px-2.5 text-brand-foreground focus:text-brand-foreground">
            <Link href="/login"><LogIn /><span>{t('login')}</span><ChevronRight className="ml-auto" /></Link>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function MenuStatus({ children }: { children: React.ReactNode }) {
  return <span className="ml-auto rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">{children}</span>;
}
