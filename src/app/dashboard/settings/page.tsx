// src/app/dashboard/settings/page.tsx
'use client';

import { useLang } from '@/hooks/useLang';

export default function SettingsPage() {
  const { t, lang, setLang } = useLang();

  const signOut = async () => {
    await fetch('/auth/logout', { method: 'POST', credentials: 'include' });
    window.location.href = '/';
  };

  return (
    <div className="flex-1 w-full flex items-center justify-center">
      <div className="w-full max-w-2xl space-y-6">
        <h1 className="text-2xl font-bold">{t('settings_title')}</h1>

        {/* Session */}
        <div className="card p-6">
          <h2 className="font-semibold mb-1">{t('settings_session')}</h2>
          <p className="text-sm text-zinc-400 mb-4">{t('settings_session_desc')}</p>
          <button onClick={signOut} className="btn-danger">
            <i className="fa-solid fa-right-from-bracket" /> {t('settings_signout')}
          </button>
        </div>

        {/* Language */}
        <div className="card p-6">
          <h2 className="font-semibold mb-1">{t('settings_language')}</h2>
          <p className="text-sm text-zinc-400 mb-4">{t('settings_language_desc')}</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              onClick={() => setLang('es')}
              className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                lang === 'es' ? 'border-red-500 bg-red-500/10 text-white' : 'border-white/10 hover:border-white/25'
              }`}
            >
              <i className="fa-solid fa-flag mr-2" /> {t('settings_lang_es')}
            </button>
            <button
              onClick={() => setLang('en')}
              className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                lang === 'en' ? 'border-red-500 bg-red-500/10 text-white' : 'border-white/10 hover:border-white/25'
              }`}
            >
              <i className="fa-solid fa-flag-usa mr-2" /> {t('settings_lang_en')}
            </button>
            <button
              onClick={() => setLang('vi')}
              className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                lang === 'vi' ? 'border-red-500 bg-red-500/10 text-white' : 'border-white/10 hover:border-white/25'
              }`}
            >
              <i className="fa-solid fa-language mr-2" /> {t('settings_lang_vi')}
            </button>
          </div>
        </div>

        {/* About */}
        <div className="card p-6">
          <h2 className="font-semibold mb-3">{t('settings_about')}</h2>
          <div className="text-sm text-zinc-400 space-y-1">
            <p>CFX AntiDump</p>
            <p>{t('gen_version')}: 3.38.1</p>
          </div>
        </div>
      </div>
    </div>
  );
}