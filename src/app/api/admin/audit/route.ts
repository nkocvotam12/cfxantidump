// src/app/api/admin/audit/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/server/auth';
import { readDb } from '@/lib/server/store';

export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (auth.errorResponse) return auth.errorResponse;

  const limitParam = Number(req.nextUrl.searchParams.get('limit') || '50');
  const limit = Number.isFinite(limitParam) && limitParam > 0 ? Math.min(limitParam, 200) : 50;

  const db = readDb();
  return NextResponse.json(db.auditLogs.slice(0, limit));
}
