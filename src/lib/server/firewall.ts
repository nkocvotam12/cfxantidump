// src/lib/server/firewall.ts
import crypto from 'node:crypto';
import {
  FirewallLogEntry,
  PanelDatabase,
  readDb,
  StoredPanelServer,
  updateDb,
} from './store';
import { emitFirewallEvent } from './eventBus';

const SUSPICIOUS_UA_RE =
  /(redengine|eulen|dumper|fxdk|curl\/|wget\/|python-requests|python-urllib|aiohttp|go-http-client|postmanruntime|insomnia|httpie)/i;

const SUSPICIOUS_PATH_RE =
  /(\.\.|\/files\/|\.fxap|server\.cfg|__cfx_internal|\/dump\b|\/extract\b)/i;

const AUTO_BAN_THRESHOLD = 5;

function ipv4ToInt(ip: string): number | null {
  const parts = ip.trim().split('.');
  if (parts.length !== 4) return null;
  let num = 0;
  for (const part of parts) {
    if (!/^\d{1,3}$/.test(part)) return null;
    const octet = Number(part);
    if (octet < 0 || octet > 255) return null;
    num = (num << 8) | octet;
  }
  return num >>> 0;
}

export function ipMatchesRule(ip: string, rule: string): boolean {
  const cleanIp = ip.trim();
  const cleanRule = rule.trim();
  if (!cleanIp || !cleanRule) return false;
  if (cleanIp === cleanRule) return true;

  const slashIdx = cleanRule.indexOf('/');
  if (slashIdx === -1) return false;

  const baseIp = cleanRule.slice(0, slashIdx);
  const prefixLen = Number(cleanRule.slice(slashIdx + 1));
  if (!Number.isInteger(prefixLen) || prefixLen < 0 || prefixLen > 32) return false;

  const ipInt = ipv4ToInt(cleanIp);
  const baseInt = ipv4ToInt(baseIp);
  if (ipInt === null || baseInt === null) return false;

  const mask = prefixLen === 0 ? 0 : (0xffffffff << (32 - prefixLen)) >>> 0;
  return (ipInt & mask) === (baseInt & mask);
}

export function safeTimingEqual(a: string | undefined | null, b: string | undefined | null): boolean {
  if (!a || !b) return false;
  const bufA = Buffer.from(a, 'utf8');
  const bufB = Buffer.from(b, 'utf8');
  return bufA.length === bufB.length && crypto.timingSafeEqual(bufA, bufB);
}

export function findServerByKey(
  db: PanelDatabase,
  apiKey: string | null,
  peerKey?: string | null
): StoredPanelServer | null {
  for (const srv of db.panelServers) {
    const apiMatch = apiKey ? safeTimingEqual(srv.apiKey, apiKey) : false;
    const peerMatch = peerKey ? safeTimingEqual(srv.peerKey, peerKey) : false;
    if (apiMatch || peerMatch) return srv;
  }
  return null;
}

export interface CacheTokenPayload {
  serverId: string;
  ip: string;
  playerId: string;
  resource?: string;
  exp: number;
}

export function signCacheToken(secret: string, payload: Omit<CacheTokenPayload, 'exp'>, ttlSeconds = 120): string {
  const full: CacheTokenPayload = {
    ...payload,
    exp: Date.now() + ttlSeconds * 1000,
  };
  const body = Buffer.from(JSON.stringify(full), 'utf8').toString('base64url');
  const sig = crypto.createHmac('sha256', secret).update(body).digest('base64url');
  return `${body}.${sig}`;
}

