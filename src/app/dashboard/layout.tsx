// src/app/dashboard/layout.tsx
'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [authorized, setAuthorized] = useState(pathname === '/dashboard/error');

  useEffect(() => {
    if (pathname === '/dashboard/error') {
      setAuthorized(true);
      return;
    }

    let cancelled = false;
    fetch('/auth/me', { credentials: 'include', cache: 'no-store' })
      .then((res) => {
        if (cancelled) return;
        if (!res.ok) {
          setAuthorized(false);
          router.replace('/');
          return;
        }
        setAuthorized(true);
      })
      .catch(() => {
        if (!cancelled) {
          setAuthorized(false);
          router.replace('/');
        }
      });

    return () => {
      cancelled = true;
    };
  }, [pathname, router]);

  if (pathname === '/dashboard/error') {
    return <>{children}</>;
  }

  if (!authorized) {
    return (
      <div className="min-h-screen bg-bg-primary text-text-primary flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary flex overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto flex flex-col">
          {children}
        </main>
      </div>
    </div>
  );
}
