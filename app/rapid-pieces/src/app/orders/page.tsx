'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Package, PenLine, Shield, Star, Gift, ChevronUp, ChevronDown } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import NotificationsBell from '@/components/NotificationsBell';
import { useOrders, useRapidPoints, useReviewedOrderIds, addSellerReview } from '@/lib/store';
import { useToast } from '@/components/Toast';
import type { Order } from '@/lib/types';
import { useAuth } from '@/lib/auth';
import { OrderStatus, deliveryLabel, formatPrice } from '@/lib/types';
import { useLanguage } from '@/lib/i18n/LanguageContext';

const statusColors: Record<OrderStatus, string> = {
  payment_pending: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  paid: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  shipping: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  delivered: 'bg-green-500/20 text-green-400 border-green-500/30',
  completed: 'bg-green-500/20 text-green-400 border-green-500/30',
  cancelled: 'bg-red-500/20 text-red-400 border-red-500/30',
};

const statusLabels: Record<OrderStatus, string> = {
  payment_pending: 'Paiement en cours',
  paid: 'Payé',
  shipping: 'Livraison en cours',
  delivered: 'Livré',
  completed: 'Terminé',
  cancelled: 'Annulé',
};

// Cahier V2 - Point 51: Progression de statut complète
const progressSteps = ['Paiement en cours', 'Payé', 'Livraison en cours', 'Livré'];

