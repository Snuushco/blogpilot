import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature');

  let event;

  // If webhook secret is configured, verify signature
  if (process.env.STRIPE_WEBHOOK_SECRET && process.env.STRIPE_WEBHOOK_SECRET !== 'whsec_placeholder' && sig) {
    try {
      event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }
  } else {
    event = JSON.parse(body);
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
      const customerId = session.metadata?.customerId;
      if (customerId) {
        const customer = db.customers.getById(customerId);
        if (customer) {
          customer.stripeCustomerId = session.customer;
          customer.stripeSubscriptionId = session.subscription;
          customer.status = 'active';
          db.customers.save(customer);
          console.log(`✅ Customer ${customer.companyName} activated!`);
        }
      }
      break;
    }
    case 'customer.subscription.deleted': {
      const sub = event.data.object;
      const customer = db.customers.getByStripeCustomerId(sub.customer);
      if (customer) {
        customer.status = 'cancelled';
        db.customers.save(customer);
        console.log(`❌ Customer ${customer.companyName} cancelled.`);
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
