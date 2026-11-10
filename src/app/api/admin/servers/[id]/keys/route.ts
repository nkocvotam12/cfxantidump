// src/app/api/admin/servers/[id]/keys/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/server/auth';
import { appendAudit, generateServerKey, updateDb } from '@/lib/server/store';

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin(req);
  if (auth.errorResponse) return auth.errorResponse;

  const { id } = await context.params;
  let body: Record<string, unknown> = {};
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    body = {};
  }

  const action =
    body.action === 'rotate_api_key' ||
    body.action === 'generate_peer_key' ||
    body.action === 'reset_ip_lock' ||
    body.action === 'reveal'
      ? body.action
      : 'rotate_api_key';

  const result = updateDb((db) => {
    const srv = db.panelServers.find((s) => s.id === id);
    if (!srv) return null;

    if (action === 'rotate_api_key') {
      srv.apiKey = generateServerKey('adk');
      appendAudit(db, 'rotate_api_key', auth.session.username, srv.id);
    } else if (action === 'generate_peer_key') {
      srv.peerKey = generateServerKey('peer');
      appendAudit(db, 'generate_peer_key', auth.session.username, srv.id);
    } else if (action === 'reset_ip_lock') {
      srv.lockedIp = null;
      appendAudit(db, 'reset_peer_ip_lock', auth.session.username, srv.id);
    }

    return {
      serverId: srv.id,
      apiKey: srv.apiKey,
      peerKey: srv.peerKey,
      lockedIp: srv.lockedIp || null,
    };
  });

  if (!result) {
    return NextResponse.json({ error: 'Server not found' }, { status: 404 });
  }
  return NextResponse.json(result);
}
