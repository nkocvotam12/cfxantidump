// src/app/dashboard/orders/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useLang } from '@/hooks/useLang';
import { formatCode, getDateLocale } from '@/lib/formatUtils';

interface Order {
  id: string;
  product: string;
  status: string;
  amount: number;
  currency: string;
  createdAt: string;
}

export default function OrdersPage() {
  const { t, lang } = useLang();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/orders', { credentials: 'include' });
        if (res.ok) setOrders(await res.json());
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">{t('nav_orders')}</h1>

      <div className="card overflow-hidden">
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>{t('orders_col_id')}</th>
                <th>{t('inv_col_product')}</th>
                <th>{t('inv_col_amount')}</th>
                <th>{t('inv_col_status')}</th>
                <th>{t('inv_col_date')}</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="text-center py-8 text-zinc-400">{t('gen_loading')}</td></tr>
              ) : orders.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-8 text-zinc-400">{t('inv_empty')}</td></tr>
              ) : orders.map((o) => (
                <tr key={o.id}>
                  <td className="font-mono text-xs">{o.id}</td>
                  <td className="text-sm">{o.product}</td>
                  <td className="font-mono text-sm">${o.amount.toFixed(2)} {o.currency}</td>
                  <td>
                    <span className={`badge ${o.status === 'paid' ? 'badge-green' : o.status === 'pending' ? 'badge-yellow' : 'badge-gray'}`}>
                      {formatCode(lang, o.status)}
                    </span>
                  </td>
                  <td className="text-xs text-zinc-500">{new Date(o.createdAt).toLocaleDateString(getDateLocale(lang))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}