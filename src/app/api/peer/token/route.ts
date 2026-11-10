// src/app/api/peer/token/route.ts
import { NextRequest, NextResponse } from 'next/server';
import {
  extractClientIp,
  findServerByKey,
  safeTimingEqual,
  signCacheToken,
} from '@/lib/server/firewall';
import { readDb } from '@/lib/server/store';

export async function POST(req: NextRequest) {
  const apiKey = req.headers.get('x-api-key')?.trim() || null;
  const peerKey = req.headers.get('x-peer-key')?.trim() || null;

  if (!apiKey || !peerKey) {
    return NextResponse.json({ error: 'Missing API or Peer key' }, { status: 401 });
  }

  let body: Record<string, unknown> = {};
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const db = readDb();
  const server = findServerByKey(db, apiKey, peerKey);
  if (!server || !safeTimingEqual(server.apiKey, apiKey) || !safeTimingEqual(server.peerKey, peerKey)) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const callerIp = extractClientIp(req.headers);
  if (server.lockedIp && server.lockedIp !== callerIp) {
    return NextResponse.json({ error: 'IP Lock mismatch' }, { status: 403 });
  }

  const playerIp = typeof body.ip === 'string' && body.ip.trim() ? body.ip.trim() : '127.0.0.1';
  const playerId = typeof body.playerId === 'string' && body.playerId.trim() ? body.playerId.trim() : 'anonymous';
  const resource = typeof body.resource === 'string' ? body.resource.trim() : undefined;

  const token = signCacheToken(server.peerKey!, {
    serverId: server.id,
    ip: playerIp,
    playerId,
    resource,
  });

  return NextResponse.json({ token, expiresIn: 120 });
}
