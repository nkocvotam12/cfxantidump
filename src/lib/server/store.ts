// src/lib/server/store.ts
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { UserRole } from './auth';

export interface StoredUser {
  id: string;
  username: string;
  email?: string;
  avatar?: string;
  role: UserRole;
  joinedAt: string;
}

export interface TeamPermissions {
  logs: boolean;
  discord: boolean;
  iplists: boolean;
  team: boolean;
}

export interface TeamMember {
  id: string;
  username: string;
  email?: string;
  avatar?: string;
  role: 'owner' | 'master' | 'admin' | 'user';
  permissions: TeamPermissions;
}

export interface StoredCdnServer {
  id: string;
  target: string;
  targetPath?: string;
  omitFilesPath: boolean;
  storage: 'external' | 'r2';
  r2Prefix?: string;
}

export interface StoredPanelServer {
  id: string;
  label: string;
  domain: string | null;
  ownerId: string | null;
  ownerUsername: string | null;
  eventsCount: number;
  usersCount: number;
  webhookEnabled: boolean;
  webhookUrl: string | null;
  apiKey?: string;
  peerKey?: string;
  lockedIp?: string | null;
  createdAt: string;
}

export interface FirewallLogEntry {
  id: string;
  serverId?: string;
  ip: string;
  host: string;
  path: string;
  method: string;
  action: 'block' | 'challenge' | 'log';
  country: string;
  coordinates?: [number, number];
  timestamp: string;
  suspicious: boolean;
  rayId: string;
  rule: string;
  asn: string;
  userAgent: string;
  attempts: number;
}

export interface DebugLogEntry {
  id: string;
  method: string;
  path: string;
  ip: string;
  country?: string;
  status: number;
  timestamp: string;
  body?: string;
  headers?: Record<string, string>;
  metadata?: Record<string, unknown>;
}

export interface IpFilterEntry {
  id: string;
  serverId?: string;
  list: 'whitelist' | 'blacklist' | 'ignore';
  value: string;
  note?: string;
  createdAt: string;
}

export interface ServerBanEntry {
  id: string;
  serverId?: string;
  ip: string;
  reason: string;
  bannedAt: string;
  attempts: number;
}

export interface GlobalBanEntry {
  id: string;
  ip: string;
  reason: string;
  serverName?: string;
  createdAt: string;
}

export interface GlobalBanHistoryEntry {
  id: string;
  ip: string;
  serverName: string;
  bannedAt: string;
  unbannedAt?: string;
}

export interface NewsEntry {
  id: string;
  title: string;
  body: string;
  type: 'update' | 'info' | 'warning' | 'maintenance';
  pinned: boolean;
  author: string;
  createdAt: string;
}

export interface AuditEntry {
  id: string;
  action: string;
  actor: string;
  target?: string;
  createdAt: string;
}

export interface ReportEntry {
  id: string;
  userId: string;
  username: string;
  title: string;
  description: string;
  createdAt: string;
}

export interface UserAddonEntry {
  id: string;
  userId?: string;
  type: 'hide_all' | 'hide_1' | 'other';
  resource?: string;
  createdAt: string;
}

export interface DnsRecordEntry {
  id: string;
  type: string;
  name: string;
  value: string;
  ttl: number;
  proxied: boolean;
}

export interface SubscriptionEntry {
  id: string;
  productName: string;
  status: string;
  customerEmail?: string;
  discordUserId?: string;
  serverId?: string;
  serverDomain?: string;
  currentPeriodEnd?: string;
  cancelAtPeriodEnd?: boolean;
  oneTime?: boolean;
  lifetime?: boolean;
  expiresAt?: string;
  price?: { amount: number; currency: string; interval?: string };
  hidden: boolean;
}

export interface OrderEntry {
  id: string;
  userId?: string;
  product: string;
  status: string;
  amount: number;
  currency: string;
  createdAt: string;
}

export interface InvoiceEntry {
  id: string;
  userId?: string;
  date: string;
  product: string;
  amount: number;
  currency: string;
  status: 'paid' | 'pending' | 'failed';
  downloadUrl?: string;
}

export interface PanelDatabase {
  users: Record<string, StoredUser>;
  teamMembers: TeamMember[];
  cdnServers: StoredCdnServer[];
  panelServers: StoredPanelServer[];
  logs: FirewallLogEntry[];
  debugLogs: DebugLogEntry[];
  ipFilters: IpFilterEntry[];
  serverBans: ServerBanEntry[];
  globalBans: GlobalBanEntry[];
  globalBanHistory: GlobalBanHistoryEntry[];
  news: NewsEntry[];
  auditLogs: AuditEntry[];
  reports: ReportEntry[];
  addons: UserAddonEntry[];
  dnsRecords: DnsRecordEntry[];
  subscriptions: SubscriptionEntry[];
  orders: OrderEntry[];
  invoices: InvoiceEntry[];
}

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_PATH = path.join(DATA_DIR, 'panel-db.json');

