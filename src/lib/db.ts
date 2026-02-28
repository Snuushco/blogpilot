import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

function readFile<T>(name: string): T[] {
  ensureDir();
  const p = path.join(DATA_DIR, `${name}.json`);
  if (!fs.existsSync(p)) return [];
  return JSON.parse(fs.readFileSync(p, 'utf-8'));
}

function writeFile<T>(name: string, data: T[]) {
  ensureDir();
  fs.writeFileSync(path.join(DATA_DIR, `${name}.json`), JSON.stringify(data, null, 2));
}

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

export const db = {
  customers: {
    getAll: () => readFile<Customer>('customers'),
    getById: (id: string) => readFile<Customer>('customers').find(c => c.id === id),
    getByEmail: (email: string) => readFile<Customer>('customers').find(c => c.email === email),
    getByStripeCustomerId: (sid: string) => readFile<Customer>('customers').find(c => c.stripeCustomerId === sid),
    save: (customer: Customer) => {
      const all = readFile<Customer>('customers');
      const idx = all.findIndex(c => c.id === customer.id);
      if (idx >= 0) all[idx] = customer; else all.push(customer);
      writeFile('customers', all);
      return customer;
    },
  },
  articles: {
    getAll: () => readFile<Article>('articles'),
    getByCustomerId: (cid: string) => readFile<Article>('articles').filter(a => a.customerId === cid),
    save: (article: Article) => {
      const all = readFile<Article>('articles');
      const idx = all.findIndex(a => a.id === article.id);
      if (idx >= 0) all[idx] = article; else all.push(article);
      writeFile('articles', all);
      return article;
    },
  },
};
