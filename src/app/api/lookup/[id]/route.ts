// src/app/api/lookup/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { requireSession } from '@/lib/server/auth';
import { readDb } from '@/lib/server/store';

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const auth = await requireSession(req);
  if (auth.errorResponse) return auth.errorResponse;

  const { id } = await context.params;
  if (!/^\d{17,20}$/.test(id)) {
    return NextResponse.json({ error: 'Invalid Discord ID' }, { status: 400 });
  }

  const db = readDb();
  if (db.panelServers.length === 0) {
    return NextResponse.json({ error: 'No active server' }, { status: 403 });
  }

  const user = db.users[id];
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  return NextResponse.json({
    id: user.id,
    username: user.username,
    avatar: user.avatar,
    createdAt: user.joinedAt,
    joinedAt: user.joinedAt,
    roles: [user.role],
    commonServers: [],
  });
}
