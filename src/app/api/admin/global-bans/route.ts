// src/app/api/admin/global-bans/route.ts
import crypto from 'node:crypto';
import net from 'node:net';
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/server/auth';
import { appendAudit, readDb, updateDb } from '@/lib/server/store';

export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (auth.errorResponse) return auth.errorResponse;

  const db = readDb();
  return NextResponse.json(db.globalBans);
}

export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (auth.errorResponse) return auth.errorResponse;

  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const ip = typeof body.ip === 'string' ? body.ip.trim() : '';
  const reason = typeof body.reason === 'string' ? body.reason.trim().slice(0, 120) : 'Manual ban';
  if (net.isIP(ip) === 0) {
    return NextResponse.json({ error: 'Valid IP address is required' }, { status: 400 });
  }

  const created = updateDb((db) => {
    const now = new Date().toISOString();
    const serverName = db.panelServers[0]?.label || 'Global';
    const entry = {
      id: `gban_${crypto.randomBytes(6).toString('hex')}`,
      ip,
      reason: reason || 'Manual ban',
      serverName,
      createdAt: now,
    };
    db.globalBans.unshift(entry);
    db.globalBanHistory.unshift({
      id: `ghist_${crypto.randomBytes(6).toString('hex')}`,
      ip,
      serverName,
      bannedAt: now,
    });
    appendAudit(db, 'create_global_ban', auth.session.username, ip);
    return entry;
  });

  return NextResponse.json(created, { status: 201 });
}