export function verifyCacheToken(secret: string, token: string): CacheTokenPayload | null {
  const parts = token.split('.');
  if (parts.length !== 2) return null;
  const [body, sig] = parts;
  if (!body || !sig) return null;

  const expected = crypto.createHmac('sha256', secret).update(body).digest('base64url');
  if (!safeTimingEqual(sig, expected)) return null;

  try {
    const parsed = JSON.parse(Buffer.from(body, 'base64url').toString('utf8')) as CacheTokenPayload;
    if (!parsed?.serverId || !parsed?.ip || typeof parsed.exp !== 'number') return null;
    if (parsed.exp <= Date.now()) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function extractClientIp(headers: Headers, fallback?: string): string {
  const cf = headers.get('cf-connecting-ip')?.trim();
  if (cf) return cf;
  const xff = headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  if (xff) return xff;
  const realIp = headers.get('x-real-ip')?.trim();
  if (realIp) return realIp;
  return fallback?.trim() || '127.0.0.1';
}

export function isValidDiscordWebhookUrl(rawUrl: string): boolean {
  try {
    const url = new URL(rawUrl);
    return (
      url.protocol === 'https:' &&
      (url.hostname === 'discord.com' || url.hostname === 'discordapp.com') &&
      url.pathname.startsWith('/api/webhooks/')
    );
  } catch {
    return false;
  }
}

export async function sendDiscordAlert(
  webhookUrl: string,
  entry: FirewallLogEntry,
  isTest = false
): Promise<boolean> {
  if (!isValidDiscordWebhookUrl(webhookUrl)) return false;

  try {
    const url = new URL(webhookUrl);

    const payload = {
      username: 'CFX AntiDump',
      embeds: [
        {
          title: isTest ? '✅ Test Webhook Alert' : '🚫 IP BLOCKED / DUMP ATTEMPT',
          color: isTest ? 0x22c55e : 0xef4444,
          fields: [
            { name: '🌐 IP', value: `\`${entry.ip}\``, inline: true },
            { name: '🏠 HOST', value: `\`${entry.host}\``, inline: true },
            { name: '⚡ ACTION', value: `\`${entry.action.toUpperCase()}\``, inline: true },
            { name: '📍 PATH', value: `\`${entry.path}\``, inline: false },
            { name: '🛡️ RULE', value: `\`${entry.rule}\``, inline: true },
            { name: '🆔 RAY ID', value: `\`${entry.rayId}\``, inline: true },
          ],
          timestamp: entry.timestamp,
        },
      ],
    };

    const res = await fetch(url.toString(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export interface IngestEventInput {
  serverId?: string;
  ip: string;
  host?: string;
  path: string;
  method?: string;
  country?: string;
  coordinates?: [number, number];
  asn?: string;
  userAgent?: string;
  headers?: Record<string, string>;
  body?: string;
  token?: string;
  requireToken?: boolean;
  forcedAction?: 'block' | 'challenge' | 'log';
  forcedRule?: string;
}

export interface IngestEvaluationResult {
  allowed: boolean;
  action: 'allow' | 'block' | 'challenge' | 'log';
  rule: string;
  rayId: string;
  autoBanned: boolean;
  entry?: FirewallLogEntry;
  webhookTarget?: string | null;
}

export function evaluateAndRecordEvent(input: IngestEventInput): IngestEvaluationResult {
  const rayId = crypto.randomBytes(8).toString('hex');
  const now = new Date().toISOString();
  const ip = input.ip.trim() || '127.0.0.1';
  const reqPath = input.path || '/';
  const method = (input.method || 'GET').toUpperCase();
  const ua = input.userAgent || '';
  const host = input.host || 'localhost';

  const result = updateDb((db) => {
    const server =
      (input.serverId && db.panelServers.find((s) => s.id === input.serverId || s.domain === input.serverId)) ||
      db.panelServers[0];

    // 1. Ignore filter -> silently discard
    const ignored = db.ipFilters.some(
      (f) => f.list === 'ignore' && (!f.serverId || f.serverId === server?.id) && ipMatchesRule(ip, f.value)
    );
    if (ignored && !input.forcedAction) {
      return {
        allowed: true,
        action: 'log' as const,
        rule: 'ip_ignore',
        rayId,
        autoBanned: false,
      };
    }

    // 2. Whitelist filter -> always allow unless forced block
    const whitelisted = db.ipFilters.some(
      (f) => f.list === 'whitelist' && (!f.serverId || f.serverId === server?.id) && ipMatchesRule(ip, f.value)
    );
    if (whitelisted && !input.forcedAction) {
      return {
        allowed: true,
        action: 'allow' as const,
        rule: 'ip_whitelist',
        rayId,
        autoBanned: false,
      };
    }

    let action: 'block' | 'challenge' | 'log' = input.forcedAction || 'log';
    let rule = input.forcedRule || 'normal_traffic';
    let suspicious = false;

    const isGlobalBanned = db.globalBans.some((b) => ipMatchesRule(ip, b.ip));
    const isServerBanned = db.serverBans.some(
      (b) => (!b.serverId || b.serverId === server?.id) && ipMatchesRule(ip, b.ip)
    );
    const isBlacklisted = db.ipFilters.some(
      (f) => f.list === 'blacklist' && (!f.serverId || f.serverId === server?.id) && ipMatchesRule(ip, f.value)
    );

    if (!input.forcedAction) {
      if (isGlobalBanned) {
        action = 'block';
        rule = 'global_ban';
        suspicious = true;
      } else if (isServerBanned) {
        action = 'block';
        rule = 'server_ban';
        suspicious = true;
      } else if (isBlacklisted) {
        action = 'block';
        rule = 'ip_blacklist';
        suspicious = true;
      } else if (SUSPICIOUS_PATH_RE.test(reqPath)) {
        action = 'block';
        rule = 'antidump_forbidden_path';
        suspicious = true;
      } else if (SUSPICIOUS_UA_RE.test(ua) || (!ua && reqPath.startsWith('/cache/'))) {
        action = 'block';
        rule = 'antidump_dumper_ua';
        suspicious = true;
      } else if (input.requireToken) {
        const tokenValid =
          Boolean(input.token && server?.peerKey && verifyCacheToken(server.peerKey, input.token));
        if (!tokenValid) {
          action = 'block';
          rule = 'antidump_invalid_token';
          suspicious = true;
        }
      }
    } else {
      suspicious = action === 'block' || action === 'challenge';
    }

    const prevAttempts = db.logs
      .filter((l) => l.ip === ip && l.suspicious)
      .reduce((max, l) => Math.max(max, l.attempts || 1), 0);
    const attempts = suspicious ? prevAttempts + 1 : 1;

    const entry: FirewallLogEntry = {
      id: `log_${crypto.randomBytes(6).toString('hex')}`,
      serverId: server?.id,
      ip,
      host,
      path: reqPath,
      method,
      action,
      country: input.country || 'XX',
      coordinates: input.coordinates || [0, 0],
      timestamp: now,
      suspicious,
      rayId,
      rule,
      asn: input.asn || 'AS0000',
      userAgent: ua || 'Unknown',
      attempts,
    };

    db.logs.unshift(entry);
    if (db.logs.length > 1000) db.logs.length = 1000;

    db.debugLogs.unshift({
      id: `dbg_${crypto.randomBytes(6).toString('hex')}`,
      method,
      path: reqPath,
      ip,
      country: entry.country,
      status: action === 'block' ? 403 : action === 'challenge' ? 429 : 200,
      timestamp: now,
      body: input.body,
      headers: input.headers,
      metadata: {
        rayId,
        rule,
        serverId: server?.id,
        attempts,
      },
    });
    if (db.debugLogs.length > 300) db.debugLogs.length = 300;

    if (server) {
      server.eventsCount += 1;
    }

    let autoBanned = false;
    if (suspicious && attempts >= AUTO_BAN_THRESHOLD && !isServerBanned && !isGlobalBanned) {
      db.serverBans.unshift({
        id: `ban_${crypto.randomBytes(6).toString('hex')}`,
        serverId: server?.id,
        ip,
        reason: `Auto-ban (${rule})`,
        bannedAt: now,
        attempts,
      });
      autoBanned = true;
    }

    return {
      allowed: action !== 'block',
      action: action === 'block' ? ('block' as const) : action === 'challenge' ? ('challenge' as const) : ('allow' as const),
      rule,
      rayId,
      autoBanned,
      entry,
      webhookTarget:
        server?.webhookEnabled && server.webhookUrl && action === 'block' ? server.webhookUrl : null,
    };
  });

  if (result.entry) {
    emitFirewallEvent(result.entry);
  }
  if (result.webhookTarget && result.entry) {
    void sendDiscordAlert(result.webhookTarget, result.entry);
  }

  return result;
}

export function getActiveRulesSnapshot() {
  const db = readDb();
  return {
    whitelist: db.ipFilters.filter((f) => f.list === 'whitelist').map((f) => f.value),
    blacklist: db.ipFilters.filter((f) => f.list === 'blacklist').map((f) => f.value),
    ignore: db.ipFilters.filter((f) => f.list === 'ignore').map((f) => f.value),
    bannedIps: [
      ...db.serverBans.map((b) => b.ip),
      ...db.globalBans.map((b) => b.ip),
    ],
  };
}
