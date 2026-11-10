// src/app/dashboard/shop/page.tsx
'use client';

import { useState } from 'react';
import { useLang } from '@/hooks/useLang';

interface Product {
  id: string;
  nameKey: string;
  descKey: string;
  price: number;
  currency: string;
  capacity?: number;
}

const PRODUCTS: Product[] = [
  { id: 'internal', nameKey: 'prod_internal_monthly', descKey: 'prod_internal_desc', price: 9.99, currency: 'USD' },
  { id: 'external', nameKey: 'prod_external_monthly', descKey: 'prod_external_desc', price: 14.99, currency: 'USD' },
  { id: 'full', nameKey: 'prod_full_pack_monthly', descKey: 'prod_full_pack_desc', price: 19.99, currency: 'USD' },
  { id: 'hide_monthly', nameKey: 'prod_hide_monthly', descKey: 'prod_hide_desc', price: 7.99, currency: 'USD' },
  { id: 'hide_lifetime', nameKey: 'prod_hide_lifetime', descKey: 'prod_hide_desc', price: 79.99, currency: 'USD' },
];

export default function ShopPage() {
  const { t } = useLang();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [platform, setPlatform] = useState<'stripe' | 'moneymotion'>('stripe');
  const [checkingOut, setCheckingOut] = useState(false);

  const checkout = async () => {
    if (!selectedProduct) return;
    setCheckingOut(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ productId: selectedProduct.id, platform }),
      });
      if (res.ok) {
        const { url } = await res.json();
        window.location.href = url;
      } else {
        alert(t('prod_checkout_error'));
      }
    } catch {
      alert(t('prod_checkout_error'));
    } finally {
      setCheckingOut(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{t('prod_title')}</h1>
        <p className="text-sm text-zinc-400 mt-1">{t('prod_subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {PRODUCTS.map((product) => (
          <div key={product.id} className="card p-5 flex flex-col">
            <div className="flex-1">
              <h3 className="font-bold text-lg">{t(product.nameKey)}</h3>
              <p className="text-sm text-zinc-400 mt-1">{t(product.descKey)}</p>
            </div>
            <div className="mt-4 pt-4 border-t border-white/5">
              <p className="text-2xl font-bold">
                ${product.price.toFixed(2)}
                <span className="text-sm font-normal text-zinc-500">{t('plans_per_month')}</span>
              </p>
              <button onClick={() => { setSelectedProduct(product); setPlatform('stripe'); }} className="btn-primary w-full mt-3">
                <i className="fa-solid fa-cart-shopping" /> {t('prod_buy')}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Checkout modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-bg-card border border-white/10 rounded-2xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold mb-4">{t('prod_modal_title')}</h3>
            <p className="text-sm text-zinc-400 mb-4">{t(selectedProduct.nameKey)} — ${selectedProduct.price.toFixed(2)}</p>
            <div className="space-y-2 mb-6">
              <button
                onClick={() => setPlatform('stripe')}
                className={`w-full p-3 rounded-lg border text-left transition-all ${platform === 'stripe' ? 'border-red-500 bg-red-500/10' : 'border-white/10 hover:border-white/25'}`}
              >
                <p className="font-semibold text-sm">{t('prod_modal_stripe')}</p>
              </button>
              <button
                onClick={() => setPlatform('moneymotion')}
                className={`w-full p-3 rounded-lg border text-left transition-all ${platform === 'moneymotion' ? 'border-red-500 bg-red-500/10' : 'border-white/10 hover:border-white/25'}`}
              >
                <p className="font-semibold text-sm">{t('prod_modal_money')}</p>
              </button>
            </div>
            <div className="flex justify-end gap-2">
              <button onClick={() => setSelectedProduct(null)} className="btn-ghost">{t('gen_cancel')}</button>
              <button onClick={checkout} disabled={checkingOut} className="btn-primary">
                {checkingOut ? t('gen_loading') : t('prod_buy')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}