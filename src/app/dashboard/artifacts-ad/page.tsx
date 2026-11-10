// src/app/dashboard/artifacts-ad/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useLang } from '@/hooks/useLang';

interface Version {
  version: string;
  os: 'linux' | 'windows';
  size: number;
  publishedAt: string;
  latest: boolean;
}

type DownloadState = {
  status: 'idle' | 'downloading' | 'done' | 'error';
  progress?: number;
  task?: string;
};

export default function ArtifactsPage() {
  const { t } = useLang();
  const [os, setOs] = useState<'linux' | 'windows'>('linux');
  const [versions, setVersions] = useState<Version[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [state, setState] = useState<Record<string, DownloadState>>({});
  const [hideExtra, setHideExtra] = useState(false);
  const [selectedAddon, setSelectedAddon] = useState('');

  const loadVersions = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/artifacts?os=${os}`, { credentials: 'include' });
      if (res.ok) setVersions(await res.json());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadVersions(); }, [os]);

  const filtered = versions.filter((v) => v.version.toLowerCase().includes(search.toLowerCase()));
  const showAll = search.trim().length > 0;
  const displayList = showAll ? filtered : filtered.slice(0, 5);

  const update = (v: string, patch: Partial<DownloadState>) =>
    setState((prev) => ({ ...prev, [v]: { ...prev[v], ...patch } }));

  const download = async (version: Version) => {
    update(version.version, { status: 'downloading', progress: 0, task: t('Initializing...') });
    try {
      const res = await fetch(`/api/artifacts/${version.version}/download?os=${os}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ hideExtra, addon: selectedAddon || undefined }),
      });
      if (!res.ok) throw new Error();

      const reader = res.body?.getReader();
      const contentLength = Number(res.headers.get('content-length') ?? 0);
      let received = 0;
      const chunks: Uint8Array[] = [];
      while (reader) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
        received += value.length;
        if (contentLength) update(version.version, { progress: Math.round((received / contentLength) * 100) });
      }
      const blob = new Blob(chunks as BlobPart[]);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `artifacts-${os}-${version.version}.zip`;
      a.click();
      URL.revokeObjectURL(url);
      update(version.version, { status: 'done', task: t('Ready for download') });
    } catch {
      update(version.version, { status: 'error', task: t('addons_error_download') });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{t('nav_artifacts_ad')}</h1>
        <p className="text-sm text-zinc-400 mt-1">{t('Download specialized artifacts with built-in privacy protection.')}</p>
      </div>

      {/* Config */}
      <div className="card p-5 space-y-4">
        <h2 className="font-semibold">{t('addons_config_title')}</h2>
        <div>
          <label className="block text-xs font-medium mb-1.5">{t('addons_config_os')}</label>
          <div className="flex gap-2">
            <button
              onClick={() => setOs('linux')}
              className={`flex-1 p-2 rounded-lg border text-sm ${os === 'linux' ? 'border-red-500 bg-red-500/10' : 'border-white/10'}`}
            >
              <i className="fa-brands fa-linux mr-1.5" /> Linux
            </button>
            <button
              onClick={() => setOs('windows')}
              className={`flex-1 p-2 rounded-lg border text-sm ${os === 'windows' ? 'border-red-500 bg-red-500/10' : 'border-white/10'}`}
            >
              <i className="fa-brands fa-windows mr-1.5" /> Windows
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/5">
          <div>
            <p className="text-sm font-medium">{t('artifacts_hide_title')}</p>
            <p className="text-xs text-zinc-500">{t('artifacts_hide_desc')}</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" checked={hideExtra} onChange={(e) => setHideExtra(e.target.checked)} className="sr-only peer" />
            <div className="w-9 h-5 bg-zinc-700 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-red-600" />
          </label>
        </div>

        {hideExtra && (
          <div>
            <label className="block text-xs font-medium mb-1.5">{t('artifacts_hide_select')}</label>
            <select className="input" value={selectedAddon} onChange={(e) => setSelectedAddon(e.target.value)}>
              <option value="">—</option>
              <option value="hide_all">{t('Hide All')}</option>
              <option value="hide_1">{t('Hide 1 Resource')}</option>
            </select>
          </div>
        )}
      </div>

      {/* How it works */}
      <div className="card p-5 space-y-2">
        <h2 className="font-semibold">{t('addons_how_title')}</h2>
        <p className="text-sm text-zinc-400">{t('addons_how_desc')}</p>
        <p className="text-sm font-medium mt-3">{t('addons_inst_title')}</p>
        <ol className="list-decimal list-inside text-sm text-zinc-400 space-y-1 ml-1">
          <li>{t('addons_inst_1')}</li>
          <li>{t('addons_inst_2')}</li>
        </ol>
      </div>

      {/* Versions */}
      <div>
        <h2 className="font-semibold mb-3">{t('addons_versions_title')}</h2>
        <div className="card p-4 mb-3">
          <input
            className="input"
            placeholder={t('addons_versions_search')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="card overflow-hidden divide-y divide-white/[0.03]">
          {loading ? (
            <div className="p-8 text-center text-zinc-400">{t('gen_loading')}</div>
          ) : displayList.length === 0 ? (
            <div className="p-8 text-center text-zinc-400">{t('addons_versions_empty')}</div>
          ) : displayList.map((v) => {
            const s = state[v.version];
            return (
              <div key={v.version} className="p-4 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-mono text-sm font-semibold">{v.version}</p>
                    {v.latest && <span className="badge badge-green text-[10px]">{t('addons_versions_latest')}</span>}
                  </div>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    {(v.size / 1024 / 1024).toFixed(1)} MB • {new Date(v.publishedAt).toLocaleDateString()}
                  </p>
                  {s?.status === 'downloading' && (
                    <div className="mt-2">
                      <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-red-500 transition-all" style={{ width: `${s.progress ?? 0}%` }} />
                      </div>
                      <p className="text-[11px] text-zinc-500 mt-1">{s.task}</p>
                    </div>
                  )}
                  {s?.status === 'done' && <p className="text-[11px] text-emerald-400 mt-1">{s.task}</p>}
                  {s?.status === 'error' && <p className="text-[11px] text-red-400 mt-1">{s.task}</p>}
                </div>
                <button
                  onClick={() => download(v)}
                  disabled={s?.status === 'downloading'}
                  className="btn-primary text-xs"
                >
                  <i className="fa-solid fa-download" /> {t('addons_versions_download')}
                </button>
              </div>
            );
          })}
        </div>

        {!showAll && versions.length > 5 && (
          <p className="text-xs text-zinc-500 text-center mt-2">{t('addons_versions_more')}</p>
        )}
      </div>
    </div>
  );
}