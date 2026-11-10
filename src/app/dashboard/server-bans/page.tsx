// src/app/dashboard/server-bans/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useLang } from '@/hooks/useLang';

interface Ban {
  id: string;
  ip: string;
  reason: string;
  bannedAt: string;
  attempts: number;
}

export default function ServerBansPage() {
  const { t } = useLang();
  const [bans, setBans] = useState<Ban[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/server-bans', { credentials: 'include' });
      if (res.ok) setBans(await res.json());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const unban = async (ban: Ban) => {
    if (!confirm(t('server_bans_unban_confirm'))) return;
    const res = await fetch(`/api/server-bans/${ban.id}`, { method: 'DELETE', credentials: 'include' });
    if (res.ok) await load();
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">{t('server_bans_title')}</h1>
        <p className="text-sm text-zinc-400 mt-1">{t('server_bans_subtitle')}</p>
      </div>

      <div className="card overflow-hidden">
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>{t('col_ip')}</th>
                <th>{t('admin_global_bans_col_reason')}</th>
                <th>{t('col_time')}</th>
                <th>{t('logs_col_intentos')}</th>
                <th>{t('gen_actions')}</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="text-center py-8 text-zinc-400">{t('gen_loading')}</td></tr>
              ) : bans.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-8 text-zinc-400">{t('server_bans_empty')}</td></tr>
              ) : bans.map((b) => (
                <tr key={b.id}>
                  <td className="font-mono text-sm">{b.ip}</td>
                  <td className="text-sm">{b.reason}</td>
                  <td className="text-xs text-zinc-500">{new Date(b.bannedAt).toLocaleString()}</td>
                  <td className="text-sm">{b.attempts}</td>
                  <td>
                    <button onClick={() => unban(b)} className="btn-danger text-xs">
                      <i className="fa-solid fa-unlock" /> {t('admin_global_bans_unban')}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}