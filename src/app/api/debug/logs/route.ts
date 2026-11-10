// src/app/api/debug/logs/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { requireSession } from '@/lib/server/auth';
import { safeTimingEqual } from '@/lib/server/firewall';
import { readDb, updateDb } from '@/lib/server/store';

export async function GET(req: NextRequest) {
  const auth = await requireSession(req);
  if (auth.errorResponse) return auth.errorResponse;

  const db = readDb();
  const oneMinuteAgo = Date.now() - 60_000;
  const rate = db.debugLogs.filter((l) => new Date(l.timestamp).getTime() >= oneMinuteAgo).length;

  return NextResponse.json({
    logs: db.debugLogs,
    rate,
  });
}

export async function DELETE(req: NextRequest) {
  const auth = await requireSession(req);
  if (auth.errorResponse) return auth.errorResponse;

  const provided = req.headers.get('x-debug-secret')?.trim() || '';
  const configured = process.env.DEBUG_SECRET?.trim() || '';

  if (configured) {
    if (!safeTimingEqual(provided, configured)) {
      return NextResponse.json({ error: 'Invalid X-Debug-Secret' }, { status: 403 });
    }
  } else if (process.env.NODE_ENV === 'production' || !provided) {
    return NextResponse.json({ error: 'X-Debug-Secret required' }, { status: 403 });
  }

  updateDb((db) => {
    db.debugLogs = [];
  });

  return NextResponse.json({ ok: true });
}
