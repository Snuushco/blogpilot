export interface Customer {
  id: string;
  email: string;
  companyName: string;
  niche: string;
  keywords: string[];
  websiteUrl: string;
  plan: 'starter' | 'pro';
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  status: 'pending' | 'active' | 'cancelled';
  createdAt: string;
}

export interface Article {
  id: string;
  customerId: string;
  title: string;
  content: string;
  keywords: string[];
  status: 'draft' | 'delivered';
  createdAt: string;
  deliveredAt?: string;
}

// In-memory store for serverless (Vercel) — data persists within a single invocation
// For production, replace with a real database (Supabase, PlanetScale, etc.)
let customers: Customer[] = [];
let articles: Article[] = [];

// Try to use filesystem on non-serverless environments
function tryLoadFromFS() {
  try {
    const fs = require('fs');
    const path = require('path');
    const dir = path.join(process.cwd(), 'data');
    if (fs.existsSync(path.join(dir, 'customers.json'))) {
      customers = JSON.parse(fs.readFileSync(path.join(dir, 'customers.json'), 'utf-8'));
    }
    if (fs.existsSync(path.join(dir, 'articles.json'))) {
      articles = JSON.parse(fs.readFileSync(path.join(dir, 'articles.json'), 'utf-8'));
    }
  } catch {}
}

function trySaveToFS(name: string, data: any[]) {
  try {
    const fs = require('fs');
    const path = require('path');
    const dir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, `${name}.json`), JSON.stringify(data, null, 2));
  } catch {}
}

tryLoadFromFS();

export const db = {
  customers: {
    getAll: () => customers,
    getById: (id: string) => customers.find(c => c.id === id),
    getByEmail: (email: string) => customers.find(c => c.email === email),
    getByStripeCustomerId: (sid: string) => customers.find(c => c.stripeCustomerId === sid),
    save: (customer: Customer) => {
      const idx = customers.findIndex(c => c.id === customer.id);
      if (idx >= 0) customers[idx] = customer; else customers.push(customer);
      trySaveToFS('customers', customers);
      return customer;
    },
  },
  articles: {
    getAll: () => articles,
    getByCustomerId: (cid: string) => articles.filter(a => a.customerId === cid),
    save: (article: Article) => {
      const idx = articles.findIndex(a => a.id === article.id);
      if (idx >= 0) articles[idx] = article; else articles.push(article);
      trySaveToFS('articles', articles);
      return article;
    },
  },
};
