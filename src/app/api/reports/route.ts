// src/app/api/reports/route.ts
import crypto from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { requireSession } from '@/lib/server/auth';
import { updateDb } from '@/lib/server/store';

export async function POST(req: NextRequest) {
  const auth = await requireSession(req);
  if (auth.errorResponse) return auth.errorResponse;

  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const title = typeof body.title === 'string' ? body.title.trim().slice(0, 150) : '';
  const description = typeof body.description === 'string' ? body.description.trim().slice(0, 2000) : '';
  if (!title || !description) {
    return NextResponse.json({ error: 'Title and description are required' }, { status: 400 });
  }

  const report = updateDb((db) => {
    const entry = {
      id: `rep_${crypto.randomBytes(6).toString('hex')}`,
      userId: auth.session.id,
      username: auth.session.username,
      title,
      description,
      createdAt: new Date().toISOString(),
    };
    db.reports.unshift(entry);
    return entry;
  });

  return NextResponse.json({ ok: true, id: report.id }, { status: 201 });
}
