// src/app/api/peer/auth/route.ts
import { NextRequest, NextResponse } from 'next/server';
import {
  extractClientIp,
  findServerByKey,
  getActiveRulesSnapshot,
  safeTimingEqual,
} from '@/lib/server/firewall';
import { updateDb } from '@/lib/server/store';

export async function POST(req: NextRequest) {
  const apiKey = req.headers.get('x-api-key')?.trim() || null;
  const peerKey = req.headers.get('x-peer-key')?.trim() || null;

  if (!apiKey || !peerKey) {
    return NextResponse.json({ authenticated: false, error: 'Missing API or Peer key' }, { status: 401 });
  }

  let body: Record<string, unknown> = {};
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    body = {};
  }

  const serverIp = extractClientIp(
    req.headers,
    typeof body.serverIp === 'string' ? body.serverIp : undefined
  );

  const authResult = updateDb((db) => {
    const server = findServerByKey(db, apiKey, peerKey);
    if (!server || !safeTimingEqual(server.apiKey, apiKey) || !safeTimingEqual(server.peerKey, peerKey)) {
      return { ok: false as const, status: 401, error: 'Invalid credentials' };
    }

    if (server.lockedIp && server.lockedIp !== serverIp) {
      return {
        ok: false as const,
        status: 403,
        error: `IP Lock mismatch (locked to ${server.lockedIp}, received ${serverIp})`,
      };
    }

    if (!server.lockedIp) {
      server.lockedIp = serverIp;
    }

    return {
      ok: true as const,
      serverId: server.id,
      domain: server.domain,
      lockedIp: server.lockedIp,
    };
  });

  if (!authResult.ok) {
    return NextResponse.json({ authenticated: false, error: authResult.error }, { status: authResult.status });
  }

  return NextResponse.json({
    authenticated: true,
    serverId: authResult.serverId,
    domain: authResult.domain,
    lockedIp: authResult.lockedIp,
    rules: getActiveRulesSnapshot(),
  });
}
