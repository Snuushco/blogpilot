'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

interface Article {
  id: string;
  title: string;
  status: string;
  createdAt: string;
  deliveredAt?: string;
}

interface CustomerData {
  companyName: string;
  email: string;
  niche: string;
  plan: string;
  status: string;
  keywords: string[];
  articles: Article[];
}

function DashboardContent() {
  const searchParams = useSearchParams();
  const customerId = searchParams.get('id');
  const [data, setData] = useState<CustomerData | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!customerId) { setError('Geen klant-ID opgegeven.'); return; }
    fetch(`/api/customer?id=${customerId}`)
      .then(r => r.json())
      .then(d => { if (d.error) setError(d.error); else setData(d); })
      .catch(() => setError('Kon gegevens niet laden.'));
  }, [customerId]);

  if (error) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="bg-white rounded-2xl p-8 shadow-sm text-center max-w-md">
        <div className="text-4xl mb-4">🔒</div>
        <h2 className="text-xl font-bold text-navy mb-2">Toegang beperkt</h2>
        <p className="text-gray-500 mb-4">{error}</p>
        <a href="/" className="text-accent font-medium hover:underline">← Terug naar home</a>
      </div>
    </div>
  );

  if (!data) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-gray-400 animate-pulse">Dashboard laden...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <a href="/" className="text-xl font-bold text-navy">Blog<span className="text-accent">Pilot</span></a>
          <div className="text-sm text-gray-500">{data.email}</div>
        </div>
      </nav>
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-navy mb-1">Welkom, {data.companyName} 👋</h1>
          <p className="text-gray-500">Plan: <span className="font-medium text-accent capitalize">{data.plan}</span> · Status: <span className={`font-medium ${data.status === 'active' ? 'text-accent' : 'text-yellow-600'}`}>{data.status === 'active' ? 'Actief' : 'In afwachting'}</span></p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="text-sm text-gray-500 mb-1">Artikelen geleverd</div>
            <div className="text-3xl font-bold text-navy">{data.articles.filter(a => a.status === 'delivered').length}</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="text-sm text-gray-500 mb-1">In de planning</div>
            <div className="text-3xl font-bold text-navy">{data.articles.filter(a => a.status === 'draft').length}</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="text-sm text-gray-500 mb-1">Keywords</div>
            <div className="text-3xl font-bold text-navy">{data.keywords.length}</div>
          </div>
        </div>

        {/* Articles */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-bold text-navy">Je artikelen</h2>
          </div>
          {data.articles.length === 0 ? (
            <div className="p-12 text-center text-gray-400">
              <div className="text-4xl mb-3">📝</div>
              <p>Je eerste artikelen worden binnenkort gegenereerd!</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {data.articles.map(a => (
                <div key={a.id} className="p-6 flex items-center justify-between">
                  <div>
                    <div className="font-medium text-navy">{a.title}</div>
                    <div className="text-sm text-gray-400">{new Date(a.createdAt).toLocaleDateString('nl-NL')}</div>
                  </div>
                  <span className={`text-xs font-medium px-3 py-1 rounded-full ${a.status === 'delivered' ? 'bg-accent/10 text-accent' : 'bg-yellow-100 text-yellow-700'}`}>
                    {a.status === 'delivered' ? 'Geleverd' : 'Concept'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="text-gray-400">Laden...</div></div>}>
      <DashboardContent />
    </Suspense>
  );
}
