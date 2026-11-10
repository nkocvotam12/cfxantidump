// src/components/layout/Sidebar.tsx
'use client';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLang } from '@/hooks/useLang';

const NAV_ITEMS = [
  { href: '/dashboard', icon: 'fa-gauge-high', labelKey: 'nav_dashboard' },
  { href: '/dashboard/logs', icon: 'fa-list', labelKey: 'nav_logs' },
  { href: '/dashboard/server-bans', icon: 'fa-ban', labelKey: 'nav_server_bans' },
  { href: '/dashboard/iplists', icon: 'fa-network-wired', labelKey: 'nav_iplists' },
  { href: '/dashboard/discord', icon: 'fa-brands fa-discord', labelKey: 'nav_discord' },
  { href: '/dashboard/artifacts-ad', icon: 'fa-shield-halved', labelKey: 'nav_artifacts_ad' },
  { href: '/dashboard/debug', icon: 'fa-bug', labelKey: 'nav_debug' },
  { href: '/dashboard/team', icon: 'fa-users', labelKey: 'nav_team' },
  { href: '/dashboard/settings', icon: 'fa-gear', labelKey: 'nav_settings' },
  { href: '/admin', icon: 'fa-user-shield', labelKey: 'nav_admin' },
];

export function Sidebar() {
  const pathname = usePathname();
  const { t } = useLang();

  return (
    <aside className="hidden lg:flex w-60 flex-col bg-black/40 backdrop-blur-md border-r border-white/5 p-4 shrink-0 justify-between">
      <div>
        <div className="flex items-center gap-3 px-2 py-3 mb-6">
          <div className="relative w-9 h-9">
            <Image src="/antidumpicon.png" alt="CFX AntiDump" fill className="object-contain" sizes="36px" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold truncate">CFX AntiDump</p>
            <p className="text-[10px] text-zinc-500 truncate">{t('sidebar_security_panel')}</p>
          </div>
        </div>

        <nav className="space-y-1.5">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`sidebar-item ${pathname === item.href ? 'active' : ''}`}
            >
              <i className={`fa-solid ${item.icon} w-4 text-center`} />
              <span className="text-sm">{t(item.labelKey)}</span>
            </Link>
          ))}
        </nav>
      </div>

      <div className="pt-4 border-t border-white/5">
        <button
          type="button"
          onClick={async () => {
            await fetch('/auth/logout', { method: 'POST', credentials: 'include' });
            window.location.href = '/';
          }}
          className="sidebar-item w-full text-left"
        >
          <i className="fa-solid fa-right-from-bracket w-4 text-center" />
          <span className="text-sm">{t('sidebar_logout')}</span>
        </button>
      </div>
    </aside>
  );
}