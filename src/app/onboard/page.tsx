'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function OnboardForm() {
  const searchParams = useSearchParams();
  const initialPlan = searchParams.get('plan') === 'pro' ? 'pro' : 'starter';

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    companyName: '',
    email: '',
    websiteUrl: '',
    niche: '',
    keywords: '',
    plan: initialPlan,
  });

  const update = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }));

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else alert('Er ging iets mis. Probeer opnieuw.');
    } catch {
      alert('Er ging iets mis. Probeer opnieuw.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20 px-6">
      <div className="max-w-xl mx-auto">
        <a href="/" className="text-xl font-bold text-navy mb-8 block">Blog<span className="text-accent">Pilot</span></a>

        {/* Progress */}
        <div className="flex gap-2 mb-8">
          {[1, 2, 3].map(s => (
            <div key={s} className={`h-1.5 flex-1 rounded-full ${s <= step ? 'bg-accent' : 'bg-gray-200'}`} />
          ))}
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-sm">
          {step === 1 && (
            <>
              <h2 className="text-2xl font-bold text-navy mb-2">Over je bedrijf</h2>
              <p className="text-gray-500 mb-6">Vertel ons wie je bent zodat we de content kunnen afstemmen.</p>
              <label className="block mb-4">
                <span className="text-sm font-medium text-gray-700">Bedrijfsnaam *</span>
                <input value={form.companyName} onChange={e => update('companyName', e.target.value)}
                  className="mt-1 w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-accent focus:border-accent outline-none" placeholder="Jouw Bedrijf B.V." />
              </label>
              <label className="block mb-4">
                <span className="text-sm font-medium text-gray-700">Email *</span>
                <input type="email" value={form.email} onChange={e => update('email', e.target.value)}
                  className="mt-1 w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-accent focus:border-accent outline-none" placeholder="jouw@email.nl" />
              </label>
              <label className="block mb-6">
                <span className="text-sm font-medium text-gray-700">Website URL</span>
                <input value={form.websiteUrl} onChange={e => update('websiteUrl', e.target.value)}
                  className="mt-1 w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-accent focus:border-accent outline-none" placeholder="https://jouwbedrijf.nl" />
              </label>
              <button onClick={() => form.companyName && form.email ? setStep(2) : null}
                className="w-full bg-accent hover:bg-accent-dark text-white py-3 rounded-xl font-semibold transition">Volgende →</button>
            </>
          )}

          {step === 2 && (
            <>
              <h2 className="text-2xl font-bold text-navy mb-2">Content strategie</h2>
              <p className="text-gray-500 mb-6">In welke niche ben je actief en welke zoekwoorden zijn belangrijk?</p>
              <label className="block mb-4">
                <span className="text-sm font-medium text-gray-700">Niche / Branche *</span>
                <input value={form.niche} onChange={e => update('niche', e.target.value)}
                  className="mt-1 w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-accent focus:border-accent outline-none" placeholder="bijv. E-commerce, SaaS, Gezondheidszorg" />
              </label>
              <label className="block mb-6">
                <span className="text-sm font-medium text-gray-700">Target keywords (komma-gescheiden)</span>
                <textarea value={form.keywords} onChange={e => update('keywords', e.target.value)} rows={3}
                  className="mt-1 w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-accent focus:border-accent outline-none" placeholder="seo tips, content marketing, blog strategie" />
              </label>
              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="flex-1 border-2 border-gray-200 py-3 rounded-xl font-semibold transition hover:bg-gray-50">← Terug</button>
                <button onClick={() => form.niche ? setStep(3) : null}
                  className="flex-1 bg-accent hover:bg-accent-dark text-white py-3 rounded-xl font-semibold transition">Volgende →</button>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <h2 className="text-2xl font-bold text-navy mb-2">Kies je plan</h2>
              <p className="text-gray-500 mb-6">Selecteer het plan dat bij je past.</p>
              <div className="space-y-3 mb-6">
                {[
                  { id: 'starter', name: 'Starter', price: '€79/mnd', desc: '4 artikelen per maand' },
                  { id: 'pro', name: 'Pro', price: '€149/mnd', desc: '8 artikelen per maand' },
                ].map(p => (
                  <label key={p.id} className={`block border-2 rounded-xl p-4 cursor-pointer transition ${form.plan === p.id ? 'border-accent bg-accent/5' : 'border-gray-200 hover:border-gray-300'}`}>
                    <input type="radio" name="plan" value={p.id} checked={form.plan === p.id} onChange={e => update('plan', e.target.value)} className="sr-only" />
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-bold text-navy">{p.name}</div>
                        <div className="text-sm text-gray-500">{p.desc}</div>
                      </div>
                      <div className="font-bold text-navy">{p.price}</div>
                    </div>
                  </label>
                ))}
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(2)} className="flex-1 border-2 border-gray-200 py-3 rounded-xl font-semibold transition hover:bg-gray-50">← Terug</button>
                <button onClick={handleCheckout} disabled={loading}
                  className="flex-1 bg-accent hover:bg-accent-dark text-white py-3 rounded-xl font-semibold transition disabled:opacity-50">
                  {loading ? 'Laden...' : '💳 Afrekenen'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function OnboardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="text-gray-400">Laden...</div></div>}>
      <OnboardForm />
    </Suspense>
  );
}
