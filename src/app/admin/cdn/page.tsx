// src/app/admin/cdn/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useLang } from '@/hooks/useLang';

interface CdnServer {
  id: string;
  target: string;
  targetPath?: string;
  omitFilesPath: boolean;
  storage: 'external' | 'r2';
  r2Prefix?: string;
  panelLinked: boolean;
}

const EMPTY_FORM: Omit<CdnServer, 'panelLinked'> = {
  id: '',
  target: '',
  targetPath: '',
  omitFilesPath: false,
  storage: 'external',
  r2Prefix: '',
};

export default function CdnServersPage() {
  const { t } = useLang();
  const [servers, setServers] = useState<CdnServer[]>([]);
  const [loading, setLoading] = useState(true);
  const [tokenMissing, setTokenMissing] = useState(false);
  const [editing, setEditing] = useState<CdnServer | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/cdn/servers', { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setServers(data.servers ?? data);
        setTokenMissing(!!data.tokenMissing);
      } else {
        setToast({ type: 'error', msg: t('cdn_load_error') });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const notify = (type: 'success' | 'error', msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4000);
  };

  const openCreate = () => {
    setForm(EMPTY_FORM);
    setEditing(null);
    setCreating(true);
  };

  const openEdit = (s: CdnServer) => {
    setForm({
      id: s.id,
      target: s.target,
      targetPath: s.targetPath ?? '',
      omitFilesPath: s.omitFilesPath,
      storage: s.storage,
      r2Prefix: s.r2Prefix ?? '',
    });
    setEditing(s);
    setCreating(false);
  };

  const save = async () => {
    setSaving(true);
    try {
      const payload = {
        id: form.id.trim(),
        target: form.target.trim(),
        targetPath: form.targetPath?.trim() || undefined,
        omitFilesPath: form.omitFilesPath,
        storage: form.storage,
        r2Prefix: form.r2Prefix?.trim() || undefined,
      };
      const url = editing ? `/api/admin/cdn/servers/${editing.id}` : '/api/admin/cdn/servers';
      const method = editing ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        notify('success', editing ? t('cdn_updated') : t('cdn_created'));
        setCreating(false);
        setEditing(null);
        await load();
      } else {
        notify('error', t('cdn_save_error'));
      }
    } catch {
      notify('error', t('cdn_save_error'));
    } finally {
      setSaving(false);
    }
  };

  const remove = async (s: CdnServer) => {
    if (!confirm(t('cdn_delete_confirm').replace('{id}', s.id))) return;
    const res = await fetch(`/api/admin/cdn/servers/${s.id}`, { method: 'DELETE', credentials: 'include' });
    if (res.ok) {
      notify('success', t('cdn_deleted'));
      await load();
    } else {
      notify('error', t('cdn_save_error'));
    }
  };

  const previewTarget = (f: typeof EMPTY_FORM) => {
    if (f.storage === 'r2') {
      const prefix = f.r2Prefix || f.id;
      return `R2: ${prefix}/files/...`;
    }
    const base = f.target.replace(/\/$/, '');
    const tp = f.targetPath ? f.targetPath.replace(/^\//, '') : '';
    const files = f.omitFilesPath ? '' : 'files/';
    return `${base}/${tp ? tp + '/' : ''}${files}example.lua`;
  };

  const formOpen = creating || !!editing;
  const isEdit = !!editing;

  return (
    <div className="space-y-4">
      {toast && (
        <div className={`p-3 rounded-lg text-sm ${toast.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/10 text-red-400 border border-red-500/30'}`}>
          {toast.msg}
        </div>
      )}

      {tokenMissing && (
        <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-sm text-amber-300">
          <i className="fa-solid fa-triangle-exclamation mr-2" />
          {t('cdn_token_missing')}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">{t('cdn_title')}</h2>
          <p className="text-xs text-zinc-500">{t('cdn_subtitle')}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={load} className="btn-secondary">
            <i className="fa-solid fa-rotate" /> {t('cdn_refresh')}
          </button>
          <button onClick={openCreate} className="btn-primary">
            <i className="fa-solid fa-plus" /> {t('cdn_add')}
          </button>
          <a
            href="https://gist.github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost text-xs"
          >
            <i className="fa-solid fa-clock-rotate-left" /> {t('cdn_view_history')}
          </a>
        </div>
      </div>

      <div className="text-xs text-zinc-500">{servers.length} {t('cdn_servers_count')}</div>

      <div className="card overflow-hidden">
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>{t('cdn_identifier')}</th>
                <th>{t('cdn_target')}</th>
                <th>{t('cdn_storage')}</th>
                <th>{t('cdn_panel_linked')}</th>
                <th>{t('gen_actions')}</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="text-center py-8 text-zinc-400">{t('gen_loading')}</td></tr>
              ) : servers.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-8 text-zinc-400">{t('admin_no_audit')}</td></tr>
              ) : servers.map((s) => (
                <tr key={s.id}>
                  <td className="font-mono text-sm font-semibold">{s.id}</td>
                  <td className="text-xs font-mono text-zinc-400 max-w-[280px] truncate">{s.target}{s.targetPath ?? ''}</td>
                  <td>
                    <span className="badge badge-gray text-[10px]">
                      {s.storage === 'r2' ? 'R2' : t('cdn_external')}
                    </span>
                  </td>
                  <td>
                    {s.panelLinked ? (
                      <span className="badge badge-green text-[10px]">{t('cdn_panel_linked')}</span>
                    ) : (
                      <span className="badge badge-gray text-[10px]">{t('cdn_panel_missing')}</span>
                    )}
                  </td>
                  <td>
                    <div className="flex items-center gap-1">
                      <button onClick={() => openEdit(s)} className="btn-ghost text-xs p-1.5">
                        <i className="fa-solid fa-pen" />
                      </button>
                      <button onClick={() => remove(s)} className="btn-danger text-xs p-1.5">
                        <i className="fa-solid fa-trash" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-xs text-zinc-500">
        {t('cdn_panel_note')}{' '}
        <a href="/admin/servers" className="text-red-400 hover:text-red-300 underline">
          {t('admin_tab_servers')}
        </a>.
      </p>

      {/* Form modal */}
      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-bg-card border border-white/10 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 space-y-4">
            <h3 className="text-lg font-bold">{isEdit ? t('cdn_edit_title') : t('cdn_new_title')}</h3>

            <div>
              <label className="block text-sm font-medium mb-2">{t('cdn_identifier')}</label>
              <input
                className="input font-mono"
                value={form.id}
                onChange={(e) => setForm({ ...form, id: e.target.value })}
                disabled={isEdit}
                placeholder="my-cdn-server"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">{t('cdn_storage')}</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setForm({ ...form, storage: 'external' })}
                  className={`flex-1 p-2 rounded-lg border text-sm ${form.storage === 'external' ? 'border-red-500 bg-red-500/10' : 'border-white/10'}`}
                >
                  {t('cdn_external')}
                </button>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, storage: 'r2' })}
                  className={`flex-1 p-2 rounded-lg border text-sm ${form.storage === 'r2' ? 'border-red-500 bg-red-500/10' : 'border-white/10'}`}
                >
                  R2
                </button>
              </div>
            </div>

            {form.storage === 'external' ? (
              <>
                <div>
                  <label className="block text-sm font-medium mb-2">{t('cdn_target')}</label>
                  <input
                    className="input font-mono text-sm"
                    value={form.target}
                    onChange={(e) => setForm({ ...form, target: e.target.value })}
                    placeholder="https://origin.example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">{t('cdn_target_path')}</label>
                  <input
                    className="input font-mono text-sm"
                    value={form.targetPath}
                    onChange={(e) => setForm({ ...form, targetPath: e.target.value })}
                    placeholder="/sub/path"
                  />
                  <p className="text-xs text-zinc-500 mt-1">{t('cdn_target_path_hint')}</p>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-white/[0.02] border border-white/5">
                  <div>
                    <p className="text-sm font-medium">{t('cdn_omit_files_path')}</p>
                    <p className="text-xs text-zinc-500">{t('cdn_omit_files_path_hint')}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.omitFilesPath}
                      onChange={(e) => setForm({ ...form, omitFilesPath: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-zinc-700 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-red-600" />
                  </label>
                </div>
              </>
            ) : (
              <div>
                <label className="block text-sm font-medium mb-2">{t('cdn_r2_prefix')}</label>
                <input
                  className="input font-mono text-sm"
                  value={form.r2Prefix}
                  onChange={(e) => setForm({ ...form, r2Prefix: e.target.value })}
                />
                <p className="text-xs text-zinc-500 mt-1">{t('cdn_r2_prefix_hint')}</p>
              </div>
            )}

            <div className="p-3 rounded-lg bg-black/40 border border-white/5">
              <p className="text-xs text-zinc-500 mb-1">{t('cdn_preview')}</p>
              <p className="font-mono text-xs break-all">{previewTarget(form)}</p>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => { setCreating(false); setEditing(null); }}
                className="btn-ghost"
              >
                {t('gen_cancel')}
              </button>
              <button
                onClick={save}
                disabled={saving || !form.id.trim() || (form.storage === 'external' && !form.target.trim())}
                className="btn-primary"
              >
                {saving ? t('gen_loading') : t('gen_save')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}