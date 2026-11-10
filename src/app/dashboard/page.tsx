'use client';

import { useEffect, useState } from 'react';
import { useLang } from '@/hooks/useLang';
import { formatCode, getDateLocale } from '@/lib/formatUtils';
import { LiveThreatFeed } from '@/app/LiveThreatFeed';

interface Stats {
  today: number;
  uniqueIps: number;
  total: number;
  active: boolean;
}

interface RecentEvent {
  id: string;
  ip: string;
  host: string;
  path: string;
  action: string;
  country: string;
  timestamp: string;
}

interface NewsItem {
  id: string;
  title: string;
  body: string;
  type: 'update' | 'info' | 'warning' | 'maintenance';
  pinned: boolean;
  createdAt: string;
}

export default function DashboardPage() {
  const { t, lang } = useLang();
  const [stats, setStats] = useState<Stats>({ today: 0, uniqueIps: 0, total: 0, active: true });
  const [events, setEvents] = useState<RecentEvent[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloadingScript, setDownloadingScript] = useState(false);

  const loadDashboard = async () => {
    try {
      const [s, e, n] = await Promise.all([
        fetch('/api/stats', { credentials: 'include' }).then((r) => (r.ok ? r.json() : null)),
        fetch('/api/events/recent', { credentials: 'include' }).then((r) => (r.ok ? r.json() : [])),
        fetch('/api/news', { credentials: 'include' }).then((r) => (r.ok ? r.json() : [])),
      ]);
      if (s) setStats(s);
      setEvents(e ?? []);
      setNews(n ?? []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const downloadScript = async () => {
    setDownloadingScript(true);
    try {
      const res = await fetch('/api/script/download', { credentials: 'include' });
      if (!res.ok) throw new Error();
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'cfx-antidump-resource.zip';
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert(t('dash_download_error'));
    } finally {
      setDownloadingScript(false);
    }
  };

  const simulateDumpProbe = async () => {
    await fetch('/api/ingest/event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        ip: '203.0.113.42',
        host: 'play.example.com',
        path: '/files/server.cfg',
        method: 'GET',
        country: 'US',
        userAgent: 'redENGINE-Dumper/2.1',
      }),
    });
    await loadDashboard();
  };

  const newsBadge = (type: string) => {
    const map = { update: 'ann_update', info: 'ann_info', warning: 'ann_warning', maintenance: 'ann_maintenance' };
    return t(map[type as keyof typeof map] || 'ann_info');
  };

  const newsColor = (type: string) => {
    switch (type) {
      case 'update': return 'border-l-blue-500 bg-blue-500/5';
      case 'warning': return 'border-l-amber-500 bg-amber-500/5';
      case 'maintenance': return 'border-l-red-500 bg-red-500/5';
      default: return 'border-l-zinc-500 bg-white/[0.02]';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">{t('nav_dashboard')}</h1>
          <p className="text-xs text-zinc-500 mt-0.5">{t('dash_overview')}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button onClick={simulateDumpProbe} className="btn-secondary text-xs">
            <i className="fa-solid fa-bolt" /> {t('Test Dump Block')}
          </button>
          <button onClick={downloadScript} disabled={downloadingScript} className="btn-primary text-xs">
            <i className="fa-solid fa-download" /> {downloadingScript ? t('dash_downloading') : t('dash_antidump_script')}
          </button>
        </div>
      </div>

      {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="stat-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-zinc-500">{t('dash_stat_today')}</p>
                  <p className="text-3xl font-bold mt-1">{stats.today.toLocaleString()}</p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                  <i className="fa-solid fa-shield-halved text-red-400" />
                </div>
              </div>
              <p className="text-xs text-zinc-500">{t('dash_stat_trend_24h')}</p>
            </div>
            <div className="stat-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-zinc-500">{t('dash_stat_unique')}</p>
                  <p className="text-3xl font-bold mt-1">{stats.uniqueIps.toLocaleString()}</p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                  <i className="fa-solid fa-network-wired text-amber-400" />
                </div>
              </div>
              <p className="text-xs text-zinc-500">{t('dash_stat_trend_24h')}</p>
            </div>
            <div className="stat-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-zinc-500">{t('dash_stat_total')}</p>
                  <p className="text-3xl font-bold mt-1">{stats.total.toLocaleString()}</p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  <i className="fa-solid fa-chart-line text-emerald-400" />
                </div>
              </div>
              <p className="text-xs text-zinc-500">{t('dash_stat_trend_all')}</p>
            </div>
            <div className="stat-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-zinc-500">{t('debug_status')}</p>
                  <p className="text-lg font-bold mt-1 flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${stats.active ? 'bg-emerald-400 animate-pulse' : 'bg-zinc-500'}`} />
                    {stats.active ? t('dash_stat_active') : t('dash_stat_inactive')}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                  <i className="fa-solid fa-signal text-zinc-300" />
                </div>
              </div>
              <p className="text-xs text-zinc-500">{t('dash_monitoring')}</p>
            </div>
          </div>

          {/* News + Recent */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 card">
              <div className="p-4 border-b border-white/5 flex items-center justify-between">
                <h2 className="font-semibold">{t('dash_recent_title')}</h2>
                <a href="/dashboard/logs" className="text-xs text-red-400 hover:text-red-300">{t('dash_view_all')}</a>
              </div>
              <div className="divide-y divide-white/[0.03]">
                {loading ? (
                  <div className="p-6 text-center text-sm text-zinc-500">{t('dash_loading')}</div>
                ) : events.length === 0 ? (
                  <div className="p-6 text-center text-sm text-zinc-500">{t('dash_no_events')}</div>
                ) : events.slice(0, 10).map((ev) => (
                  <div key={ev.id} className="px-4 py-2.5 flex items-center justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="font-mono text-xs">{ev.ip}</p>
                      <p className="text-xs text-zinc-500 truncate">{ev.path}</p>
                    </div>
                    <span className={`badge ${ev.action === 'block' ? 'badge-red' : 'badge-gray'} text-[10px]`}>
                      {formatCode(lang, ev.action)}
                    </span>
                    <span className="text-[10px] text-zinc-500">{new Date(ev.timestamp).toLocaleTimeString(getDateLocale(lang))}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <div className="p-4 border-b border-white/5">
                <h2 className="font-semibold">{t('dash_novedades')}</h2>
              </div>
              <div className="p-3 space-y-2 max-h-[400px] overflow-y-auto">
                {news.length === 0 ? (
                  <p className="text-xs text-zinc-500 text-center py-4">{t('dash_no_news')}</p>
                ) : news.map((n) => (
                  <div key={n.id} className={`p-3 rounded-lg border-l-4 ${newsColor(n.type)}`}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] uppercase font-bold text-zinc-400">{newsBadge(n.type)}</span>
                      {n.pinned && <i className="fa-solid fa-thumbtack text-[10px] text-red-400" />}
                    </div>
                    <p className="text-sm font-semibold">{n.title}</p>
                    <p className="text-xs text-zinc-400 mt-0.5 line-clamp-3">{n.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

      <LiveThreatFeed />
    </div>
  );
}