// src/app/api/addons/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { requireSession } from '@/lib/server/auth';
import { readDb } from '@/lib/server/store';

export async function GET(req: NextRequest) {
  const auth = await requireSession(req);
  if (auth.errorResponse) return auth.errorResponse;

  const db = readDb();
  const addons = db.addons.filter((a) => !a.userId || a.userId === auth.session.id);
  return NextResponse.json(addons);
}
