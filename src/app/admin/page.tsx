// src/app/admin/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useLang } from '@/hooks/useLang';
import { getDateLocale } from '@/lib/formatUtils';

interface AuditEntry {
  id: string;
  action: string;
  actor: string;
  target?: string;
  createdAt: string;
}

interface AdminStats {
  totalServers: number;
  totalUsers: number;
  totalLogs: number;
}

export default function AdminOverviewPage() {
  const { t, lang } = useLang();
  const [stats, setStats] = useState<AdminStats>({ totalServers: 0, totalUsers: 0, totalLogs: 0 });
  const [audit, setAudit] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [s, a] = await Promise.all([
          fetch('/api/admin/stats', { credentials: 'include' }).then((r) => r.ok ? r.json() : null),
          fetch('/api/admin/audit?limit=20', { credentials: 'include' }).then((r) => r.ok ? r.json() : []),
        ]);
        if (s) setStats(s);
        setAudit(a ?? []);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const AUDIT_KEYS: Record<string, string> = {
    update_webhook: 'audit_action_update_webhook',
    download_antidump_script: 'audit_action_download_antidump_script',
    create_server: 'audit_action_create_server',
    update_server: 'audit_action_update_server',
    delete_server: 'audit_action_delete_server',
    create_cdn_gist_server: 'audit_action_create_cdn_gist_server',
    update_cdn_gist_server: 'audit_action_update_cdn_gist_server',
    delete_cdn_gist_server: 'audit_action_delete_cdn_gist_server',
    reset_peer_ip_lock: 'audit_action_reset_peer_ip_lock',
    rotate_api_key: 'audit_action_rotate_api_key',
    generate_peer_key: 'audit_action_generate_peer_key',
    add_ip_filter: 'audit_action_add_ip_filter',
    update_ip_filter: 'audit_action_update_ip_filter',
    delete_ip_filter: 'audit_action_delete_ip_filter',
    add_server_user: 'audit_action_add_server_user',
    remove_server_user: 'audit_action_remove_server_user',
    set_server_admin: 'audit_action_set_server_admin',
    remove_server_admin: 'audit_action_remove_server_admin',
    create_global_ban: 'audit_action_create_global_ban',
    delete_global_ban: 'audit_action_delete_global_ban',
    update_user_role: 'audit_action_update_user_role',
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-zinc-500">{t('admin_total_servers')}</p>
              <p className="text-3xl font-bold mt-1">{stats.totalServers.toLocaleString()}</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
              <i className="fa-solid fa-server text-red-400" />
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-zinc-500">{t('admin_total_users')}</p>
              <p className="text-3xl font-bold mt-1">{stats.totalUsers.toLocaleString()}</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
              <i className="fa-solid fa-users text-amber-400" />
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-zinc-500">{t('admin_total_logs')}</p>
              <p className="text-3xl font-bold mt-1">{stats.totalLogs.toLocaleString()}</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <i className="fa-solid fa-list text-emerald-400" />
            </div>
          </div>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="p-4 border-b border-white/5">
          <h2 className="font-semibold">{t('admin_recent_audit')}</h2>
        </div>
        <div className="divide-y divide-white/[0.03]">
          {loading ? (
            <div className="p-6 text-center text-sm text-zinc-500">{t('gen_loading')}</div>
          ) : audit.length === 0 ? (
            <div className="p-6 text-center text-sm text-zinc-500">{t('admin_no_audit')}</div>
          ) : audit.map((entry) => (
            <div key={entry.id} className="px-4 py-3 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-medium">{t(AUDIT_KEYS[entry.action] || entry.action)}</p>
                <p className="text-xs text-zinc-500">
                  {entry.actor} {entry.target && `→ ${entry.target}`}
                </p>
              </div>
              <span className="text-xs text-zinc-500 whitespace-nowrap">
                {new Date(entry.createdAt).toLocaleString(getDateLocale(lang))}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}