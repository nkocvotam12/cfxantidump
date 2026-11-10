'use client';
// src/components/dashboard/LiveThreatFeed.tsx
import { useEffect, useState, useRef } from 'react';
import { useLang } from '@/hooks/useLang';
import { formatCode, getDateLocale } from '@/lib/formatUtils';

interface Threat {
  id: string;
  ip: string;
  country: string;
  path: string;
  action: string;
  timestamp: string;
}

export function LiveThreatFeed() {
  const { t, lang } = useLang();
  const [threats, setThreats] = useState<Threat[]>([]);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Kết nối SSE (Server-Sent Events) để nhận real-time
    const eventSource = new EventSource('/api/events/stream');

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data) as Threat;
        setThreats((prev) => [data, ...prev].slice(0, 50)); // Giữ 50 sự kiện mới nhất
      } catch {}
    };

    return () => eventSource.close();
  }, []);

  return (
    <div className="card flex flex-col h-[400px]">
      <div className="p-4 border-b border-white/5 flex items-center justify-between">
        <h3 className="font-semibold text-sm flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          {t('logs_title')}
        </h3>
        <span className="text-xs text-zinc-500">{threats.length} {t('logs_records')}</span>
      </div>
      
      <div ref={listRef} className="flex-1 overflow-y-auto p-2 space-y-1">
        {threats.length === 0 ? (
          <div className="p-6 text-center text-xs text-zinc-500">{t('dash_no_events')}</div>
        ) : threats.map((threat) => (
          <div key={threat.id} className="flex items-center justify-between p-2 rounded bg-white/[0.02] border border-white/5 text-xs animate-fade-in">
            <div className="flex items-center gap-3">
              <span className={`badge ${threat.action === 'block' ? 'badge-red' : 'badge-gray'}`}>{formatCode(lang, threat.action)}</span>
              <span className="font-mono">{threat.ip}</span>
              <span className="text-zinc-500">{threat.country}</span>
            </div>
            <span className="font-mono text-zinc-400 max-w-[150px] truncate">{threat.path}</span>
            <span className="text-zinc-500">{new Date(threat.timestamp).toLocaleTimeString(getDateLocale(lang))}</span>
          </div>
        ))}
      </div>
    </div>
  );
}