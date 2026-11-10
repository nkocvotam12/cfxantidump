// src/app/api/artifacts/[version]/download/route.ts
import fs from 'node:fs';
import path from 'node:path';
import { NextRequest, NextResponse } from 'next/server';
import { requireSession } from '@/lib/server/auth';
import { appendAudit, updateDb } from '@/lib/server/store';
import { buildZipBuffer, ZipFileEntry } from '@/lib/server/zip';

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ version: string }> }
) {
  const auth = await requireSession(req);
  if (auth.errorResponse) return auth.errorResponse;

  const { version } = await context.params;
  if (!/^\d{3,6}$/.test(version)) {
    return NextResponse.json({ error: 'Invalid artifact version' }, { status: 400 });
  }

  const os = req.nextUrl.searchParams.get('os') === 'windows' ? 'windows' : 'linux';
  let body: Record<string, unknown> = {};
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    body = {};
  }

  const hideExtra = Boolean(body.hideExtra);
  const addon = typeof body.addon === 'string' ? body.addon : undefined;

  const server = updateDb((db) => {
    const srv = db.panelServers[0];
    appendAudit(db, 'download_antidump_script', auth.session.username, `${os}:${version}`);
    return srv;
  });

  const entries: ZipFileEntry[] = [
    {
      name: 'antidump-artifact-config.json',
      content: JSON.stringify(
        {
          version,
          os,
          serverId: server?.id || 'srv_default',
          panelUrl: req.nextUrl.origin,
          hideResources: hideExtra ? { enabled: true, mode: addon || 'hide_all' } : { enabled: false },
          generatedAt: new Date().toISOString(),
        },
        null,
        2
      ),
    },
  ];

  const resourceRoot = path.resolve(process.cwd(), '..', 'fivem-resource', 'cfx-antidump');
  if (fs.existsSync(resourceRoot)) {
    for (const rel of ['fxmanifest.lua', 'config.lua', 'server/main.lua', 'client/main.lua', 'README.md']) {
      entries.push({
        name: `resources/cfx-antidump/${rel}`,
        content: fs.readFileSync(path.join(resourceRoot, rel), 'utf8'),
      });
    }
  }

  const zip = buildZipBuffer(entries);

  return new NextResponse(new Uint8Array(zip), {
    status: 200,
    headers: {
      'Content-Type': 'application/zip',
      'Content-Disposition': `attachment; filename="artifacts-${os}-${version}.zip"`,
      'Content-Length': String(zip.length),
    },
  });
}
