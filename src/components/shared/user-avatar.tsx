'use client';

import { useTranslations } from 'next-intl';
import { LogOut } from 'lucide-react';

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
import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/stores/auth.store';

interface UserAvatarProps {
  imageUrl?: string | null;
  displayName?: string | null;
}

interface NameAvatarProps extends UserAvatarProps {
  className?: string;
}

const FALLBACK_NAME = 'Meago';

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
  const clearAuth = useAuthStore((state) => state.clear);
  const t = useTranslations('SidebarNavigation');
  if (!isReady) {
    return (
      <span className="flex size-10 shrink-0 overflow-hidden rounded-full border border-primary/60 dark:border-primary/80">
        <Skeleton className="size-full rounded-full" aria-label={t('loadingUser')} />
      </span>
    );
  }

  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      clearAuth();
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button type="button" variant="ghost" size="icon-lg" aria-label={t('account')} className="rounded-full">
          <NameAvatar className="size-9" displayName={displayName} imageUrl={imageUrl} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="flex items-center gap-3 py-2 font-normal">
          <NameAvatar className="size-10" displayName={displayName} imageUrl={imageUrl} />
          <span className="min-w-0">
            <span className="block truncate text-sm font-medium">{displayName || t('guest')}</span>
            <span className="text-muted-foreground block truncate text-xs">{accessToken ? t('signedIn') : t('notSignedIn')}</span>
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" disabled={!accessToken} onSelect={() => void logout()}>
          <LogOut />
          {t('logout')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
