// src/app/dashboard/dns/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useLang } from '@/hooks/useLang';

interface DnsRecord {
  id: string;
  type: string;
  name: string;
  value: string;
  ttl: number;
  proxied: boolean;
}

export default function DnsPage() {
  const { t } = useLang();
  const [records, setRecords] = useState<DnsRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/dns', { credentials: 'include' });
        if (res.ok) setRecords(await res.json());
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">{t('nav_dns')}</h1>

      <div className="card overflow-hidden">
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>{t('dns_type')}</th>
                <th>{t('dns_name')}</th>
                <th>{t('dns_value')}</th>
                <th>{t('dns_ttl')}</th>
                <th>{t('dns_proxied')}</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="text-center py-8 text-zinc-400">{t('gen_loading')}</td></tr>
              ) : records.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-8 text-zinc-400">{t('dns_no_records')}</td></tr>
              ) : records.map((r) => (
                <tr key={r.id}>
                  <td><span className="badge badge-gray text-[10px]">{r.type}</span></td>
                  <td className="font-mono text-xs">{r.name}</td>
                  <td className="font-mono text-xs max-w-[280px] truncate">{r.value}</td>
                  <td className="text-xs">{r.ttl}</td>
                  <td>
                    <span className={`badge text-[10px] ${r.proxied ? 'badge-green' : 'badge-gray'}`}>
                      {r.proxied ? t('dns_proxied_badge') : t('dns_only_badge')}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}