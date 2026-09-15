'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, FileText, Download, Calendar, DollarSign, CheckCircle2, Clock } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import { useAuth } from '@/lib/auth';
import { useOrders } from '@/lib/store';
import { formatPrice } from '@/lib/types';

export default function SellerInvoicesPage() {
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

  // Cahier V2 - Point 44: Historique des factures
  const COMMISSION_RATE = 0.25;
  const sellerOrders = orders.filter((o) => o.sellerId === user.id);
  
  // Generate mock invoices from orders
  const invoices = sellerOrders.map((order, index) => ({
    id: `INV-${String(index + 1).padStart(4, '0')}`,
    orderId: order.id,
    partName: order.partName,
    date: new Date(order.createdAt),
    amount: order.price,
    currency: order.currency,
    commission: order.price * COMMISSION_RATE,
    netAmount: order.price * (1 - COMMISSION_RATE),
    status: order.status === 'completed' || order.status === 'delivered' ? 'paid' : 'pending',
  }));

  const paidInvoices = invoices.filter((inv) => inv.status === 'paid');
  const pendingInvoices = invoices.filter((inv) => inv.status === 'pending');
  const totalNet = paidInvoices.reduce((sum, inv) => sum + inv.netAmount, 0);
  const myCurrency = sellerOrders[0]?.currency;

  return (
    <div className="min-h-screen bg-rp-bg pb-24">
      <header className="bg-white backdrop-blur-xl border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/seller" className="text-gray-400 dark:text-slate-500 dark:text-slate-500 hover:text-gray-900 dark:text-white"><ArrowLeft className="w-5 h-5" /></Link>
          <h1 className="text-sm font-bold text-gray-900 dark:text-white dark:text-white flex-1">Historique des factures</h1>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        {/* Summary cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-2xl p-4 border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              <span className="text-xs text-gray-400 dark:text-slate-500 dark:text-slate-500">Total net perçu</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatPrice(totalNet, myCurrency)}</p>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-5 h-5 text-blue-600" />
              <span className="text-xs text-gray-400 dark:text-slate-500 dark:text-slate-500">Total factures</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{invoices.length}</p>
          </div>
        </div>

        {/* Invoice tabs */}
        <div className="flex gap-2 bg-white rounded-xl p-1 border border-gray-200">
          <button className="flex-1 py-2 px-3 rounded-lg bg-blue-600 text-white text-xs font-semibold">Toutes</button>
          <button className="flex-1 py-2 px-3 rounded-lg text-gray-500 text-xs font-medium">Payées</button>
          <button className="flex-1 py-2 px-3 rounded-lg text-gray-500 text-xs font-medium">En attente</button>
        </div>

        {/* Invoice list */}
        <div className="bg-white rounded-2xl border border-gray-200 p-4">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">Factures</h3>
          {invoices.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-400 dark:text-slate-500 dark:text-slate-500">Aucune facture pour le moment</p>
            </div>
          ) : (
            <div className="space-y-3">
              {invoices.map((invoice) => (
                <div key={invoice.id} className="border border-gray-200 rounded-xl p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-gray-900 dark:text-white">{invoice.id}</span>
                        {invoice.status === 'paid' ? (
                          <span className="flex items-center gap-1 text-[10px] text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                            <CheckCircle2 className="w-3 h-3" />
                            Payée
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-[10px] text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                            <Clock className="w-3 h-3" />
                            En attente
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 dark:text-slate-500 dark:text-slate-500">{invoice.partName}</p>
                    </div>
                    <button className="text-blue-600 hover:text-blue-700">
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <p className="text-gray-400 dark:text-slate-500 dark:text-slate-500 mb-1">Date</p>
                      <p className="font-medium text-gray-900 dark:text-white">{invoice.date.toLocaleDateString('fr-FR')}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 dark:text-slate-500 dark:text-slate-500 mb-1">Montant</p>
                      <p className="font-medium text-gray-900 dark:text-white">{formatPrice(invoice.amount, invoice.currency)}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 dark:text-slate-500 dark:text-slate-500 mb-1">Net</p>
                      <p className="font-medium text-green-600">{formatPrice(invoice.netAmount, invoice.currency)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <p className="text-xs text-blue-800">
            <strong>Information :</strong> Le montant net correspond au montant total moins la commission ({(COMMISSION_RATE * 100)}%) due à Rapid Pièces.
          </p>
        </div>
      </div>

      <BottomNav role="seller" />
    </div>
  );
}