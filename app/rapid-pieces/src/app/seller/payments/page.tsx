'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, DollarSign, TrendingUp, Calendar, CheckCircle2, AlertCircle } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import { useAuth } from '@/lib/auth';
import { useOrders } from '@/lib/store';
import { formatPrice } from '@/lib/types';

export default function SellerPaymentsPage() {
  const router = useRouter();
  const { user, isLoading, logout } = useAuth();
  const { data: orders } = useOrders();

  const handleLogout = () => {
    logout();
    router.push('/welcome');
  };

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'seller')) router.replace('/login');
  }, [user, isLoading, router]);

  if (isLoading || !user) return <div className="min-h-screen bg-rp-bg flex items-center justify-center"><div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" /></div>;

  // Cahier V2 - Point 43: Calcul des paiements dus à Rapid Pièces
  // Commission hypothétique de 10% sur chaque transaction
  const COMMISSION_RATE = 0.25;
  
  const sellerOrders = orders.filter((o) => o.sellerId === user.id);
  const totalRevenue = sellerOrders.reduce((sum, o) => sum + o.price, 0);
  const totalCommission = totalRevenue * COMMISSION_RATE;
  const completedOrders = sellerOrders.filter((o) => o.status === 'completed' || o.status === 'delivered');
  const pendingOrders = sellerOrders.filter((o) => o.status === 'payment_pending' || o.status === 'paid');
  const myCurrency = sellerOrders[0]?.currency;

  return (
    <div className="min-h-screen bg-rp-bg pb-24">
      <header className="bg-white backdrop-blur-xl border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/seller" className="text-gray-400 dark:text-slate-500 dark:text-slate-500 hover:text-gray-900 dark:text-white"><ArrowLeft className="w-5 h-5" /></Link>
          <h1 className="text-sm font-bold text-gray-900 dark:text-white dark:text-white flex-1">Paiements dus à Rapid Pièces</h1>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        {/* Summary cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-2xl p-4 border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-5 h-5 text-red-600" />
              <span className="text-xs text-gray-400 dark:text-slate-500 dark:text-slate-500">Montant dû</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatPrice(totalCommission, myCurrency)}</p>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <span className="text-xs text-gray-400 dark:text-slate-500 dark:text-slate-500">Commission</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{(COMMISSION_RATE * 100).toFixed(0)}%</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-2xl p-4 border border-gray-200 text-center">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{sellerOrders.length}</p>
            <p className="text-[10px] text-gray-400 dark:text-slate-500 dark:text-slate-500">Total commandes</p>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-gray-200 text-center">
            <p className="text-2xl font-bold text-green-600">{completedOrders.length}</p>
            <p className="text-[10px] text-gray-400 dark:text-slate-500 dark:text-slate-500">Effectuées</p>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-gray-200 text-center">
            <p className="text-2xl font-bold text-amber-600">{pendingOrders.length}</p>
            <p className="text-[10px] text-gray-400 dark:text-slate-500 dark:text-slate-500">En attente</p>
          </div>
        </div>

        {/* Recent transactions */}
        <div className="bg-white rounded-2xl border border-gray-200 p-4">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">Transactions récentes</h3>
          {sellerOrders.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-gray-400 dark:text-slate-500 dark:text-slate-500">Aucune transaction pour le moment</p>
            </div>
          ) : (
            <div className="space-y-2">
              {sellerOrders.slice(0, 5).map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      order.status === 'completed' || order.status === 'delivered' ? 'bg-green-100' : 'bg-amber-100'
                    }`}>
                      {order.status === 'completed' || order.status === 'delivered' ? <CheckCircle2 className="w-4 h-4 text-green-600" /> : <AlertCircle className="w-4 h-4 text-amber-600" />}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-900 dark:text-white">{order.partName}</p>
                      <p className="text-[10px] text-gray-400 dark:text-slate-500 dark:text-slate-500">{new Date(order.createdAt).toLocaleDateString('fr-FR')}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900 dark:text-white">{formatPrice(order.price, order.currency)}</p>
                    <p className="text-[10px] text-red-600">{formatPrice(order.price * COMMISSION_RATE, order.currency)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <p className="text-xs text-blue-800">
            <strong>Information :</strong> Le montant dû correspond à la commission ({(COMMISSION_RATE * 100)}%) sur vos transactions. 
            Le paiement est déduit automatiquement des montants reçus.
          </p>
        </div>
      </div>

      <BottomNav role="seller" />
    </div>
  );
}