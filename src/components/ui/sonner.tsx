'use client';

import { Toaster as Sonner, type ToasterProps } from 'sonner';

export function Toaster(props: ToasterProps) {
  return (
    <Sonner
      theme="system"
      position="top-right"
      richColors
      closeButton
      visibleToasts={4}
      {...props}
    />
  );
}

