// src/app/api/admin/global-bans/history/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/server/auth';
import { readDb } from '@/lib/server/store';

export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (auth.errorResponse) return auth.errorResponse;

  const ip = req.nextUrl.searchParams.get('ip')?.trim() || '';
  if (!ip) return NextResponse.json([]);

  const db = readDb();
  return NextResponse.json(db.globalBanHistory.filter((h) => h.ip === ip));
}
