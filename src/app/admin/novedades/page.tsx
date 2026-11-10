// src/app/admin/novedades/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useLang } from '@/hooks/useLang';

interface News {
  id: string;
  title: string;
  body: string;
  type: 'update' | 'info' | 'warning' | 'maintenance';
  pinned: boolean;
  author: string;
  createdAt: string;
}

const EMPTY: Omit<News, 'id' | 'author' | 'createdAt'> = {
  title: '',
  body: '',
  type: 'info',
  pinned: false,
};

export default function NovedadesPage() {
  const { t } = useLang();
  const [items, setItems] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/novedades', { credentials: 'include' });
      if (res.ok) setItems(await res.json());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const notify = (type: 'success' | 'error', msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4000);
  };

  const save = async () => {
    if (!form.title.trim() || !form.body.trim()) return;
    setSaving(true);
    try {
      const url = editingId ? `/api/admin/novedades/${editingId}` : '/api/admin/novedades';
      const method = editingId ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(form),
      });
      if (res.ok) {
        notify('success', editingId ? t('Announcement updated') : t('Announcement published'));
        setForm(EMPTY);
        setEditingId(null);
        await load();
      } else {
        notify('error', t('Error saving'));
      }
    } finally {
      setSaving(false);
    }
  };

  const edit = (item: News) => {
    setForm({ title: item.title, body: item.body, type: item.type, pinned: item.pinned });
    setEditingId(item.id);
  };

  const remove = async (item: News) => {
    if (!confirm(t('Delete this announcement?'))) return;
    const res = await fetch(`/api/admin/novedades/${item.id}`, { method: 'DELETE', credentials: 'include' });
    if (res.ok) {
      notify('success', t('Announcement deleted'));
      await load();
    } else {
      notify('error', t('Error deleting'));
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[380px_minmax(0,1fr)] gap-4">
      {toast && (
        <div className={`lg:col-span-2 p-3 rounded-lg text-sm ${toast.type === 'success' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
          {toast.msg}
        </div>
      )}

      <div className="card p-4 space-y-3 h-fit">
        <h2 className="font-semibold">{editingId ? t('nov_edit') : t('nov_new')}</h2>

        <div>
          <label className="block text-xs font-medium mb-1.5">{t('nov_title')}</label>
          <input
            className="input"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder={t('Example: Update v2.1 — New feature')}
          />
        </div>

        <div>
          <label className="block text-xs font-medium mb-1.5">{t('nov_body')}</label>
          <textarea
            className="input min-h-[120px] resize-none"
            value={form.body}
            onChange={(e) => setForm({ ...form, body: e.target.value })}
            placeholder={t('Describe important changes, maintenance or notices…')}
          />
        </div>

        <div>
          <label className="block text-xs font-medium mb-1.5">{t('nov_type')}</label>
          <select className="input" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as any })}>
            <option value="update">{t('ann_update')}</option>
            <option value="info">{t('ann_info')}</option>
            <option value="warning">{t('ann_warning')}</option>
            <option value="maintenance">{t('ann_maintenance')}</option>
          </select>
        </div>

        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input
            type="checkbox"
            checked={form.pinned}
            onChange={(e) => setForm({ ...form, pinned: e.target.checked })}
            className="w-4 h-4 accent-red-600"
          />
          {t('nov_pinned')}
        </label>

        <div className="flex gap-2">
          {editingId && (
            <button
              onClick={() => { setForm(EMPTY); setEditingId(null); }}
              className="btn-ghost flex-1"
            >
              {t('nov_cancel')}
            </button>
          )}
          <button
            onClick={save}
            disabled={saving || !form.title.trim() || !form.body.trim()}
            className="btn-primary flex-1"
          >
            {saving ? t('nov_saving') : editingId ? t('nov_update') : t('nov_publish')}
          </button>
        </div>
      </div>

      <div className="card">
        <div className="p-4 border-b border-white/5">
          <h2 className="font-semibold">{t('nov_list')} ({items.length})</h2>
        </div>
        <div className="divide-y divide-white/[0.03]">
          {loading ? (
            <div className="p-6 text-center text-sm text-zinc-500">{t('gen_loading')}</div>
          ) : items.length === 0 ? (
            <div className="p-6 text-center text-sm text-zinc-500">{t('nov_no_items')}</div>
          ) : items.map((item) => (
            <div key={item.id} className="p-4">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="badge badge-gray text-[10px]">{t(`ann_${item.type}` as any) || item.type}</span>
                    {item.pinned && <span className="badge badge-red text-[10px]">{t('nov_pinned_badge')}</span>}
                  </div>
                  <p className="font-semibold">{item.title}</p>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => edit(item)} className="btn-ghost text-xs p-1.5">
                    <i className="fa-solid fa-pen" />
                  </button>
                  <button onClick={() => remove(item)} className="btn-danger text-xs p-1.5">
                    <i className="fa-solid fa-trash" />
                  </button>
                </div>
              </div>
              <p className="text-sm text-zinc-400 whitespace-pre-wrap">{item.body}</p>
              <p className="text-xs text-zinc-500 mt-2">
                {t('nov_by')} {item.author} • {new Date(item.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}