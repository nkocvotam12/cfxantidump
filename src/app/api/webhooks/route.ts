// src/app/api/logs/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const qs = req.nextUrl.searchParams;
  const filters = {
    ip: qs.get('ip'),
    path: qs.get('path'),
    country: qs.get('country'),
    action: qs.get('action'),
    from: qs.get('from'),
    to: qs.get('to'),
  };
  // TODO: query DB
  return NextResponse.json({ logs: [] });
}