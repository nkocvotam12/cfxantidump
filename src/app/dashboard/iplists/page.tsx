// src/app/dashboard/iplists/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useLang } from '@/hooks/useLang';

type ListType = 'whitelist' | 'blacklist' | 'ignore';

interface IpEntry {
  id: string;
  value: string;
  note?: string;
  createdAt: string;
}

const TABS: Array<{ key: ListType; labelKey: string; color: string }> = [
  { key: 'whitelist', labelKey: 'Whitelist', color: 'text-emerald-400' },
  { key: 'blacklist', labelKey: 'Blacklist', color: 'text-red-400' },
  { key: 'ignore', labelKey: 'Ignore', color: 'text-zinc-400' },
];

export default function IpListsPage() {
  const { t } = useLang();
  const [tab, setTab] = useState<ListType>('whitelist');
  const [lists, setLists] = useState<Record<ListType, IpEntry[]>>({ whitelist: [], blacklist: [], ignore: [] });
  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState('');
  const [note, setNote] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/ip-filters', { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setLists({ whitelist: data.whitelist ?? [], blacklist: data.blacklist ?? [], ignore: data.ignore ?? [] });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const addEntry = async () => {
    const value = input.trim();
    if (!value) return;
    try {
      const res = await fetch('/api/ip-filters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ list: tab, value, note: note.trim() || undefined }),
      });
      if (res.ok) {
        setInput('');
        setNote('');
        await load();
      }
    } catch (e) {
      console.error('Failed to add filter', e);
    }
  };

  const removeEntry = async (id: string) => {
    try {
      const res = await fetch(`/api/ip-filters/${id}`, { method: 'DELETE', credentials: 'include' });
      if (res.ok) await load();
    } catch (e) {
      console.error('Failed to remove filter', e);
    }
  };

  const items = lists[tab];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{t('nav_iplists')}</h1>
        <p className="text-sm text-zinc-400 mt-1">{t('iplists_subtitle')}</p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10">
        {TABS.map((tb) => (
          <button
            key={tb.key}
            onClick={() => setTab(tb.key)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              tab === tb.key ? `border-red-500 ${tb.color}` : 'border-transparent text-zinc-500 hover:text-white'
            }`}
          >
            {t(tb.labelKey)} ({lists[tb.key].length})
          </button>
        ))}
      </div>

      {/* Add form */}
      <div className="card p-4">
        <label className="block text-sm font-medium mb-2">{t('Add to')} {t(TABS.find((x) => x.key === tab)!.labelKey)}</label>
        <div className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-2">
          <input
            className="input"
            placeholder="192.168.1.1 or 10.0.0.0/24"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addEntry()}
          />
          <input
            className="input"
            placeholder={t('Note (optional)')}
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
          <button onClick={addEntry} className="btn-primary">
            <i className="fa-solid fa-plus" /> {t('Add')}
          </button>
        </div>
      </div>

      {/* List */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-zinc-400">{t('gen_loading')}</div>
        ) : items.length === 0 ? (
          <div className="p-8 text-center">
            <p className="font-semibold">{t('No')} {t('entries yet')}</p>
            <p className="text-xs text-zinc-500 mt-1">{t('Add IPs above to get started')}</p>
          </div>
        ) : (
          <div className="divide-y divide-white/[0.03]">
            {items.map((entry) => (
              <div key={entry.id} className="p-4 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-mono text-sm">{entry.value}</p>
                  {entry.note && <p className="text-xs text-zinc-500 mt-0.5">{entry.note}</p>}
                  <p className="text-[11px] text-zinc-600 mt-0.5">{new Date(entry.createdAt).toLocaleString()}</p>
                </div>
                <button onClick={() => removeEntry(entry.id)} className="btn-danger text-xs">
                  <i className="fa-solid fa-trash" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}