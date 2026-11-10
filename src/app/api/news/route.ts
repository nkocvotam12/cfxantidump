// src/app/api/news/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { requireSession } from '@/lib/server/auth';
import { readDb } from '@/lib/server/store';

export async function GET(req: NextRequest) {
  const auth = await requireSession(req);
  if (auth.errorResponse) return auth.errorResponse;

  const db = readDb();
  const sorted = [...db.news].sort((a, b) => Number(b.pinned) - Number(a.pinned));
  return NextResponse.json(sorted);
}
