// src/app/admin/layout.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useLang } from '@/hooks/useLang';

const ADMIN_TABS = [
  { href: '/admin', labelKey: 'admin_tab_overview', icon: 'fa-chart-pie' },
  { href: '/admin/users', labelKey: 'admin_tab_users', icon: 'fa-users' },
  { href: '/admin/servers', labelKey: 'admin_tab_servers', icon: 'fa-server' },
  { href: '/admin/logs', labelKey: 'admin_tab_logs', icon: 'fa-list' },
  { href: '/admin/audit', labelKey: 'admin_tab_audit', icon: 'fa-clipboard-list' },
  { href: '/admin/novedades', labelKey: 'admin_tab_novedades', icon: 'fa-bullhorn' },
  { href: '/admin/subscriptions', labelKey: 'admin_tab_subscriptions', icon: 'fa-credit-card' },
  { href: '/admin/cdn', labelKey: 'admin_tab_cdn', icon: 'fa-cloud' },
  { href: '/admin/global-bans', labelKey: 'admin_tab_global_bans', icon: 'fa-ban' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { t, lang } = useLang();
  const pathname = usePathname();
  const router = useRouter();
  const [authState, setAuthState] = useState<'checking' | 'authorized' | 'forbidden'>('checking');

  useEffect(() => {
    let cancelled = false;
    fetch('/auth/me', { credentials: 'include', cache: 'no-store' })
      .then(async (res) => {
        if (cancelled) return;
        if (!res.ok) {
          router.replace('/');
          return;
        }
        const user = (await res.json()) as { role?: string };
        if (user.role === 'admin' || user.role === 'super_admin') {
          setAuthState('authorized');
        } else {
          setAuthState('forbidden');
        }
      })
      .catch(() => {
        if (!cancelled) router.replace('/');
      });

    return () => {
      cancelled = true;
    };
  }, [pathname, router]);

  if (authState === 'checking') {
    return (
      <div className="min-h-screen bg-bg-primary text-text-primary flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (authState === 'forbidden') {
    const titleText =
      lang === 'vi' ? '403 - Không có quyền truy cập' : lang === 'es' ? '403 - Acceso denegado' : '403 - Access Denied';
    const descText =
      lang === 'vi'
        ? 'Cần quyền Admin hoặc Super Admin (thêm Discord ID của bạn vào ADMIN_DISCORD_IDS trong .env.local).'
        : lang === 'es'
          ? 'Se requiere rol Admin o Super Admin (añade tu Discord ID a ADMIN_DISCORD_IDS en .env.local).'
          : 'Admin or Super Admin role required (configure ADMIN_DISCORD_IDS in .env.local).';
    return (
      <div className="min-h-screen bg-bg-primary text-text-primary flex items-center justify-center p-4">
        <div className="card p-6 max-w-md w-full text-center space-y-4">
          <i className="fa-solid fa-shield-halved text-3xl text-red-400" />
          <h1 className="text-xl font-bold">{titleText}</h1>
          <p className="text-xs text-zinc-400">{descText}</p>
          <Link href="/dashboard" className="btn-primary inline-flex items-center gap-2 text-xs">
            <i className="fa-solid fa-arrow-left" /> {t('nav_dashboard')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold">{t('admin_title')}</h1>
            <p className="text-sm text-zinc-400 mt-1">{t('admin_subtitle')}</p>
          </div>
          <Link href="/dashboard" className="btn-secondary text-xs">
            <i className="fa-solid fa-arrow-left" /> {t('nav_dashboard')}
          </Link>
        </div>

        <nav className="flex flex-wrap items-center gap-1 border-b border-white/10 overflow-x-auto">
          {ADMIN_TABS.map((tab) => {
            const active = pathname === tab.href;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`px-3 py-2.5 text-sm font-medium border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
                  active ? 'border-red-500 text-white' : 'border-transparent text-zinc-500 hover:text-white'
                }`}
              >
                <i className={`fa-solid ${tab.icon} text-xs`} />
                {t(tab.labelKey)}
              </Link>
            );
          })}
        </nav>

        {children}
      </div>
    </div>
  );
}