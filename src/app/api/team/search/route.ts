// src/app/api/team/search/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { requireSession } from '@/lib/server/auth';
import { readDb } from '@/lib/server/store';

export async function GET(req: NextRequest) {
  const auth = await requireSession(req);
  if (auth.errorResponse) return auth.errorResponse;

  const q = req.nextUrl.searchParams.get('q')?.trim().toLowerCase() || '';
  if (!q) {
    return NextResponse.json([]);
  }

  const db = readDb();
  const teamIds = new Set(db.teamMembers.map((m) => m.id));
  const matches = Object.values(db.users)
    .filter(
      (u) =>
        u.id.toLowerCase().includes(q) ||
        u.username.toLowerCase().includes(q) ||
        (u.email || '').toLowerCase().includes(q)
    )
    .slice(0, 20)
    .map((u) => ({
      id: u.id,
      username: u.username,
      email: u.email,
      avatar: u.avatar,
      alreadyAdded: teamIds.has(u.id),
    }));

  return NextResponse.json(matches);
}
