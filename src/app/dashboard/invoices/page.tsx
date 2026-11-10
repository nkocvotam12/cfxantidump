// src/app/dashboard/invoices/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useLang } from '@/hooks/useLang';
import { formatCode, getDateLocale } from '@/lib/formatUtils';

interface Invoice {
  id: string;
  date: string;
  product: string;
  amount: number;
  currency: string;
  status: 'paid' | 'pending' | 'failed';
  downloadUrl?: string;
}

export default function InvoicesPage() {
  const { t, lang } = useLang();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/invoices', { credentials: 'include' });
        if (res.ok) setInvoices(await res.json());
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{t('inv_title')}</h1>
        <p className="text-sm text-zinc-400 mt-1">{t('inv_subtitle')}</p>
      </div>

      <div className="card overflow-hidden">
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>{t('inv_col_date')}</th>
                <th>{t('inv_col_product')}</th>
                <th>{t('inv_col_amount')}</th>
                <th>{t('inv_col_status')}</th>
                <th>{t('inv_col_download')}</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="text-center py-8 text-zinc-400">{t('inv_loading')}</td></tr>
              ) : invoices.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-8">
                  <p className="font-semibold">{t('inv_empty')}</p>
                  <p className="text-xs text-zinc-500">{t('inv_empty_desc')}</p>
                </td></tr>
              ) : invoices.map((inv) => (
                <tr key={inv.id}>
                  <td className="text-xs">{new Date(inv.date).toLocaleDateString(getDateLocale(lang))}</td>
                  <td className="text-sm">{inv.product || t('inv_default_product')}</td>
                  <td className="font-mono text-sm">${inv.amount.toFixed(2)} {inv.currency.toUpperCase()}</td>
                  <td>
                    <span className={`badge ${inv.status === 'paid' ? 'badge-green' : inv.status === 'pending' ? 'badge-yellow' : 'badge-red'}`}>
                      {inv.status === 'paid' ? t('inv_status_paid') : formatCode(lang, inv.status)}
                    </span>
                  </td>
                  <td>
                    {inv.downloadUrl ? (
                      <a href={inv.downloadUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary text-xs">
                        <i className="fa-solid fa-download" />
                      </a>
                    ) : (
                      <span className="text-xs text-zinc-500">{t('inv_not_available')}</span>
                    )}
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