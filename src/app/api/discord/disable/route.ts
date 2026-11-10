// src/app/api/discord/disable/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { requireSession } from '@/lib/server/auth';
import { appendAudit, updateDb } from '@/lib/server/store';

export async function POST(req: NextRequest) {
  const auth = await requireSession(req);
  if (auth.errorResponse) return auth.errorResponse;

  updateDb((db) => {
    const server = db.panelServers[0];
    if (server) {
      server.webhookEnabled = false;
      appendAudit(db, 'update_webhook', auth.session.username, `${server.id}:disabled`);
    }
  });

  return NextResponse.json({ ok: true });
}
