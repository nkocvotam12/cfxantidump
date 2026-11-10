// src/app/api/artifacts/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { requireSession } from '@/lib/server/auth';

const ARTIFACT_VERSIONS = [
  { version: '10820', size: 124518400, publishedAt: '2026-11-01T12:00:00.000Z', latest: true },
  { version: '10785', size: 124102400, publishedAt: '2026-10-20T12:00:00.000Z', latest: false },
  { version: '10742', size: 123890000, publishedAt: '2026-10-08T12:00:00.000Z', latest: false },
  { version: '10690', size: 123520000, publishedAt: '2026-09-25T12:00:00.000Z', latest: false },
  { version: '10615', size: 123100000, publishedAt: '2026-09-10T12:00:00.000Z', latest: false },
  { version: '10540', size: 122800000, publishedAt: '2026-08-28T12:00:00.000Z', latest: false },
];

export async function GET(req: NextRequest) {
  const auth = await requireSession(req);
  if (auth.errorResponse) return auth.errorResponse;

  const os = req.nextUrl.searchParams.get('os') === 'windows' ? 'windows' : 'linux';
  return NextResponse.json(
    ARTIFACT_VERSIONS.map((v) => ({
      ...v,
      os,
    }))
  );
}