export default function OrdersPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [filter, setFilter] = useState('all');
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'buyer')) router.replace('/login');
  }, [user, isLoading, router]);

  const { data: allOrders, refetch: refetchOrders } = useOrders();
  const orders = user ? allOrders.filter((o) => o.buyerId === user.id) : [];
  const { data: totalPoints } = useRapidPoints(user?.id);
  const { data: reviewedOrderIds, refetch: refetchReviewed } = useReviewedOrderIds(orders.map((o) => o.id));
  const [reviewingOrder, setReviewingOrder] = useState<Order | null>(null);
  const { showToast } = useToast();

  // useOrders() se lance au montage, potentiellement avant que la session soit
  // restaurée (ouverture directe/rechargement) — la requête RLS part alors en
  // anonyme et revient vide. On relance une fois la session confirmée pour
  // éviter d'afficher "aucune commande" à tort.
  useEffect(() => {
    if (!isLoading && user) refetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  if (isLoading || !user) {
    return <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex items-center justify-center"><div className="w-10 h-10 border-4 border-red-500 border-t-transparent rounded-full animate-spin" /></div>;
  }

  const filtered = orders.filter((o) => {
    if (filter === 'active') return o.status !== 'delivered' && o.status !== 'completed';
    if (filter === 'delivered') return o.status === 'delivered' || o.status === 'completed';
    return true;
  });

  const getStatusLabel = (status: OrderStatus) => {
    switch (status) {
      case 'payment_pending': return t('common.orderStatusPaymentPending');
      case 'paid': return t('common.orderStatusPaid');
      case 'shipping': return t('common.orderStatusShipping');
      case 'delivered': return t('common.orderStatusDelivered');
      case 'completed': return t('common.orderStatusCompleted');
      case 'cancelled': return t('common.orderStatusCancelled');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 pb-24 lg:pb-8">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white backdrop-blur-xl border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-black text-red-500">RAPID</span>
            <span className="text-xl font-black text-gray-900 dark:text-white">PIÈCES</span>
          </Link>
          <h1 className="text-sm font-bold text-gray-400 dark:text-slate-500 dark:text-slate-500 ml-auto mr-2">{t('common.myOrders')}</h1>
          <NotificationsBell role="buyer" />
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 space-y-4">
        {/* Summary cards */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-white backdrop-blur-sm rounded-xl p-3 border border-gray-200 text-center">
            <div className="text-lg font-bold text-gray-900 dark:text-white dark:text-white">{orders.filter(o => o.status !== 'delivered' && o.status !== 'completed').length}</div>
            <div className="text-[10px] text-gray-400 dark:text-slate-500 dark:text-slate-500">{t('common.ordersInProgress')}</div>
          </div>
          <div className="bg-white backdrop-blur-sm rounded-xl p-3 border border-gray-200 text-center">
            <div className="text-lg font-bold text-green-400">{orders.filter(o => o.status === 'delivered' || o.status === 'completed').length}</div>
            <div className="text-[10px] text-gray-400 dark:text-slate-500 dark:text-slate-500">{t('common.ordersDelivered')}</div>
          </div>
          <div className="bg-white backdrop-blur-sm rounded-xl p-3 border border-yellow-500/20 text-center">
            <div className="text-lg font-bold text-yellow-400">{totalPoints.toLocaleString('fr-FR')}</div>
            <div className="text-[10px] text-gray-400 dark:text-slate-500 dark:text-slate-500">{t('common.ordersPoints')}</div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2">
          {[
            { value: 'all', label: t('common.ordersAll') },
            { value: 'active', label: t('common.ordersInProgress') },
            { value: 'delivered', label: t('common.ordersDelivered') },
          ].map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                filter === f.value ? 'bg-red-600 text-white' : 'bg-gray-50 text-gray-400 dark:text-slate-500 dark:text-slate-500'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Orders list */}
        <div className="space-y-3">
          {filtered.map((order) => {
            const isDelivered = order.status === 'delivered' || order.status === 'completed';
            return (
            <div key={order.id} className="bg-white backdrop-blur-sm rounded-2xl border border-gray-200 overflow-hidden">
              {/* Order header */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border flex items-center gap-1 ${statusColors[order.status]}`}>
                      {order.status === 'shipping' && <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse inline-block" />}
                      {getStatusLabel(order.status)}
                    </span>
                    {order.status === 'shipping' && (
                      <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full font-bold animate-pulse flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse inline-block" />Live</span>
                    )}
                  </div>
                  <span className="text-[10px] text-gray-400 dark:text-slate-500 dark:text-slate-500 font-mono">{order.id}</span>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center shrink-0">
                    <Package className="w-6 h-6 text-gray-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white dark:text-white truncate">{order.partName}</h4>
                    <div className="text-xs text-gray-400 dark:text-slate-500 dark:text-slate-500 mt-0.5">
                      {order.sellerName} • {order.vehicle.brand} {order.vehicle.model} {order.vehicle.year}
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-lg font-black text-gray-900 dark:text-white">{formatPrice(order.price, order.currency)}</span>
                      <span className="text-[10px] bg-red-500/20 text-red-300 px-2 py-1 rounded-full font-bold">{deliveryLabel(order.deliveryType)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress tracker */}
              <div className="px-4 pb-3">
                <div className="flex items-center gap-1">
                  {progressSteps.map((step, i) => {
                    // Cahier V2 - Point 51: Progression basée sur les nouveaux statuts
                    const stepIndex = order.status === 'paid' ? 1 : order.status === 'shipping' ? 2 : isDelivered ? 3 : 0;
                    const isActive = i <= stepIndex;
                    return (
                      <div key={step} className="flex-1">
                        <div className={`h-1 rounded-full ${isActive ? 'bg-red-500' : 'bg-gray-100'}`} />
                        <div className={`text-[8px] mt-1 text-center ${isActive ? 'text-red-400' : 'text-gray-400 dark:text-slate-500 dark:text-slate-500'}`}>{step}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Expanded details */}
              {expandedOrder === order.id && (
                <div className="border-t border-gray-200 p-4 space-y-3">
                  <div className="bg-gray-50 rounded-xl p-3 flex items-center justify-between">
                    <div className="text-xs text-gray-400 dark:text-slate-500 dark:text-slate-500">
                      Escrow : <span className="font-bold text-gray-900 dark:text-white">{order.escrowStatus === 'held' ? 'Sécurisé' : order.escrowStatus === 'released' ? 'Libéré au vendeur' : 'Remboursé'}</span>
                    </div>
                    <Shield className="w-4 h-4 text-purple-500" />
                  </div>
                  {isDelivered && (
                    <div className="bg-green-900/20 rounded-xl p-3 border border-green-500/20">
                      <div className="flex items-center gap-2">
                        <PenLine className="w-5 h-5 text-green-400" />
                        <div>
                          <div className="text-xs font-bold text-green-400">Livrée</div>
                          <div className="text-[10px] text-green-300/70">+{Math.floor(order.price / 1000)} Rapid Points sur cette commande</div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="flex gap-2">
                    <Link href="/protection" className="flex-1 bg-gray-50 hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-600 dark:text-slate-300 dark:text-slate-300 text-xs font-bold py-2.5 rounded-lg transition-all flex items-center justify-center gap-1">
                      <Shield className="w-3 h-3" /> Protection
                    </Link>
                    {reviewedOrderIds.has(order.id) ? (
                      <div className="flex-1 bg-emerald-50 text-emerald-700 text-xs font-bold py-2.5 rounded-lg flex items-center justify-center gap-1">
                        <Star className="w-3 h-3 fill-emerald-600" /> Déjà évalué
                      </div>
                    ) : (
                      <button onClick={() => setReviewingOrder(order)}
                        className="flex-1 bg-gray-50 hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-600 dark:text-slate-300 dark:text-slate-300 text-xs font-bold py-2.5 rounded-lg transition-all flex items-center justify-center gap-1">
                        <Star className="w-3 h-3" /> Évaluer
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Toggle */}
              <button
                onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                className="w-full py-2 border-t border-gray-200 text-xs text-gray-400 dark:text-slate-500 dark:text-slate-500 hover:text-gray-900 dark:text-white transition-all"
              >
                <span className="inline-flex items-center gap-1">
                  {expandedOrder === order.id ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  {expandedOrder === order.id ? 'Masquer' : 'Détails'}
                </span>
              </button>
            </div>
            );
          })}
        </div>

        {/* Rapid Points */}
        <div className="bg-white backdrop-blur-sm rounded-2xl p-4 border border-gray-200">
          <div className="flex items-center gap-2 mb-3">
            <Gift className="w-5 h-5 text-yellow-500" />
            <span className="text-sm font-bold text-gray-900 dark:text-white dark:text-white">Rapid Points</span>
          </div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl font-black text-yellow-400">{totalPoints.toLocaleString('fr-FR')}</span>
            <span className="text-xs text-gray-400 dark:text-slate-500 dark:text-slate-500">1 point / 1 000 FCFA dépensé</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2">
            <div className="bg-gradient-to-r from-yellow-500 to-orange-500 h-2 rounded-full" style={{ width: `${Math.min(100, (totalPoints / 4500) * 100)}%` }} />
          </div>
        </div>
      </div>

      {reviewingOrder && (
        <ReviewModal
          order={reviewingOrder}
          buyerId={user.id}
          onClose={() => setReviewingOrder(null)}
          onSubmitted={async () => {
            setReviewingOrder(null);
            await refetchReviewed();
            showToast('Merci pour votre avis !', 'success');
          }}
        />
      )}

      <BottomNav />
    </div>
  );
}

// Cahier V2 - Points 11/12/13/41 : le vendeur commence à 5 étoiles ; cet avis
// recalcule sa vraie moyenne (trigger DB) au lieu de rester une valeur figée.
function ReviewModal({ order, buyerId, onClose, onSubmitted }: { order: Order; buyerId: string; onClose: () => void; onSubmitted: () => void }) {
  const { showToast } = useToast();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    setSubmitting(true);
    const result = await addSellerReview({ orderId: order.id, sellerId: order.sellerId, buyerId, rating, comment: comment.trim() || undefined });
    setSubmitting(false);
    if (result) {
      onSubmitted();
    } else {
      showToast("L'envoi de votre avis a échoué, réessayez.", 'error');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 w-full max-w-sm space-y-4">
        <h3 className="text-sm font-bold text-gray-900 dark:text-white">Évaluer {order.sellerName}</h3>
        <div className="flex justify-center gap-2">
          {[1, 2, 3, 4, 5].map((n) => (
            <button key={n} onClick={() => setRating(n)}>
              <Star className={`w-8 h-8 ${n <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 dark:text-slate-600'}`} />
            </button>
          ))}
        </div>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Un commentaire (optionnel)"
          rows={3}
          className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-600 rounded-lg text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-red-500 resize-none"
        />
        <div className="flex gap-2">
          <button onClick={onClose} className="flex-1 py-2.5 bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300 rounded-lg text-xs font-semibold">Annuler</button>
          <button onClick={handleSubmit} disabled={submitting} className="flex-1 py-2.5 bg-red-600 text-white rounded-lg text-xs font-semibold disabled:opacity-50">
            {submitting ? 'Envoi...' : 'Envoyer'}
          </button>
        </div>
      </div>
    </div>
  );
}
