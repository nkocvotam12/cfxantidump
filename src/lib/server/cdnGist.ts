// src/lib/server/cdnGist.ts
import { readDb, StoredCdnServer, updateDb } from './store';

export interface CdnServerResponse extends StoredCdnServer {
  panelLinked: boolean;
}

const VALID_ID_RE = /^[a-zA-Z0-9._-]{1,64}$/;

export function validateCdnServerInput(raw: unknown): { data?: StoredCdnServer; error?: string } {
  if (!raw || typeof raw !== 'object') {
    return { error: 'Invalid request body' };
  }
  const obj = raw as Record<string, unknown>;
  const id = typeof obj.id === 'string' ? obj.id.trim() : '';
  if (!VALID_ID_RE.test(id)) {
    return { error: 'Invalid identifier. Use 1-64 alphanumeric, dot, underscore, or hyphen characters.' };
  }

  const storage = obj.storage === 'r2' ? 'r2' : obj.storage === 'external' ? 'external' : null;
  if (!storage) {
    return { error: 'Invalid storage mode' };
  }

  const target = typeof obj.target === 'string' ? obj.target.trim() : '';
  if (storage === 'external') {
    let parsed: URL;
    try {
      parsed = new URL(target);
    } catch {
      return { error: 'Invalid target URL' };
    }
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return { error: 'Target URL must use http or https' };
    }
  }

  const targetPath = typeof obj.targetPath === 'string' ? obj.targetPath.trim() : '';
  const omitFilesPath = Boolean(obj.omitFilesPath);
  const r2Prefix = typeof obj.r2Prefix === 'string' ? obj.r2Prefix.trim() : '';

  return {
    data: {
      id,
      target: storage === 'external' ? target : '',
      targetPath: targetPath || undefined,
      omitFilesPath,
      storage,
      r2Prefix: r2Prefix || undefined,
    },
  };
}

function getGistConfig() {
  const gistId = process.env.GITHUB_GIST_ID?.trim() || '';
  const token = process.env.GITHUB_GIST_TOKEN?.trim() || '';
  return { gistId, token };
}

function withPanelLinked(entries: StoredCdnServer[]): CdnServerResponse[] {
  const db = readDb();
  const domains = new Set(db.panelServers.map((s) => s.domain).filter(Boolean));
  return entries.map((entry) => ({
    ...entry,
    omitFilesPath: Boolean(entry.omitFilesPath),
    storage: entry.storage === 'r2' ? 'r2' : 'external',
    panelLinked: domains.has(entry.id),
  }));
}

export async function listCdnServers(): Promise<{ servers: CdnServerResponse[]; tokenMissing: boolean }> {
  const { gistId, token } = getGistConfig();

  if (!gistId) {
    const db = readDb();
    return { servers: withPanelLinked(db.cdnServers), tokenMissing: false };
  }

  const headers: Record<string, string> = {
    Accept: 'application/vnd.github.v3+json',
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`https://api.github.com/gists/${encodeURIComponent(gistId)}`, {
    headers,
    cache: 'no-store',
  });
  if (!res.ok) {
    throw new Error(`Failed to load Gist (${res.status})`);
  }

  const gist = (await res.json()) as { files?: Record<string, { content?: string }> };
  const content = gist.files?.['domains.json']?.content;
  const parsed = content ? (JSON.parse(content) as StoredCdnServer[]) : [];
  return {
    servers: withPanelLinked(Array.isArray(parsed) ? parsed : []),
    tokenMissing: !token,
  };
}

export async function saveCdnServers(entries: StoredCdnServer[]): Promise<{ ok: boolean; status: number; error?: string }> {
  const { gistId, token } = getGistConfig();

  if (!gistId) {
    updateDb((db) => {
      db.cdnServers = entries;
    });
    return { ok: true, status: 200 };
  }

  if (!token) {
    return { ok: false, status: 403, error: 'GITHUB_GIST_TOKEN missing' };
  }

  const res = await fetch(`https://api.github.com/gists/${encodeURIComponent(gistId)}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      files: {
        'domains.json': { content: JSON.stringify(entries, null, 2) },
      },
    }),
  });

  if (!res.ok) {
    return { ok: false, status: 502, error: 'Failed to save Gist' };
  }

  return { ok: true, status: 200 };
}
