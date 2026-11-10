// src/app/admin/servers/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useLang } from '@/hooks/useLang';

interface Server {
  id: string;
  label: string;
  domain: string | null;
  ownerId: string | null;
  ownerUsername: string | null;
  eventsCount: number;
  usersCount: number;
  webhookEnabled: boolean;
  lockedIp?: string | null;
}

interface ServerKeysInfo {
  serverId: string;
  apiKey: string;
  peerKey: string;
  lockedIp: string | null;
}

export default function AdminServersPage() {
  const { t } = useLang();
  const [servers, setServers] = useState<Server[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ label: '', domain: '', ownerId: '' });
  const [creating, setCreating] = useState(false);
  const [keysModal, setKeysModal] = useState<ServerKeysInfo | null>(null);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/servers', { credentials: 'include' });
      if (res.ok) setServers(await res.json());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const notify = (type: 'success' | 'error', msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4000);
  };

  const createServer = async () => {
    if (!form.label.trim()) return;
    setCreating(true);
    try {
      const res = await fetch('/api/admin/servers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          label: form.label.trim(),
          domain: form.domain.trim() || undefined,
          ownerId: form.ownerId.trim() || undefined,
        }),
      });
      if (res.ok) {
        notify('success', t('Server created successfully'));
        setShowCreate(false);
        setForm({ label: '', domain: '', ownerId: '' });
        await load();
      } else {
        notify('error', t('Failed to create server'));
      }
    } finally {
      setCreating(false);
    }
  };

  const deleteServer = async (server: Server) => {
    if (!confirm(t('Delete this server and ALL its data? This cannot be undone.'))) return;
    try {
      const res = await fetch(`/api/admin/servers/${server.id}`, { method: 'DELETE', credentials: 'include' });
      if (res.ok) {
        notify('success', t('Server deleted'));
        await load();
      } else {
        notify('error', t('Failed to delete server'));
      }
    } catch {
      notify('error', t('Failed to delete server'));
    }
  };

  const manageKeys = async (serverId: string, action: 'reveal' | 'rotate_api_key' | 'generate_peer_key' | 'reset_ip_lock') => {
    try {
      const res = await fetch(`/api/admin/servers/${serverId}/keys`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ action }),
      });
      if (res.ok) {
        const info = (await res.json()) as ServerKeysInfo;
        setKeysModal(info);
        if (action === 'reset_ip_lock') {
          notify('success', t('IP lock reset. The next script authentication will set the new IP.'));
          await load();
        }
      }
    } catch {
      notify('error', t('Failed to reset IP lock'));
    }
  };

  return (
    <div className="space-y-4">
      {toast && (
        <div className={`p-3 rounded-lg text-sm ${toast.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/10 text-red-400 border border-red-500/30'}`}>
          {toast.msg}
        </div>
      )}

      <div className="flex justify-end">
        <button onClick={() => setShowCreate(true)} className="btn-primary">
          <i className="fa-solid fa-plus" /> {t('admin_btn_create_server')}
        </button>
      </div>

      <div className="card overflow-hidden">
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>{t('admin_col_label')}</th>
                <th>{t('admin_col_domain')}</th>
                <th>{t('admin_col_owner')}</th>
                <th>{t('admin_col_events')}</th>
                <th>{t('admin_col_users')}</th>
                <th>{t('admin_col_webhook')}</th>
                <th>{t('gen_actions')}</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} className="text-center py-8 text-zinc-400">{t('gen_loading')}</td></tr>
              ) : servers.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-8 text-zinc-400">{t('admin_servers_empty')}</td></tr>
              ) : servers.map((s) => (
                <tr key={s.id}>
                  <td className="font-semibold">{s.label}</td>
                  <td className="text-xs font-mono text-zinc-400">{s.domain || '—'}</td>
                  <td className="text-xs">{s.ownerUsername || '—'}</td>
                  <td className="text-sm">{s.eventsCount.toLocaleString()}</td>
                  <td className="text-sm">{s.usersCount}</td>
                  <td>
                    <span className={`badge ${s.webhookEnabled ? 'badge-green' : 'badge-gray'}`}>
                      {s.webhookEnabled ? t('admin_servers_on') : t('admin_servers_off')}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center gap-1.5">
                      <button onClick={() => manageKeys(s.id, 'reveal')} className="btn-secondary text-xs" title="API / Peer Key">
                        <i className="fa-solid fa-key" />
                      </button>
                      <button onClick={() => deleteServer(s)} className="btn-danger text-xs">
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

      {keysModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={() => setKeysModal(null)}>
          <div className="bg-bg-card border border-white/10 rounded-2xl max-w-lg w-full p-6 space-y-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold">{keysModal.serverId}</h3>
              <button onClick={() => setKeysModal(null)} className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center">
                <i className="fa-solid fa-xmark" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <p className="text-zinc-500 mb-1">API Key</p>
                <div className="p-2.5 rounded-lg bg-black/40 border border-white/10 font-mono break-all select-all">{keysModal.apiKey}</div>
              </div>
              <div>
                <p className="text-zinc-500 mb-1">Peer Key</p>
                <div className="p-2.5 rounded-lg bg-black/40 border border-white/10 font-mono break-all select-all">{keysModal.peerKey}</div>
              </div>
              <div>
                <p className="text-zinc-500 mb-1">{t('IP Lock')}</p>
                <p className="font-mono text-sm">{keysModal.lockedIp || t('Unlocked')}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              <button onClick={() => manageKeys(keysModal.serverId, 'rotate_api_key')} className="btn-secondary text-xs">
                <i className="fa-solid fa-rotate" /> {t('audit_action_rotate_api_key')}
              </button>
              <button onClick={() => manageKeys(keysModal.serverId, 'generate_peer_key')} className="btn-secondary text-xs">
                <i className="fa-solid fa-key" /> {t('audit_action_generate_peer_key')}
              </button>
              <button onClick={() => manageKeys(keysModal.serverId, 'reset_ip_lock')} className="btn-danger text-xs">
                <i className="fa-solid fa-unlock" /> {t('Reset IP')}
              </button>
            </div>
          </div>
        </div>
      )}

      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-bg-card border border-white/10 rounded-2xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-lg font-bold">{t('admin_new_server_title')}</h3>
            <div>
              <label className="block text-sm font-medium mb-2">{t('admin_col_label')}</label>
              <input className="input" value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">{t('admin_col_domain')}</label>
              <input className="input" value={form.domain} onChange={(e) => setForm({ ...form, domain: e.target.value })} placeholder="example.com" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">{t('admin_col_owner')}</label>
              <input className="input" value={form.ownerId} onChange={(e) => setForm({ ...form, ownerId: e.target.value })} placeholder={t('admin_servers_owner_ph')} />
              <p className="text-xs text-zinc-500 mt-1.5">{t('admin_new_server_owner_optional')}</p>
            </div>
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowCreate(false)} className="btn-ghost">{t('gen_cancel')}</button>
              <button onClick={createServer} disabled={creating || !form.label.trim()} className="btn-primary">
                {creating ? t('admin_servers_creating') : t('Create')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}