// src/app/api/team/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { requireSession } from '@/lib/server/auth';
import { updateDb } from '@/lib/server/store';

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const auth = await requireSession(req);
  if (auth.errorResponse) return auth.errorResponse;

  const { id } = await context.params;
  if (!id) {
    return NextResponse.json({ error: 'Member ID required' }, { status: 400 });
  }

  const result = updateDb((db) => {
    const idx = db.teamMembers.findIndex((m) => m.id === id);
    if (idx === -1) return { status: 404 as const };
    const target = db.teamMembers[idx];
    if (target.role === 'master' || target.role === 'owner') {
      return { status: 403 as const };
    }
    db.teamMembers.splice(idx, 1);
    return { status: 200 as const };
  });

  if (result.status === 404) {
    return NextResponse.json({ error: 'Member not found' }, { status: 404 });
  }
  if (result.status === 403) {
    return NextResponse.json({ error: 'Master/Owner accounts cannot be removed' }, { status: 403 });
  }
  return NextResponse.json({ ok: true });
}
