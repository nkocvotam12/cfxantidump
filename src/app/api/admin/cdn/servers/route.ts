// src/app/api/admin/cdn/servers/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/server/auth';
import { listCdnServers, saveCdnServers, validateCdnServerInput } from '@/lib/server/cdnGist';

export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (auth.errorResponse) return auth.errorResponse;

  try {
    const data = await listCdnServers();
    return NextResponse.json(data);
  } catch (err) {
    console.error('[api/admin/cdn/servers] GET failed:', err);
    return NextResponse.json({ error: 'Failed to load CDN servers' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (auth.errorResponse) return auth.errorResponse;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const validated = validateCdnServerInput(body);
  if (!validated.data) {
    return NextResponse.json({ error: validated.error }, { status: 400 });
  }

  try {
    const { servers } = await listCdnServers();
    if (servers.some((s) => s.id === validated.data!.id)) {
      return NextResponse.json({ error: 'Server identifier already exists' }, { status: 409 });
    }

    const updated = [...servers.map(({ panelLinked: _pl, ...rest }) => rest), validated.data];
    const saved = await saveCdnServers(updated);
    if (!saved.ok) {
      return NextResponse.json({ error: saved.error }, { status: saved.status });
    }

    return NextResponse.json({ success: true, server: validated.data }, { status: 201 });
  } catch (err) {
    console.error('[api/admin/cdn/servers] POST failed:', err);
    return NextResponse.json({ error: 'Failed to save CDN server' }, { status: 500 });
  }
}
