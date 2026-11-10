// src/app/api/ingest/event/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/server/auth';
import {
  evaluateAndRecordEvent,
  extractClientIp,
  findServerByKey,
  safeTimingEqual,
} from '@/lib/server/firewall';
import { readDb } from '@/lib/server/store';

export async function POST(req: NextRequest) {
  const apiKey = req.headers.get('x-api-key')?.trim() || null;
  const workerSecret = req.headers.get('x-worker-secret')?.trim() || null;
  const configuredWorkerSecret = process.env.CDN_WORKER_SECRET?.trim() || null;

  const db = readDb();
  const serverByKey = apiKey ? findServerByKey(db, apiKey) : null;
  const workerAuthed = Boolean(configuredWorkerSecret && safeTimingEqual(workerSecret, configuredWorkerSecret));
  const session = !serverByKey && !workerAuthed ? await getSession(req) : null;

  if (!serverByKey && !workerAuthed && !session) {
    return NextResponse.json({ error: 'Unauthorized ingest request' }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const ip =
    typeof body.ip === 'string' && body.ip.trim()
      ? body.ip.trim()
      : extractClientIp(req.headers);

  const forcedAction =
    body.forcedAction === 'block' || body.forcedAction === 'challenge' || body.forcedAction === 'log'
      ? body.forcedAction
      : undefined;

  const evaluation = evaluateAndRecordEvent({
    serverId: typeof body.serverId === 'string' ? body.serverId : serverByKey?.id,
    ip,
    host: typeof body.host === 'string' ? body.host : req.headers.get('host') || 'localhost',
    path: typeof body.path === 'string' ? body.path : '/',
    method: typeof body.method === 'string' ? body.method : 'GET',
    country: typeof body.country === 'string' ? body.country : undefined,
    coordinates:
      Array.isArray(body.coordinates) &&
      body.coordinates.length === 2 &&
      typeof body.coordinates[0] === 'number' &&
      typeof body.coordinates[1] === 'number'
        ? [body.coordinates[0], body.coordinates[1]]
        : undefined,
    asn: typeof body.asn === 'string' ? body.asn : undefined,
    userAgent: typeof body.userAgent === 'string' ? body.userAgent : req.headers.get('user-agent') || '',
    body: typeof body.body === 'string' ? body.body : undefined,
    token: typeof body.token === 'string' ? body.token : undefined,
    requireToken: Boolean(body.requireToken),
    forcedAction,
    forcedRule: typeof body.forcedRule === 'string' ? body.forcedRule : undefined,
  });

  return NextResponse.json({
    allowed: evaluation.allowed,
    action: evaluation.action,
    rule: evaluation.rule,
    rayId: evaluation.rayId,
    autoBanned: evaluation.autoBanned,
  });
}
