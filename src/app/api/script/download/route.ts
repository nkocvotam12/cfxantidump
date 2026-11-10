// src/app/api/script/download/route.ts
import fs from 'node:fs';
import path from 'node:path';
import { NextRequest, NextResponse } from 'next/server';
import { requireSession } from '@/lib/server/auth';
import { appendAudit, updateDb } from '@/lib/server/store';
import { buildZipBuffer } from '@/lib/server/zip';

export async function GET(req: NextRequest) {
  const auth = await requireSession(req);
  if (auth.errorResponse) return auth.errorResponse;

  const resourceRoot = path.resolve(process.cwd(), '..', 'fivem-resource', 'cfx-antidump');
  if (!fs.existsSync(resourceRoot)) {
    return NextResponse.json({ error: 'FiveM resource template not found' }, { status: 404 });
  }

  const server = updateDb((db) => {
    const srv = db.panelServers[0];
    appendAudit(db, 'download_antidump_script', auth.session.username, srv?.id);
    return srv;
  });

  const panelUrl = req.nextUrl.origin;
  const serverId = server?.id || 'srv_default';

  const readFileOrEmpty = (relPath: string) =>
    fs.readFileSync(path.join(resourceRoot, relPath), 'utf8');

  const configSnippet = [
    readFileOrEmpty('config.lua'),
    '',
    `-- Quick server.cfg setup:`,
    `-- set cfx_antidump_panel_url "${panelUrl}"`,
    `-- set cfx_antidump_server_id "${serverId}"`,
    `-- set cfx_antidump_api_key "<copy from Admin -> Servers>"`,
    `-- set cfx_antidump_peer_key "<copy from Admin -> Servers>"`,
    `-- ensure cfx-antidump`,
  ].join('\n');

  const zipBuffer = buildZipBuffer([
    { name: 'cfx-antidump/fxmanifest.lua', content: readFileOrEmpty('fxmanifest.lua') },
    { name: 'cfx-antidump/config.lua', content: configSnippet },
    { name: 'cfx-antidump/server/main.lua', content: readFileOrEmpty('server/main.lua') },
    { name: 'cfx-antidump/client/main.lua', content: readFileOrEmpty('client/main.lua') },
    { name: 'cfx-antidump/README.md', content: readFileOrEmpty('README.md') },
  ]);

  return new NextResponse(new Uint8Array(zipBuffer), {
    status: 200,
    headers: {
      'Content-Type': 'application/zip',
      'Content-Disposition': 'attachment; filename="cfx-antidump-resource.zip"',
      'Content-Length': String(zipBuffer.length),
    },
  });
}
