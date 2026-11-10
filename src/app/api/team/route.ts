// src/app/api/team/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { requireSession } from '@/lib/server/auth';
import { readDb, TeamMember, updateDb } from '@/lib/server/store';

export async function GET(req: NextRequest) {
  const auth = await requireSession(req);
  if (auth.errorResponse) return auth.errorResponse;

  const db = readDb();
  return NextResponse.json(db.teamMembers);
}

export async function POST(req: NextRequest) {
  const auth = await requireSession(req);
  if (auth.errorResponse) return auth.errorResponse;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const userId =
    body && typeof body === 'object' && typeof (body as { userId?: unknown }).userId === 'string'
      ? (body as { userId: string }).userId.trim()
      : '';

  if (!userId) {
    return NextResponse.json({ error: 'userId is required' }, { status: 400 });
  }

  const result = updateDb((db) => {
    const existingMember = db.teamMembers.find((m) => m.id === userId);
    if (existingMember) {
      return { status: 409 as const, member: existingMember };
    }

    const user = db.users[userId];
    if (!user) {
      return { status: 404 as const };
    }

    const member: TeamMember = {
      id: user.id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      role: user.role === 'super_admin' || user.role === 'admin' ? 'admin' : 'user',
      permissions: {
        logs: true,
        discord: false,
        iplists: false,
        team: false,
      },
    };
    db.teamMembers.push(member);
    return { status: 201 as const, member };
  });

  if (result.status === 404) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }
  if (result.status === 409) {
    return NextResponse.json({ error: 'User is already in the team', member: result.member }, { status: 409 });
  }
  return NextResponse.json({ ok: true, member: result.member }, { status: 201 });
}
