// src/app/dashboard/debug/page.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { useLang } from '@/hooks/useLang';

interface DebugLog {
  id: string;
  method: string;
  path: string;
  ip: string;
  country?: string;
  status: number;
  timestamp: string;
  body?: string;
  headers?: Record<string, string>;
  metadata?: Record<string, unknown>;
}

export default function DebugPage() {
  const { t } = useLang();
  const [live, setLive] = useState(true);
  const [logs, setLogs] = useState<DebugLog[]>([]);
  const [rate, setRate] = useState(0);
  const [filters, setFilters] = useState({ ip: '', body: '' });
  const [selected, setSelected] = useState<DebugLog | null>(null);
  const [secret, setSecret] = useState('');
  const intervalRef = useRef<number | null>(null);

  const fetchLogs = async () => {
    try {
      const res = await fetch('/api/debug/logs', { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setLogs(data.logs ?? []);
        setRate(data.rate ?? 0);
      }
    } catch {}
  };

  useEffect(() => {
    fetchLogs();
    if (live) {
      intervalRef.current = window.setInterval(fetchLogs, 2000);
      return () => { if (intervalRef.current) window.clearInterval(intervalRef.current); };
    }
  }, [live]);

  const clearLogs = async () => {
    if (!secret.trim()) return;
    const res = await fetch('/api/debug/logs', {
      method: 'DELETE',
      headers: { 'X-Debug-Secret': secret.trim() },
      credentials: 'include',
    });
    if (res.ok) {
      setLogs([]);
      setSecret('');
    }
  };

  const filtered = logs.filter((l) => {
    if (filters.ip && !l.ip.includes(filters.ip)) return false;
    if (filters.body) {
      const hay = `${l.body ?? ''} ${JSON.stringify(l.headers ?? {})}`.toLowerCase();
      if (!hay.includes(filters.body.toLowerCase())) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">{t('nav_debug')}</h1>
          <p className="text-sm text-zinc-400 mt-1">{t('Real-time diagnosis of incoming webhook and API requests')}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.02] border border-white/5 text-xs">
            <span className={`w-2 h-2 rounded-full ${live ? 'bg-emerald-400 animate-pulse' : 'bg-zinc-500'}`} />
            <span>{t('Live Mode')}</span>
          </div>
          <button
            onClick={() => setLive((v) => !v)}
            className="btn-secondary text-xs"
          >
            <i className={`fa-solid ${live ? 'fa-pause' : 'fa-play'}`} />
          </button>
          <span className="text-xs text-zinc-500">{rate} {t('req/min')}</span>
        </div>
      </div>

      <div className="card p-4 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <input
            className="input"
            placeholder={t('IP Address')}
            value={filters.ip}
            onChange={(e) => setFilters({ ...filters, ip: e.target.value })}
          />
          <input
            className="input"
            placeholder={t('Search Body/Headers')}
            value={filters.body}
            onChange={(e) => setFilters({ ...filters, body: e.target.value })}
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="password"
            className="input flex-1 min-w-[220px]"
            placeholder={t('Enter X-Debug-Secret to clear logs:')}
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
          />
          <button
            onClick={clearLogs}
            disabled={!secret.trim()}
            className="btn-danger text-xs"
          >
            <i className="fa-solid fa-trash" /> {t('Clear Logs')}
          </button>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>{t('Date/Time')}</th>
                <th>{t('Method')}</th>
                <th>{t('Path')}</th>
                <th>{t('IP Address')}</th>
                <th>{t('Country')}</th>
                <th>{t('debug_status')}</th>
                <th>{t('View')}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-8 text-zinc-400">{t('No debug logs found.')}</td></tr>
              ) : filtered.slice(0, 200).map((l) => (
                <tr key={l.id}>
                  <td className="text-xs text-zinc-400">{new Date(l.timestamp).toLocaleTimeString()}</td>
                  <td><span className="badge badge-gray text-[10px]">{l.method}</span></td>
                  <td className="font-mono text-xs max-w-[220px] truncate">{l.path}</td>
                  <td className="font-mono text-xs">{l.ip}</td>
                  <td className="text-xs">{l.country ?? '—'}</td>
                  <td>
                    <span className={`badge text-[10px] ${l.status >= 400 ? 'badge-red' : l.status >= 300 ? 'badge-yellow' : 'badge-green'}`}>
                      {l.status}
                    </span>
                  </td>
                  <td>
                    <button onClick={() => setSelected(l)} className="btn-ghost text-xs p-1.5">
                      <i className="fa-solid fa-eye" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={() => setSelected(null)}>
          <div className="bg-bg-card border border-white/10 rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 space-y-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold">{t('Request Details')}</h3>
              <button onClick={() => setSelected(null)} className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center">
                <i className="fa-solid fa-xmark" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><p className="text-xs text-zinc-500">{t('Method')}</p><p className="font-mono">{selected.method}</p></div>
              <div><p className="text-xs text-zinc-500">{t('debug_status')}</p><p className="font-mono">{selected.status}</p></div>
              <div className="col-span-2"><p className="text-xs text-zinc-500">{t('Path')}</p><p className="font-mono text-xs break-all">{selected.path}</p></div>
              <div><p className="text-xs text-zinc-500">{t('IP Address')}</p><p className="font-mono text-xs">{selected.ip}</p></div>
              <div><p className="text-xs text-zinc-500">{t('Country')}</p><p>{selected.country ?? '—'}</p></div>
            </div>
            {selected.headers && (
              <div>
                <p className="text-xs text-zinc-500 mb-1">{t('debug_headers')}</p>
                <pre className="p-3 rounded-lg bg-black/50 text-xs font-mono overflow-x-auto">{JSON.stringify(selected.headers, null, 2)}</pre>
              </div>
            )}
            <div>
              <p className="text-xs text-zinc-500 mb-1">{t('Body')}</p>
              {selected.body ? (
                <pre className="p-3 rounded-lg bg-black/50 text-xs font-mono overflow-x-auto whitespace-pre-wrap break-all">{selected.body}</pre>
              ) : (
                <p className="text-xs text-zinc-500 italic">{t('Empty body')}</p>
              )}
            </div>
            {selected.metadata && (
              <div>
                <p className="text-xs text-zinc-500 mb-1">{t('Real Event Metadata')}</p>
                <pre className="p-3 rounded-lg bg-black/50 text-xs font-mono overflow-x-auto">{JSON.stringify(selected.metadata, null, 2)}</pre>
              </div>
            )}
            <button
              onClick={() => navigator.clipboard.writeText(JSON.stringify(selected, null, 2))}
              className="btn-secondary text-xs"
            >
              <i className="fa-solid fa-copy" /> {t('Copy JSON')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}