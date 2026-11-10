// src/app/api/discord/test/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { requireSession } from '@/lib/server/auth';
import { isValidDiscordWebhookUrl, sendDiscordAlert } from '@/lib/server/firewall';
import { readDb } from '@/lib/server/store';

export async function POST(req: NextRequest) {
  const auth = await requireSession(req);
  if (auth.errorResponse) return auth.errorResponse;

  let candidateUrl: string | undefined;
  try {
    const body = (await req.json()) as { webhookUrl?: unknown };
    if (typeof body?.webhookUrl === 'string' && body.webhookUrl.trim()) {
      candidateUrl = body.webhookUrl.trim();
    }
  } catch {
    // Empty JSON body falls back to saved webhook URL
  }

  if (candidateUrl && !isValidDiscordWebhookUrl(candidateUrl)) {
    return NextResponse.json({ error: 'Invalid Discord webhook URL' }, { status: 400 });
  }

  const db = readDb();
  const server = db.panelServers[0];
  const targetUrl = candidateUrl || server?.webhookUrl;
  if (!targetUrl) {
    return NextResponse.json({ error: 'Webhook URL is not configured' }, { status: 400 });
  }

  const ok = await sendDiscordAlert(
    targetUrl,
    {
      id: 'test_evt',
      serverId: server?.id || 'srv_default',
      ip: '192.0.2.100',
      host: server?.domain || 'localhost',
      path: '/cache/test/resource.rpf',
      method: 'GET',
      action: 'block',
      country: 'VN',
      timestamp: new Date().toISOString(),
      suspicious: true,
      rayId: 'test_ray_0001',
      rule: 'webhook_test',
      asn: 'AS0000',
      userAgent: 'CFX-AntiDump-Test',
      attempts: 1,
    },
    true
  );

  if (!ok) {
    return NextResponse.json({ error: 'Failed to deliver Discord test message' }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
