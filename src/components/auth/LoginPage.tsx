// src/components/auth/LoginPage.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useLang } from '@/hooks/useLang';
import { useAntiSpam } from '@/hooks/useAntiSpam';
import { UiText } from '@/components/ui/UiText';
import { LoginSkeleton } from '@/components/skeletons/LoginSkeleton';
import { Lang } from '@/types';

// Honeypot field
function Honeypot({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div
      style={{
        opacity: 0,
        position: 'absolute',
        top: 0,
        left: 0,
        height: 0,
        width: 0,
        zIndex: -1,
        overflow: 'hidden',
        pointerEvents: 'none',
      }}
      aria-hidden="true"
    >
      <label htmlFor="hp_company_field">
        <UiText text="Leave this field blank" />
      </label>
      <input
        id="hp_company_field"
        type="text"
        name="company_verification_field"
        tabIndex={-1}
        autoComplete="off"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

export function LoginPage() {
  const router = useRouter();
  const { t, lang, setLang } = useLang();
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const {
    honeypotValue,
    setHoneypotValue,
    validateSubmission,
    cooldownRemaining,
    startCooldown,
  } = useAntiSpam(0.8, 3000);

  useEffect(() => {
    fetch('/auth/me', { credentials: 'include' })
      .then((r) => {
        if (r.ok) router.replace('/dashboard');
        else setChecking(false);
      })
      .catch(() => setChecking(false));
  }, [router]);

  if (checking) return <LoginSkeleton />;

  const handleDiscordClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const result = validateSubmission();
    if (!result.isValid) {
      e.preventDefault();
      const reason = result.reason || 'Spam prevention active.';
      const m = reason.match(/^Please wait (\d+)s before submitting again\.$/);
      if (m) {
        setError(
          lang === 'es'
            ? `Espera ${m[1]} s antes de volver a intentarlo.`
            : lang === 'vi'
              ? `Vui lòng đợi ${m[1]} giây trước khi gửi lại.`
              : reason
        );
      } else {
        setError(t(reason));
      }
      return;
    }
    if (cooldownRemaining > 0) {
      e.preventDefault();
      setError(
        lang === 'es'
          ? `Espera ${cooldownRemaining} s.`
          : lang === 'vi'
            ? `Vui lòng đợi ${cooldownRemaining} giây.`
            : `Please wait ${cooldownRemaining}s.`
      );
      return;
    }
    startCooldown();
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white relative flex flex-col justify-between overflow-x-clip selection:bg-red-500/30">
      {/* Background glows */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_6%_6%,rgba(127,29,29,0.14),transparent_32%),radial-gradient(circle_at_88%_90%,rgba(127,29,29,0.14),transparent_32%)]" />
        <div className="absolute -left-32 -top-32 w-[22rem] h-[22rem] rounded-full bg-red-800/15 blur-[130px]" />
        <div className="absolute -right-24 -bottom-24 w-[24rem] h-[24rem] rounded-full bg-red-800/15 blur-[130px]" />
      </div>

      <main className="relative z-10 flex-1 grid grid-cols-1 lg:grid-cols-2">
        <section className="hidden lg:flex items-center justify-center border-r border-white/10 p-12">
          <div className="max-w-lg w-full">
            <div className="flex items-center gap-4 mb-7">
              <div className="relative w-14 h-14">
                <Image
                  src="/antidumpicon.png"
                  alt="CFX AntiDump"
                  fill
                  className="object-contain drop-shadow-[0_0_20px_rgba(239,68,68,0.5)]"
                  sizes="56px"
                  priority
                />
              </div>
              <div>
                <h1 className="text-3xl font-bold leading-tight tracking-tight">CFX AntiDump</h1>
                <p className="text-sm text-zinc-300 mt-1">{t('login_hero_tagline')}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="flex flex-col items-center justify-center px-5 py-12 sm:px-8">
          <div className="w-full max-w-md border border-white/10 bg-black/55 backdrop-blur-md rounded-2xl p-6 sm:p-8 shadow-[0_10px_40px_rgba(0,0,0,0.6)]">
            <Honeypot value={honeypotValue} onChange={setHoneypotValue} />

            <div className="flex flex-col items-center text-center gap-3 mb-6">
              <div className="relative w-12 h-12 lg:hidden">
                <Image src="/antidumpicon.png" alt="CFX AntiDump" fill className="object-contain" sizes="48px" priority />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">{t('login_title')}</h2>
                <p className="text-xs text-zinc-400 mt-1">
                  <UiText text="Login" />
                </p>
              </div>
            </div>

            {error && (
              <div className="mb-4 p-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-400 text-center animate-fade-in flex items-center justify-center gap-2">
                <i className="fa-solid fa-triangle-exclamation" />
                <span>{error}</span>
              </div>
            )}

            <a
              href="/auth/discord"
              id="discord-login-btn"
              onClick={handleDiscordClick}
              className="w-full h-12 px-4 inline-flex items-center justify-center gap-2.5 rounded-xl border border-white/15 bg-white/[0.03] hover:bg-red-500/15 hover:border-red-400/50 transition-all duration-200 text-sm font-semibold text-white shadow-sm group focus-visible:ring-2 focus-visible:ring-red-500"
            >
              <i className="fa-brands fa-discord text-lg text-indigo-400 group-hover:text-white transition-colors" />
              <span>{t('login_btn_discord')}</span>
              {cooldownRemaining > 0 && (
                <span className="text-xs text-zinc-400 font-mono ml-1">({cooldownRemaining}s)</span>
              )}
            </a>

            <p className="text-xs text-zinc-400 text-center mt-5 leading-relaxed">{t('login_footer')}</p>
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-white/[0.08] bg-black/60 backdrop-blur-sm py-2 px-4 sm:px-8 text-[11px] sm:text-xs text-zinc-400">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2 text-center md:text-left">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-zinc-300">CFX AntiDump</span>
            <span>•</span>
            <span>
              © {new Date().getFullYear()} <UiText text="All rights reserved." />
            </span>
          </div>
          <nav aria-label={t('Legal & compliance')} className="flex flex-wrap items-center justify-center gap-3">
            <Link href="/legal-notice" className="hover:text-white underline-offset-4 hover:underline">
              <UiText text="Legal Notice" />
            </Link>
            <span>•</span>
            <Link href="/privacy" className="hover:text-white underline-offset-4 hover:underline">
              <UiText text="Privacy Policy" />
            </Link>
            <span>•</span>
            <Link href="/cookies" className="hover:text-white underline-offset-4 hover:underline">
              <UiText text="Cookie Policy" />
            </Link>
            <span>•</span>
            <button
              type="button"
              onClick={() => window.dispatchEvent(new CustomEvent('open-cookie-banner'))}
              className="hover:text-white underline-offset-4 hover:underline"
            >
              <UiText text="Cookie Preferences" />
            </button>
            <span>•</span>
            <div className="inline-flex items-center gap-1" role="group" aria-label={t('settings_language')}>
              {(['en', 'es', 'vi'] as Lang[]).map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => setLang(code)}
                  className={`px-1.5 py-0.5 rounded text-[10px] uppercase transition-colors ${
                    lang === code
                      ? 'bg-red-600/80 text-white font-semibold'
                      : 'text-zinc-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {code}
                </button>
              ))}
            </div>
            <span>•</span>
            <a
              href="https://discord.gg/rdZWbHVYh"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white inline-flex items-center gap-1"
            >
              <i className="fa-brands fa-discord" />
              Discord
            </a>
          </nav>
        </div>
      </footer>
    </div>
  );
}