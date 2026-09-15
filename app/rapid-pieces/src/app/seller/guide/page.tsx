'use client';

import Link from 'next/link';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import BottomNav from '@/components/BottomNav';

const steps = [
  'Répondez vite aux demandes ouvertes avec un prix clair.',
  'Renseignez la qualité, la disponibilité, la garantie et le mode de livraison.',
  'Utilisez les contre-offres pour ajuster le prix sans perdre la négociation.',
  'Gardez vos coordonnées boutique complètes dans votre profil vendeur.',
];

export default function SellerGuidePage() {
  return (
    <div className="min-h-screen bg-rp-bg pb-24">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/seller/profile" className="text-gray-400 hover:text-gray-900"><ArrowLeft className="w-5 h-5" /></Link>
          <h1 className="text-sm font-bold text-gray-900">Guide vendeur</h1>
        </div>
      </header>
      <main className="max-w-2xl mx-auto px-4 py-4 space-y-3">
        {steps.map((step) => (
          <div key={step} className="flex gap-3 rounded-xl border border-gray-200 bg-white p-4">
            <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-500" />
            <p className="text-sm text-gray-700">{step}</p>
          </div>
        ))}
      </main>
      <BottomNav role="seller" />
    </div>
  );
}
