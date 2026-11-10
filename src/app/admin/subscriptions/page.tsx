// src/app/admin/subscriptions/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useLang } from '@/hooks/useLang';
import { subscriptionStatus } from '@/lib/formatUtils';

interface Subscription {
  id: string;
  productName: string;
  status: string;
  customerEmail?: string;
  discordUserId?: string;
  serverId?: string;
  serverDomain?: string;
  currentPeriodEnd?: string;
  hidden: boolean;
}

type Filter = 'active' | 'expired' | 'unassigned' | 'all' | 'hidden';

export default function AdminSubscriptionsPage() {
  const { t, lang } = useLang();
  const [subs, setSubs] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>('active');
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<Subscription | null>(null);
  const [discordInput, setDiscordInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/subscriptions', { credentials: 'include' });
      if (res.ok) setSubs(await res.json());
      else setToast({ type: 'error', msg: t('admin_subscriptions_error') });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const notify = (type: 'success' | 'error', msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4000);
  };

  const filtered = subs.filter((s) => {
    if (filter === 'active' && !['active', 'trialing', 'past_due'].includes(s.status)) return false;
    if (filter === 'expired' && !['canceled', 'unpaid', 'incomplete_expired'].includes(s.status)) return false;
    if (filter === 'unassigned' && s.discordUserId) return false;
    if (filter === 'hidden' && !s.hidden) return false;
    if (filter !== 'hidden' && s.hidden) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        s.productName.toLowerCase().includes(q) ||
        (s.customerEmail || '').toLowerCase().includes(q) ||
        (s.discordUserId || '').includes(q) ||
        (s.serverDomain || '').toLowerCase().includes(q) ||
        s.id.includes(q)
      );
    }
    return true;
  });

  const openLink = (s: Subscription) => {
    setEditing(s);
    setDiscordInput(s.discordUserId ?? '');
  };

  const saveLink = async () => {
    if (!editing) return;
    if (discordInput && !/^\d{17,20}$/.test(discordInput.trim())) {
      notify('error', t('admin_subscriptions_invalid_discord'));
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/subscriptions/${editing.id}/link`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ discordUserId: discordInput.trim() || null }),
      });
      if (res.ok) {
        notify('success', t('admin_subscriptions_saved'));
        setEditing(null);
        await load();
      } else {
        notify('error', t('admin_subscriptions_save_error'));
      }
    } finally {
      setSaving(false);
    }
  };

  const toggleVisibility = async (s: Subscription) => {
    const res = await fetch(`/api/admin/subscriptions/${s.id}/visibility`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ hidden: !s.hidden }),
    });
    if (res.ok) {
      notify('success', t('admin_subscriptions_visibility_saved'));
      await load();
    } else {
      notify('error', t('admin_subscriptions_visibility_error'));
    }
  };

  const FILTERS: Array<{ key: Filter; labelKey: string }> = [
    { key: 'active', labelKey: 'admin_subscriptions_active' },
    { key: 'expired', labelKey: 'admin_subscriptions_expired' },
    { key: 'unassigned', labelKey: 'admin_subscriptions_unassigned' },
    { key: 'all', labelKey: 'admin_subscriptions_all' },
    { key: 'hidden', labelKey: 'admin_subscriptions_hidden' },
  ];

  return (
    <div className="space-y-4">
      {toast && (
        <div className={`p-3 rounded-lg text-sm ${toast.type === 'success' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
          {toast.msg}
        </div>
      )}

      <div className="card p-4">
        <input
          className="input"
          placeholder={t('admin_subscriptions_search')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              filter === f.key ? 'bg-red-600 text-white' : 'bg-white/5 text-zinc-400 hover:text-white'
            }`}
          >
            {t(f.labelKey)}
          </button>
        ))}
      </div>

      <div className="card overflow-hidden">
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>{t('admin_subs_col_product')}</th>
                <th>{t('admin_subs_col_user')}</th>
                <th>{t('admin_subscriptions_server')}</th>
                <th>{t('admin_subs_col_status')}</th>
                <th>{t('admin_subscriptions_metadata')}</th>
                <th>{t('gen_actions')}</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="text-center py-8 text-zinc-400">{t('gen_loading')}</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-8 text-zinc-400">{t('admin_subscriptions_none')}</td></tr>
              ) : filtered.map((s) => (
                <tr key={s.id} className={s.hidden ? 'opacity-60' : ''}>
                  <td>
                    <p className="font-semibold text-sm">{s.productName}</p>
                    {s.customerEmail && <p className="text-xs text-zinc-500">{s.customerEmail}</p>}
                  </td>
                  <td className="font-mono text-xs">
                    {s.discordUserId ? (
                      <span className="text-emerald-400">{s.discordUserId}</span>
                    ) : (
                      <span className="text-zinc-500">{t('admin_subscriptions_unassigned')}</span>
                    )}
                  </td>
                  <td className="text-xs text-zinc-400">{s.serverDomain || '—'}</td>
                  <td>
                    <span className={`badge ${s.status === 'active' ? 'badge-green' : s.status === 'past_due' ? 'badge-yellow' : 'badge-gray'} text-[10px]`}>
                      {subscriptionStatus(lang, s.status)}
                    </span>
                  </td>
                  <td className="font-mono text-[10px] text-zinc-500 max-w-[140px] truncate">{s.id}</td>
                  <td>
                    <div className="flex items-center gap-1">
                      <button onClick={() => openLink(s)} className="btn-ghost text-xs p-1.5" title={t('admin_subs_link_user')}>
                        <i className="fa-solid fa-link" />
                      </button>
                      <button onClick={() => toggleVisibility(s)} className="btn-ghost text-xs p-1.5" title={s.hidden ? t('admin_subscriptions_show') : t('admin_subscriptions_hide')}>
                        <i className={`fa-solid ${s.hidden ? 'fa-eye' : 'fa-eye-slash'}`} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-bg-card border border-white/10 rounded-2xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-lg font-bold">{t('admin_subscriptions_user')}</h3>
            <p className="text-sm text-zinc-400">{editing.productName}</p>
            <input
              className="input font-mono"
              placeholder={t('admin_subscriptions_discord_placeholder')}
              value={discordInput}
              onChange={(e) => setDiscordInput(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <button onClick={() => setEditing(null)} className="btn-ghost">{t('gen_cancel')}</button>
              <button onClick={saveLink} disabled={saving} className="btn-primary">
                {saving ? t('gen_loading') : t('gen_save')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}