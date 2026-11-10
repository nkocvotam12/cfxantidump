// src/app/dashboard/report/page.tsx
'use client';

import { useState } from 'react';
import { useLang } from '@/hooks/useLang';

export default function ReportPage() {
  const { t } = useLang();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  const submit = async () => {
    if (!title.trim() || !description.trim()) return;
    setSending(true);
    setStatus(null);
    try {
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ title: title.trim(), description: description.trim() }),
      });
      if (res.ok) {
        setStatus({ type: 'success', msg: t('report_success') });
        setTitle('');
        setDescription('');
      } else {
        setStatus({ type: 'error', msg: t('report_error') });
      }
    } catch {
      setStatus({ type: 'error', msg: t('report_error') });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold">{t('report_title')}</h1>
        <p className="text-sm text-zinc-400 mt-1">{t('report_subtitle')}</p>
      </div>

      {status && (
        <div className={`p-3 rounded-lg text-sm ${status.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/10 text-red-400 border border-red-500/30'}`}>
          {status.msg}
        </div>
      )}

      <div className="card p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">{t('report_label_title')}</label>
          <input
            className="input"
            placeholder={t('report_placeholder_title')}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">{t('report_label_desc')}</label>
          <textarea
            className="input min-h-[160px] resize-none"
            placeholder={t('report_placeholder_desc')}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <button onClick={submit} disabled={sending || !title.trim() || !description.trim()} className="btn-primary">
          <i className="fa-solid fa-paper-plane" /> {sending ? t('report_sending') : t('report_btn_send')}
        </button>
      </div>

      <div className="card p-4 border-l-4 border-l-amber-500 bg-amber-500/[0.07]">
        <h3 className="font-semibold text-amber-300 flex items-center gap-2">
          <i className="fa-solid fa-lightbulb" /> {t('report_tip_title')}
        </h3>
        <p className="text-xs text-zinc-400 mt-1">{t('report_tip_desc')}</p>
      </div>
    </div>
  );
}