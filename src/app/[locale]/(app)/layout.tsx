import { GlobalCommandPalette } from '@/components/shared/global-command-palette';
import { AppShell } from '@/components/shared/app-shell';

export default function ApplicationLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <GlobalCommandPalette />
      <AppShell>{children}</AppShell>
    </>
  );
}
