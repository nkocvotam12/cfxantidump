// src/app/admin/global-bans/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useLang } from '@/hooks/useLang';

interface GlobalBan {
  id: string;
  ip: string;
  reason: string;
  serverName?: string;
  createdAt: string;
}

interface HistoryEntry {
  id: string;
  ip: string;
  serverName: string;
  bannedAt: string;
  unbannedAt?: string;
}

const BAN_REASONS = [
  { value: 'Cheating', key: 'ban_reason_cheating' },
  { value: 'Script dumping', key: 'ban_reason_script_dumping' },
  { value: 'DDoS', key: 'ban_reason_ddos' },
  { value: 'Abuse', key: 'ban_reason_abuse' },
  { value: 'Other', key: 'ban_reason_other' },
];

export default function GlobalBansPage() {
  const { t } = useLang();
  const [bans, setBans] = useState<GlobalBan[]>([]);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [showHistory, setShowHistory] = useState<string | null>(null);
  const [newIp, setNewIp] = useState('');
  const [newReason, setNewReason] = useState('Cheating');
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/global-bans', { credentials: 'include' });
      if (res.ok) setBans(await res.json());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const loadHistory = async (ip: string) => {
    setShowHistory(ip);
    try {
      const res = await fetch(`/api/admin/global-bans/history?ip=${encodeURIComponent(ip)}`, { credentials: 'include' });
      if (res.ok) setHistory(await res.json());
    } catch (e) {
      console.error(e);
    }
  };

  const unban = async (id: string) => {
    if (!confirm(t('server_bans_unban_confirm'))) return;
    await fetch(`/api/admin/global-bans/${id}`, { method: 'DELETE', credentials: 'include' });
    load();
  };

  const addBan = async () => {
    if (!newIp.trim()) return;
    setSaving(true);
    try {
      const res = await fetch('/api/admin/global-bans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ ip: newIp.trim(), reason: newReason }),
      });
      if (res.ok) {
        setShowAdd(false);
        setNewIp('');
        await load();
      }
    } finally {
      setSaving(false);
    }
  };

  const filtered = bans.filter((b) =>
    !search || b.ip.includes(search) || b.reason.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t('nav_global_bans')}</h1>
        </div>
        <button onClick={() => setShowAdd(true)} className="btn-primary">
          <i className="fa-solid fa-ban" /> {t('admin_global_bans_add')}
        </button>
      </div>

      <div className="card p-4">
        <input
          className="input"
          placeholder={t('admin_global_bans_search')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="card overflow-hidden">
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>IP</th>
                <th>{t('admin_global_bans_col_reason')}</th>
                <th>{t('admin_global_bans_last_server')}</th>
                <th>{t('col_time')}</th>
                <th>{t('gen_actions')}</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="text-center py-8 text-zinc-400">{t('gen_loading')}</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-8 text-zinc-400">{t('admin_global_bans_no_results')}</td></tr>
              ) : filtered.map((ban) => (
                <tr key={ban.id}>
                  <td className="font-mono text-sm">{ban.ip}</td>
                  <td>{ban.reason}</td>
                  <td className="text-xs text-zinc-400">{ban.serverName || '—'}</td>
                  <td className="text-xs">{new Date(ban.createdAt).toLocaleString()}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <button onClick={() => loadHistory(ban.ip)} className="btn-ghost text-xs">
                        <i className="fa-solid fa-clock-rotate-left" /> {t('admin_global_bans_history')}
                      </button>
                      <button onClick={() => unban(ban.id)} className="btn-danger text-xs">
                        <i className="fa-solid fa-unlock" /> {t('admin_global_bans_unban')}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-bg-card border border-white/10 rounded-2xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-lg font-bold">{t('admin_global_bans_add_title')}</h3>
            <div>
              <label className="block text-sm font-medium mb-2">IP</label>
              <input className="input" placeholder={t('admin_global_bans_ip_ph')} value={newIp} onChange={(e) => setNewIp(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">{t('admin_global_bans_reason_label')}</label>
              <select className="input" value={newReason} onChange={(e) => setNewReason(e.target.value)}>
                {BAN_REASONS.map((r) => <option key={r.value} value={r.value}>{t(r.key)}</option>)}
              </select>
            </div>
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowAdd(false)} className="btn-ghost">{t('gen_cancel')}</button>
              <button onClick={addBan} disabled={saving || !newIp.trim()} className="btn-primary">
                {saving ? t('admin_global_bans_saving') : t('gen_save')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* History modal */}
      {showHistory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={() => setShowHistory(null)}>
          <div className="bg-bg-card border border-white/10 rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold mb-4">{t('admin_global_bans_history_title')} {showHistory}</h3>
            {history.length === 0 ? (
              <p className="text-sm text-zinc-500 text-center py-6">{t('admin_global_bans_no_history')}</p>
            ) : (
              <div className="space-y-2">
                {history.map((h) => (
                  <div key={h.id} className="p-3 rounded-lg bg-white/[0.02] border border-white/5 text-sm">
                    <p className="font-semibold">{h.serverName}</p>
                    <p className="text-xs text-zinc-500">{t('admin_global_bans_banned_at')} {new Date(h.bannedAt).toLocaleString()}</p>
                    {h.unbannedAt && <p className="text-xs text-emerald-400">{t('admin_global_bans_unbanned_at')} {new Date(h.unbannedAt).toLocaleString()}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}