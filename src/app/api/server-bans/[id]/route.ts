// src/app/api/server-bans/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { requireSession } from '@/lib/server/auth';
import { appendAudit, updateDb } from '@/lib/server/store';

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const auth = await requireSession(req);
  if (auth.errorResponse) return auth.errorResponse;

  const { id } = await context.params;
  const removed = updateDb((db) => {
    const idx = db.serverBans.findIndex((b) => b.id === id);
    if (idx === -1) return null;
    const [entry] = db.serverBans.splice(idx, 1);
    appendAudit(db, 'delete_global_ban', auth.session.username, entry.ip);
    return entry;
  });

  if (!removed) {
    return NextResponse.json({ error: 'Ban not found' }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
