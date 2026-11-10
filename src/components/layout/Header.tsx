// src/components/layout/Header.tsx
'use client';
import { useLang } from '@/hooks/useLang';
import { Lang } from '@/types';

const LANG_OPTIONS: Array<{ code: Lang; label: string }> = [
  { code: 'en', label: 'EN' },
  { code: 'es', label: 'ES' },
  { code: 'vi', label: 'VI' },
];

export function Header() {
  const { t, lang, setLang } = useLang();
  return (
    <header className="h-16 bg-black/25 backdrop-blur-md px-3 sm:px-6 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-3">
        <button className="lg:hidden w-11 h-11 rounded-xl hover:bg-white/5 flex items-center justify-center">
          <i className="fa-solid fa-bars" />
        </button>
        <div>
          <p className="text-sm font-semibold">{t('dash_monitoring')}</p>
          <p className="text-xs text-zinc-500">{t('dash_overview')}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div
          className="inline-flex items-center rounded-lg border border-white/10 bg-white/[0.02] p-0.5"
          role="group"
          aria-label={t('settings_language')}
        >
          {LANG_OPTIONS.map((opt) => (
            <button
              key={opt.code}
              type="button"
              onClick={() => setLang(opt.code)}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                lang === opt.code
                  ? 'bg-red-600 text-white'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
