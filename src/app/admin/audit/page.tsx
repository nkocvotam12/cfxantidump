// src/app/admin/audit/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useLang } from '@/hooks/useLang';
import { getDateLocale } from '@/lib/formatUtils';

interface AuditEntry {
  id: string;
  action: string;
  actor: string;
  target?: string;
  createdAt: string;
}

export default function AdminAuditPage() {
  const { t, lang } = useLang();
  const [entries, setEntries] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/admin/audit?limit=100', { credentials: 'include' });
        if (res.ok) setEntries(await res.json());
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="card overflow-hidden">
      <div className="p-4 border-b border-white/5">
        <h2 className="font-semibold">{t('admin_tab_audit')}</h2>
      </div>
      <div className="divide-y divide-white/[0.03]">
        {loading ? (
          <div className="p-8 text-center text-sm text-zinc-500">{t('gen_loading')}</div>
        ) : entries.length === 0 ? (
          <div className="p-8 text-center text-sm text-zinc-500">{t('admin_no_audit')}</div>
        ) : (
          entries.map((entry) => (
            <div key={entry.id} className="px-4 py-3 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-medium">{t(`audit_action_${entry.action}`) || entry.action}</p>
                <p className="text-xs text-zinc-500">
                  {entry.actor} {entry.target && `→ ${entry.target}`}
                </p>
              </div>
              <span className="text-xs text-zinc-500 whitespace-nowrap">
                {new Date(entry.createdAt).toLocaleString(getDateLocale(lang))}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
