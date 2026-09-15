'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Banknote, Star, BarChart3, CheckCircle2, ArrowRight, Check, X, MessageSquare } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import { useOffersForRequest, useRequestById, computeRapidScore, acceptOffer, rejectOffer, counterOffer, useNegotiationHistoryForOffers } from '@/lib/store';
import { useAuth } from '@/lib/auth';
import { requestTitleLine, MAX_ACTIVE_SELLERS_PER_REQUEST, deliveryLabel, COUNTER_OFFER_PERCENTAGES, applyCounterOfferPercentage, formatPrice, type Offer } from '@/lib/types';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useToast } from '@/components/Toast';

export default function OffersPage() {
  const { t } = useLanguage();
  const { showToast } = useToast();
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const requestId = params.id;
  const [sortBy, setSortBy] = useState('rapid-score');
  const [filterOrigin, setFilterOrigin] = useState<'all' | 'local' | 'intl'>('all');
  const [counteringId, setCounteringId] = useState<string | null>(null);
  // Cahier V2 : plus de saisie libre du prix — un % de réduction (5 à 35%)
  // choisi par l'acheteur, le nouveau prix est recalculé automatiquement.
  const [counterPercentage, setCounterPercentage] = useState<number | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const { isLoading: authLoading } = useAuth();

  // Tant que la session n'est pas restaurée (ouverture directe/rechargement de la page),
  // on ne lance pas la requête protégée par RLS — sinon elle part en anonyme, échoue,
  // et affiche un faux "Demande introuvable" avant de se corriger toute seule.
  const { data: request, loading: requestLoading } = useRequestById(authLoading ? undefined : requestId);
  const { data: offersForRequest, loading: offersLoading, refetch: refetchOffers } = useOffersForRequest(authLoading ? undefined : requestId);

  // Cahier V2 - Point 45 : historique complet des échanges, groupé par offre.
  const { data: negotiationHistories } = useNegotiationHistoryForOffers(offersForRequest.map((o) => o.id));

  // Cahier V2 - Point 47: Les offres non retenues passent en 'completed' et restent visibles (grisées, "Terminé")
  // Cahier V2 - Point 2 : une offre expirée disparaît aussi de la liste active.
  const activeOffers = offersForRequest.filter((o) => o.status !== 'rejected' && o.status !== 'expired');
  const scored = activeOffers.map((offer) => ({
    ...offer,
    ...computeRapidScore(offer, activeOffers.filter((o) => o.id !== offer.id)),
  }));

  const sorted = [...scored].sort((a, b) => {
    if (sortBy === 'price') return a.price - b.price;
    if (sortBy === 'rating') return b.sellerScore - a.sellerScore;
    return b.total - a.total;
  });

  const filteredOffers = sorted.filter(offer => {
    if (filterOrigin === 'all') return true;
    return filterOrigin === 'local' ? !offer.isInternational : offer.isInternational;
  });

  // Cahier §9 : l'acheteur peut échanger (contre-offrir) avec au maximum 3 vendeurs par demande.
  const activeSellersCount = activeOffers.filter((o) => o.status === 'countered' || o.status === 'accepted').length;

  const handleAccept = async (offer: Offer) => {
    setBusyId(offer.id);
    setActionError(null);
    const result = await acceptOffer(offer.id, requestId);
    if (!result.success) setActionError(result.error ?? t('common.offerAcceptError'));
    else showToast(t('common.offerAcceptedToast'), 'success');
    await refetchOffers();
    setBusyId(null);
  };

  const handleReject = async (offer: Offer) => {
    setBusyId(offer.id);
    setActionError(null);
    const result = await rejectOffer(offer.id);
    if (!result.success) setActionError(result.error ?? t('common.offerRejectError'));
    else showToast(t('common.offerRejectedToast'), 'success');
    await refetchOffers();
    setBusyId(null);
  };

  const handleCounter = async (offer: Offer) => {
    if (!counterPercentage) return;
    const price = applyCounterOfferPercentage(offer.price, counterPercentage);
    setBusyId(offer.id);
    setActionError(null);
    const result = await counterOffer(offer, price, 'buyer');
    if (!result.success) setActionError(result.error ?? t('common.offerCounterError'));
    else { setCounteringId(null); setCounterPercentage(null); showToast(t('common.offerCounterSentToast'), 'success'); await refetchOffers(); }
    setBusyId(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 pb-24 lg:pb-8">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white backdrop-blur-xl border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center gap-3">
          <button onClick={() => router.back()} className="text-gray-400 dark:text-slate-500 dark:text-slate-500 hover:text-gray-900 dark:text-white">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          {request?.photo && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={request.photo} alt={request.partName} className="w-9 h-9 rounded-lg object-cover flex-shrink-0" />
          )}
          <div>
            <h1 className="text-sm font-bold text-gray-900 dark:text-white dark:text-white">{t('common.offerPageTitle')}</h1>
            <p className="text-[10px] text-gray-400 dark:text-slate-500 dark:text-slate-500">
              {request
                ? requestTitleLine(request)
                : (authLoading || requestLoading) ? t('common.offerLoading') : t('common.offerNotFound')}
            </p>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-4 space-y-4">
        {/* Cahier V2 - Point 3 : proposer le renouvellement d'une demande expirée */}
        {request?.status === 'expired' && (
          <Link href={`/requests/${requestId}`} className="block bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800">
            {t('common.offerExpiredNotice')} <span className="font-bold underline">{t('common.offerRenewLink')}</span>
          </Link>
        )}

        {/* Filtres et Tri */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex p-1 bg-gray-100 dark:bg-slate-900 rounded-lg">
            <button 
              onClick={() => setFilterOrigin('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${filterOrigin === 'all' ? 'bg-white dark:bg-slate-800 shadow-sm text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-slate-400'}`}
            >
              {t('common.offerFilterAll')}
            </button>
            <button 
              onClick={() => setFilterOrigin('local')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${filterOrigin === 'local' ? 'bg-white dark:bg-slate-800 shadow-sm text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-slate-400'}`}
            >
              {t('common.offerFilterLocal')}
            </button>
            <button 
              onClick={() => setFilterOrigin('intl')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${filterOrigin === 'intl' ? 'bg-white dark:bg-slate-800 shadow-sm text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-slate-400'}`}
            >
              {t('common.offerFilterIntl')}
            </button>
          </div>

          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="text-xs bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-lg px-2 py-1.5 outline-none focus:ring-2 ring-blue-500/20"
          >
            <option value="rapid-score">{t('common.offerSortBestScore')}</option>
            <option value="price">{t('common.offerSortPrice')}</option>
            <option value="rating">{t('common.offerSortRating')}</option>
          </select>
        </div>

        {/* Rapid Score explanation */}
        <div className="bg-white backdrop-blur-sm rounded-xl p-3 border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="w-4 h-4 text-gray-400" />
            <span className="text-[10px] font-bold text-gray-900 dark:text-white dark:text-white">{t('common.offerScoreFormula')}</span>
          </div>
        </div>

        {/* Offers */}
        <div className="space-y-3">
          {offersLoading && (
            <div className="bg-white rounded-2xl border border-gray-200 p-6 text-center">
              <div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto" />
            </div>
          )}
          {!offersLoading && filteredOffers.length === 0 && (
            <div className="bg-white rounded-2xl border border-gray-200 p-6 text-center text-sm text-gray-400 dark:text-slate-500">
              {t('common.offerNoOffers')}
            </div>
          )}
          {filteredOffers.map((offer, index) => {
            const isSelected = offer.status === 'accepted';
            // Cahier V2 - Point 47 : une offre non retenue reste visible, gelée, grisée,
            // marquée "Terminé" — au lieu de disparaître comme avant ('rejected').
            const isFrozen = offer.status === 'completed';
            // Anti-contournement (document, section 7) : l'identité complète du vendeur
            // n'est révélée qu'après acceptation de son offre, pas avant.
            const displayName = isSelected ? offer.sellerName : `Vendeur #${offer.sellerId.slice(-4).toUpperCase()}`;
            const isBuyerTurn = offer.lastActor === 'seller' && offer.status !== 'accepted';
            // Cahier V2 - Point 32 : pas de contre-offre possible si le vendeur a fermé la négociation.
            const canCounter = offer.negotiable !== false && offer.round < 3 && (offer.status === 'countered' || activeSellersCount < MAX_ACTIVE_SELLERS_PER_REQUEST);
            return (
            <div
              key={offer.id}
              className={`bg-white backdrop-blur-sm rounded-2xl border transition-all ${
                isSelected ? 'border-green-500/50 ring-2 ring-green-500/20 bg-green-50 dark:bg-green-900/20' :
                isFrozen ? 'border-gray-200 opacity-60 grayscale' :
                'border-gray-200 hover:border-gray-300 dark:hover:border-slate-500'
              }`}
            >
              {/* Seller header */}
              <div className="p-4 pb-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-gray-900 dark:text-white font-bold text-sm">
                      {isSelected ? offer.sellerName.charAt(0) : '?'}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-bold text-gray-900 dark:text-white dark:text-white">{displayName}</span>
                        {isSelected && <span className="bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Offre choisie</span>}
                        {isFrozen && <span className="bg-gray-400 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Terminé</span>}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-yellow-400 flex items-center gap-1"><Star className="w-3 h-3" /> {offer.sellerScore}</span>
                        {offer.warranty && (
                          <>
                            <span className="text-xs text-gray-400 dark:text-slate-500 dark:text-slate-500">•</span>
                            <Link href={`/guarantee?offerId=${offer.id}&requestId=${requestId}`} className="text-xs text-red-500 underline">Garantie {offer.warranty}</Link>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-black text-gray-900 dark:text-white">{offer.total}</div>
                    <div className="text-[10px] text-gray-400 dark:text-slate-500 dark:text-slate-500">Rapid Score</div>
                  </div>
                </div>
                {/* Badges */}
                <div className="flex gap-1.5 mt-2">
                  <span className="text-[10px] bg-gray-500/10 text-gray-500 dark:text-slate-400 px-2 py-0.5 rounded-full font-bold">
                    {offer.isInternational ? 'Internationale' : 'Locale'}
                  </span>
                  {!offer.negotiable && (
                    <span className="text-[10px] bg-amber-500/10 text-amber-600 px-2 py-0.5 rounded-full font-bold">Prix ferme</span>
                  )}
                  {offer.condition && (
                    <span className="text-[10px] bg-blue-500/10 text-blue-500 px-2 py-0.5 rounded-full font-bold">{offer.condition === 'new' ? 'Neuf' : 'Occasion'}</span>
                  )}
                </div>
              </div>

              {/* Part details */}
              <div className="p-4">
                <div className="bg-gray-50 rounded-xl p-3 mb-3">
                  <div className="text-sm font-bold text-gray-900 dark:text-white dark:text-white">{offer.partName}</div>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-lg font-black text-gray-900 dark:text-white">{formatPrice(offer.price, offer.currency)}</span>
                    {(() => {
                      // Cahier V2 : % de réduction par rapport au prix initial de l'offre.
                      const initialPrice = negotiationHistories[offer.id]?.[0]?.price;
                      if (!initialPrice || initialPrice <= offer.price) return null;
                      const pct = Math.round((1 - offer.price / initialPrice) * 100);
                      return <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full">-{pct}%</span>;
                    })()}
                  </div>
                </div>

                {/* Delivery */}
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="bg-gray-50 rounded-lg p-2 text-center">
                    <div className="text-[10px] text-gray-400 dark:text-slate-500 dark:text-slate-500">Livraison</div>
                    <div className="text-xs font-bold text-red-400">{deliveryLabel(offer.deliveryType)}</div>
                    {offer.deliveryType !== 'RAPID_NOW' && (
                      <div className="text-[10px] text-gray-400 dark:text-slate-500 dark:text-slate-500">{offer.deliveryTime}</div>
                    )}
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2 text-center">
                    <div className="text-[10px] text-gray-400 dark:text-slate-500 dark:text-slate-500">Disponibilité</div>
                    <div className="text-xs font-bold text-green-400">{offer.availability}</div>
                  </div>
                </div>

                {/* Score breakdown */}
                <div className="space-y-1 mb-3">
                  {[
                    { label: 'Prix', value: offer.breakdown.price, max: 30, color: 'bg-green-500' },
                    { label: 'Qualité', value: offer.breakdown.quality, max: 25, color: 'bg-blue-500' },
                    { label: 'Dispo', value: offer.breakdown.availability, max: 20, color: 'bg-purple-500' },
                    { label: 'Rép.', value: offer.breakdown.reputation, max: 15, color: 'bg-yellow-500' },
                    { label: 'Délai', value: offer.breakdown.delivery, max: 10, color: 'bg-red-500' },
                  ].map((s) => (
                    <div key={s.label} className="flex items-center gap-2">
                      <span className="text-[10px] text-gray-400 dark:text-slate-500 dark:text-slate-500 w-8">{s.label}</span>
                      <div className="flex-1 bg-gray-100 rounded-full h-1.5">
                        <div className={`${s.color} h-1.5 rounded-full`} style={{ width: `${(s.value / s.max) * 100}%` }} />
                      </div>
                      <span className="text-[10px] text-gray-400 dark:text-slate-500 dark:text-slate-500 w-6 text-right">{s.value}/{s.max}</span>
                    </div>
                  ))}
                </div>

                {/* Cahier V2 - Point 45 : historique complet de la négociation */}
                {(negotiationHistories[offer.id]?.length ?? 0) > 1 && (
                  <div className="mb-3 pt-2 border-t border-gray-100 space-y-1">
                    <p className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase">Historique des échanges</p>
                    {negotiationHistories[offer.id].map((event, i, arr) => {
                      // Cahier V2 : % de variation par rapport à la proposition précédente.
                      const prev = i > 0 ? arr[i - 1].price : null;
                      const pct = prev ? Math.round((1 - event.price / prev) * 100) : null;
                      return (
                        <div key={event.id} className="flex justify-between text-[11px] text-gray-500 dark:text-slate-400">
                          <span>{event.actor === 'buyer' ? 'Vous' : 'Vendeur'} — {new Date(event.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}</span>
                          <span className="font-semibold flex items-center gap-1">
                            {formatPrice(event.price, offer.currency)}
                            {pct !== null && pct !== 0 && (
                              <span className={pct > 0 ? 'text-emerald-600' : 'text-red-500'}>({pct > 0 ? '-' : '+'}{Math.abs(pct)}%)</span>
                            )}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Action — cahier §9 : Accepter / Contre-offrir / Refuser */}
                {/* Bug corrigé : cette condition exigeait counteringId === offer.id,
                    ce qui ne se produit jamais pour Accepter/Refuser — l'erreur
                    n'était donc jamais affichée pour ces deux actions. */}
                {actionError && busyId === null && counteringId !== offer.id && (
                  <p className="text-[11px] text-red-500 mb-2">{actionError}</p>
                )}
                {isFrozen && (
                  <div className="w-full py-3 rounded-xl font-bold text-sm bg-gray-100 text-gray-400 dark:text-slate-500 text-center">
                    Terminé — l&apos;acheteur a choisi une autre offre
                  </div>
                )}
                {isSelected && (
                  <Link href={`/checkout?offerId=${offer.id}&requestId=${requestId}`}
                    className="w-full py-3 rounded-xl font-bold text-sm bg-red-600 text-white flex items-center justify-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> Offre acceptée — Payer maintenant <ArrowRight className="w-4 h-4" />
                  </Link>
                )}
                {!isSelected && !isFrozen && !isBuyerTurn && (
                  <div className="w-full py-3 rounded-xl font-bold text-sm bg-gray-50 text-gray-400 dark:text-slate-500 text-center">
                    En attente de la réponse du vendeur…
                  </div>
                )}
                {!isSelected && !isFrozen && isBuyerTurn && counteringId !== offer.id && (
                  <div className="grid grid-cols-3 gap-1.5">
                    <button onClick={() => handleAccept(offer)} disabled={busyId === offer.id}
                      className="py-2.5 rounded-xl font-bold text-xs bg-emerald-600 text-white flex items-center justify-center gap-1 disabled:opacity-50">
                      <Check className="w-3.5 h-3.5" /> Accepter
                    </button>
                    <button onClick={() => { setCounteringId(offer.id); setCounterPercentage(null); setActionError(null); }}
                      disabled={busyId === offer.id || !canCounter}
                      title={!canCounter ? (offer.negotiable === false ? 'Ce vendeur a fixé un prix ferme' : offer.round >= 3 ? 'Nombre maximum de contre-offres atteint' : 'Vous négociez déjà avec 3 vendeurs pour cette demande') : undefined}
                      className="py-2.5 rounded-xl font-bold text-xs bg-gray-100 text-gray-700 dark:text-slate-300 flex items-center justify-center gap-1 disabled:opacity-40">
                      <MessageSquare className="w-3.5 h-3.5" /> Contre-offre
                    </button>
                    <button onClick={() => handleReject(offer)} disabled={busyId === offer.id}
                      className="py-2.5 rounded-xl font-bold text-xs bg-red-50 text-red-600 flex items-center justify-center gap-1 disabled:opacity-50">
                      <X className="w-3.5 h-3.5" /> Refuser
                    </button>
                  </div>
                )}
                {counteringId === offer.id && (
                  <div className="mt-2 space-y-2">
                    {actionError && <p className="text-[11px] text-red-500">{actionError}</p>}
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
                        Nouveau prix : <span className="font-bold text-gray-900 dark:text-white">{formatPrice(applyCounterOfferPercentage(offer.price, counterPercentage), offer.currency)}</span>
                      </p>
                    )}
                    <div className="grid grid-cols-2 gap-2">
                      <button onClick={() => handleCounter(offer)} disabled={busyId === offer.id || !counterPercentage}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg text-xs font-bold disabled:opacity-50">Envoyer</button>
                      <button onClick={() => setCounteringId(null)} className="px-3 py-2 bg-gray-100 text-gray-600 rounded-lg text-xs">Annuler</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            );
          })}
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
