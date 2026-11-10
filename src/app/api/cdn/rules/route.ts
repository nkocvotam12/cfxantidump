// src/app/api/cdn/rules/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/server/auth';
import { listCdnServers } from '@/lib/server/cdnGist';
import { getActiveRulesSnapshot, safeTimingEqual } from '@/lib/server/firewall';
import { readDb } from '@/lib/server/store';

export async function GET(req: NextRequest) {
  const workerSecret = req.headers.get('x-worker-secret')?.trim() || null;
  const configuredWorkerSecret = process.env.CDN_WORKER_SECRET?.trim() || null;
  const workerAuthed = Boolean(configuredWorkerSecret && safeTimingEqual(workerSecret, configuredWorkerSecret));

  if (!workerAuthed) {
    const session = await getSession(req);
    if (!session || (session.role !== 'admin' && session.role !== 'super_admin')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  const db = readDb();
  const { servers } = await listCdnServers();
  const panelByDomain = new Map(db.panelServers.map((s) => [s.domain, s]));

  return NextResponse.json({
    servers: servers.map((s) => ({
      ...s,
      peerKey: panelByDomain.get(s.id)?.peerKey,
    })),
    ...getActiveRulesSnapshot(),
  });
}
