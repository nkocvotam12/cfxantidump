// src/app/api/plans/[id]/portal/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { requireSession } from '@/lib/server/auth';

export async function POST(req: NextRequest) {
  const auth = await requireSession(req);
  if (auth.errorResponse) return auth.errorResponse;

  return NextResponse.json(
    { error: 'Stripe billing portal requires STRIPE_SECRET_KEY configuration' },
    { status: 503 }
  );
}
