// src/app/dashboard/addons/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useLang } from '@/hooks/useLang';

interface UserAddon {
  id: string;
  type: 'hide_all' | 'hide_1' | 'other';
  resource?: string;
  createdAt: string;
}

export default function AddonsPage() {
  const { t } = useLang();
  const [addons, setAddons] = useState<UserAddon[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/addons', { credentials: 'include' });
        if (res.ok) setAddons(await res.json());
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const addonLabel = (a: UserAddon) => {
    if (a.type === 'hide_all') return t('Hide All');
    if (a.type === 'hide_1') return `${t('Hide 1 Resource')}: ${a.resource || '—'}`;
    return a.type;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{t('addons_title')}</h1>
        <p className="text-sm text-zinc-400 mt-1">{t('addons_subtitle')}</p>
      </div>

      {loading ? (
        <div className="card p-8 text-center text-zinc-400">{t('gen_loading')}</div>
      ) : addons.length === 0 ? (
        <div className="card p-8 text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mb-4">
            <i className="fa-solid fa-puzzle-piece text-2xl text-red-400" />
          </div>
          <p className="font-semibold">{t('addons_no_assigned')}</p>
          <p className="text-xs text-zinc-500 mt-1 max-w-md mx-auto">{t('addons_no_assigned_desc')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addons.map((a) => (
            <div key={a.id} className="card p-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                  <i className="fa-solid fa-puzzle-piece text-red-400" />
                </div>
                <div>
                  <p className="font-semibold text-sm">{addonLabel(a)}</p>
                  <p className="text-xs text-zinc-500">{new Date(a.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}