// src/app/api/admin/stats/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/server/auth';
import { readDb } from '@/lib/server/store';

export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (auth.errorResponse) return auth.errorResponse;

  const db = readDb();
  return NextResponse.json({
    totalServers: db.panelServers.length,
    totalUsers: Object.keys(db.users).length,
    totalLogs: db.logs.length,
  });
}
