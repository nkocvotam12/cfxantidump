// src/app/api/admin/users/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/server/auth';
import { readDb } from '@/lib/server/store';

export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (auth.errorResponse) return auth.errorResponse;

  const q = req.nextUrl.searchParams.get('q')?.trim().toLowerCase() || '';
  const page = Math.max(1, Number(req.nextUrl.searchParams.get('page') || '1') || 1);
  const limit = Math.min(100, Math.max(1, Number(req.nextUrl.searchParams.get('limit') || '20') || 20));

  const db = readDb();
  const allUsers = Object.values(db.users)
    .filter(
      (u) =>
        !q ||
        u.id.toLowerCase().includes(q) ||
        u.username.toLowerCase().includes(q) ||
        (u.email || '').toLowerCase().includes(q)
    )
    .map((u) => ({
      ...u,
      serversCount: db.panelServers.filter((s) => s.ownerId === u.id).length,
    }));

  const start = (page - 1) * limit;
  return NextResponse.json({
    users: allUsers.slice(start, start + limit),
    total: allUsers.length,
  });
}
