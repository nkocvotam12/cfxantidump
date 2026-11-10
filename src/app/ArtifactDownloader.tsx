'use client';
// src/components/dashboard/ArtifactDownloader.tsx
import { useState } from 'react';

export function ArtifactDownloader({ version, os }: { version: string; os: string }) {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<'idle' | 'downloading' | 'error'>('idle');

  const download = async () => {
    setStatus('downloading');
    setProgress(0);

    try {
      const res = await fetch(`/api/artifacts/${version}/download?os=${os}`, {
        method: 'POST',
        credentials: 'include',
      });

      if (!res.ok) throw new Error('Download failed');

      const contentLength = Number(res.headers.get('content-length') || 0);
      const reader = res.body?.getReader();
      let received = 0;
      const chunks = [];

      while (reader) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
        received += value.length;
        if (contentLength) {
          setProgress(Math.round((received / contentLength) * 100));
        }
      }

      // Tạo Blob và tự động tải xuống
      const blob = new Blob(chunks as BlobPart[]);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `artifacts-${os}-${version}.zip`;
      a.click();
      URL.revokeObjectURL(url);

      setStatus('idle');
      setProgress(0);
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={download}
        disabled={status === 'downloading'}
        className="btn-primary text-xs"
      >
        {status === 'downloading' ? `Downloading... ${progress}%` : 'Download'}
      </button>
      {status === 'downloading' && (
        <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div className="h-full bg-red-500 transition-all" style={{ width: `${progress}%` }} />
        </div>
      )}
      {status === 'error' && <p className="text-xs text-red-400">Download failed. Try again.</p>}
    </div>
  );
}