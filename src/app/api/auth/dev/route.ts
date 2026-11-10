// src/app/api/auth/dev/route.ts
import { NextRequest, NextResponse } from 'next/server';
import {
  createSessionToken,
  SESSION_COOKIE_NAME,
  SESSION_TTL_SECONDS,
  UserRole,
} from '@/lib/server/auth';
import { updateDb } from '@/lib/server/store';

function isDevAuthAllowed(): boolean {
  return process.env.NODE_ENV !== 'production';
}

export async function POST(req: NextRequest) {
  if (!isDevAuthAllowed()) {
    return NextResponse.json({ error: 'Dev auth is disabled in production' }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    body = {};
  }

  const obj = body && typeof body === 'object' ? (body as Record<string, unknown>) : {};
  const role: UserRole =
    obj.role === 'super_admin' || obj.role === 'admin' || obj.role === 'user'
      ? obj.role
      : 'super_admin';

  const rawId = typeof obj.id === 'string' && /^\d{5,20}$/.test(obj.id.trim()) ? obj.id.trim() : null;
  const id = rawId || (role === 'user' ? '100000000000000002' : '100000000000000001');
  const rawUsername = typeof obj.username === 'string' ? obj.username.trim().slice(0, 32) : '';
  const username = rawUsername || (role === 'user' ? 'dev_user' : 'dev_admin');

  const stored = updateDb((db) => {
    const existing = db.users[id];
    const user = {
      id,
      username,
      email: existing?.email || `${username}@local.dev`,
      avatar: existing?.avatar,
      role,
      joinedAt: existing?.joinedAt || new Date().toISOString(),
    };
    db.users[id] = user;
    return user;
  });

  const token = createSessionToken({
    id: stored.id,
    username: stored.username,
    email: stored.email ?? null,
    avatar: stored.avatar ?? null,
    role: stored.role,
  });

  const res = NextResponse.json({ ok: true, user: stored });
  res.cookies.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    maxAge: SESSION_TTL_SECONDS,
    path: '/',
  });
  return res;
}
