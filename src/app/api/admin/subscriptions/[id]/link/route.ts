// src/app/api/admin/subscriptions/[id]/link/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/server/auth';
import { updateDb } from '@/lib/server/store';

export async function PATCH(
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

  const discordUserId =
    typeof body.discordUserId === 'string' && /^\d{17,20}$/.test(body.discordUserId.trim())
      ? body.discordUserId.trim()
      : body.discordUserId === null
        ? undefined
        : null;

  if (discordUserId === null) {
    return NextResponse.json({ error: 'Invalid Discord ID' }, { status: 400 });
  }

  const updated = updateDb((db) => {
    const sub = db.subscriptions.find((s) => s.id === id);
    if (!sub) return null;
    sub.discordUserId = discordUserId;
    return sub;
  });

  if (!updated) {
    return NextResponse.json({ error: 'Subscription not found' }, { status: 404 });
  }
  return NextResponse.json(updated);
}
