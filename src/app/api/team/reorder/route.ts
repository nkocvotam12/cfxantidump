// src/app/api/team/reorder/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { requireSession } from '@/lib/server/auth';
import { TeamMember, updateDb } from '@/lib/server/store';

export async function PATCH(req: NextRequest) {
  const auth = await requireSession(req);
  if (auth.errorResponse) return auth.errorResponse;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const orderedIds =
    body && typeof body === 'object' && Array.isArray((body as { orderedIds?: unknown }).orderedIds)
      ? (body as { orderedIds: unknown[] }).orderedIds
      : null;

  if (!orderedIds || !orderedIds.every((id) => typeof id === 'string' && id.trim().length > 0)) {
    return NextResponse.json({ error: 'orderedIds must be an array of member IDs' }, { status: 400 });
  }

  const members = updateDb((db) => {
    const byId = new Map(db.teamMembers.map((m) => [m.id, m]));
    const reordered: TeamMember[] = [];
    const seen = new Set<string>();

    for (const id of orderedIds as string[]) {
      const m = byId.get(id);
      if (m && !seen.has(id)) {
        reordered.push(m);
        seen.add(id);
      }
    }
    for (const m of db.teamMembers) {
      if (!seen.has(m.id)) {
        reordered.push(m);
      }
    }

    db.teamMembers = reordered;
    return reordered;
  });

  return NextResponse.json({ success: true, members });
}
