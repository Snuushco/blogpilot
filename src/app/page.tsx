import Link from 'next/link';

const steps = [
  { icon: '📝', title: 'Vul je gegevens in', desc: 'Bedrijfsnaam, niche, keywords — wij doen de rest.' },
  { icon: '💳', title: 'Kies je plan', desc: 'Starter (€79/mnd) of Pro (€149/mnd). Opzegbaar per maand.' },
  { icon: '🚀', title: 'Ontvang content', desc: 'Wekelijks SEO-artikelen in je inbox. Volledig autonoom.' },
];

const plans = [
  { name: 'Starter', price: '€79', period: '/maand', features: ['4 artikelen per maand', 'SEO-geoptimaliseerd', 'Maandelijks rapport', 'Email support'], cta: 'Start met Starter', href: '/onboard?plan=starter' },
  { name: 'Pro', price: '€149', period: '/maand', features: ['8 artikelen per maand', 'SEO-geoptimaliseerd', 'Wekelijks rapport', 'Prioriteit support', 'Keyword research'], cta: 'Start met Pro', href: '/onboard?plan=pro', popular: true },
];

const faqs = [
  { q: 'Hoe werkt de content generatie?', a: 'Onze AI analyseert je niche, concurrenten en keywords om unieke, SEO-geoptimaliseerde artikelen te schrijven die ranken in Google.' },
  { q: 'Kan ik de artikelen aanpassen?', a: 'Ja, alle artikelen worden per email geleverd zodat je ze kunt reviewen en aanpassen voordat je ze publiceert.' },
  { q: 'Wat als ik wil opzeggen?', a: 'Je kunt per maand opzeggen. Geen langlopende contracten, geen kleine lettertjes.' },
  { q: 'In welke taal zijn de artikelen?', a: 'Standaard Nederlands, maar we ondersteunen ook Engels en Duits.' },
];

export default function Home() {
  return (
    <main>
      {/* Nav */}
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur z-50 border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="text-xl font-bold text-navy">Blog<span className="text-accent">Pilot</span></span>
          <div className="hidden md:flex gap-8 text-sm text-gray-600">
            <a href="#hoe-het-werkt" className="hover:text-navy">Hoe het werkt</a>
            <a href="#pricing" className="hover:text-navy">Pricing</a>
            <a href="#faq" className="hover:text-navy">FAQ</a>
          </div>
          <Link href="/onboard" className="bg-accent hover:bg-accent-dark text-white px-5 py-2 rounded-lg text-sm font-medium transition">Start nu</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block bg-accent/10 text-accent text-sm font-medium px-4 py-1.5 rounded-full mb-6">✨ Volledig autonoom — geen gedoe</div>
          <h1 className="text-4xl md:text-6xl font-bold text-navy leading-tight mb-6">
            SEO-content op <span className="text-accent">autopilot</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-10">
            Ontvang wekelijks professionele, SEO-geoptimaliseerde blogartikelen. Zonder schrijvers, zonder stress. Jij groeit, wij schrijven.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/onboard" className="bg-accent hover:bg-accent-dark text-white px-8 py-4 rounded-xl text-lg font-semibold transition shadow-lg shadow-accent/25">
              Begin vandaag — vanaf €79/mnd
            </Link>
            <a href="#hoe-het-werkt" className="border-2 border-navy/20 hover:border-navy text-navy px-8 py-4 rounded-xl text-lg font-semibold transition">
              Hoe werkt het?
            </a>
          </div>
        </div>
      </section>

      {/* Hoe het werkt */}
      <section id="hoe-het-werkt" className="py-20 bg-gray-50 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-navy text-center mb-12">Hoe het werkt</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((s, i) => (
              <div key={i} className="bg-white rounded-2xl p-8 shadow-sm text-center">
                <div className="text-4xl mb-4">{s.icon}</div>
                <div className="text-xs font-bold text-accent mb-2">STAP {i + 1}</div>
                <h3 className="text-xl font-bold text-navy mb-2">{s.title}</h3>
                <p className="text-gray-600">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-navy text-center mb-4">Transparante pricing</h2>
          <p className="text-gray-600 text-center mb-12 max-w-lg mx-auto">Geen verborgen kosten. Maandelijks opzegbaar.</p>
          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {plans.map((p) => (
              <div key={p.name} className={`rounded-2xl p-8 ${p.popular ? 'bg-navy text-white ring-4 ring-accent/30' : 'bg-gray-50'}`}>
                {p.popular && <div className="text-accent text-xs font-bold mb-3">⭐ MEEST GEKOZEN</div>}
                <h3 className={`text-2xl font-bold ${p.popular ? 'text-white' : 'text-navy'}`}>{p.name}</h3>
                <div className="mt-4 mb-6">
                  <span className="text-4xl font-bold">{p.price}</span>
                  <span className={`${p.popular ? 'text-gray-300' : 'text-gray-500'}`}>{p.period}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {p.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="text-accent">✓</span> {f}
                    </li>
                  ))}
                </ul>
                <Link href={p.href} className={`block text-center py-3 rounded-xl font-semibold transition ${p.popular ? 'bg-accent hover:bg-accent-dark text-white' : 'bg-navy hover:bg-navy-light text-white'}`}>
                  {p.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 bg-gray-50 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-navy text-center mb-12">Veelgestelde vragen</h2>
          <div className="space-y-4">
            {faqs.map((f, i) => (
              <details key={i} className="bg-white rounded-xl p-6 shadow-sm group">
                <summary className="font-semibold text-navy cursor-pointer list-none flex justify-between items-center">
                  {f.q}
                  <span className="text-accent group-open:rotate-45 transition-transform text-xl">+</span>
                </summary>
                <p className="mt-3 text-gray-600">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-navy text-white px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <span className="text-lg font-bold">Blog<span className="text-accent">Pilot</span></span>
          <p className="text-gray-400 text-sm">© 2026 BlogPilot. Alle rechten voorbehouden.</p>
        </div>
      </footer>
    </main>
  );
}
