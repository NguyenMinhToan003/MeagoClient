import { MeagoLogo } from '@/components/shared/meago-logo';
import { cn } from '@/lib/utils';

interface BrandLoadingScreenProps {
  className?: string;
  fullScreen?: boolean;
}

/** Server-safe loading UI shared by route Suspense and client startup bootstrap. */
export function BrandLoadingScreen({ className, fullScreen = true }: BrandLoadingScreenProps) {
  return (
    <div
      role="status"
      aria-label="Loading Meago"
      aria-live="polite"
      className={cn(
        'relative isolate grid place-items-center overflow-hidden bg-background text-foreground',
        fullScreen ? 'min-h-svh' : 'min-h-full',
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,color-mix(in_oklab,var(--primary)_10%,transparent),transparent_38%)]" />
      <div className="relative flex flex-col items-center gap-5">
        <div className="meago-loader-mark relative grid size-20 place-items-center rounded-2xl border border-primary/15 bg-card/80 backdrop-blur-sm">
          <span className="meago-loader-orbit absolute inset-[-7px] rounded-[1.35rem] border border-transparent border-t-primary/70 border-r-primary/25" aria-hidden="true" />
          <MeagoLogo className="h-10 w-14" aria-hidden="true" />
        </div>
        <div className="flex flex-col items-center gap-3">
          <span className="text-lg font-semibold tracking-tight">Meago</span>
          <span className="meago-loader-track h-1 w-28 overflow-hidden rounded-full bg-primary/12" aria-hidden="true">
            <span className="meago-loader-bar block h-full w-2/5 rounded-full bg-primary" />
          </span>
        </div>
      </div>
    </div>
  );
}
