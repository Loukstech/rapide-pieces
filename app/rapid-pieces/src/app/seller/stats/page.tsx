'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, TrendingUp, TrendingDown, Package, Clock, Star, Users, ShoppingCart, BarChart3, Trophy, ClipboardList } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import { useAuth } from '@/lib/auth';
import { useOrders, useSellers } from '@/lib/store';
import { OrderStatus, formatPrice } from '@/lib/types';

const statusColors: Record<OrderStatus, string> = {
  payment_pending: 'bg-amber-500/10 text-amber-600',
  paid: 'bg-blue-500/10 text-blue-600',
  shipping: 'bg-purple-500/10 text-purple-600',
  delivered: 'bg-emerald-500/10 text-emerald-600',
  completed: 'bg-emerald-500/10 text-emerald-600',
  cancelled: 'bg-red-500/10 text-red-600',
};

const statusLabels: Record<OrderStatus, string> = {
  payment_pending: 'Paiement en cours',
  paid: 'Payé',
  shipping: 'En livraison',
  delivered: 'Livrée',
  completed: 'Terminée',
  cancelled: 'Annulée',
};

export default function SellerStatsPage() {
  const { user } = useAuth();
  const { data: orders } = useOrders();
  const { data: sellers } = useSellers();
  const [period, setPeriod] = useState('month');

  const seller = sellers.find(s => s.id === user?.id);
  const myOrders = orders.filter(o => o.sellerId === user?.id);

  const totalRevenue = myOrders.reduce((sum, o) => sum + o.price, 0);
  const totalOrders = myOrders.length;
  const avgOrder = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  const cancelledCount = myOrders.filter(o => o.status === 'cancelled').length;
  const cancelRate = totalOrders > 0 ? Math.round((cancelledCount / totalOrders) * 100) : 0;

  // Cahier V2 - Point 20/40 : plus de données statiques — chaque KPI vient soit
  // des commandes réelles du vendeur, soit des colonnes réelles de `sellers`
  // (fulfillment_rate, response_rate) déjà maintenues côté admin/backend.
  const fulfillmentRate = seller?.fulfillmentRate ?? 0;
  const responseRate = seller?.responseRate ?? 0;

  // Cahier V2 - Point 45 : produits les plus demandés, calculé à partir des
  // vraies commandes (regroupées par nom de pièce) — pas de compteur de vues
  // factice, cette donnée n'existe pas encore côté backend.
  const topProducts = Object.values(
    myOrders.reduce((acc, o) => {
      acc[o.partName] ??= { name: o.partName, sold: 0, revenue: 0 };
      acc[o.partName].sold += 1;
      acc[o.partName].revenue += o.price;
      return acc;
    }, {} as Record<string, { name: string; sold: number; revenue: number }>)
  )
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  const recentOrders = [...myOrders]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)
    .map(o => ({ id: o.id.slice(0, 8).toUpperCase(), part: o.partName, date: new Date(o.createdAt).toLocaleDateString('fr-FR'), status: o.status, amount: o.price }));

  const myCurrency = myOrders[0]?.currency;

  // Cahier V2 - Point 20/40 : 6 derniers mois calculés à partir des vraies
  // commandes du vendeur (plus de valeurs statiques à 0).
  const now = new Date();
  const monthlyRevenue = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    const revenue = myOrders
      .filter(o => {
        const od = new Date(o.createdAt);
        return od.getMonth() === d.getMonth() && od.getFullYear() === d.getFullYear();
      })
      .reduce((sum, o) => sum + o.price, 0);
    return { month: d.toLocaleDateString('fr-FR', { month: 'short' }), revenue };
  });

  const maxRevenue = Math.max(...monthlyRevenue.map(m => m.revenue), 1);

  return (
    <div className="min-h-screen bg-rp-bg pb-24 lg:pb-8">
      {/* Header */}
      <header className="bg-white backdrop-blur-xl border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-3">
          <Link href="/seller" className="text-gray-400 dark:text-slate-500 dark:text-slate-500 hover:text-gray-900 dark:text-white">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-sm font-bold text-gray-900 dark:text-white dark:text-white">Statistiques</h1>
            <p className="text-[10px] text-gray-400 dark:text-slate-500 dark:text-slate-500">Performance de votre boutique</p>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 space-y-6">
        {/* Period selector */}
        <div className="flex gap-2">
          {['week', 'month', 'quarter', 'year'].map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                period === p ? 'bg-blue-600 text-white' : 'bg-gray-50 text-gray-400 dark:text-slate-500 dark:text-slate-500'
              }`}
            >
              {p === 'week' ? 'Semaine' : p === 'month' ? 'Mois' : p === 'quarter' ? 'Trimestre' : 'Année'}
            </button>
          ))}
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { label: 'Chiffre d\'affaires', value: `${(totalRevenue / 1000000).toFixed(1)}M`, color: 'text-emerald-400', icon: TrendingUp },
            { label: 'Commandes', value: totalOrders.toString(), color: 'text-blue-400', icon: ShoppingCart },
            { label: 'Panier moyen', value: `${(avgOrder / 1000).toFixed(0)}k`, color: 'text-purple-400', icon: BarChart3 },
            { label: 'Taux de réponse', value: `${responseRate}%`, color: 'text-amber-400', icon: Clock },
            { label: 'Satisfaction client', value: `${fulfillmentRate}%`, color: 'text-emerald-400', icon: Users },
            { label: 'Taux annulation', value: `${cancelRate}%`, color: cancelRate > 10 ? 'text-red-400' : 'text-emerald-400', icon: Package },
          ].map((kpi, i) => (
            <div key={i} className="bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-4">
              <div className="text-xs text-gray-400 dark:text-slate-500 dark:text-slate-500 mb-1 flex items-center gap-1"><kpi.icon className="w-3 h-3" /> {kpi.label}</div>
              <div className={`text-xl font-black ${kpi.color}`}>{kpi.value}</div>
            </div>
          ))}
        </div>

        {/* Revenue chart */}
        <div className="bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-5">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white dark:text-white mb-4 flex items-center gap-1.5"><TrendingUp className="w-4 h-4" /> Revenus mensuels</h3>
          <div className="flex items-end gap-2 h-40">
            {monthlyRevenue.map((m, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[9px] text-gray-400 dark:text-slate-500 dark:text-slate-500">{(m.revenue / 1000000).toFixed(1)}M</span>
                <div className="w-full bg-blue-500 rounded-t transition-all" style={{ height: `${(m.revenue / maxRevenue) * 120}px` }} />
                <span className="text-[9px] text-gray-400 dark:text-slate-500 dark:text-slate-500">{m.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top products */}
        <div className="bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-5">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white dark:text-white mb-4 flex items-center gap-1.5"><Trophy className="w-4 h-4" /> Produits les plus vendus</h3>
          <div className="space-y-3">
            {topProducts.length === 0 && (
              <p className="text-xs text-gray-400 dark:text-slate-500 text-center py-4">Aucune vente pour le moment.</p>
            )}
            {topProducts.map((p, i) => (
              <div key={i} className="flex items-center gap-3 py-2 border-b border-gray-200 last:border-0">
                <div className="w-8 h-8 bg-red-600/20 rounded-lg flex items-center justify-center text-sm font-bold text-red-600">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-gray-900 dark:text-white dark:text-white truncate">{p.name}</div>
                  <div className="text-[10px] text-gray-400 dark:text-slate-500 dark:text-slate-500">{p.sold} vendu{p.sold > 1 ? 's' : ''}</div>
                </div>
                <div className="text-xs font-bold text-gray-900 dark:text-white dark:text-white">{formatPrice(p.revenue, myCurrency)}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent orders */}
        <div className="bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-5">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white dark:text-white mb-4 flex items-center gap-1.5"><ClipboardList className="w-4 h-4" /> Commandes récentes</h3>
          <div className="space-y-2">
            {recentOrders.length === 0 && (
              <p className="text-xs text-gray-400 dark:text-slate-500 text-center py-4">Aucune commande pour le moment.</p>
            )}
            {recentOrders.map((o, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-gray-200 last:border-0">
                <div>
                  <div className="text-xs font-bold text-gray-900 dark:text-white dark:text-white">{o.part}</div>
                  <div className="text-[10px] text-gray-400 dark:text-slate-500 dark:text-slate-500">{o.id} • {o.date}</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${statusColors[o.status]}`}>
                    {statusLabels[o.status]}
                  </span>
                  <span className="text-xs font-bold text-gray-900 dark:text-white dark:text-white">{formatPrice(o.amount, myCurrency)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <BottomNav role="seller" />
    </div>
  );
}
