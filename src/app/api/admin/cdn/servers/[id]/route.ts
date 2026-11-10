// src/app/api/admin/cdn/servers/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/server/auth';
import { listCdnServers, saveCdnServers, validateCdnServerInput } from '@/lib/server/cdnGist';

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin(req);
  if (auth.errorResponse) return auth.errorResponse;

  const { id } = await context.params;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const rawWithId =
    body && typeof body === 'object' ? { ...(body as Record<string, unknown>), id } : null;
  const validated = validateCdnServerInput(rawWithId);
  if (!validated.data) {
    return NextResponse.json({ error: validated.error }, { status: 400 });
  }

  try {
    const { servers } = await listCdnServers();
    const idx = servers.findIndex((s) => s.id === id);
    if (idx === -1) {
      return NextResponse.json({ error: 'CDN server not found' }, { status: 404 });
    }

    const updated = servers.map(({ panelLinked: _pl, ...rest }, i) =>
      i === idx ? validated.data! : rest
    );
    const saved = await saveCdnServers(updated);
    if (!saved.ok) {
      return NextResponse.json({ error: saved.error }, { status: saved.status });
    }

    return NextResponse.json({ success: true, server: validated.data });
  } catch (err) {
    console.error('[api/admin/cdn/servers/[id]] PUT failed:', err);
    return NextResponse.json({ error: 'Failed to update CDN server' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin(req);
  if (auth.errorResponse) return auth.errorResponse;

  const { id } = await context.params;

  try {
    const { servers } = await listCdnServers();
    if (!servers.some((s) => s.id === id)) {
      return NextResponse.json({ error: 'CDN server not found' }, { status: 404 });
    }

    const updated = servers
      .filter((s) => s.id !== id)
      .map(({ panelLinked: _pl, ...rest }) => rest);
    const saved = await saveCdnServers(updated);
    if (!saved.ok) {
      return NextResponse.json({ error: saved.error }, { status: saved.status });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[api/admin/cdn/servers/[id]] DELETE failed:', err);
    return NextResponse.json({ error: 'Failed to delete CDN server' }, { status: 500 });
  }
}
