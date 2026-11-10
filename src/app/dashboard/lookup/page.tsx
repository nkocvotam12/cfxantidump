// src/app/dashboard/lookup/page.tsx
'use client';

import { useState } from 'react';
import { useLang } from '@/hooks/useLang';

interface LookupResult {
  id: string;
  username: string;
  avatar?: string;
  createdAt: string;
  joinedAt?: string;
  nick?: string;
  roles: string[];
  commonServers: Array<{ id: string; name: string }>;
}

export default function LookupPage() {
  const { t } = useLang();
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<LookupResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = async () => {
    const id = query.trim();
    setError(null);
    setResult(null);

    if (!/^\d{17,20}$/.test(id)) {
      setError(t('lookup_error_invalid_id'));
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/lookup/${id}`, { credentials: 'include' });
      if (res.status === 429) {
        setError(t('lookup_rate_limit_error'));
        return;
      }
      if (res.status === 403) {
        setError(t('lookup_error_no_server'));
        return;
      }
      if (res.status === 404) {
        setError(t('lookup_not_found'));
        return;
      }
      if (res.ok) setResult(await res.json());
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold">{t('lookup_title')}</h1>
        <p className="text-sm text-zinc-400 mt-1">{t('lookup_subtitle')}</p>
      </div>

      <div className="card p-4">
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            className="input flex-1"
            placeholder={t('lookup_placeholder')}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && search()}
          />
          <button onClick={search} disabled={loading} className="btn-primary">
            <i className="fa-solid fa-magnifying-glass" /> {loading ? t('lookup_btn_searching') : t('lookup_btn_search')}
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-sm text-red-400">{error}</div>
      )}

      {!result && !error && !loading && (
        <div className="card p-8 text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mb-4">
            <i className="fa-solid fa-user-magnifying-glass text-2xl text-red-400" />
          </div>
          <h3 className="font-semibold">{t('lookup_initial_title')}</h3>
          <p className="text-sm text-zinc-500 mt-2 max-w-md mx-auto">{t('lookup_initial_desc')}</p>
        </div>
      )}

      {result && (
        <div className="card p-6 space-y-4">
          <div className="flex items-center gap-4">
            {result.avatar ? (
              <img src={result.avatar} alt={result.username} className="w-16 h-16 rounded-full" />
            ) : (
              <div className="w-16 h-16 rounded-full bg-red-600/20 flex items-center justify-center text-2xl font-bold">
                {result.username[0]?.toUpperCase()}
              </div>
            )}
            <div>
              <p className="text-xl font-bold">{result.username}</p>
              {result.nick && <p className="text-sm text-zinc-400">{t('lookup_nick')} {result.nick}</p>}
              <p className="text-xs font-mono text-zinc-500 mt-0.5">{result.id}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-xs text-zinc-500">{t('lookup_created')}</p>
              <p>{new Date(result.createdAt).toLocaleDateString()}</p>
            </div>
            {result.joinedAt && (
              <div>
                <p className="text-xs text-zinc-500">{t('lookup_joined')}</p>
                <p>{new Date(result.joinedAt).toLocaleDateString()}</p>
              </div>
            )}
          </div>

          <div>
            <p className="text-xs text-zinc-500 mb-2">{t('lookup_common_servers')}</p>
            {result.commonServers.length === 0 ? (
              <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5">
                <p className="text-sm font-medium">{t('lookup_no_common_servers')}</p>
                <p className="text-xs text-zinc-500 mt-0.5">{t('lookup_no_common_servers_desc')}</p>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {result.commonServers.map((s) => (
                  <span key={s.id} className="badge badge-blue">{s.name}</span>
                ))}
              </div>
            )}
          </div>

          {result.roles.length > 0 && (
            <div>
              <p className="text-xs text-zinc-500 mb-2">{t('lookup_roles')}</p>
              <div className="flex flex-wrap gap-2">
                {result.roles.map((r) => <span key={r} className="badge badge-gray">{r}</span>)}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}