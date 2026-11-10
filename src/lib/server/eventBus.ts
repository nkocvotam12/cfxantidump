// src/lib/server/eventBus.ts
import { EventEmitter } from 'node:events';
import { FirewallLogEntry } from './store';

const globalForBus = globalThis as typeof globalThis & {
  __cfxEventBus?: EventEmitter;
};

function getBus(): EventEmitter {
  if (!globalForBus.__cfxEventBus) {
    const emitter = new EventEmitter();
    emitter.setMaxListeners(100);
    globalForBus.__cfxEventBus = emitter;
  }
  return globalForBus.__cfxEventBus;
}

export function emitFirewallEvent(entry: FirewallLogEntry): void {
  getBus().emit('firewall_event', entry);
}

export function subscribeFirewallEvents(handler: (entry: FirewallLogEntry) => void): () => void {
  const bus = getBus();
  bus.on('firewall_event', handler);
  return () => {
    bus.off('firewall_event', handler);
  };
}
