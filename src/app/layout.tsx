import type { Metadata } from 'next';
import { AppProvider } from '@/providers/app-provider';
import './globals.css';

export const metadata: Metadata = {
  title: 'Meago',
  description: 'Nền tảng chia sẻ audio & truyện',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
