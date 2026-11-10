// src/app/auth/me/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/server/auth';

export async function GET(req: NextRequest) {
  const session = await getSession(req);
  if (!session) {
    return new NextResponse(null, { status: 401 });
  }
  return NextResponse.json({
    id: session.id,
    username: session.username,
    email: session.email ?? null,
    avatar: session.avatar ?? null,
    role: session.role,
  });
}
