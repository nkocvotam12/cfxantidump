// src/app/api/ip-filters/[id]/route.ts
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
    const idx = db.ipFilters.findIndex((f) => f.id === id);
    if (idx === -1) return null;
    const [entry] = db.ipFilters.splice(idx, 1);
    appendAudit(db, 'delete_ip_filter', auth.session.username, `${entry.list}:${entry.value}`);
    return entry;
  });

  if (!removed) {
    return NextResponse.json({ error: 'Filter not found' }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
