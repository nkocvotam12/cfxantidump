// src/app/api/admin/users/[id]/role/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin, UserRole } from '@/lib/server/auth';
import { appendAudit, updateDb } from '@/lib/server/store';

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin(req);
  if (auth.errorResponse) return auth.errorResponse;

  const { id } = await context.params;
  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const role: UserRole | null =
    body.role === 'user' || body.role === 'admin' || body.role === 'super_admin'
      ? body.role
      : null;
  if (!role) {
    return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
  }

  const updated = updateDb((db) => {
    const user = db.users[id];
    if (!user) return null;
    user.role = role;
    appendAudit(db, 'update_user_role', auth.session.username, `${id}:${role}`);
    return user;
  });

  if (!updated) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }
  return NextResponse.json({ ok: true, user: updated });
}
