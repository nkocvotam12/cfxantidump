// src/app/not-found.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { UiText } from '@/components/ui/UiText';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#050505] text-[#f5f5f5] flex flex-col justify-between selection:bg-red-500/30 relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(127,29,29,0.18),transparent_55%)]" />
        <div className="absolute -left-32 -top-32 w-96 h-96 rounded-full bg-red-900/10 blur-[120px]" />
        <div className="absolute -right-32 -bottom-32 w-96 h-96 rounded-full bg-red-900/10 blur-[120px]" />
      </div>

      <header className="relative z-10 border-b border-white/10 bg-black/30 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
            <div className="relative w-8 h-8">
              <Image src="/antidumpicon.png" alt="CFX AntiDump" fill className="object-contain" sizes="32px" priority />
            </div>
            <span className="font-bold text-lg text-white">CFX AntiDump</span>
          </Link>
          <Link href="/" className="text-xs sm:text-sm font-medium text-zinc-300 hover:text-white flex items-center gap-2 border border-white/10 hover:border-white/25 px-3 py-1.5 rounded-lg transition-all">
            <i className="fa-solid fa-house text-xs" />
            <UiText text="Home" />
          </Link>
        </div>
      </header>

      <main className="relative z-10 max-w-2xl mx-auto px-4 py-16 text-center my-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-mono uppercase tracking-wider mb-6">
          <i className="fa-solid fa-triangle-exclamation text-xs" />
          <UiText text="Error 404" />
        </div>

        <div className="relative mb-6">
          <h1 className="text-8xl sm:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-zinc-200 to-zinc-600 tracking-tighter select-none drop-shadow-[0_0_35px_rgba(239,68,68,0.3)]">
            404
          </h1>
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
          <UiText text="Security Perimeter: Resource Not Found" />
        </h2>
        <p className="text-zinc-400 text-sm sm:text-base max-w-md mx-auto mb-8 leading-relaxed">
          <UiText text="The requested route or sector does not exist, has been restricted, or was relocated under heightened security policies." />
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/" className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-sm shadow-[0_0_20px_rgba(239,68,68,0.4)] transition-all flex items-center justify-center gap-2">
            <i className="fa-solid fa-arrow-left text-xs" />
            <UiText text="Return to Safety" />
          </Link>
          <Link href="/dashboard" className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 text-white font-semibold text-sm transition-all flex items-center justify-center gap-2">
            <i className="fa-solid fa-shield text-xs text-red-400" />
            <UiText text="Open Dashboard" />
          </Link>
          <a href="https://discord.gg/rdZWbHVYh" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#5865F2]/10 hover:bg-[#5865F2]/20 border border-[#5865F2]/30 text-indigo-300 font-semibold text-sm transition-all flex items-center justify-center gap-2">
            <i className="fa-brands fa-discord text-sm" />
            <UiText text="Discord Support" />
          </a>
        </div>
      </main>

      <footer className="relative z-10 border-t border-white/10 py-6 bg-black/40 text-xs text-zinc-400">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} <UiText text="CFX AntiDump. System online & protected." /></p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-white transition-colors"><UiText text="Privacy Policy" /></Link>
            <span>•</span>
            <Link href="/legal-notice" className="hover:text-white transition-colors"><UiText text="Legal Notice" /></Link>
            <span>•</span>
            <Link href="/cookies" className="hover:text-white transition-colors"><UiText text="Cookie Policy" /></Link>
          </div>
        </div>
      </footer>
    </div>
  );
}