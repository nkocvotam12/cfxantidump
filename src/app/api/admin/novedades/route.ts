// src/app/api/admin/novedades/route.ts
import crypto from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/server/auth';
import { NewsEntry, readDb, updateDb } from '@/lib/server/store';

export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (auth.errorResponse) return auth.errorResponse;

  const db = readDb();
  return NextResponse.json(db.news);
}

export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (auth.errorResponse) return auth.errorResponse;

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

  if (!title || !msg) {
    return NextResponse.json({ error: 'Title and body are required' }, { status: 400 });
  }

  const created = updateDb((db) => {
    const item: NewsEntry = {
      id: `news_${crypto.randomBytes(6).toString('hex')}`,
      title,
      body: msg,
      type,
      pinned,
      author: auth.session.username,
      createdAt: new Date().toISOString(),
    };
    db.news.unshift(item);
    return item;
  });

  return NextResponse.json(created, { status: 201 });
}
