// src/app/auth/discord/route.ts
import crypto from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import {
  createSessionToken,
  isAdminDiscordId,
  SESSION_COOKIE_NAME,
  SESSION_TTL_SECONDS,
  UserRole,
} from '@/lib/server/auth';
import { updateDb } from '@/lib/server/store';

const OAUTH_STATE_COOKIE = 'discord_oauth_state';

function safeRedirectError(req: NextRequest): NextResponse {
  return NextResponse.redirect(new URL('/auth/error', req.url));
}

function getRedirectUri(req: NextRequest): string {
  return process.env.DISCORD_REDIRECT_URI?.trim() || `${req.nextUrl.origin}/auth/discord`;
}

function isConfiguredValue(val: string | undefined): val is string {
  if (!val) return false;
  const trimmed = val.trim();
  return trimmed.length > 0 && trimmed !== '...' && !trimmed.startsWith('your_');
}

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const oauthError = searchParams.get('error');

  if (oauthError) {
    return safeRedirectError(req);
  }

  const rawClientId = process.env.DISCORD_CLIENT_ID;
  const rawClientSecret = process.env.DISCORD_CLIENT_SECRET;
  if (!isConfiguredValue(rawClientId) || !isConfiguredValue(rawClientSecret)) {
    if (process.env.NODE_ENV !== 'production') {
      return NextResponse.redirect(new URL('/auth/dev', req.url));
    }
    console.error('[auth/discord] DISCORD_CLIENT_ID or DISCORD_CLIENT_SECRET is missing.');
    return safeRedirectError(req);
  }
  const clientId = rawClientId.trim();
  const clientSecret = rawClientSecret.trim();

  const redirectUri = getRedirectUri(req);

  // Step 1: Initiate Discord OAuth2 authorization redirect when no code is present
  if (!code) {
    const newState = crypto.randomBytes(24).toString('hex');
    const authUrl = new URL('https://discord.com/oauth2/authorize');
    authUrl.searchParams.set('client_id', clientId);
    authUrl.searchParams.set('redirect_uri', redirectUri);
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('scope', 'identify email');
    authUrl.searchParams.set('state', newState);

    const res = NextResponse.redirect(authUrl);
    res.cookies.set(OAUTH_STATE_COOKIE, newState, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 600,
      path: '/auth/discord',
    });
    return res;
  }

  // Step 2: Verify CSRF state cookie before exchanging authorization code
  const expectedState = req.cookies.get(OAUTH_STATE_COOKIE)?.value;
  if (!state || !expectedState) {
    return safeRedirectError(req);
  }
  const stateBuf = Buffer.from(state, 'utf8');
  const expectedBuf = Buffer.from(expectedState, 'utf8');
  if (stateBuf.length !== expectedBuf.length || !crypto.timingSafeEqual(stateBuf, expectedBuf)) {
    return safeRedirectError(req);
  }

  try {
    const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
      }),
    });

    const tokenData = (await tokenResponse.json()) as { access_token?: string; error?: string };
    if (!tokenResponse.ok || !tokenData.access_token) {
      throw new Error(tokenData.error || 'Token exchange failed');
    }

    const userResponse = await fetch('https://discord.com/api/users/@me', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const userData = (await userResponse.json()) as {
      id?: string;
      username?: string;
      global_name?: string;
      avatar?: string | null;
      email?: string | null;
    };

    if (!userResponse.ok || !userData.id || !userData.username) {
      throw new Error('Failed to fetch Discord user profile');
    }

    const avatarUrl = userData.avatar
      ? `https://cdn.discordapp.com/avatars/${userData.id}/${userData.avatar}.png`
      : null;

    const storedUser = updateDb((db) => {
      const existing = db.users[userData.id!];
      const defaultRole: UserRole = isAdminDiscordId(userData.id!) ? 'super_admin' : 'user';
      const role: UserRole = isAdminDiscordId(userData.id!)
        ? 'super_admin'
        : existing?.role || defaultRole;

      const updated = {
        id: userData.id!,
        username: userData.global_name || userData.username!,
        email: userData.email ?? existing?.email,
        avatar: avatarUrl ?? existing?.avatar,
        role,
        joinedAt: existing?.joinedAt || new Date().toISOString(),
      };
      db.users[updated.id] = updated;
      return updated;
    });

    const sessionToken = createSessionToken({
      id: storedUser.id,
      username: storedUser.username,
      email: storedUser.email ?? null,
      avatar: storedUser.avatar ?? null,
      role: storedUser.role,
    });

    const response = NextResponse.redirect(new URL('/dashboard', req.url));
    response.cookies.set(SESSION_COOKIE_NAME, sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: SESSION_TTL_SECONDS,
      path: '/',
    });
    response.cookies.delete({ name: OAUTH_STATE_COOKIE, path: '/auth/discord' });
    return response;
  } catch (err) {
    console.error('[auth/discord] OAuth error:', err);
    return safeRedirectError(req);
  }
}
