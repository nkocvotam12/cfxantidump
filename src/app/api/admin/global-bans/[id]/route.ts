// src/app/api/admin/global-bans/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/server/auth';
import { appendAudit, updateDb } from '@/lib/server/store';

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin(req);
  if (auth.errorResponse) return auth.errorResponse;

  const { id } = await context.params;
  const removed = updateDb((db) => {
    const idx = db.globalBans.findIndex((b) => b.id === id);
    if (idx === -1) return null;
    const [ban] = db.globalBans.splice(idx, 1);
    const hist = db.globalBanHistory.find((h) => h.ip === ban.ip && !h.unbannedAt);
    if (hist) {
      hist.unbannedAt = new Date().toISOString();
    }
    appendAudit(db, 'delete_global_ban', auth.session.username, ban.ip);
    return ban;
  });

  if (!removed) {
    return NextResponse.json({ error: 'Global ban not found' }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
