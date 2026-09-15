'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Shield, Check, AlertTriangle, DollarSign, Filter, Users, ShoppingBag, Package, BarChart3, ShieldCheck, Lock, CheckCircle2, Undo2 } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import { useAuth } from '@/lib/auth';
import { useOrders, updateOrderEscrow } from '@/lib/store';
import { OrderStatus, deliveryLabel, formatPrice } from '@/lib/types';

// Cahier V2 - Point 51: Statut complet d'une commande
const statusStyles: Record<OrderStatus, { bg: string; text: string; border: string; label: string }> = {
  payment_pending: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30', label: 'Paiement en cours' },
  paid: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/30', label: 'Payé' },
  shipping: { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/30', label: 'Livraison en cours' },
  delivered: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30', label: 'Livré' },
  completed: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30', label: 'Terminé' },
  cancelled: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/30', label: 'Annulé' },
};

const escrowStyles: Record<string, { bg: string; text: string; label: string; icon: ReactNode }> = {
  held: { bg: 'bg-purple-500/10', text: 'text-purple-400', label: 'Escrow actif', icon: <Lock className="w-3 h-3" /> },
  released: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', label: 'Libéré', icon: <CheckCircle2 className="w-3 h-3" /> },
  refunded: { bg: 'bg-red-500/10', text: 'text-red-400', label: 'Remboursé', icon: <Undo2 className="w-3 h-3" /> },
};

export default function AdminOrdersPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [filter, setFilter] = useState<'all' | 'active' | 'escrow' | 'completed'>('all');

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'admin')) router.replace('/login?role=admin');
  }, [user, isLoading, router]);

  const { data: allTransactions, refetch: refetchOrders } = useOrders();

  if (isLoading || !user) return <div className="min-h-screen bg-rp-bg flex items-center justify-center"><div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" /></div>;

  const filtered = allTransactions.filter(t => {
    if (filter === 'active') return t.status !== 'delivered' && t.status !== 'completed';
    if (filter === 'escrow') return t.escrowStatus === 'held';
    if (filter === 'completed') return t.status === 'delivered' || t.status === 'completed';
    return true;
  });

  const totalGMV = allTransactions.reduce((s, t) => s + t.price, 0);
  const heldEscrow = allTransactions.filter(t => t.escrowStatus === 'held').reduce((s, t) => s + t.price, 0);

  return (
    <div className="min-h-screen bg-rp-bg">
      <header className="bg-white backdrop-blur-xl border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/admin" className="text-gray-400 dark:text-slate-500 dark:text-slate-500 hover:text-gray-900 dark:text-white"><ArrowLeft className="w-5 h-5" /></Link>
          <h1 className="text-sm font-bold text-gray-900 dark:text-white dark:text-white flex-1">Transactions</h1>
        </div>
        <div className="max-w-2xl mx-auto px-4 pb-3 space-y-3">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3">
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3">
              <p className="text-[10px] text-emerald-400/70">GMV Total</p>
              <p className="text-lg font-bold text-emerald-400">{(totalGMV / 1000).toFixed(0)}k FCFA</p>
            </div>
            <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-3">
              <p className="text-[10px] text-purple-400/70">Escrow actif</p>
              <p className="text-lg font-bold text-purple-400">{(heldEscrow / 1000).toFixed(0)}k FCFA</p>
            </div>
          </div>
          <div className="flex gap-2">
            {[
              { key: 'all' as const, label: 'Toutes' },
              { key: 'active' as const, label: 'En cours' },
              { key: 'escrow' as const, label: 'Escrow', icon: <Lock className="w-3 h-3" /> },
              { key: 'completed' as const, label: 'Effectuées', icon: <CheckCircle2 className="w-3 h-3" /> },
            ].map((f: { key: 'all' | 'active' | 'escrow' | 'completed'; label: string; icon?: ReactNode }) => (
              <button key={f.key} onClick={() => setFilter(f.key)}
                className={`px-3 py-1.5 rounded-full text-[11px] font-medium transition-all flex items-center gap-1 ${
                  filter === f.key ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-400 dark:text-slate-500 dark:text-slate-500 border border-gray-200'
                }`}>{f.icon}{f.label}</button>
            ))}
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-4 space-y-3 pb-24 lg:pb-6">
        {filtered.map(tx => {
          const status = statusStyles[tx.status] ?? statusStyles.paid;
          const escrow = escrowStyles[tx.escrowStatus] ?? escrowStyles.held;

          return (
            <div key={tx.id} className="bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${status.bg} ${status.text} border ${status.border}`}>{status.label}</span>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium flex items-center gap-1 ${escrow.bg} ${escrow.text}`}>{escrow.icon}{escrow.label}</span>
                  </div>
                  <h3 className="text-xs font-semibold text-gray-900 dark:text-white">{tx.partName}</h3>
                  <p className="text-[10px] text-gray-400 dark:text-slate-500 dark:text-slate-500">Acheteur: #{tx.buyerId.slice(-6).toUpperCase()} • Vendeur: {tx.sellerName}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900 dark:text-white dark:text-white">{formatPrice(tx.price, tx.currency)}</p>
                  <p className="text-[9px] text-gray-400 dark:text-slate-500 dark:text-slate-500">Commission: {Math.round(tx.price * 0.07).toLocaleString('fr-FR')}</p>
                </div>
              </div>

              <div className="flex items-center justify-between text-[10px] text-gray-400 dark:text-slate-500 dark:text-slate-500 bg-gray-100 rounded-lg p-2">
                <span>{deliveryLabel(tx.deliveryType)}</span>
                <span>{new Date(tx.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}</span>
              </div>

              {tx.escrowStatus === 'held' && (
                <div className="flex gap-2 mt-3">
                  <button onClick={async () => { await updateOrderEscrow(tx.id, 'released'); refetchOrders(); }} className="flex-1 py-2 bg-emerald-600 text-white rounded-lg text-[11px] font-semibold hover:bg-emerald-700 transition-colors">Libérer</button>
                  <button onClick={async () => { await updateOrderEscrow(tx.id, 'refunded'); refetchOrders(); }} className="flex-1 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg text-[11px] font-medium hover:bg-red-100 transition-colors">Rembourser</button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <BottomNav role="admin" />
    </div>
  );
}
