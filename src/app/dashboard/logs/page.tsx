// src/app/dashboard/logs/page.tsx
'use client';

import { useEffect, useMemo, useState } from 'react';
import { useLang } from '@/hooks/useLang';
import { formatCode, getDateLocale } from '@/lib/formatUtils';

interface LogEntry {
  id: string;
  ip: string;
  host: string;
  path: string;
  method: string;
  action: string;
  country: string;
  timestamp: string;
  suspicious: boolean;
  rayId?: string;
  rule?: string;
  asn?: string;
  userAgent?: string;
  attempts?: number;
}

interface Filters {
  ip: string;
  path: string;
  country: string;
  action: string;
  from: string;
  to: string;
}

const EMPTY_FILTERS: Filters = { ip: '', path: '', country: '', action: '', from: '', to: '' };

export default function LogsPage() {
  const { t, lang } = useLang();
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const [applied, setApplied] = useState<Filters>(EMPTY_FILTERS);
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<LogEntry | null>(null);
  const pageSize = 25;

  const fetchLogs = async (f: Filters) => {
    setLoading(true);
    try {
      const qs = new URLSearchParams();
      Object.entries(f).forEach(([k, v]) => v && qs.set(k, v));
      const res = await fetch(`/api/logs?${qs.toString()}`, { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setLogs(data.logs ?? data ?? []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLogs(applied); }, [applied]);

  const paginated = useMemo(() => {
    const start = (page - 1) * pageSize;
    return logs.slice(start, start + pageSize);
  }, [logs, page]);

  const totalPages = Math.max(1, Math.ceil(logs.length / pageSize));

  const applyFilters = () => { setPage(1); setApplied({ ...filters }); };
  const clearFilters = () => { setFilters(EMPTY_FILTERS); setApplied(EMPTY_FILTERS); setPage(1); };

  const exportCSV = () => {
    const headers = ['IP', 'Host', 'Path', 'Method', 'Action', 'Country', 'Timestamp', 'Suspicious'];
    const rows = logs.map((l) => [l.ip, l.host, l.path, l.method, l.action, l.country, l.timestamp, String(l.suspicious)]);
    const csv = [headers, ...rows].map((r) => r.map((c) => `"${String(c ?? '').replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `logs-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">{t('logs_title')}</h1>
          <p className="text-sm text-zinc-400 mt-1">{t('logs_subtitle')}</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => fetchLogs(applied)} className="btn-secondary">
            <i className="fa-solid fa-rotate" /> {t('logs_refresh')}
          </button>
          <button onClick={exportCSV} className="btn-primary">
            <i className="fa-solid fa-download" /> {t('logs_export')}
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <input
          className="input"
          placeholder={t('logs_filter_ip')}
          value={filters.ip}
          onChange={(e) => setFilters({ ...filters, ip: e.target.value })}
        />
        <input
          className="input"
          placeholder={t('logs_filter_path')}
          value={filters.path}
          onChange={(e) => setFilters({ ...filters, path: e.target.value })}
        />
        <input
          className="input"
          placeholder={t('logs_filter_country')}
          value={filters.country}
          onChange={(e) => setFilters({ ...filters, country: e.target.value })}
        />
        <select
          className="input"
          value={filters.action}
          onChange={(e) => setFilters({ ...filters, action: e.target.value })}
        >
          <option value="">{t('logs_action_all')}</option>
          <option value="block">{t('Block')}</option>
          <option value="challenge">{t('Challenge')}</option>
          <option value="log">{t('Log')}</option>
        </select>
        <input
          type="datetime-local"
          className="input"
          value={filters.from}
          onChange={(e) => setFilters({ ...filters, from: e.target.value })}
        />
        <input
          type="datetime-local"
          className="input"
          value={filters.to}
          onChange={(e) => setFilters({ ...filters, to: e.target.value })}
        />
        <div className="sm:col-span-2 lg:col-span-3 flex items-center justify-end gap-2">
          <button onClick={clearFilters} className="btn-ghost">{t('logs_filter_clear')}</button>
          <button onClick={applyFilters} className="btn-primary">{t('logs_filter_apply')}</button>
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>{t('col_ip')}</th>
                <th>{t('col_host')}</th>
                <th>{t('col_path')}</th>
                <th>{t('col_method')}</th>
                <th>{t('col_action')}</th>
                <th>{t('col_country')}</th>
                <th>{t('col_time')}</th>
                <th>{t('col_suspicious')}</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8} className="text-center py-8 text-zinc-400">{t('logs_loading')}</td></tr>
              ) : paginated.length === 0 ? (
                <tr><td colSpan={8} className="text-center py-8 text-zinc-400">
                  <p className="font-semibold">{t('logs_empty')}</p>
                  <p className="text-xs">{t('logs_empty_desc')}</p>
                </td></tr>
              ) : paginated.map((log) => (
                <tr key={log.id} className="cursor-pointer" onClick={() => setSelected(log)}>
                  <td className="font-mono text-xs">{log.ip}</td>
                  <td className="text-xs text-zinc-400">{log.host}</td>
                  <td className="font-mono text-xs max-w-[220px] truncate">{log.path}</td>
                  <td><span className="badge badge-gray">{log.method}</span></td>
                  <td>
                    <span className={`badge ${log.action === 'block' ? 'badge-red' : log.action === 'challenge' ? 'badge-yellow' : 'badge-gray'}`}>
                      {formatCode(lang, log.action)}
                    </span>
                  </td>
                  <td className="text-xs">{log.country}</td>
                  <td className="text-xs text-zinc-400">{new Date(log.timestamp).toLocaleString(getDateLocale(lang))}</td>
                  <td>
                    <span className={`badge ${log.suspicious ? 'badge-red' : 'badge-green'}`}>
                      {log.suspicious ? t('logs_yes') : t('logs_no')}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between text-sm text-zinc-400">
        <span>{logs.length} {t('logs_records')}</span>
        <div className="flex items-center gap-2">
          <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="btn-secondary disabled:opacity-40">
            <i className="fa-solid fa-chevron-left" />
          </button>
          <span>{t('logs_page_info').replace('{page}', String(page)).replace('{pages}', String(totalPages)).replace('{total}', String(logs.length))}</span>
          <button disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)} className="btn-secondary disabled:opacity-40">
            <i className="fa-solid fa-chevron-right" />
          </button>
        </div>
      </div>

      {/* Detail modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={() => setSelected(null)}>
          <div className="bg-bg-card border border-white/10 rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">{t('col_ip')}: {selected.ip}</h3>
              <button onClick={() => setSelected(null)} className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center">
                <i className="fa-solid fa-xmark" />
              </button>
            </div>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div><dt className="text-zinc-500">{t('logs_detail_rayid')}</dt><dd className="font-mono text-xs">{selected.rayId ?? '—'}</dd></div>
              <div><dt className="text-zinc-500">{t('logs_detail_rule')}</dt><dd>{selected.rule ?? '—'}</dd></div>
              <div><dt className="text-zinc-500">{t('logs_detail_asn')}</dt><dd>{selected.asn ?? '—'}</dd></div>
              <div><dt className="text-zinc-500">{t('logs_detail_ua')}</dt><dd className="text-xs break-all">{selected.userAgent ?? '—'}</dd></div>
              <div className="sm:col-span-2"><dt className="text-zinc-500">{t('col_path')}</dt><dd className="font-mono text-xs break-all">{selected.path}</dd></div>
            </dl>
          </div>
        </div>
      )}
    </div>
  );
}