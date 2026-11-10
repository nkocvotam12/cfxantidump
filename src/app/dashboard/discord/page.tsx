// src/app/dashboard/discord/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLang } from '@/hooks/useLang';

interface DiscordConfig {
  webhookUrl: string | null;
  enabled: boolean;
}

export default function DiscordPage() {
  const router = useRouter();
  const { t } = useLang();
  const [config, setConfig] = useState<DiscordConfig>({ webhookUrl: null, enabled: false });
  const [urlInput, setUrlInput] = useState('');
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  const readError = async (res: Response, fallback: string) => {
    if (res.status === 401) {
      router.replace('/');
      return `${fallback} (Unauthorized)`;
    }
    try {
      const data = (await res.json()) as { error?: string };
      return data?.error ? `${fallback}: ${data.error}` : fallback;
    } catch {
      return fallback;
    }
  };

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/discord/config', { credentials: 'include' });
      if (res.status === 401) {
        router.replace('/');
        return;
      }
      if (res.ok) {
        const data = await res.json();
        setConfig(data);
        setEnabled(data.enabled);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const showToast = (type: 'success' | 'error', msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4000);
  };

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/discord/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ webhookUrl: urlInput.trim() || undefined, enabled }),
      });
      if (res.ok) {
        showToast('success', t('discord_success_save'));
        setUrlInput('');
        await load();
      } else {
        showToast('error', await readError(res, t('discord_error_save')));
      }
    } catch {
      showToast('error', t('discord_error_save'));
    } finally {
      setSaving(false);
    }
  };

  const testWebhook = async () => {
    setTesting(true);
    try {
      const res = await fetch('/api/discord/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ webhookUrl: urlInput.trim() || undefined }),
      });
      if (res.ok) showToast('success', t('discord_success_test'));
      else showToast('error', await readError(res, t('discord_error_test')));
    } catch {
      showToast('error', t('discord_error_test'));
    } finally {
      setTesting(false);
    }
  };

  const disable = async () => {
    try {
      const res = await fetch('/api/discord/disable', { method: 'POST', credentials: 'include' });
      if (res.ok) {
        showToast('success', t('discord_success_disable'));
        await load();
      } else {
        showToast('error', await readError(res, t('discord_error_disable')));
      }
    } catch {
      showToast('error', t('discord_error_disable'));
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold">{t('discord_title')}</h1>
        <p className="text-sm text-zinc-400 mt-1">{t('discord_subtitle')}</p>
      </div>

      {toast && (
        <div className={`p-3 rounded-lg text-sm ${toast.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/10 text-red-400 border border-red-500/30'}`}>
          {toast.msg}
        </div>
      )}

      {/* Status */}
      <div className="card p-4 flex items-center justify-between">
        <div>
          <p className="text-xs text-zinc-500">{t('discord_status')}</p>
          <p className="text-sm font-semibold mt-0.5">
            {config.enabled ? (
              <span className="text-emerald-400 flex items-center gap-2">
                <i className="fa-solid fa-circle text-[8px]" /> {t('discord_active')}
              </span>
            ) : (
              <span className="text-zinc-400 flex items-center gap-2">
                <i className="fa-solid fa-circle text-[8px]" /> {t('discord_inactive')}
              </span>
            )}
          </p>
        </div>
        {config.enabled && (
          <button onClick={disable} className="btn-danger text-xs">
            <i className="fa-solid fa-power-off" /> {t('discord_disable')}
          </button>
        )}
      </div>

      {/* Config form */}
      <div className="card p-6 space-y-4">
        <h2 className="font-semibold">{t('discord_config')}</h2>
        <div>
          <label className="block text-sm font-medium mb-2">{t('discord_url_label')}</label>
          <input
            className="input"
            type="url"
            placeholder="https://discord.com/api/webhooks/..."
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
          />
          <p className="text-xs text-zinc-500 mt-1.5">
            {t('discord_url_hint')} <span className="font-mono">{config.webhookUrl ? '••••••••' + config.webhookUrl.slice(-8) : t('discord_not_set')}</span>
          </p>
        </div>

        <div className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/5">
          <div>
            <p className="text-sm font-medium">{t('discord_enable')}</p>
            <p className="text-xs text-zinc-500">{t('discord_enable_desc')}</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" checked={enabled} onChange={(e) => setEnabled(e.target.checked)} className="sr-only peer" />
            <div className="w-9 h-5 bg-zinc-700 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-red-600" />
          </label>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button onClick={save} disabled={saving} className="btn-primary">
            <i className="fa-solid fa-floppy-disk" /> {saving ? t('discord_saving') : t('discord_save')}
          </button>
          <button onClick={testWebhook} disabled={testing} className="btn-secondary">
            <i className="fa-solid fa-paper-plane" /> {testing ? t('discord_testing') : t('discord_test')}
          </button>
        </div>
      </div>

      {/* Preview */}
      <div className="card overflow-hidden">
        <div className="px-4 py-3 border-b border-white/5">
          <h3 className="font-semibold text-sm">{t('discord_preview')}</h3>
        </div>
        <div className="p-4 bg-[#313338]">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-[#5865F2] flex items-center justify-center text-white font-bold shrink-0">
              <i className="fa-brands fa-discord" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-white font-semibold text-sm">CFX AntiDump</span>
                <span className="text-[10px] bg-[#5865F2] text-white px-1.5 py-0.5 rounded font-bold">{t('discord_preview_bot')}</span>
                <span className="text-[10px] text-zinc-400">{new Date().toLocaleTimeString()}</span>
              </div>
              <div className="mt-2 border-l-4 border-red-500 pl-3 py-1">
                <p className="text-red-400 font-bold text-sm">{t('discord_preview_blocked')}</p>
                <div className="grid grid-cols-1 gap-1 mt-2 text-xs text-zinc-300">
                  <p>{t('discord_field_ip')}: <span className="font-mono">192.168.1.100</span></p>
                  <p>{t('discord_field_host')}: <span className="font-mono">server.example.com</span></p>
                  <p>{t('discord_field_path')}: <span className="font-mono">/api/resources/load</span></p>
                  <p>{t('discord_field_date')}: {new Date().toLocaleString()}</p>
                  <p>{t('discord_field_action')}: <span className="text-red-400 font-semibold">BLOCK</span></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}