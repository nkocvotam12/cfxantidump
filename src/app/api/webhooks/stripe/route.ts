// src/app/api/webhooks/stripe/route.ts
import crypto from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';

const SIGNATURE_TOLERANCE_SECONDS = 300;

interface StripeEventPayload {
  id: string;
  type: string;
  data?: {
    object?: Record<string, unknown>;
  };
}

function verifyStripeSignature(rawBody: string, header: string | null, secret: string): boolean {
  if (!header) return false;

  const pairs = header.split(',').map((part) => part.trim());
  let timestamp = '';
  const signatures: string[] = [];

  for (const pair of pairs) {
    const eqIdx = pair.indexOf('=');
    if (eqIdx === -1) continue;
    const key = pair.slice(0, eqIdx);
    const value = pair.slice(eqIdx + 1);
    if (key === 't') timestamp = value;
    else if (key === 'v1') signatures.push(value);
  }

  const tsNum = Number(timestamp);
  if (!Number.isFinite(tsNum) || signatures.length === 0) return false;
  if (Math.abs(Math.floor(Date.now() / 1000) - tsNum) > SIGNATURE_TOLERANCE_SECONDS) {
    return false;
  }

  const signedPayload = `${timestamp}.${rawBody}`;
  const expected = crypto.createHmac('sha256', secret).update(signedPayload, 'utf8').digest('hex');
  const expectedBuf = Buffer.from(expected, 'hex');

  return signatures.some((sig) => {
    if (!/^[0-9a-fA-F]+$/.test(sig)) return false;
    const sigBuf = Buffer.from(sig, 'hex');
    return sigBuf.length === expectedBuf.length && crypto.timingSafeEqual(sigBuf, expectedBuf);
  });
}

export async function POST(req: NextRequest) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET?.trim();
  if (!webhookSecret) {
    return NextResponse.json({ error: 'STRIPE_WEBHOOK_SECRET is not configured' }, { status: 503 });
  }

  const body = await req.text();
  const signature = req.headers.get('stripe-signature');

  if (!verifyStripeSignature(body, signature, webhookSecret)) {
    return new NextResponse('Webhook Error: Invalid signature', { status: 400 });
  }

  let event: StripeEventPayload;
  try {
    event = JSON.parse(body) as StripeEventPayload;
  } catch {
    return new NextResponse('Webhook Error: Invalid JSON payload', { status: 400 });
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const sessionObj = event.data?.object;
      console.log('[stripe] Checkout completed:', sessionObj?.id, 'Customer:', sessionObj?.customer);
      break;
    }
    case 'invoice.payment_succeeded': {
      const invoiceObj = event.data?.object;
      console.log('[stripe] Invoice paid:', invoiceObj?.id);
      break;
    }
    case 'customer.subscription.deleted': {
      const subObj = event.data?.object;
      console.log('[stripe] Subscription deleted:', subObj?.id);
      break;
    }
  }

  return NextResponse.json({ received: true });
}
