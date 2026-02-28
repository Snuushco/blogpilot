import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { db, Customer } from '@/lib/db';
import { v4 as uuid } from 'uuid';

// We'll store price IDs after creating them in Stripe
let priceIds: Record<string, string> | null = null;

async function ensureProducts() {
  if (priceIds) return priceIds;

  // Search for existing products
  const products = await stripe.products.list({ limit: 10 });
  const starterProduct = products.data.find(p => p.name === 'BlogPilot Starter' && p.active);
  const proProduct = products.data.find(p => p.name === 'BlogPilot Pro' && p.active);

  let starterId: string;
  let proId: string;

  if (starterProduct) {
    const prices = await stripe.prices.list({ product: starterProduct.id, active: true, limit: 1 });
    starterId = prices.data[0]?.id || (await stripe.prices.create({
      product: starterProduct.id, unit_amount: 7900, currency: 'eur', recurring: { interval: 'month' },
    })).id;
  } else {
    const p = await stripe.products.create({ name: 'BlogPilot Starter', description: '4 SEO-geoptimaliseerde blogartikelen per maand' });
    starterId = (await stripe.prices.create({ product: p.id, unit_amount: 7900, currency: 'eur', recurring: { interval: 'month' } })).id;
  }

  if (proProduct) {
    const prices = await stripe.prices.list({ product: proProduct.id, active: true, limit: 1 });
    proId = prices.data[0]?.id || (await stripe.prices.create({
      product: proProduct.id, unit_amount: 14900, currency: 'eur', recurring: { interval: 'month' },
    })).id;
  } else {
    const p = await stripe.products.create({ name: 'BlogPilot Pro', description: '8 SEO-geoptimaliseerde blogartikelen per maand' });
    proId = (await stripe.prices.create({ product: p.id, unit_amount: 14900, currency: 'eur', recurring: { interval: 'month' } })).id;
  }

  priceIds = { starter: starterId, pro: proId };
  return priceIds;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { companyName, email, websiteUrl, niche, keywords, plan } = body;

    if (!companyName || !email || !niche) {
      return NextResponse.json({ error: 'Vul alle verplichte velden in.' }, { status: 400 });
    }

    const prices = await ensureProducts();
    const priceId = plan === 'pro' ? prices.pro : prices.starter;

    // Create customer in our DB
    const customerId = uuid();
    const customer: Customer = {
      id: customerId,
      email,
      companyName,
      niche,
      keywords: keywords ? keywords.split(',').map((k: string) => k.trim()).filter(Boolean) : [],
      websiteUrl: websiteUrl || '',
      plan: plan === 'pro' ? 'pro' : 'starter',
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    db.customers.save(customer);

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card', 'ideal'],
      customer_email: email,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${baseUrl}/dashboard?id=${customerId}`,
      cancel_url: `${baseUrl}/onboard?plan=${plan}`,
      metadata: { customerId, companyName, niche },
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Checkout error:', error);
    return NextResponse.json({ error: error.message || 'Checkout mislukt' }, { status: 500 });
  }
}
