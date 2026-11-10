// src/app/api/stats/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { requireSession } from '@/lib/server/auth';
import { readDb } from '@/lib/server/store';

export async function GET(req: NextRequest) {
  const auth = await requireSession(req);
  if (auth.errorResponse) return auth.errorResponse;

  const db = readDb();
  const since24h = Date.now() - 24 * 60 * 60 * 1000;
  const recent24h = db.logs.filter((l) => new Date(l.timestamp).getTime() >= since24h);
  const uniqueIps = new Set(recent24h.map((l) => l.ip)).size;

  return NextResponse.json({
    today: recent24h.length,
    uniqueIps,
    total: db.logs.length,
    active: db.panelServers.length > 0,
  });
}
