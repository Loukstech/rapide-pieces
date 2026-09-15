'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, Package, Truck, Check, Clock, Shield, TrendingUp, DollarSign, Filter, BarChart3, ArrowRight } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import { useAuth } from '@/lib/auth';
import { useOrders, useSellers } from '@/lib/store';
import { deliveryLabel, formatPrice, currencyLabel, currencyForCountry } from '@/lib/types';
import { useLanguage } from '@/lib/i18n/LanguageContext';

// Cahier V2 - Point 51: Statut complet d'une commande
const statusColors: Record<string, { color: string; bgColor: string }> = {
  payment_pending: { color: 'text-amber-700', bgColor: 'bg-amber-100' },
  paid: { color: 'text-blue-700', bgColor: 'bg-blue-100' },
  shipping: { color: 'text-purple-700', bgColor: 'bg-purple-100' },
  delivered: { color: 'text-green-700', bgColor: 'bg-green-100' },
  completed: { color: 'text-rp-success', bgColor: 'bg-rp-success/10' },
  cancelled: { color: 'text-red-700', bgColor: 'bg-red-100' },
};

export default function SellerOrdersPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const { user, isLoading } = useAuth();
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  const statusLabels: Record<string, string> = {
    payment_pending: t('common.orderStatusPaymentPending'),
    paid: t('common.orderStatusPaid'),
    shipping: t('common.orderStatusShipping'),
    delivered: t('common.orderStatusDelivered'),
    completed: t('common.orderStatusCompleted'),
    cancelled: t('common.orderStatusCancelled'),
  };

  const { data: allOrders, refetch: refetchOrders } = useOrders();
  const { data: sellers } = useSellers();

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'seller')) router.replace('/login');
  }, [user, isLoading, router]);

  // useOrders() se lance au montage, potentiellement avant que la session soit
  // restaurée (ouverture directe/rechargement) — la requête RLS part alors en
  // anonyme et revient vide. On relance une fois la session confirmée pour
  // éviter d'afficher un espace vide à tort.
  useEffect(() => {
    if (!isLoading && user) refetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  if (isLoading || !user) return <div className="min-h-screen bg-rp-bg flex items-center justify-center"><div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" /></div>;

  const sales = allOrders.filter((o) => o.sellerId === user.id);
  const sellerRecord = sellers.find((s) => s.id === user.id);
  const fulfillmentRate = sellerRecord?.fulfillmentRate ?? 0;
  const myCurrency = sales[0]?.currency ?? currencyForCountry(sellerRecord?.country);

  const filtered = sales.filter(s => {
    if (filter === 'active') return s.status !== 'completed' && s.status !== 'delivered';
    if (filter === 'completed') return s.status === 'completed' || s.status === 'delivered';
    return true;
  });

  const totalRevenue = sales.reduce((sum, s) => sum + s.price, 0);
  const activeOrders = sales.filter(s => s.status !== 'completed' && s.status !== 'delivered');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
      {/* Header */}
      <div className="bg-white px-4 pt-12 pb-4 border-b border-rp-border sticky top-0 z-40">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center gap-3 mb-3">
            <Link href="/seller" className="w-8 h-8 flex items-center justify-center">
              <ChevronLeft className="w-5 h-5 text-rp-text" />
            </Link>
            <h1 className="text-lg font-bold text-rp-text">Mes ventes</h1>
          </div>

          {/* Revenue Summary */}
          <div className="bg-rp-success/10 rounded-xl p-3 flex items-center justify-between mb-3">
            <div>
              <p className="text-xs text-rp-text-muted">CA Total (janvier)</p>
              <p className="text-lg font-bold text-rp-success">{formatPrice(totalRevenue, myCurrency)}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-rp-text-muted">En cours</p>
              <p className="text-lg font-bold text-red-600">{activeOrders.length} commandes</p>
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-2">
            {[
              { key: 'all' as const, label: 'Toutes' },
              { key: 'active' as const, label: 'En cours' },
              { key: 'completed' as const, label: 'Effectuées' },
            ].map(f => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                  filter === f.key ? 'bg-red-600 text-white' : 'bg-gray-50 text-rp-text-muted'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-4 space-y-3 pb-20">
        {filtered.map((sale) => {
          const status = statusColors[sale.status];
          return (
            <div key={sale.id} className="bg-white rounded-2xl p-4 shadow-sm">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${status.bgColor} ${status.color}`}>
                      {statusLabels[sale.status]}
                    </span>
                    {sale.escrowStatus === 'held' && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 flex items-center gap-1">
                        <Shield className="w-3 h-3" /> Escrow actif
                      </span>
                    )}
                  </div>
                  <h3 className="font-semibold text-sm text-rp-text">{sale.partName}</h3>
                  <p className="text-xs text-rp-text-muted">Acheteur #{sale.buyerId.slice(-6).toUpperCase()}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-rp-success">{formatPrice(sale.price, sale.currency)}</p>
                  <p className="text-[10px] text-rp-text-muted">{new Date(sale.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                </div>
              </div>

              {/* Delivery Type Badge */}
              <div className="flex items-center justify-between mt-2">
                <span className="text-[10px] bg-gray-50 px-2 py-1 rounded-full text-rp-text-muted">
                  {deliveryLabel(sale.deliveryType)}
                </span>
                {sale.status === 'shipping' && (
                  <span className="text-xs text-red-600 font-medium inline-flex items-center gap-1">
                    En livraison
                    <ArrowRight className="w-3 h-3" />
                  </span>
                )}
                {(sale.status === 'completed' || sale.status === 'delivered') && (
                  <span className="text-xs text-rp-success font-medium flex items-center gap-1">
                    <Check className="w-3 h-3" /> Paiement reçu
                  </span>
                )}
              </div>
            </div>
          );
        })}

        {/* Monthly Summary */}
        <div className="bg-gradient-to-r from-rp-secondary to-rp-secondary-light rounded-2xl p-4 text-gray-900 dark:text-white">
          <h3 className="font-bold mb-3 flex items-center gap-1.5"><BarChart3 className="w-4 h-4" /> Résumé mensuel</h3>
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center">
              <p className="text-xl font-bold">{sales.length}</p>
              <p className="text-[10px] text-gray-900 dark:text-white/70">Transactions</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold">{(totalRevenue / 1000).toFixed(0)}k</p>
              <p className="text-[10px] text-gray-900 dark:text-white/70">Revenue ({currencyLabel(myCurrency)})</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold">{fulfillmentRate}%</p>
              <p className="text-[10px] text-gray-900 dark:text-white/70">Satisfaction client</p>
            </div>
          </div>
        </div>
      </div>

      <BottomNav role="seller" />
    </div>
  );
}
