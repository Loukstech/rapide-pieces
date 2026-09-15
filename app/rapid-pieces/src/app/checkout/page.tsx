'use client';

import { useState, useMemo, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Shield, CreditCard, Banknote, Smartphone, Lock, CheckCircle2, Gift, ArrowRight, ChevronRight } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import BottomActionBar from '@/components/BottomActionBar';
import { useOfferById, useRequestById, addOrder, addRapidPoints } from '@/lib/store';
import { useAuth } from '@/lib/auth';
import { DeliveryType, deliveryLabel, formatPrice } from '@/lib/types';

const DELIVERY_FEES: Record<DeliveryType, number> = {
  RAPID_NOW: 1500,
  RAPID_CITY: 3000,
  RAPID_NIGERIA: 8000,
  RAPID_USA: 15000,
  RAPID_DUBAI: 15000,
  RAPID_TURKEY: 18000,
  RAPID_FRANCE: 18000,
  RAPID_GERMANY: 18000,
  RAPID_ENGLAND: 18000,
  RAPID_CHINA: 20000,
};

export default function CheckoutPage() {
  return (
    <Suspense fallback={null}>
      <CheckoutPageInner />
    </Suspense>
  );
}

function CheckoutPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const offerId = searchParams.get('offerId') ?? undefined;
  const requestId = searchParams.get('requestId') ?? undefined;
  const { user, isLoading: authLoading } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState('momo');
  const [step, setStep] = useState(1);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [pointsGained, setPointsGained] = useState(0);
  const [paying, setPaying] = useState(false);
  const [vin, setVin] = useState('');
  const [payError, setPayError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'buyer')) router.replace('/login');
  }, [user, authLoading, router]);

  // Tant que la session n'est pas restaurée (ouverture directe/rechargement), on ne
  // lance pas ces requêtes protégées par RLS — sinon elles partent en anonyme,
  // échouent silencieusement, et la page peut afficher un résumé de secours
  // (prix par défaut) au lieu de la vraie offre, voire valider un paiement fictif.
  const { data: offer, loading: offerLoading } = useOfferById(authLoading ? undefined : offerId);
  const { data: request } = useRequestById(authLoading ? undefined : requestId);

  // Cahier V2 - Point 7 : pré-remplit le VIN depuis la demande s'il a déjà été
  // renseigné (ex. mode de recherche par VIN), sinon l'acheteur devra le saisir
  // ici si le montant dépasse le seuil.
  useEffect(() => {
    if (request?.vehicle.vin) setVin(request.vehicle.vin);
  }, [request]);

  const orderSummary = useMemo(() => {
    const deliveryFee = 0; // Cahier V2 - Point 34: livraison = 0 temporairement
    const price = offer?.price ?? 45000;
    return {
      part: offer?.partName ?? 'Pièce auto',
      quality: offer?.quality ?? 'OEM',
      seller: offer?.sellerName ?? 'Vendeur Rapid Pièces',
      price,
      delivery: offer ? deliveryLabel(offer.deliveryType) : 'RAPID CITY',
      deliveryFee,
      total: price + deliveryFee,
    };
  }, [offer]);

  // Cahier V2 - Point 7 : VIN/châssis obligatoire au-delà de 50 000 FCFA (aussi
  // imposé côté DB, migration 017 — ce contrôle évite juste un aller-retour inutile).
  const VIN_REQUIRED_THRESHOLD = 50000;
  const vinRequired = orderSummary.total > VIN_REQUIRED_THRESHOLD;

  const handleConfirmPayment = async () => {
    if (vinRequired && !vin.trim()) {
      setPayError('Le numéro VIN/châssis est obligatoire pour un paiement supérieur à 50 000 FCFA.');
      return;
    }
    if (offer && request && user) {
      setPaying(true);
      setPayError(null);
      const order = await addOrder({
        requestId: request.id,
        offerId: offer.id,
        buyerId: user.id,
        sellerId: offer.sellerId,
        sellerName: offer.sellerName,
        partName: offer.partName,
        vehicle: request.vehicle,
        price: orderSummary.total,
        currency: offer.currency,
        deliveryType: offer.deliveryType,
        vin: vin.trim() || undefined,
      });
      setPaying(false);
      if (order) {
        setOrderId(order.id);
        setPointsGained(await addRapidPoints(user.id, orderSummary.total));
        setStep(3);
      } else {
        // Ne pas avancer vers l'écran "Paiement confirmé" si la commande n'a pas
        // réellement été enregistrée (ex. rejetée par le trigger VIN côté DB) —
        // avant ce correctif, l'acheteur voyait "Paiement confirmé !" alors que
        // rien n'avait été créé.
        setPayError("Le paiement n'a pas pu être finalisé. Vérifiez le numéro VIN/châssis et réessayez.");
      }
    }
  };

  if (authLoading || !user || offerLoading) {
    return <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex items-center justify-center"><div className="w-10 h-10 border-4 border-red-500 border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 pb-24 lg:pb-8">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white backdrop-blur-xl border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center gap-3">
          <button onClick={() => step > 1 ? setStep(step - 1) : router.back()} className="text-gray-400 dark:text-slate-500 dark:text-slate-500 hover:text-gray-900 dark:text-white">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <h1 className="text-lg font-bold text-gray-900 dark:text-white dark:text-white">Paiement</h1>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Progress */}
        <div className="flex items-center gap-2">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${step >= s ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-400 dark:text-slate-500 dark:text-slate-500'}`}>
                {s}
              </div>
              {s < 3 && <div className={`flex-1 h-0.5 mx-2 ${step > s ? 'bg-red-600' : 'bg-gray-100'}`} />}
            </div>
          ))}
        </div>
        <div className="flex justify-between text-[10px] text-gray-400 dark:text-slate-500 dark:text-slate-500">
          <span>Résumé</span>
          <span>Paiement</span>
          <span>Confirmation</span>
        </div>

        {/* Step 1: Summary */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="bg-white backdrop-blur-sm rounded-2xl p-5 border border-gray-200 space-y-3">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Résumé de la commande</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400 dark:text-slate-500 dark:text-slate-500">Pièce</span>
                  <span className="text-gray-900 dark:text-white font-bold">{orderSummary.part}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400 dark:text-slate-500 dark:text-slate-500">Qualité</span>
                  <span className="text-blue-400">{orderSummary.quality}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400 dark:text-slate-500 dark:text-slate-500">Vendeur</span>
                  <span className="text-gray-900 dark:text-white">{orderSummary.seller}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400 dark:text-slate-500 dark:text-slate-500">Livraison</span>
                  <span className="text-red-400 font-bold">Temporaire</span>
                </div>
                <hr className="border-gray-200" />
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400 dark:text-slate-500 dark:text-slate-500">Pièce</span>
                  <span className="text-gray-900 dark:text-white">{formatPrice(orderSummary.price, offer?.currency)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400 dark:text-slate-500 dark:text-slate-500">Livraison</span>
                  <span className="text-gray-900 dark:text-white">{formatPrice(0, offer?.currency)}</span>
                </div>
                <hr className="border-gray-200" />
                <div className="flex justify-between text-lg">
                  <span className="text-gray-900 dark:text-white font-bold">Total</span>
                  <span className="text-gray-900 dark:text-white font-black">{formatPrice(orderSummary.total, offer?.currency)}</span>
                </div>
              </div>
            </div>

            {/* Rapid Protection */}
            <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg text-emerald-600"><Shield className="w-5 h-5" /></span>
                <span className="text-sm font-bold text-emerald-700">Rapid Protection active</span>
              </div>
              <p className="text-xs text-emerald-700/80">Votre paiement est sécurisé par Escrow. L&apos;argent est retenu jusqu&apos;à confirmation de réception.</p>
            </div>

            {/* Cahier V2 - Point 35 : bloc cliquable vers la page dédiée à la garantie */}
            <Link
              href={`/guarantee?offerId=${offerId ?? ''}&requestId=${requestId ?? ''}`}
              className="flex items-center justify-between bg-white rounded-xl p-4 border border-gray-200 hover:border-gray-300"
            >
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-red-600" />
                <span className="text-sm font-bold text-gray-900 dark:text-white">Rapide Pièces Garantie</span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </Link>

            <BottomActionBar>
              <button onClick={() => setStep(2)} className="flex-1 py-3.5 bg-red-600 hover:bg-red-500 text-gray-900 dark:text-white font-bold rounded-xl transition-all flex items-center justify-center gap-1.5">
                Continuer
                <ArrowRight className="w-4 h-4" />
              </button>
            </BottomActionBar>
          </div>
        )}

        {/* Step 2: Payment */}
        {step === 2 && (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Méthode de paiement</h3>
            
            {[
              { id: 'momo', icon: <Smartphone className="w-6 h-6" />, name: 'Mobile Money', desc: 'MTN MoMo, Moov Money' },
              { id: 'card', icon: <CreditCard className="w-6 h-6" />, name: 'Carte bancaire', desc: 'Visa, Mastercard' },
              ...(offer?.paymentCondition === 'on_delivery' ? [{ id: 'cod', icon: <Banknote className="w-6 h-6" />, name: 'Paiement à la livraison', desc: 'Payez quand vous recevez' }] : []),
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => setPaymentMethod(m.id)}
                className={`w-full rounded-xl p-4 border text-left transition-all ${
                  paymentMethod === m.id
                    ? 'bg-red-600/10 border-red-500/50'
                    : 'bg-white border-gray-200 hover:border-gray-300 dark:hover:border-slate-500'
                }`}
              >
                <div className="flex items-center gap-3">
                  {m.icon}
                  <div>
                    <div className="text-sm font-bold text-gray-900 dark:text-white dark:text-white">{m.name}</div>
                    <div className="text-xs text-gray-400 dark:text-slate-500 dark:text-slate-500">{m.desc}</div>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 ml-auto flex items-center justify-center ${paymentMethod === m.id ? 'border-red-500 bg-red-500' : 'border-gray-300'}`}>
                    {paymentMethod === m.id && <div className="w-2 h-2 bg-white rounded-full" />}
                  </div>
                </div>
              </button>
            ))}

            {vinRequired && (
              <div className="bg-white backdrop-blur-sm rounded-xl p-4 border border-gray-200 space-y-2">
                <label className="text-xs font-bold text-gray-700 dark:text-slate-200 mb-1 block">
                  Numéro VIN / châssis <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={vin}
                  onChange={(e) => setVin(e.target.value)}
                  placeholder="Ex : VF1XXXXXXXXXXXXXX"
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2.5 text-gray-900 dark:text-white text-sm"
                />
                <p className="text-[10px] text-gray-400 dark:text-slate-500">
                  Obligatoire au-delà de 50 000 FCFA.
                </p>
              </div>
            )}

            {payError && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-xs text-red-600">{payError}</div>
            )}

            {paymentMethod === 'momo' && (
              <div className="bg-white backdrop-blur-sm rounded-xl p-4 border border-gray-200 space-y-3">
                <div>
                  <label className="text-xs font-bold text-gray-700 dark:text-slate-200 mb-1 block">Numéro Mobile Money</label>
                  <input type="tel" placeholder="+229 XX XX XX XX" className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2.5 text-gray-900 dark:text-white text-sm" />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700 dark:text-slate-200 mb-1 block">Nom du titulaire</label>
                  <input type="text" placeholder="Nom complet" className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2.5 text-gray-900 dark:text-white text-sm" />
                </div>
              </div>
            )}

            <BottomActionBar>
              <button onClick={handleConfirmPayment} disabled={paying} className="flex-1 py-3.5 bg-red-600 hover:bg-red-500 text-gray-900 dark:text-white font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 disabled:opacity-60">
                <Lock className="w-4 h-4" /> {paying ? 'Paiement...' : 'Payer'}
              </button>
            </BottomActionBar>
          </div>
        )}

        {/* Step 3: Confirmation */}
        {step === 3 && (
          <div className="space-y-4 text-center">
            <div className="bg-emerald-50 rounded-2xl p-8 border border-emerald-200">
              <CheckCircle2 className="w-12 h-12 mx-auto mb-4 text-emerald-600" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Paiement confirmé !</h2>
              <p className="text-sm text-gray-500 dark:text-slate-400">Votre commande a été traitée. La livraison est en cours.</p>
            </div>

            <div className="bg-white backdrop-blur-sm rounded-xl p-4 border border-gray-200 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400 dark:text-slate-500 dark:text-slate-500">N° Commande</span>
                <span className="text-gray-900 dark:text-white font-mono font-bold">{orderId ?? '—'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400 dark:text-slate-500 dark:text-slate-500">Montant</span>
                <span className="text-gray-900 dark:text-white font-bold">{formatPrice(orderSummary.total, offer?.currency)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400 dark:text-slate-500 dark:text-slate-500">Escrow</span>
                <span className="text-yellow-400 font-bold inline-flex items-center gap-1"><Lock className="w-3 h-3" /> Sécurisé</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400 dark:text-slate-500 dark:text-slate-500">Livraison estimée</span>
                <span className="text-emerald-600 font-bold">Aujourd&apos;hui - 2h</span>
              </div>
            </div>

            <div className="bg-white backdrop-blur-sm rounded-xl p-4 border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg"><Gift className="w-5 h-5" /></span>
                <span className="text-sm font-bold text-yellow-400">+{pointsGained} Rapid Points gagnés !</span>
              </div>
              <p className="text-[10px] text-gray-400 dark:text-slate-500 dark:text-slate-500 mt-1">1 point / 1 000 FCFA dépensé, cumulés dans votre profil.</p>
            </div>

            <div className="flex gap-3">
              <Link href="/orders" className="flex-1 bg-red-600 hover:bg-red-500 text-gray-900 dark:text-white font-bold py-3 rounded-xl text-center transition-all">
                Suivre la commande
              </Link>
              <Link href="/" className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-900 dark:text-white font-bold py-3 rounded-xl text-center transition-all">
                Retour accueil
              </Link>
            </div>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
