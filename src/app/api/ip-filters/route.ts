// src/app/api/ip-filters/route.ts
import crypto from 'node:crypto';
import net from 'node:net';
import { NextRequest, NextResponse } from 'next/server';
import { requireSession } from '@/lib/server/auth';
import { appendAudit, IpFilterEntry, readDb, updateDb } from '@/lib/server/store';

function isValidIpOrCidr(raw: string): boolean {
  const value = raw.trim();
  if (!value) return false;
  const slashIdx = value.indexOf('/');
  if (slashIdx === -1) {
    return net.isIP(value) !== 0;
  }
  const ip = value.slice(0, slashIdx);
  const mask = Number(value.slice(slashIdx + 1));
  const version = net.isIP(ip);
  if (version === 4) return Number.isInteger(mask) && mask >= 0 && mask <= 32;
  if (version === 6) return Number.isInteger(mask) && mask >= 0 && mask <= 128;
  return false;
}

export async function GET(req: NextRequest) {
  const auth = await requireSession(req);
  if (auth.errorResponse) return auth.errorResponse;

  const db = readDb();
  return NextResponse.json({
    whitelist: db.ipFilters.filter((f) => f.list === 'whitelist'),
    blacklist: db.ipFilters.filter((f) => f.list === 'blacklist'),
    ignore: db.ipFilters.filter((f) => f.list === 'ignore'),
  });
}

export async function POST(req: NextRequest) {
  const auth = await requireSession(req);
  if (auth.errorResponse) return auth.errorResponse;

  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const list =
    body.list === 'whitelist' || body.list === 'blacklist' || body.list === 'ignore'
      ? body.list
      : null;
  const value = typeof body.value === 'string' ? body.value.trim() : '';
  const note = typeof body.note === 'string' ? body.note.trim().slice(0, 120) : undefined;

  if (!list || !isValidIpOrCidr(value)) {
    return NextResponse.json({ error: 'Valid list and IP/CIDR are required' }, { status: 400 });
  }

  const entry = updateDb((db) => {
    const server = db.panelServers[0];
    const item: IpFilterEntry = {
      id: `flt_${crypto.randomBytes(6).toString('hex')}`,
      serverId: server?.id,
      list,
      value,
      note: note || undefined,
      createdAt: new Date().toISOString(),
    };
    db.ipFilters.unshift(item);
    appendAudit(db, 'add_ip_filter', auth.session.username, `${list}:${value}`);
    return item;
  });

  return NextResponse.json(entry, { status: 201 });
}
