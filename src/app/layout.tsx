import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'BlogPilot — Autonome SEO Content op Autopilot',
  description: 'Ontvang wekelijks SEO-geoptimaliseerde blogartikelen. Volledig autonoom, zonder gedoe.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl">
      <body className="bg-white text-gray-900 antialiased">{children}</body>
    </html>
  );
}
