// src/lib/server/auth.ts
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export type UserRole = 'user' | 'admin' | 'super_admin';

export interface SessionUser {
  id: string;
  username: string;
  email?: string | null;
  avatar?: string | null;
  role: UserRole;
  exp: number;
}

export const SESSION_COOKIE_NAME = 'session';
export const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

const globalForAuth = globalThis as typeof globalThis & {
  __cfxDevSessionSecret?: string;
};

function getSessionSecret(): string {
  const configured = process.env.SESSION_SECRET?.trim();
  if (configured) return configured;

  if (process.env.NODE_ENV === 'production') {
    throw new Error('SESSION_SECRET environment variable must be configured in production.');
  }

  if (globalForAuth.__cfxDevSessionSecret) {
    return globalForAuth.__cfxDevSessionSecret;
  }

  // Persist dev secret under gitignored data/ so `next dev` restarts keep sessions valid.
  const secretFile = path.join(process.cwd(), 'data', '.dev-session-secret');
  try {
    if (fs.existsSync(secretFile)) {
      const saved = fs.readFileSync(secretFile, 'utf8').trim();
      if (saved.length >= 32) {
        globalForAuth.__cfxDevSessionSecret = saved;
        return saved;
      }
    }
    const generated = crypto.randomBytes(32).toString('hex');
    fs.mkdirSync(path.dirname(secretFile), { recursive: true });
    fs.writeFileSync(secretFile, generated, { mode: 0o600 });
    globalForAuth.__cfxDevSessionSecret = generated;
    return generated;
  } catch {
    globalForAuth.__cfxDevSessionSecret = crypto.randomBytes(32).toString('hex');
    return globalForAuth.__cfxDevSessionSecret;
  }
}

function signPayload(payloadB64: string, secret: string): string {
  return crypto.createHmac('sha256', secret).update(payloadB64).digest('base64url');
}

export function createSessionToken(user: Omit<SessionUser, 'exp'>): string {
  const payload: SessionUser = {
    ...user,
    exp: Date.now() + SESSION_TTL_SECONDS * 1000,
  };
  const payloadB64 = Buffer.from(JSON.stringify(payload), 'utf8').toString('base64url');
  const sig = signPayload(payloadB64, getSessionSecret());
  return `${payloadB64}.${sig}`;
}

export function verifySessionToken(token: string | undefined | null): SessionUser | null {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 2) return null;

  const [payloadB64, sigB64] = parts;
  if (!payloadB64 || !sigB64) return null;

  let secret: string;
  try {
    secret = getSessionSecret();
  } catch {
    return null;
  }

  const expectedSig = signPayload(payloadB64, secret);
  const sigBuf = Buffer.from(sigB64, 'utf8');
  const expectedBuf = Buffer.from(expectedSig, 'utf8');
  if (sigBuf.length !== expectedBuf.length || !crypto.timingSafeEqual(sigBuf, expectedBuf)) {
    return null;
  }

  try {
    const parsed = JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf8')) as SessionUser;
    if (!parsed?.id || !parsed?.username || typeof parsed.exp !== 'number') return null;
    if (parsed.exp <= Date.now()) return null;
    return parsed;
  } catch {
    return null;
  }
}

export async function getSession(req?: NextRequest): Promise<SessionUser | null> {
  if (req) {
    const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
    return verifySessionToken(token);
  }
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  return verifySessionToken(token);
}

export async function requireSession(
  req?: NextRequest
): Promise<{ session: SessionUser; errorResponse?: never } | { session?: never; errorResponse: NextResponse }> {
  const session = await getSession(req);
  if (!session) {
    return { errorResponse: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };
  }
  return { session };
}

export async function requireAdmin(
  req?: NextRequest
): Promise<{ session: SessionUser; errorResponse?: never } | { session?: never; errorResponse: NextResponse }> {
  const result = await requireSession(req);
  if (result.errorResponse) return result;
  if (result.session.role !== 'admin' && result.session.role !== 'super_admin') {
    return { errorResponse: NextResponse.json({ error: 'Forbidden' }, { status: 403 }) };
  }
  return result;
}

export function isAdminDiscordId(discordId: string): boolean {
  const raw = process.env.ADMIN_DISCORD_IDS || '';
  const ids = raw
    .split(',')
    .map((v) => v.trim())
    .filter(Boolean);
  return ids.includes(discordId);
}
