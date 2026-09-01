import type { SVGProps } from 'react';

import { cn } from '@/lib/utils';

interface MeagoLogoProps extends SVGProps<SVGSVGElement> {
  className?: string;
}

export function MeagoLogo({ className, ...props }: MeagoLogoProps) {
  return (
    <svg
      viewBox="10 18 60 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('text-foreground', className)}
      {...props}
    >
      <path
        d="M20 55C16.5 55 14 52.2 14 48.4V36.2C14 33.8 15 31.6 16.8 29.8L22.7 23.8C25.9 20.6 31.2 21.6 33.9 25.1C36 27.9 36.3 30.8 34.9 33.4C33.9 35.2 32.3 36 30.2 36.2C28.1 36.4 26.8 38 26.8 40.1V48.4C26.8 52.2 23.9 55 20 55Z"
        fill="currentColor"
      />
      <path
        d="M60 55C63.5 55 66 52.2 66 48.4V36.2C66 33.8 65 31.6 63.2 29.8L57.3 23.8C54.1 20.6 48.8 21.6 46.1 25.1C44 27.9 43.7 30.8 45.1 33.4C46.1 35.2 47.7 36 49.8 36.2C51.9 36.4 53.2 38 53.2 40.1V48.4C53.2 52.2 56.1 55 60 55Z"
        fill="currentColor"
      />
      <path
        d="M35.4 30.4C36.2 34.2 40.5 36.2 43.9 38.8C47.2 41.3 48.5 43.8 48 46.3C47.4 50.1 44.7 52.7 41.2 52.7C37.3 52.7 34.7 50.1 34.6 46.5C34.4 42.4 31.8 40.1 29.2 37.8C32.3 36.8 34.8 33.7 35.4 30.4Z"
        fill="#14B8A6"
      />
    </svg>
  );
}
