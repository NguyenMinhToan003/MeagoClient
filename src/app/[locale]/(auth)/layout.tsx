import { GuestGuard } from '@/components/guards/guest-guard';
import { AuthShell } from '@/features/auth/components/auth-shell';

export default function AuthenticationLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <GuestGuard>
      <AuthShell>{children}</AuthShell>
    </GuestGuard>
  );
}
