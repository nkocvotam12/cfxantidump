// src/app/layout.tsx
import type { Metadata } from 'next';
import { LanguageProvider } from '@/hooks/useLang';
import { CookieBanner } from '@/components/cookie/CookieBanner';
import './globals.css';

export const metadata: Metadata = {
  title: 'CFX AntiDump | FiveM Anti-Dump Protection Suite',
  description: 'Next-generation FiveM server security and anti-dump protection panel.',
  manifest: '/manifest.webmanifest',
  icons: { icon: '/favicon.ico', shortcut: '/favicon.ico' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
        />
      </head>
      <body className="bg-bg-primary text-text-primary antialiased">
        <LanguageProvider>
          {children}
          <CookieBanner />
        </LanguageProvider>
      </body>
    </html>
  );
}