import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST() {
  const articles = db.articles.getAll().filter(a => a.status === 'draft');
  const delivered: string[] = [];

  for (const article of articles) {
    const customer = db.customers.getById(article.customerId);
    if (!customer || customer.status !== 'active') continue;

    // Email delivery — placeholder until Resend is configured
    if (process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== 're_placeholder') {
      try {
        const { Resend } = await import('resend');
        const resend = new Resend(process.env.RESEND_API_KEY);
        await resend.emails.send({
          from: 'BlogPilot <noreply@blogpilot.nl>',
          to: customer.email,
          subject: `Nieuw artikel: ${article.title}`,
          html: `<div style="font-family:sans-serif;max-width:600px;margin:0 auto">
            <h1 style="color:#1a365d">${article.title}</h1>
            <div style="white-space:pre-wrap;line-height:1.6">${article.content}</div>
            <hr style="margin:2rem 0;border-color:#eee">
            <p style="color:#999;font-size:12px">BlogPilot — Autonome SEO content voor ${customer.companyName}</p>
          </div>`,
        });
      } catch (err) {
        console.error('Email delivery failed:', err);
        continue;
      }
    } else {
      console.log(`📧 [MOCK] Would send "${article.title}" to ${customer.email}`);
    }

    article.status = 'delivered';
    article.deliveredAt = new Date().toISOString();
    db.articles.save(article);
    delivered.push(`${customer.email}: "${article.title}"`);
  }

  return NextResponse.json({ delivered, count: delivered.length });
}