export function generateServerKey(prefix: 'adk' | 'peer'): string {
  return `${prefix}_${crypto.randomBytes(24).toString('hex')}`;
}

function createInitialDb(): PanelDatabase {
  const now = new Date().toISOString();
  return {
    users: {},
    teamMembers: [],
    cdnServers: [
      {
        id: 'default-fivem',
        target: 'http://127.0.0.1:30120',
        omitFilesPath: false,
        storage: 'external',
      },
    ],
    panelServers: [
      {
        id: 'srv_default',
        label: 'Primary FiveM Server',
        domain: 'default-fivem',
        ownerId: null,
        ownerUsername: null,
        eventsCount: 0,
        usersCount: 0,
        webhookEnabled: false,
        webhookUrl: null,
        apiKey: generateServerKey('adk'),
        peerKey: generateServerKey('peer'),
        lockedIp: null,
        createdAt: now,
      },
    ],
    logs: [],
    debugLogs: [],
    ipFilters: [],
    serverBans: [],
    globalBans: [],
    globalBanHistory: [],
    news: [
      {
        id: 'news_welcome',
        title: 'CFX AntiDump Active',
        body: 'Anti-Dump protection, IP firewall, Discord webhook alerts, and FiveM peer authentication are ready.',
        type: 'info',
        pinned: true,
        author: 'System',
        createdAt: now,
      },
    ],
    auditLogs: [],
    reports: [],
    addons: [
      {
        id: 'addon_hide_all',
        type: 'hide_all',
        createdAt: now,
      },
    ],
    dnsRecords: [
      {
        id: 'dns_cache',
        type: 'CNAME',
        name: 'cache',
        value: 'cdn-proxy.cfxantidump.local',
        ttl: 300,
        proxied: true,
      },
    ],
    subscriptions: [],
    orders: [],
    invoices: [],
  };
}

function normalizeDb(parsed: Partial<PanelDatabase>): PanelDatabase {
  const base = createInitialDb();
  return {
    users: parsed.users && typeof parsed.users === 'object' ? parsed.users : base.users,
    teamMembers: Array.isArray(parsed.teamMembers) ? parsed.teamMembers : base.teamMembers,
    cdnServers: Array.isArray(parsed.cdnServers) ? parsed.cdnServers : base.cdnServers,
    panelServers: Array.isArray(parsed.panelServers) ? parsed.panelServers : base.panelServers,
    logs: Array.isArray(parsed.logs) ? parsed.logs : base.logs,
    debugLogs: Array.isArray(parsed.debugLogs) ? parsed.debugLogs : base.debugLogs,
    ipFilters: Array.isArray(parsed.ipFilters) ? parsed.ipFilters : base.ipFilters,
    serverBans: Array.isArray(parsed.serverBans) ? parsed.serverBans : base.serverBans,
    globalBans: Array.isArray(parsed.globalBans) ? parsed.globalBans : base.globalBans,
    globalBanHistory: Array.isArray(parsed.globalBanHistory) ? parsed.globalBanHistory : base.globalBanHistory,
    news: Array.isArray(parsed.news) ? parsed.news : base.news,
    auditLogs: Array.isArray(parsed.auditLogs) ? parsed.auditLogs : base.auditLogs,
    reports: Array.isArray(parsed.reports) ? parsed.reports : base.reports,
    addons: Array.isArray(parsed.addons) ? parsed.addons : base.addons,
    dnsRecords: Array.isArray(parsed.dnsRecords) ? parsed.dnsRecords : base.dnsRecords,
    subscriptions: Array.isArray(parsed.subscriptions) ? parsed.subscriptions : base.subscriptions,
    orders: Array.isArray(parsed.orders) ? parsed.orders : base.orders,
    invoices: Array.isArray(parsed.invoices) ? parsed.invoices : base.invoices,
  };
}

export function readDb(): PanelDatabase {
  try {
    if (!fs.existsSync(DB_PATH)) {
      const initial = createInitialDb();
      writeDb(initial);
      return initial;
    }
    const raw = fs.readFileSync(DB_PATH, 'utf8');
    return normalizeDb(JSON.parse(raw) as Partial<PanelDatabase>);
  } catch {
    return createInitialDb();
  }
}

export function writeDb(db: PanelDatabase): void {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  const tmpPath = `${DB_PATH}.${process.pid}.tmp`;
  fs.writeFileSync(tmpPath, JSON.stringify(db, null, 2), 'utf8');
  fs.renameSync(tmpPath, DB_PATH);
}

export function updateDb<T>(mutator: (db: PanelDatabase) => T): T {
  const db = readDb();
  const result = mutator(db);
  writeDb(db);
  return result;
}

export function appendAudit(db: PanelDatabase, action: string, actor: string, target?: string): void {
  db.auditLogs.unshift({
    id: `aud_${crypto.randomBytes(6).toString('hex')}`,
    action,
    actor,
    target,
    createdAt: new Date().toISOString(),
  });
  if (db.auditLogs.length > 500) {
    db.auditLogs.length = 500;
  }
}
