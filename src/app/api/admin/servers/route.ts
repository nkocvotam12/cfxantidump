// src/app/api/admin/servers/route.ts
import crypto from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/server/auth';
import { appendAudit, generateServerKey, readDb, updateDb } from '@/lib/server/store';

export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (auth.errorResponse) return auth.errorResponse;

  const db = readDb();
  return NextResponse.json(
    db.panelServers.map((s) => ({
      id: s.id,
      label: s.label,
      domain: s.domain,
      ownerId: s.ownerId,
      ownerUsername: s.ownerUsername,
      eventsCount: s.eventsCount,
      usersCount: s.usersCount,
      webhookEnabled: s.webhookEnabled,
      lockedIp: s.lockedIp || null,
      hasApiKey: Boolean(s.apiKey),
      hasPeerKey: Boolean(s.peerKey),
    }))
  );
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

  const label = typeof body.label === 'string' ? body.label.trim().slice(0, 80) : '';
  const domain = typeof body.domain === 'string' ? body.domain.trim().slice(0, 120) : '';
  const ownerInput = typeof body.ownerId === 'string' ? body.ownerId.trim() : '';

  if (!label) {
    return NextResponse.json({ error: 'Server label is required' }, { status: 400 });
  }

  const created = updateDb((db) => {
    const owner = ownerInput
      ? db.users[ownerInput] ||
        Object.values(db.users).find((u) => u.username.toLowerCase() === ownerInput.toLowerCase())
      : db.users[auth.session.id];

    const srv = {
      id: `srv_${crypto.randomBytes(6).toString('hex')}`,
      label,
      domain: domain || null,
      ownerId: owner?.id ?? auth.session.id,
      ownerUsername: owner?.username ?? auth.session.username,
      eventsCount: 0,
      usersCount: 1,
      webhookEnabled: false,
      webhookUrl: null,
      apiKey: generateServerKey('adk'),
      peerKey: generateServerKey('peer'),
      lockedIp: null,
      createdAt: new Date().toISOString(),
    };
    db.panelServers.push(srv);
    appendAudit(db, 'create_server', auth.session.username, srv.id);
    return srv;
  });

  return NextResponse.json(created, { status: 201 });
}
