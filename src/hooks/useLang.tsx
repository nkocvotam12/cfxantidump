// src/hooks/useLang.tsx
'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { usePathname } from 'next/navigation';
import { translations, pageTitles, defaultTitle } from '@/lib/i18n';
import { lookupUiText } from '@/lib/uiText';
import { Lang } from '@/types';

interface LangContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
}

const LangContext = createContext<LangContextType>({
  lang: 'en',
  setLang: () => {},
  t: (key) => key,
});

function isSupportedLang(value: string | null): value is Lang {
  return value === 'en' || value === 'es' || value === 'vi';
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [lang, setLangState] = useState<Lang>('en');
  const [initialized, setInitialized] = useState(true);
  const [hydrated, setHydrated] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('fad_lang');
    if (isSupportedLang(saved)) {
      setLangState(saved);
      setInitialized(true);
    } else {
      setInitialized(false);
    }
    setHydrated(true);
  }, []);

  const setLang = (newLang: Lang) => {
    setIsExiting(true);
    setTimeout(() => {
      setLangState(newLang);
      setInitialized(true);
      localStorage.setItem('fad_lang', newLang);
      setIsExiting(false);
    }, 250);
  };

  useEffect(() => {
    if (hydrated) document.documentElement.lang = lang;
  }, [hydrated, lang]);

  useEffect(() => {
    if (hydrated) {
      document.title = (pageTitles[pathname] || defaultTitle)[lang];
    }
  }, [hydrated, lang, pathname]);

  const t = (key: string, vars?: Record<string, string | number>) => {
    let str =
      translations[lang]?.[key] ??
      lookupUiText(lang, key) ??
      translations.en?.[key] ??
      key;
    if (vars) {
      Object.entries(vars).forEach(([k, v]) => {
        str = str.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
      });
    }
    return str;
  };

  return (
    <LangContext.Provider value={{ lang, setLang, t }}>
      {children}
      {hydrated && !initialized && <LanguagePicker onSelect={setLang} isExiting={isExiting} />}
    </LangContext.Provider>
  );
}

export const useLang = () => useContext(LangContext);

// Language picker modal
function LanguagePicker({ onSelect, isExiting }: { onSelect: (l: Lang) => void; isExiting: boolean }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return createPortal(
    <div style={{ position: 'fixed', inset: 0, zIndex: 999999999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(4,4,4,0.88)', backdropFilter: 'blur(12px)', opacity: isExiting ? 0 : 1, transition: 'opacity 0.25s ease' }} />
      <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: 420, backgroundColor: '#0e0e0e', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 20, padding: '28px 24px', boxShadow: '0 25px 60px rgba(0,0,0,0.95)', opacity: isExiting ? 0 : 1, transform: isExiting ? 'scale(0.96)' : 'scale(1)', transition: 'all 0.25s ease' }}>
        <h2 className="text-lg font-bold text-white text-center mb-6 tracking-tight">
          Select language / Seleccionar idioma / Chọn ngôn ngữ
        </h2>
        <div className="flex flex-col gap-3.5">
          {[
            { code: 'en' as Lang, name: 'English', sub: 'International' },
            { code: 'es' as Lang, name: 'Español', sub: 'Spanish' },
            { code: 'vi' as Lang, name: 'Tiếng Việt', sub: 'Vietnamese' },
          ].map((l) => (
            <button key={l.code} onClick={() => onSelect(l.code)} className="group w-full flex items-center justify-between px-5 py-4 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] hover:border-red-500/40 transition-all text-left">
              <div>
                <p className="text-white font-semibold text-sm group-hover:text-red-400 transition-colors">{l.name}</p>
                <p className="text-zinc-400 text-xs mt-1">{l.sub}</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-white/[0.04] group-hover:bg-red-600 border border-white/5 group-hover:border-red-500 text-zinc-400 group-hover:text-white flex items-center justify-center text-xs transition-all ml-3">
                <i className="fa-solid fa-chevron-right text-[10px] transform group-hover:translate-x-0.5 transition-transform" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>,
    document.body
  );
}
