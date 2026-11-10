// src/app/api/discord/config/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { requireSession } from '@/lib/server/auth';
import { isValidDiscordWebhookUrl } from '@/lib/server/firewall';
import { appendAudit, readDb, updateDb } from '@/lib/server/store';

export async function GET(req: NextRequest) {
  const auth = await requireSession(req);
  if (auth.errorResponse) return auth.errorResponse;

  const db = readDb();
  const server = db.panelServers[0];
  return NextResponse.json({
    webhookUrl: server?.webhookUrl || null,
    enabled: Boolean(server?.webhookEnabled),
  });
}

export async function POST(req: NextRequest) {
  const auth = await requireSession(req);
  if (auth.errorResponse) return auth.errorResponse;

  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const webhookUrl = typeof body.webhookUrl === 'string' ? body.webhookUrl.trim() : undefined;
  if (webhookUrl && !isValidDiscordWebhookUrl(webhookUrl)) {
    return NextResponse.json({ error: 'Invalid Discord webhook URL' }, { status: 400 });
  }

  const updated = updateDb((db) => {
    const server = db.panelServers[0];
    if (!server) return null;
    if (webhookUrl) server.webhookUrl = webhookUrl;
    if (typeof body.enabled === 'boolean') server.webhookEnabled = body.enabled;
    appendAudit(db, 'update_webhook', auth.session.username, server.id);
    return { webhookUrl: server.webhookUrl, enabled: server.webhookEnabled };
  });

  if (!updated) {
    return NextResponse.json({ error: 'No server configured' }, { status: 404 });
  }
  return NextResponse.json(updated);
}
