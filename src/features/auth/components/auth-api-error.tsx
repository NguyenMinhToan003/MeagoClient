import { isAxiosError } from 'axios';
import { CircleAlert } from 'lucide-react';

export type AuthErrorKey = 'conflict' | 'invalidCredentials' | 'rateLimited' | 'serverUnavailable' | 'unknown';

export function getAuthErrorKey(error: unknown, operation: 'login' | 'register'): AuthErrorKey {
  if (!isAxiosError(error)) return 'unknown';
  if (!error.response) return 'serverUnavailable';
  if (error.response.status === 429) return 'rateLimited';
  if (operation === 'login' && error.response.status === 401) return 'invalidCredentials';
  if (operation === 'register' && error.response.status === 409) return 'conflict';
  return 'unknown';
}

export function AuthApiError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <div role="alert" className="flex gap-2 rounded-md border border-destructive/20 bg-destructive/10 px-3 py-2.5 text-sm text-destructive">
      <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
      <span>{message}</span>
    </div>
  );
}
