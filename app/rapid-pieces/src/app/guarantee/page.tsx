'use client';

import { useMemo, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import { useOfferById, useRequestById } from '@/lib/store';
import { requestTitleLine, formatPrice } from '@/lib/types';

// Cahier V2 - Points 35/36/37 : "Rapide Pièces Garantie" est un bloc cliquable
// sur la page d'offre/checkout qui mène ici. Les infos de la pièce et le
// montant sont récupérés automatiquement depuis la commande (offre + demande),
// l'acheteur choisit une durée et le prix de la garantie est recalculé.
//
// La formule exacte n'a pas encore été fournie par le client (cf. cahier v2,
// section "points laissés en attente") — on applique donc une estimation
// simple et transparente (3% du prix de la pièce par année), clairement
// signalée comme telle, à remplacer dès que la vraie formule sera définie.
const WARRANTY_RATE_PER_YEAR = 0.03;
const YEAR_OPTIONS = [1, 2, 3, 5];

export default function GuaranteePage() {
  return (
    <Suspense fallback={null}>
      <GuaranteePageInner />
    </Suspense>
  );
}

function GuaranteePageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const offerId = searchParams.get('offerId') ?? undefined;
  const requestId = searchParams.get('requestId') ?? undefined;
  const { data: offer, loading: offerLoading } = useOfferById(offerId);
  const { data: request } = useRequestById(requestId);
  const [years, setYears] = useState(1);

  const guaranteePrice = useMemo(() => {
    if (!offer) return 0;
    return Math.round(offer.price * WARRANTY_RATE_PER_YEAR * years);
  }, [offer, years]);

  if (offerLoading) {
    return <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex items-center justify-center"><div className="w-10 h-10 border-4 border-red-500 border-t-transparent rounded-full animate-spin" /></div>;
  }

  if (!offer) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex items-center justify-center px-4 text-center">
        <p className="text-sm text-gray-400 dark:text-slate-500">Commande introuvable pour la garantie.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 pb-24 lg:pb-8">
      <header className="sticky top-0 z-40 bg-white backdrop-blur-xl border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center gap-3">
          <button onClick={() => router.back()} className="text-gray-400 dark:text-slate-500 hover:text-gray-900 dark:text-white">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-bold text-gray-900 dark:text-white">Rapide Pièces Garantie</h1>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 space-y-4">
        <div className="bg-white rounded-2xl p-5 border border-gray-200 space-y-2">
          <div className="flex items-center gap-2 text-emerald-600 mb-1">
            <ShieldCheck className="w-5 h-5" />
            <span className="text-sm font-bold">Détails de la commande</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400 dark:text-slate-500">Pièce</span>
            <span className="text-gray-900 dark:text-white font-bold">{offer.partName}</span>
          </div>
          {request && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-400 dark:text-slate-500">Véhicule</span>
              <span className="text-gray-900 dark:text-white">{requestTitleLine(request)}</span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span className="text-gray-400 dark:text-slate-500">Qualité</span>
            <span className="text-blue-600">{offer.quality}</span>
          </div>
          <hr className="border-gray-200" />
          <div className="flex justify-between text-sm">
            <span className="text-gray-400 dark:text-slate-500">Montant de la pièce</span>
            <span className="text-gray-900 dark:text-white font-bold">{formatPrice(offer.price, offer.currency)}</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-200 space-y-3">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Durée de la garantie</h3>
          <div className="flex flex-wrap gap-2">
            {YEAR_OPTIONS.map((y) => (
              <button
                key={y}
                onClick={() => setYears(y)}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                  years === y ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-600 dark:text-slate-300'
                }`}
              >
                {y} an{y > 1 ? 's' : ''}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-200 space-y-1">
          <p className="text-xs text-emerald-700/80">Prix de la garantie (estimation)</p>
          <p className="text-2xl font-black text-emerald-700">{formatPrice(guaranteePrice, offer?.currency)}</p>
          <p className="text-[10px] text-emerald-700/60">Calculé sur {years} an{years > 1 ? 's' : ''} et le montant de la pièce. La formule définitive sera confirmée avec Rapid Pièces.</p>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
