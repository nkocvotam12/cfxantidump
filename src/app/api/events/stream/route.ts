// src/app/api/events/stream/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { requireSession } from '@/lib/server/auth';
import { subscribeFirewallEvents } from '@/lib/server/eventBus';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const auth = await requireSession(req);
  if (auth.errorResponse) return auth.errorResponse;

  const encoder = new TextEncoder();
  let unsubscribe: (() => void) | null = null;
  let heartbeat: ReturnType<typeof setInterval> | null = null;

  const stream = new ReadableStream({
    start(controller) {
      unsubscribe = subscribeFirewallEvents((entry) => {
        try {
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({
                id: entry.id,
                ip: entry.ip,
                country: entry.country,
                path: entry.path,
                action: entry.action,
                timestamp: entry.timestamp,
              })}\n\n`
            )
          );
        } catch {
          // Stream closed
        }
      });

      heartbeat = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(': keepalive\n\n'));
        } catch {
          // Stream closed
        }
      }, 20000);

      req.signal.addEventListener('abort', () => {
        if (heartbeat) clearInterval(heartbeat);
        if (unsubscribe) unsubscribe();
      });
    },
    cancel() {
      if (heartbeat) clearInterval(heartbeat);
      if (unsubscribe) unsubscribe();
    },
  });

  return new NextResponse(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    },
  });
}
