// src/components/cookies/CookieBanner.tsx
'use client';

import { UiText } from '@/components/ui/UiText';
import { useUiText } from '@/hooks/useUiText';
import { useCookieConsent } from '@/hooks/useCookieConsent';
import Link from 'next/link';

export function CookieBanner() {
  const t = useUiText();
  const {
    showBanner,
    customizing,
    setCustomizing,
    analytics,
    setAnalytics,
    preferences,
    setPreferences,
    save,
  } = useCookieConsent();

  if (!showBanner) return null;

  return (
    <aside
      aria-label={t('Cookie Consent Banner')}
      role="region"
      className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-xl z-50 animate-fade-in"
    >
      <div className="bg-[#0a0a0a]/95 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-[0_10px_40px_rgba(0,0,0,0.8)] text-white">
        <div className="flex items-start gap-3.5 mb-3">
          <div className="w-10 h-10 rounded-xl bg-red-950/40 border border-red-500/30 flex items-center justify-center flex-shrink-0 text-red-500 text-lg">
            <i className="fa-solid fa-cookie-bite" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-wide flex items-center gap-2">
              <UiText text="Cookie Preferences" />
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400">
                GDPR
              </span>
            </h2>
            <p className="text-xs text-zinc-300 mt-1 leading-relaxed">
              <UiText text="We use essential security cookies to run this panel and anonymized performance telemetry to optimize response times and defense capabilities." />
            </p>
          </div>
        </div>

        {customizing && (
          <div className="my-4 pt-3 border-t border-white/10 space-y-3">
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-white/[0.02] border border-white/5">
              <div>
                <p className="text-xs font-semibold text-white">
                  <UiText text="Essential & Security Cookies" />
                </p>
                <p className="text-[11px] text-zinc-400">
                  <UiText text="Required for session authentication and anti-tamper security." />
                </p>
              </div>
              <span className="text-[10px] text-zinc-400 font-mono bg-white/5 px-2 py-1 rounded">
                <UiText text="Always Active" />
              </span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-lg bg-white/[0.02] border border-white/5">
              <div>
                <p className="text-xs font-semibold text-white">
                  <UiText text="Analytics Telemetry" />
                </p>
                <p className="text-[11px] text-zinc-400">
                  <UiText text="Anonymized performance measurements to detect network bottlenecks." />
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={analytics} onChange={(e) => setAnalytics(e.target.checked)} className="sr-only peer" />
                <div className="w-9 h-5 bg-zinc-700 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-red-600" />
              </label>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-lg bg-white/[0.02] border border-white/5">
              <div>
                <p className="text-xs font-semibold text-white">
                  <UiText text="Preferences & UI State" />
                </p>
                <p className="text-[11px] text-zinc-400">
                  <UiText text="Remembers selected language and interface preferences." />
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={preferences} onChange={(e) => setPreferences(e.target.checked)} className="sr-only peer" />
                <div className="w-9 h-5 bg-zinc-700 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-red-600" />
              </label>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pt-3 border-t border-white/10">
          <div className="flex items-center gap-3 text-[11px] text-zinc-400">
            <Link href="/cookies" className="underline hover:text-white">
              <UiText text="Cookie Policy" />
            </Link>
            <span>•</span>
            <Link href="/privacy" className="underline hover:text-white">
              <UiText text="Privacy Policy" />
            </Link>
          </div>
          <div className="flex items-center gap-2">
            {customizing ? (
              <>
                <button
                  onClick={() => setCustomizing(false)}
                  className="px-3 py-1.5 text-xs text-zinc-300 hover:text-white border border-white/10 hover:border-white/20 rounded-lg transition-all"
                >
                  <UiText text="Back" />
                </button>
                <button
                  onClick={() => save({ analytics, preferences })}
                  className="px-4 py-1.5 text-xs font-medium text-white bg-red-600 hover:bg-red-500 rounded-lg"
                >
                  <UiText text="Save Choices" />
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setCustomizing(true)}
                  className="px-3 py-1.5 text-xs text-zinc-300 hover:text-white border border-white/10 hover:border-white/20 rounded-lg"
                >
                  <UiText text="Customize" />
                </button>
                <button
                  onClick={() => save({ analytics: false, preferences: false })}
                  className="px-3 py-1.5 text-xs text-zinc-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg"
                >
                  <UiText text="Essential Only" />
                </button>
                <button
                  onClick={() => save({ analytics: true, preferences: true })}
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-red-600 hover:bg-red-500 rounded-lg shadow-[0_0_15px_rgba(239,68,68,0.4)]"
                >
                  <UiText text="Accept All" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}