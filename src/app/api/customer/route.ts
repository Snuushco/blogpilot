import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'ID vereist' }, { status: 400 });

  const customer = db.customers.getById(id);
  if (!customer) return NextResponse.json({ error: 'Klant niet gevonden' }, { status: 404 });

  const articles = db.articles.getByCustomerId(id);

  return NextResponse.json({
    companyName: customer.companyName,
    email: customer.email,
    niche: customer.niche,
    plan: customer.plan,
    status: customer.status,
    keywords: customer.keywords,
    articles,
  });
}
