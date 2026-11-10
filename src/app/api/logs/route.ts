// src/app/api/logs/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { requireSession } from '@/lib/server/auth';
import { readDb } from '@/lib/server/store';

export async function GET(req: NextRequest) {
  const auth = await requireSession(req);
  if (auth.errorResponse) return auth.errorResponse;

  const qs = req.nextUrl.searchParams;
  const ip = qs.get('ip')?.trim().toLowerCase() || '';
  const logPath = qs.get('path')?.trim().toLowerCase() || '';
  const country = qs.get('country')?.trim().toLowerCase() || '';
  const action = qs.get('action')?.trim().toLowerCase() || '';
  const from = qs.get('from') ? new Date(qs.get('from')!).getTime() : null;
  const to = qs.get('to') ? new Date(qs.get('to')!).getTime() : null;

  const db = readDb();
  const logs = db.logs.filter((entry) => {
    if (ip && !entry.ip.toLowerCase().includes(ip)) return false;
    if (logPath && !entry.path.toLowerCase().includes(logPath)) return false;
    if (country && !entry.country.toLowerCase().includes(country)) return false;
    if (action && entry.action.toLowerCase() !== action) return false;
    const ts = new Date(entry.timestamp).getTime();
    if (from && Number.isFinite(from) && ts < from) return false;
    if (to && Number.isFinite(to) && ts > to) return false;
    return true;
  });

  return NextResponse.json({ logs });
}
