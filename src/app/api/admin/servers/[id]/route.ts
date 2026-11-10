// src/app/api/admin/servers/[id]/route.ts
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
    const idx = db.panelServers.findIndex((s) => s.id === id);
    if (idx === -1) return null;
    const [srv] = db.panelServers.splice(idx, 1);
    appendAudit(db, 'delete_server', auth.session.username, srv.id);
    return srv;
  });

  if (!removed) {
    return NextResponse.json({ error: 'Server not found' }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
