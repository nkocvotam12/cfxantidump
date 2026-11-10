// src/app/auth/dev/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLang } from '@/hooks/useLang';

export default function DevAuthPage() {
  const router = useRouter();
  const { lang } = useLang();
  const [username, setUsername] = useState('dev_admin');
  const [loadingRole, setLoadingRole] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const labels = {
    en: {
      badge: 'LOCAL DEV LOGIN',
      title: 'Development Sign-In',
      subtitle: 'Discord OAuth2 keys are not configured yet. Choose a local test account to enter the panel.',
      usernameLabel: 'Test Username',
      adminBtn: 'Sign in as Super Admin',
      userBtn: 'Sign in as User',
      back: 'Back to Login',
      failed: 'Dev sign-in is disabled or failed.',
    },
    es: {
      badge: 'ACCESO DEV LOCAL',
      title: 'Inicio de sesión de desarrollo',
      subtitle: 'Las claves de Discord OAuth2 aún no están configuradas. Elige una cuenta local de prueba.',
      usernameLabel: 'Usuario de prueba',
      adminBtn: 'Entrar como Super Admin',
      userBtn: 'Entrar como Usuario',
      back: 'Volver al inicio',
      failed: 'El acceso dev está desactivado o falló.',
    },
    vi: {
      badge: 'ĐĂNG NHẬP DEV LOCAL',
      title: 'Đăng nhập chế độ phát triển',
      subtitle: 'Chưa cấu hình Discord OAuth2 thật. Chọn tài khoản test cục bộ để vào bảng điều khiển.',
      usernameLabel: 'Tên tài khoản test',
      adminBtn: 'Đăng nhập quyền Super Admin',
      userBtn: 'Đăng nhập quyền User',
      back: 'Quay lại đăng nhập',
      failed: 'Đăng nhập Dev bị tắt hoặc thất bại.',
    },
  }[lang];

  const signIn = async (role: 'super_admin' | 'user') => {
    setLoadingRole(role);
    setError(null);
    try {
      const res = await fetch('/api/auth/dev', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          role,
          username: username.trim() || (role === 'user' ? 'dev_user' : 'dev_admin'),
        }),
      });
      if (!res.ok) {
        setError(labels.failed);
        return;
      }
      router.replace('/dashboard');
    } catch {
      setError(labels.failed);
    } finally {
      setLoadingRole(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md border border-white/10 bg-black/60 backdrop-blur-md rounded-2xl p-6 sm:p-8 space-y-5 shadow-[0_10px_40px_rgba(0,0,0,0.6)]">
        <div className="text-center space-y-2">
          <span className="inline-block text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400">
            {labels.badge}
          </span>
          <h1 className="text-xl font-bold">{labels.title}</h1>
          <p className="text-xs text-zinc-400 leading-relaxed">{labels.subtitle}</p>
        </div>

        {error && (
          <div className="p-2.5 rounded-lg bg-red-500/10 border border-red-500/30 text-xs text-red-400 text-center">
            {error}
          </div>
        )}

        <div>
          <label className="block text-xs font-medium text-zinc-400 mb-1.5">{labels.usernameLabel}</label>
          <input
            className="input w-full"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="dev_admin"
          />
        </div>

        <div className="space-y-2.5">
          <button
            type="button"
            disabled={!!loadingRole}
            onClick={() => signIn('super_admin')}
            className="w-full h-11 rounded-xl bg-red-600 hover:bg-red-500 text-white text-sm font-semibold transition-all disabled:opacity-50"
          >
            <i className="fa-solid fa-shield-halved mr-2" />
            {labels.adminBtn}
          </button>
          <button
            type="button"
            disabled={!!loadingRole}
            onClick={() => signIn('user')}
            className="w-full h-11 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-white text-sm font-medium transition-all disabled:opacity-50"
          >
            <i className="fa-solid fa-user mr-2" />
            {labels.userBtn}
          </button>
        </div>

        <div className="text-center pt-2">
          <Link href="/" className="text-xs text-zinc-400 hover:text-white underline-offset-4 hover:underline">
            {labels.back}
          </Link>
        </div>
      </div>
    </div>
  );
}
