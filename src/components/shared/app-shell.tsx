import { AppSidebar } from '@/components/shared/app-sidebar';
import { AppTopbar } from '@/components/shared/app-topbar';

export function AppShell({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-svh lg:flex">
      <AppSidebar />
      <div className="min-w-0 flex-1">
        <AppTopbar />
        {children}
      </div>
    </div>
  );
}
