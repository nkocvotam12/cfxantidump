// src/app/api/team/[id]/permissions/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { requireSession } from '@/lib/server/auth';
import { updateDb } from '@/lib/server/store';

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const auth = await requireSession(req);
  if (auth.errorResponse) return auth.errorResponse;

  const { id } = await context.params;
  if (!id) {
    return NextResponse.json({ error: 'Member ID required' }, { status: 400 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  if (!body || typeof body !== 'object') {
    return NextResponse.json({ error: 'Invalid permissions payload' }, { status: 400 });
  }

  const perms = body as Record<string, unknown>;
  const result = updateDb((db) => {
    const member = db.teamMembers.find((m) => m.id === id);
    if (!member) return { status: 404 as const };
    if (member.role === 'master' || member.role === 'owner') {
      return { status: 403 as const };
    }
    member.permissions = {
      logs: typeof perms.logs === 'boolean' ? perms.logs : member.permissions.logs,
      discord: typeof perms.discord === 'boolean' ? perms.discord : member.permissions.discord,
      iplists: typeof perms.iplists === 'boolean' ? perms.iplists : member.permissions.iplists,
      team: typeof perms.team === 'boolean' ? perms.team : member.permissions.team,
    };
    return { status: 200 as const, member };
  });

  if (result.status === 404) {
    return NextResponse.json({ error: 'Member not found' }, { status: 404 });
  }
  if (result.status === 403) {
    return NextResponse.json({ error: 'Master/Owner permissions cannot be changed' }, { status: 403 });
  }
  return NextResponse.json({ ok: true, member: result.member });
}
