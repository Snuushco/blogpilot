import { NextResponse } from 'next/server';
import { db, Article } from '@/lib/db';
import { v4 as uuid } from 'uuid';

// Placeholder content generation — Phase 2 will use real AI
function generateArticle(companyName: string, niche: string, keywords: string[]): { title: string; content: string } {
  const keyword = keywords[Math.floor(Math.random() * keywords.length)] || niche;
  const title = `${keyword.charAt(0).toUpperCase() + keyword.slice(1)}: De Complete Gids voor ${niche} in 2026`;
  const content = `
# ${title}

*Geschreven voor ${companyName} door BlogPilot*

## Introductie

In de wereld van ${niche} is het essentieel om up-to-date te blijven met de laatste trends rondom ${keyword}. In dit artikel bespreken we de belangrijkste aspecten en geven we praktische tips.

## Waarom ${keyword} belangrijk is

${keyword} speelt een cruciale rol in de groeistrategie van elk bedrijf in de ${niche} sector. Uit recent onderzoek blijkt dat bedrijven die investeren in content marketing gemiddeld 67% meer leads genereren.

## Praktische tips

1. **Begin met keyword research** — Identificeer de zoektermen die je doelgroep gebruikt.
2. **Schrijf waardevolle content** — Focus op het beantwoorden van vragen.
3. **Optimaliseer technisch** — Zorg voor snelle laadtijden en mobile-first design.
4. **Bouw backlinks** — Kwaliteit boven kwantiteit.
5. **Meet en optimaliseer** — Gebruik data om je strategie te verbeteren.

## Conclusie

Door consistent te investeren in SEO-geoptimaliseerde content rondom ${keyword}, bouw je een duurzaam concurrentievoordeel op in de ${niche} markt.

---
*Dit artikel is automatisch gegenereerd door BlogPilot — jouw autonome SEO content partner.*
  `.trim();

  return { title, content };
}

export async function POST() {
  const customers = db.customers.getAll().filter(c => c.status === 'active');
  const generated: string[] = [];

  for (const customer of customers) {
    const articlesPerWeek = customer.plan === 'pro' ? 2 : 1;

    for (let i = 0; i < articlesPerWeek; i++) {
      const { title, content } = generateArticle(customer.companyName, customer.niche, customer.keywords);
      const article: Article = {
        id: uuid(),
        customerId: customer.id,
        title,
        content,
        keywords: customer.keywords,
        status: 'draft',
        createdAt: new Date().toISOString(),
      };
      db.articles.save(article);
      generated.push(`${customer.companyName}: "${title}"`);
    }
  }

  return NextResponse.json({ generated, count: generated.length });
}
