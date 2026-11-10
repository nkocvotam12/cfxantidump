// src/app/dashboard/plans/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useLang } from '@/hooks/useLang';
import { getDateLocale, subscriptionStatus } from '@/lib/formatUtils';

interface Plan {
  id: string;
  productName?: string;
  server?: string;
  domain?: string;
  status: string;
  currentPeriodEnd?: string;
  cancelAtPeriodEnd?: boolean;
  oneTime?: boolean;
  lifetime?: boolean;
  expiresAt?: string;
  price?: { amount: number; currency: string; interval?: string };
}

export default function PlansPage() {
  const { t, lang } = useLang();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showExpiredModal, setShowExpiredModal] = useState<Plan | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/plans', { credentials: 'include' });
      if (!res.ok) throw new Error();
      setPlans(await res.json());
    } catch {
      setError(t('plans_error'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openPortal = async (plan: Plan) => {
    try {
      const res = await fetch(`/api/plans/${plan.id}/portal`, { method: 'POST', credentials: 'include' });
      if (res.ok) {
        const { url } = await res.json();
        window.location.href = url;
      } else {
        alert(t('plans_portal_error'));
      }
    } catch {
      alert(t('plans_portal_error'));
    }
  };

  const formatDate = (s?: string) => (s ? new Date(s).toLocaleDateString(getDateLocale(lang)) : '—');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t('plans_title')}</h1>
          <p className="text-sm text-zinc-400 mt-1">{t('plans_subtitle')}</p>
        </div>
        <a href="/dashboard/shop" className="btn-primary">
          <i className="fa-solid fa-cart-plus" /> {t('plans_add')}
        </a>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-sm text-red-400">{error}</div>
      )}

      {loading ? (
        <div className="card p-8 text-center text-zinc-400">{t('gen_loading')}</div>
      ) : plans.length === 0 ? (
        <div className="card p-8 text-center">
          <p className="font-semibold">{t('plans_empty')}</p>
          <p className="text-xs text-zinc-500 mt-1 max-w-md mx-auto">{t('plans_empty_desc')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {plans.map((plan) => {
            const expired = plan.status === 'canceled' || plan.status === 'incomplete_expired' || (plan.oneTime && plan.expiresAt && new Date(plan.expiresAt) < new Date());
            return (
              <div key={plan.id} className="card p-5 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-lg">{plan.productName || t('prod_title')}</h3>
                    <p className="text-xs text-zinc-500">{t('plans_server')}: {plan.server || plan.domain || t('plans_undefined')}</p>
                  </div>
                  <span className={`badge ${expired ? 'badge-red' : plan.status === 'active' ? 'badge-green' : 'badge-yellow'}`}>
                    {expired ? t('plans_status_expired') : subscriptionStatus(lang, plan.status)}
                  </span>
                </div>

                {plan.oneTime && <p className="text-xs text-amber-400">{t('plans_manual_badge')}</p>}
                {plan.lifetime && <p className="text-xs text-emerald-400">{t('plans_lifetime_badge')}</p>}

                <div className="text-sm space-y-1 text-zinc-400">
                  {plan.lifetime ? (
                    <p>{t('plans_lifetime_duration')}</p>
                  ) : plan.oneTime ? (
                    <p>{t('plans_manual_expires_at')}: {formatDate(plan.expiresAt)}</p>
                  ) : plan.cancelAtPeriodEnd ? (
                    <p>{t('plans_cancels_at_end')}</p>
                  ) : (
                    <p>{t('plans_renews_at')}: {formatDate(plan.currentPeriodEnd)}</p>
                  )}
                  {plan.price && (
                    <p className="text-white font-semibold">
                      {plan.price.amount.toFixed(2)} {plan.price.currency.toUpperCase()}
                      {plan.price.interval === 'month' && t('plans_per_month')}
                      {plan.price.interval === 'year' && t('plans_per_year')}
                    </p>
                  )}
                </div>

                {expired && plan.oneTime && (
                  <div className="p-2.5 rounded-lg bg-red-500/10 border border-red-500/30">
                    <p className="text-xs text-red-400">{t('plans_manual_expired_notice')}</p>
                  </div>
                )}

                {!plan.oneTime && !plan.lifetime && (
                  <button onClick={() => openPortal(plan)} className="btn-secondary w-full">
                    <i className="fa-solid fa-credit-card" /> {t('plans_manage')}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Expired modal */}
      {showExpiredModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-bg-card border border-white/10 rounded-2xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-red-400 mb-3">{t('plans_expired_modal_title')}</h3>
            <p className="text-sm text-zinc-300 mb-4">{t('plans_expired_modal_body')}</p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowExpiredModal(null)} className="btn-ghost">{t('plans_later')}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}