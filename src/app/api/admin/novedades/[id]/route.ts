// src/app/api/admin/novedades/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/server/auth';
import { updateDb } from '@/lib/server/store';

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin(req);
  if (auth.errorResponse) return auth.errorResponse;

  const { id } = await context.params;
  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const title = typeof body.title === 'string' ? body.title.trim().slice(0, 120) : '';
  const msg = typeof body.body === 'string' ? body.body.trim().slice(0, 2000) : '';
  const type =
    body.type === 'update' || body.type === 'info' || body.type === 'warning' || body.type === 'maintenance'
      ? body.type
      : 'info';
  const pinned = Boolean(body.pinned);

  const updated = updateDb((db) => {
    const item = db.news.find((n) => n.id === id);
    if (!item) return null;
    if (title) item.title = title;
    if (msg) item.body = msg;
    item.type = type;
    item.pinned = pinned;
    return item;
  });

  if (!updated) {
    return NextResponse.json({ error: 'Announcement not found' }, { status: 404 });
  }
  return NextResponse.json(updated);
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin(req);
  if (auth.errorResponse) return auth.errorResponse;

  const { id } = await context.params;
  const removed = updateDb((db) => {
    const idx = db.news.findIndex((n) => n.id === id);
    if (idx === -1) return false;
    db.news.splice(idx, 1);
    return true;
  });

  if (!removed) {
    return NextResponse.json({ error: 'Announcement not found' }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
