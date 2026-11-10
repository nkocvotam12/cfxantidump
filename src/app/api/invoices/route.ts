// src/app/api/invoices/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { requireSession } from '@/lib/server/auth';
import { readDb } from '@/lib/server/store';

export async function GET(req: NextRequest) {
  const auth = await requireSession(req);
  if (auth.errorResponse) return auth.errorResponse;

  const db = readDb();
  const invoices = db.invoices.filter((i) => !i.userId || i.userId === auth.session.id);
  return NextResponse.json(invoices);
}
