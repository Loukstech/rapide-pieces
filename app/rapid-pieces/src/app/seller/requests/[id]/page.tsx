'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Check, Send, Package, X, MessageSquare } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import { useAuth } from '@/lib/auth';
import { useRequestById, useOffersForRequest, useSellers, addOffer, acceptOffer, rejectOffer, counterOffer, useEnabledDeliveryOptions, useOfferNegotiationHistory } from '@/lib/store';
import { PartQuality, DeliveryType, Offer, QUALITY_LEVELS, requestTitleLine, requestSubtitleLine, COUNTER_OFFER_PERCENTAGES, applyCounterOfferPercentage, currencyForCountry, formatPrice, currencyLabel } from '@/lib/types';
import { useToast } from '@/components/Toast';

const qualityOptions: PartQuality[] = ['OEM', 'Genuine', 'Premium Aftermarket', 'Standard Aftermarket'];
const availabilityOptions: { value: Offer['availability']; label: string }[] = [
  { value: 'immediate', label: 'Immédiate' },
  { value: '24h', label: '24 heures' },
  { value: '48h', label: '48 heures' },
  { value: '3-5days', label: '3-5 jours' },
];

export default function SellerRequestDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const requestId = params.id;
  const { user, isLoading: authLoading } = useAuth();
  const { showToast } = useToast();

  // Tant que la session n'est pas restaurée, on ne lance pas les requêtes
  // protégées par RLS — sinon elles partent en anonyme et affichent à tort
  // "Demande introuvable" avant de se corriger toutes seules.
  const { data: request, loading: requestLoading } = useRequestById(authLoading ? undefined : requestId);
  const { data: offersForRequest, loading: offersLoading, refetch: refetchOffers } = useOffersForRequest(authLoading ? undefined : requestId);
  const { data: sellers } = useSellers();
  const { data: enabledDeliveryOptions } = useEnabledDeliveryOptions();

  const [price, setPrice] = useState('');
  const [quality, setQuality] = useState<PartQuality>('OEM');
  const [availability, setAvailability] = useState<Offer['availability']>('immediate');
  const [deliveryType, setDeliveryType] = useState<DeliveryType>('RAPID_NOW');
  const [warranty, setWarranty] = useState('3 mois');
  const [paymentCondition, setPaymentCondition] = useState<'rapid_pieces' | 'in_store' | 'on_delivery'>('rapid_pieces');
  const [condition, setCondition] = useState<'used' | 'new'>('new'); // Cahier V2 - Nouvelle section État
  // Cahier V2 - Point 32 : le vendeur choisit si sa demande accepte la
  // contre-offre (ouverte) ou si le prix est ferme (fermée).
  const [negotiable, setNegotiable] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [counterPercentage, setCounterPercentage] = useState<number | null>(null);
  const [countering, setCountering] = useState(false);
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  // Calculé ici (avant tout return conditionnel) car useOfferNegotiationHistory
  // ci-dessous est un hook — l'appeler après un `return` casserait les Rules of Hooks.
  const myOffer = offersForRequest.find((o) => o.sellerId === user?.id);
  const { data: negotiationHistory } = useOfferNegotiationHistory(myOffer?.id);

  // Brouillon local : si le vendeur quitte l'app en plein remplissage du
  // formulaire d'offre, il retrouve ses saisies au retour (par demande).
  const draftKey = `offerDraft:${requestId}`;
  useEffect(() => {
    try {
      const raw = localStorage.getItem(draftKey);
      if (raw) {
        const draft = JSON.parse(raw);
        if (draft.price) setPrice(draft.price);
        if (draft.quality) setQuality(draft.quality);
        if (draft.availability) setAvailability(draft.availability);
        if (draft.deliveryType) setDeliveryType(draft.deliveryType);
        if (draft.warranty) setWarranty(draft.warranty);
        if (draft.paymentCondition) setPaymentCondition(draft.paymentCondition);
        if (draft.condition) setCondition(draft.condition);
        if (typeof draft.negotiable === 'boolean') setNegotiable(draft.negotiable);
      }
    } catch {
      // localStorage indisponible (navigation privée, etc.) — pas grave, on
      // se contente de ne pas restaurer de brouillon.
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draftKey]);

  useEffect(() => {
    try {
      localStorage.setItem(draftKey, JSON.stringify({ price, quality, availability, deliveryType, warranty, paymentCondition, condition, negotiable }));
    } catch {
      // idem
    }
  }, [draftKey, price, quality, availability, deliveryType, warranty, paymentCondition, condition, negotiable]);

  if (!authLoading && (!user || user.role !== 'seller')) {
    router.replace('/login');
    return null;
  }

  if (authLoading || !user) {
    return <div className="min-h-screen bg-rp-bg flex items-center justify-center"><div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" /></div>;
  }

  const myCurrency = currencyForCountry(sellers.find((s) => s.id === user.id)?.country);

  const handleSubmit = async () => {
    if (!request || !price) return;
    const sellerRecord = sellers.find((s) => s.id === user.id);
    if (sellerRecord?.isBanned) {
      setActionError('Votre compte a été suspendu, vous ne pouvez plus proposer d’offres.');
      return;
    }
    setActionError(null);
    setSubmitting(true);
    const created = await addOffer({
      requestId: request.id,
      sellerId: user.id,
      sellerName: sellerRecord?.name ?? user.name,
      sellerBadge: sellerRecord?.badge ?? 'Rapid Seller',
      sellerScore: sellerRecord?.rating ?? 5,
      partName: request.partName,
      quality,
      price: parseInt(price, 10),
      // Cahier V2 - Point 26 : devise du pays du vendeur plutôt que "FCFA" fixe.
      currency: myCurrency,
      availability,
      deliveryType,
      deliveryTime: enabledDeliveryOptions.find((d) => d.type === deliveryType)?.timeframe ?? '',
      warranty,
      paymentCondition, // Cahier V2 - Point 49: Conditions de paiement
      negotiable, // Cahier V2 - Point 32: offre ouverte/fermée à la négociation
      condition, // Cahier V2 - Nouvelle section État : pièce d'occasion ou neuve
    });
    await refetchOffers();
    setSubmitting(false);
    // Bug trouvé : le toast de succès s'affichait inconditionnellement même
    // quand addOffer() échouait (ex. colonne manquante en base) — le
    // formulaire restait affiché sans jamais indiquer d'erreur, laissant
    // croire à tort que l'offre avait été envoyée.
    if (created) {
      try { localStorage.removeItem(draftKey); } catch { /* idem */ }
      showToast('Nous avons transmis votre offre à l\'acheteur.', 'success');
    } else {
      setActionError("L'offre n'a pas pu être envoyée. Réessayez.");
      showToast("L'offre n'a pas pu être envoyée. Réessayez.", 'error');
    }
  };

  const handleAccept = async () => {
    if (!myOffer || !request) return;
    setBusy(true);
    setActionError(null);
    const result = await acceptOffer(myOffer.id, request.id);
    if (!result.success) setActionError(result.error ?? "L'acceptation a échoué, réessayez.");
    else showToast('Offre acceptée.', 'success');
    await refetchOffers();
    setBusy(false);
  };

  const handleReject = async () => {
    if (!myOffer) return;
    setBusy(true);
    setActionError(null);
    const result = await rejectOffer(myOffer.id);
    if (!result.success) setActionError(result.error ?? "Le refus a échoué, réessayez.");
    else showToast('Offre refusée.', 'success');
    await refetchOffers();
    setBusy(false);
  };

  const handleCounter = async () => {
    if (!myOffer || !counterPercentage) return;
    const newPrice = applyCounterOfferPercentage(myOffer.price, counterPercentage);
    setBusy(true);
    setActionError(null);
    const result = await counterOffer(myOffer, newPrice, 'seller');
    if (!result.success) setActionError(result.error ?? 'Action impossible');
    else { setCountering(false); setCounterPercentage(null); showToast('Contre-offre envoyée.', 'success'); await refetchOffers(); }
    setBusy(false);
  };

  return (
    <div className="min-h-screen bg-rp-bg">
      <header className="bg-white backdrop-blur-xl border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/seller/requests" className="text-gray-400 dark:text-slate-500 hover:text-gray-900 dark:text-white"><ArrowLeft className="w-5 h-5" /></Link>
          <h1 className="text-sm font-bold text-gray-900 dark:text-white flex-1">Demande</h1>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-4 pb-24 lg:pb-6">
        {(requestLoading || offersLoading) && !request && (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {!requestLoading && !offersLoading && !request && (
          <div className="bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-6 text-center">
            <p className="text-sm text-gray-500 dark:text-slate-400">Demande introuvable — elle a peut-être été retirée.</p>
            <Link href="/seller/requests" className="inline-block mt-3 text-xs text-blue-600 font-medium">Retour aux demandes</Link>
          </div>
        )}

        {request && (
          <div className="bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl overflow-hidden">
            <div className="p-4">
              <div className="flex items-start gap-3 mb-2">
                {request.photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={request.photo} alt={request.partName} className="w-20 h-20 rounded-lg object-cover flex-shrink-0 border border-gray-200 dark:border-slate-600" />
                ) : (
                  <div className="w-20 h-20 rounded-lg bg-gray-100 dark:bg-slate-700 flex items-center justify-center flex-shrink-0">
                    <Package className="w-7 h-7 text-gray-400 dark:text-slate-500" />
                  </div>
                )}
                <div className="flex-1">
                  <h2 className="text-base font-bold text-gray-900 dark:text-white">{requestTitleLine(request)}</h2>
                  <p className="text-[11px] text-gray-400 dark:text-slate-500 mt-1 leading-snug">{requestSubtitleLine(request, { showMissing: true })}</p>
                  {request.oemReference && <p className="text-[11px] text-gray-400 dark:text-slate-500 mt-1">Réf. OEM : {request.oemReference}</p>}
                </div>
              </div>

              {request.description && <p className="text-xs text-gray-600 dark:text-slate-300 mb-3">{request.description}</p>}

              <div className="flex flex-wrap items-center gap-2 text-[11px] text-gray-400 dark:text-slate-500 mb-1">
                <span>Quantité : {request.quantity}</span>
                {request.budgetIndicative && <span className="text-red-600 font-medium">Offre acheteur : {formatPrice(request.budgetIndicative)}</span>}
              </div>
            </div>

            {myOffer ? (
              <div className={`border-t border-gray-200 dark:border-slate-700 p-4 ${myOffer.status === 'completed' ? 'bg-gray-100 dark:bg-slate-800' : 'bg-emerald-500/10'}`}>
                <div className="flex items-center gap-2 mb-2">
                  {myOffer.status === 'completed' ? (
                    <span className="bg-gray-400 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Terminée</span>
                  ) : (
                    <Check className="w-4 h-4 text-emerald-500" />
                  )}
                  <p className={`text-xs font-semibold ${myOffer.status === 'completed' ? 'text-gray-500 dark:text-slate-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                    {myOffer.status === 'accepted' ? "Votre offre a été acceptée par l'acheteur — un message vous sera envoyé lorsque l'acheteur effectue un paiement."
                      // Cahier V2 - Point 47/10 : une offre non retenue passe en 'completed'
                      // (gelée) quand l'acheteur a choisi un autre vendeur — pas 'rejected'.
                      : myOffer.status === 'completed' ? 'Cette demande a déjà été satisfaite par un autre vendeur.'
                      : myOffer.status === 'rejected' ? 'Votre offre a été refusée par l’acheteur.'
                      // Cahier V2 - Point 2 : offre sans réponse depuis 24h.
                      : myOffer.status === 'expired' ? 'Votre offre a expiré sans réponse de l’acheteur.'
                      : myOffer.status === 'countered' && myOffer.lastActor === 'buyer' ? 'L’acheteur a fait une contre-offre'
                      : myOffer.status === 'countered' ? 'Contre-offre envoyée — en attente de la réponse de l’acheteur'
                      : 'Offre envoyée avec succès ! En attente de la réponse de l’acheteur'}
                  </p>
                </div>
                <div className="text-xs text-gray-600 dark:text-slate-300 space-y-0.5">
                  <p>Prix : <span className="font-semibold text-gray-900 dark:text-white">{formatPrice(myOffer.price, myOffer.currency)}</span></p>
                  <p>Qualité : {myOffer.quality}</p>
                  <p>Livraison : {formatPrice(0, myOffer.currency)}</p>
                </div>

                {myOffer.status === 'countered' && myOffer.lastActor === 'buyer' && (
                  <div className="mt-3 pt-3 border-t border-emerald-500/20">
                    {actionError && <p className="text-[11px] text-red-500 mb-2">{actionError}</p>}
                    {!countering ? (
                      <div className="grid grid-cols-3 gap-1.5">
                        <button onClick={handleAccept} disabled={busy}
                          className="py-2 rounded-lg font-bold text-[11px] bg-emerald-600 text-white flex items-center justify-center gap-1 disabled:opacity-50">
                          <Check className="w-3.5 h-3.5" /> Accepter
                        </button>
                        <button onClick={() => { setCountering(true); setCounterPercentage(null); }}
                          disabled={busy || myOffer.round >= 3}
                          title={myOffer.round >= 3 ? 'Nombre maximum de contre-offres atteint' : undefined}
                          className="py-2 rounded-lg font-bold text-[11px] bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-300 flex items-center justify-center gap-1 disabled:opacity-40">
                          <MessageSquare className="w-3.5 h-3.5" /> Contre-offre
                        </button>
                        <button onClick={handleReject} disabled={busy}
                          className="py-2 rounded-lg font-bold text-[11px] bg-red-50 text-red-600 flex items-center justify-center gap-1 disabled:opacity-50">
                          <X className="w-3.5 h-3.5" /> Refuser
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <p className="text-[10px] font-bold text-gray-500 dark:text-slate-400">Réduction proposée</p>
                        <div className="grid grid-cols-4 gap-1.5">
                          {COUNTER_OFFER_PERCENTAGES.map((pct) => (
                            <button
                              key={pct}
                              type="button"
                              onClick={() => setCounterPercentage(pct)}
                              className={`py-1.5 rounded-lg text-[11px] font-bold transition-all ${
                                counterPercentage === pct ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-600 dark:bg-slate-700 dark:text-slate-300'
                              }`}
                            >
                              -{pct}%
                            </button>
                          ))}
                        </div>
                        {counterPercentage && (
                          <p className="text-xs text-gray-600 dark:text-slate-300">
                            Nouveau prix : <span className="font-bold text-gray-900 dark:text-white">{formatPrice(applyCounterOfferPercentage(myOffer.price, counterPercentage), myOffer.currency)}</span>
                          </p>
                        )}
                        <div className="grid grid-cols-2 gap-2">
                          <button onClick={handleCounter} disabled={busy || !counterPercentage} className="px-4 py-2 bg-red-600 text-white rounded-lg text-xs font-bold disabled:opacity-50">Envoyer</button>
                          <button onClick={() => setCountering(false)} className="px-3 py-2 bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300 rounded-lg text-xs">Annuler</button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                {/* Cahier V2 - Point 45 : historique complet de la négociation */}
                {negotiationHistory.length > 1 && (
                  <div className="mt-3 pt-3 border-t border-emerald-500/20 space-y-1">
                    <p className="text-[10px] font-bold text-gray-500 dark:text-slate-400 uppercase">Historique des échanges</p>
                    {negotiationHistory.map((event, i, arr) => {
                      // Cahier V2 : % de variation par rapport à la proposition précédente.
                      const prev = i > 0 ? arr[i - 1].price : null;
                      const pct = prev ? Math.round((1 - event.price / prev) * 100) : null;
                      return (
                        <div key={event.id} className="flex justify-between text-[11px] text-gray-600 dark:text-slate-300">
                          <span>{event.actor === 'buyer' ? 'Acheteur' : 'Vous'} — {new Date(event.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}</span>
                          <span className="font-semibold flex items-center gap-1">
                            {formatPrice(event.price, myOffer.currency)}
                            {pct !== null && pct !== 0 && (
                              <span className={pct > 0 ? 'text-emerald-600' : 'text-red-500'}>({pct > 0 ? '-' : '+'}{Math.abs(pct)}%)</span>
                            )}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ) : request.status === 'expired' ? (
              <div className="border-t border-gray-200 dark:border-slate-700 bg-gray-100 dark:bg-slate-900/40 p-4 text-center">
                <p className="text-xs text-gray-500 dark:text-slate-400">Cette demande a expiré (plus de 24h sans offre acceptée).</p>
              </div>
            ) : request.status !== 'open' ? (
              <div className="border-t border-gray-200 dark:border-slate-700 bg-gray-100 dark:bg-slate-900/40 p-4 text-center">
                <p className="text-xs text-gray-500 dark:text-slate-400">Cette demande a déjà été satisfaite — l&apos;acheteur a trouvé ce qu&apos;il recherchait.</p>
              </div>
            ) : (
              <div className="border-t border-gray-200 dark:border-slate-700 bg-gray-100 dark:bg-slate-900/40 p-4">
                <h3 className="text-xs font-bold text-gray-900 dark:text-white mb-3">Votre offre</h3>
                {actionError && <p className="text-[11px] text-red-500 mb-2">{actionError}</p>}
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-bold text-gray-700 dark:text-slate-200 mb-1 block">Prix ({currencyLabel(myCurrency)}) *</label>
                    <input type="number" placeholder="Ex: 62000" value={price} onChange={(e) => setPrice(e.target.value)}
                      className="w-full px-3 py-2.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-lg text-sm text-gray-900 dark:text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-700 dark:text-slate-200 mb-1 block">Qualité</label>
                    <div className="flex flex-wrap gap-2.5">
                      {qualityOptions.map((q) => (
                        <button key={q} type="button" onClick={() => setQuality(q)}
                          className={`px-3 py-1.5 rounded-full text-[10px] font-medium transition-all ${quality === q ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-slate-700 text-gray-500 dark:text-slate-400 border border-gray-200 dark:border-slate-600'}`}>{QUALITY_LEVELS.find((ql) => ql.value === q)?.label ?? q}</button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-700 dark:text-slate-200 mb-1 block">État de la pièce</label>
                    <div className="flex flex-wrap gap-2.5">
                      <button
                        type="button"
                        onClick={() => setCondition('new')}
                        className={`px-3 py-1.5 rounded-full text-[10px] font-medium transition-all ${
                          condition === 'new'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 dark:bg-slate-700 text-gray-500 dark:text-slate-400 border border-gray-200 dark:border-slate-600'
                        }`}
                      >
                        Neuve
                      </button>
                      <button
                        type="button"
                        onClick={() => setCondition('used')}
                        className={`px-3 py-1.5 rounded-full text-[10px] font-medium transition-all ${
                          condition === 'used'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 dark:bg-slate-700 text-gray-500 dark:text-slate-400 border border-gray-200 dark:border-slate-600'
                        }`}
                      >
                        Occasion
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs font-bold text-gray-700 dark:text-slate-200 mb-1 block">Disponibilité</label>
                      <select value={availability} onChange={(e) => setAvailability(e.target.value as Offer['availability'])}
                        className="w-full px-3 py-2.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-lg text-sm text-gray-900 dark:text-white outline-none">
                        {availabilityOptions.map((a) => <option key={a.value} value={a.value}>{a.label}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-700 dark:text-slate-200 mb-1 block">Garantie</label>
                      <select value={warranty} onChange={(e) => setWarranty(e.target.value)}
                        className="w-full px-3 py-2.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-lg text-sm text-gray-900 dark:text-white outline-none">
                        <option>1 mois</option><option>3 mois</option><option>6 mois</option><option>12 mois</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-700 dark:text-slate-200 mb-1 block">Condition de paiement</label>
                    <div className="flex flex-wrap gap-2.5">
                      <button
                        type="button"
                        onClick={() => setPaymentCondition('rapid_pieces')}
                        className={`px-3 py-1.5 rounded-full text-[10px] font-medium transition-all ${
                          paymentCondition === 'rapid_pieces'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 dark:bg-slate-700 text-gray-500 dark:text-slate-400 border border-gray-200 dark:border-slate-600'
                        }`}
                      >
                        Rapid Pièces
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentCondition('in_store')}
                        className={`px-3 py-1.5 rounded-full text-[10px] font-medium transition-all ${
                          paymentCondition === 'in_store'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 dark:bg-slate-700 text-gray-500 dark:text-slate-400 border border-gray-200 dark:border-slate-600'
                        }`}
                      >
                        En boutique
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentCondition('on_delivery')}
                        className={`px-3 py-1.5 rounded-full text-[10px] font-medium transition-all ${
                          paymentCondition === 'on_delivery'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 dark:bg-slate-700 text-gray-500 dark:text-slate-400 border border-gray-200 dark:border-slate-600'
                        }`}
                      >
                        À la livraison
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-700 dark:text-slate-200 mb-1 block">Négociation Prix</label>
                    <div className="flex flex-wrap gap-2.5">
                      <button
                        type="button"
                        onClick={() => setNegotiable(true)}
                        className={`px-3 py-1.5 rounded-full text-[10px] font-medium transition-all ${
                          negotiable
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 dark:bg-slate-700 text-gray-500 dark:text-slate-400 border border-gray-200 dark:border-slate-600'
                        }`}
                      >
                        Oui
                      </button>
                      <button
                        type="button"
                        onClick={() => setNegotiable(false)}
                        className={`px-3 py-1.5 rounded-full text-[10px] font-medium transition-all ${
                          !negotiable
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 dark:bg-slate-700 text-gray-500 dark:text-slate-400 border border-gray-200 dark:border-slate-600'
                        }`}
                      >
                        Non
                      </button>
                    </div>
                  </div>
                  <button onClick={handleSubmit} disabled={!price || submitting}
                    className="w-full py-2.5 bg-blue-600 text-white rounded-lg text-xs font-semibold disabled:opacity-40 flex items-center justify-center gap-2">
                    {submitting ? <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                    {submitting ? 'Envoi...' : 'Envoyer mon offre'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <BottomNav role="seller" />
    </div>
  );
}
