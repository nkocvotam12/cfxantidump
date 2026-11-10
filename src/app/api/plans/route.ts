// src/app/api/plans/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { requireSession } from '@/lib/server/auth';
import { readDb } from '@/lib/server/store';

export async function GET(req: NextRequest) {
  const auth = await requireSession(req);
  if (auth.errorResponse) return auth.errorResponse;

  const db = readDb();
  const plans = db.subscriptions.filter(
    (s) => !s.hidden && s.discordUserId === auth.session.id
  );
  return NextResponse.json(plans);
}
