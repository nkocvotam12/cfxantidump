// src/app/auth/error/page.tsx
'use client';

import Link from 'next/link';
import { UiText } from '@/components/ui/UiText';
import { useUiText } from '@/hooks/useUiText';

export default function AuthErrorPage() {
  const t = useUiText();
  return (
    <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center p-4 relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(127,29,29,0.18),transparent_55%)]" />
      </div>
      <div className="relative max-w-md w-full text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 mb-5">
          <i className="fa-solid fa-triangle-exclamation text-2xl text-red-400" />
        </div>
        <h1 className="text-2xl font-bold mb-3"><UiText text="Authentication Failed" /></h1>
        <p className="text-sm text-zinc-400 mb-6">
          <UiText text="There was an error signing in with Discord. You may not have permission to access this application." />
        </p>
        <Link href="/" className="btn-primary">
          <i className="fa-solid fa-arrow-left" /> {t('Back to Login')}
        </Link>
      </div>
    </div>
  );
}