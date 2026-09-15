'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { TrendingUp, Package, Star, ChevronRight, Menu, X, LogOut, BarChart3, RefreshCw } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import NotificationsBell from '@/components/NotificationsBell';
import LanguageSelector from '@/components/LanguageSelector';
import { useAuth } from '@/lib/auth';
import { useOrders, useRequests, useSellers, useOffersForSeller } from '@/lib/store';
import { requestSubtitleLine, requestTitleLine, formatPrice } from '@/lib/types';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export default function SellerDashboard() {
  const router = useRouter();
  const { user, isLoading, logout } = useAuth();
  const { t } = useLanguage();
  const [mobileMenu, setMobileMenu] = useState(false);
  const { data: orders, refetch: refetchOrders } = useOrders();
  const { data: sellerOffers } = useOffersForSeller(user?.id);
  const { data: allRequests, refetch: refetchRequests } = useRequests();
  const { data: sellers } = useSellers();

  const handleLogout = () => {
    logout();
    router.push('/welcome');
  };

  const handleRefresh = () => {
    refetchOrders();
    refetchRequests();
  };

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'seller')) router.replace('/login');
  }, [user, isLoading, router]);

  // useOrders()/useRequests() se lancent au montage, potentiellement avant que la
  // session soit restaurée (ouverture directe/rechargement) — la requête RLS part
  // alors en anonyme et revient vide. On relance une fois la session confirmée
  // pour éviter d'afficher un tableau de bord vide à tort.
  useEffect(() => {
    if (!isLoading && user) {
      refetchOrders();
      refetchRequests();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  if (isLoading || !user) return <div className="min-h-screen bg-rp-bg flex items-center justify-center"><div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" /></div>;

  // Cahier section 6 : « Chiffre d'affaires du mois », mois dynamique, chiffre réel qui se
  // réinitialise à chaque nouveau mois (recalculé à partir des vraies commandes, jamais stocké).
  const now = new Date();
  const monthlySales = orders.filter((o) => {
    if (o.sellerId !== user.id) return false;
    const d = new Date(o.createdAt);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });
  const monthlyRevenue = monthlySales.reduce((sum, o) => sum + o.price, 0);
  const monthName = now.toLocaleDateString('fr-FR', { month: 'long' });
  const openRequests = allRequests.filter((r) => r.status === 'open');
  const recentOpenRequests = openRequests.slice(0, 4);
  // Une fois la demande acceptée, elle sort de "Demandes reçues" (qui ne montre
  // que les demandes 'open') — sans cette section elle n'était plus retrouvable
  // nulle part avant que l'acheteur ne paie.
  const acceptedAwaitingPayment = sellerOffers.filter(
    (o) => o.status === 'accepted' && !orders.some((order) => order.offerId === o.id)
  );
  const sellerRecord = sellers.find((seller) => seller.id === user.id);
  const rating = sellerRecord?.rating ?? 0;
  const badge = sellerRecord?.badge ?? 'New Seller';
  const recentSales = orders
    .filter((order) => order.sellerId === user.id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);
  const todaySalesCount = orders.filter((o) => {
    if (o.sellerId !== user.id) return false;
    const d = new Date(o.createdAt);
    return d.toDateString() === now.toDateString();
  }).length;
  const navLinks = [
    { href: '/seller', label: t('nav.home') },
    { href: '/seller/requests', label: t('nav.requests'), badge: openRequests.length },
    { href: '/seller/orders', label: t('nav.orders') },
    { href: '/seller/payments', label: 'Paiements dus' },
    { href: '/seller/invoices', label: 'Factures' },
    { href: '/seller/profile', label: t('nav.profile') },
  ];

  return (
    <div className="min-h-screen bg-rp-bg">
      {/* Header */}
      <header className="bg-white backdrop-blur-xl border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/seller" className="flex items-center gap-2">
            <Image src="/logo_rapidePiece.jpeg" alt="RP" width={108} height={36} className="h-9 w-auto object-contain" priority />
            <div>
              <span className="text-sm font-bold text-gray-900 dark:text-white dark:text-white hidden sm:block">{t('nav.sellerSpace')}</span>
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                <span className="text-[10px] text-gray-400 dark:text-slate-500 dark:text-slate-500">{rating.toFixed(1)} • {badge}</span>
              </div>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map(link => (
              <Link key={link.href} href={link.href}
                className="relative px-3 py-2 text-sm text-gray-600 dark:text-slate-300 dark:text-slate-300 hover:text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                {link.label}
                {link.badge && <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-600 text-white text-[9px] rounded-full flex items-center justify-center font-bold">{link.badge}</span>}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button onClick={handleRefresh} className="p-2 text-gray-400 dark:text-slate-500 dark:text-slate-500 hover:text-gray-900 dark:text-white" title="Rafraîchir">
              <RefreshCw className="w-4 h-4" />
            </button>
            <LanguageSelector />
            <NotificationsBell role="seller" />
            <button onClick={() => setMobileMenu(!mobileMenu)} className="lg:hidden p-2 text-gray-400 dark:text-slate-500 dark:text-slate-500 hover:text-gray-900 dark:text-white">
              {mobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <button onClick={handleLogout} className="hidden sm:flex p-2 text-gray-400 dark:text-slate-500 dark:text-slate-500 hover:text-red-600"><LogOut className="w-4 h-4" /></button>
          </div>
        </div>

        {mobileMenu && (
          <div className="lg:hidden border-t border-gray-200 px-4 py-3 space-y-1 slide-up">
            {navLinks.map(link => (
              <Link key={link.href} href={link.href} onClick={() => setMobileMenu(false)}
                className="block px-4 py-2.5 text-sm text-gray-600 dark:text-slate-300 dark:text-slate-300 hover:text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg">
                {link.label} {link.badge ? `(${link.badge})` : ''}
              </Link>
            ))}
            <button onClick={handleLogout} className="block w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg">Déconnexion</button>
          </div>
        )}
      </header>

      {/* Revenue Banner */}
      <div className="bg-gradient-to-r from-blue-600/20 to-blue-500/10 border-b border-blue-500/20">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-blue-300/70">{t('seller.monthlyRevenue')} {monthName}</p>
            <p className="text-2xl font-extrabold text-gray-900 dark:text-white">{formatPrice(monthlyRevenue, monthlySales[0]?.currency ?? recentSales[0]?.currency)}</p>
            <p className="text-[10px] text-blue-300/60">{monthlySales.length} {t('seller.salesThisMonth')}</p>
          </div>
          <TrendingUp className="w-8 h-8 text-blue-400/30" />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6 pb-24 lg:pb-6">
        {/* Cahier V2 - Point 45/46 : offres acceptées mais pas encore payées —
            sans ça elles disparaissaient de "Demandes reçues" dès l'acceptation
            et devenaient introuvables jusqu'au paiement. */}
        {acceptedAwaitingPayment.length > 0 && (
          <section className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-4">
            <h2 className="text-sm font-bold text-emerald-700 dark:text-emerald-400 mb-2">Offres acceptées — en attente de paiement</h2>
            <div className="space-y-2">
              {acceptedAwaitingPayment.map((offer) => (
                <Link key={offer.id} href={`/seller/requests/${offer.requestId}`}
                  className="flex items-center justify-between bg-white dark:bg-slate-800 rounded-xl p-3 hover:border-emerald-300 border border-transparent">
                  <span className="text-xs font-medium text-gray-900 dark:text-white">{offer.partName}</span>
                  <span className="text-xs font-bold text-emerald-600">{formatPrice(offer.price, offer.currency)}</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* New Requests + Recent Sales */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* New Requests */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-gray-900 dark:text-white">{t('seller.newRequests')}</h2>
                <span className="w-5 h-5 bg-red-600 text-white text-[10px] rounded-full flex items-center justify-center font-bold">{openRequests.length}</span>
              </div>
              <Link href="/seller/requests" className="text-xs text-red-600 font-medium flex items-center gap-1 hover:underline">{t('common.next')} <ChevronRight className="w-3 h-3" /></Link>
            </div>
            <div className="space-y-2">
              {recentOpenRequests.length === 0 && (
                <div className="bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-6 text-center text-xs text-gray-400 dark:text-slate-500">
                  Aucune nouvelle demande pour le moment.
                </div>
              )}
              {recentOpenRequests.map(req => (
                <Link key={req.id} href={`/seller/requests/${req.id}`}
                  className="block bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-3 hover:border-gray-300 dark:hover:border-slate-500 transition-colors card-hover">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-gray-100 dark:bg-slate-700 flex items-center justify-center flex-shrink-0">
                      <Package className="w-4 h-4 text-gray-400 dark:text-slate-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-2">
                        <h3 className="text-sm font-bold text-gray-900 dark:text-white leading-snug line-clamp-2">{requestTitleLine(req)}</h3>
                        {/* Suppression du badge "PAS D'OFFRE" conformément à la demande */}
                      </div>
                      <p className="text-[10px] text-gray-400 dark:text-slate-500 mt-0.5 leading-snug line-clamp-2">{requestSubtitleLine(req, { showMissing: true })}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400 dark:text-slate-500 flex-shrink-0 mt-1" />
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Recent Sales */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-bold text-gray-900 dark:text-white">{t('seller.recentSales')}</h2>
              <Link href="/seller/orders" className="text-xs text-red-600 font-medium flex items-center gap-1 hover:underline">{t('common.next')} <ChevronRight className="w-3 h-3" /></Link>
            </div>
            <div className="bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl overflow-hidden">
              {recentSales.length === 0 && (
                <div className="p-6 text-center text-xs text-gray-400 dark:text-slate-500">
                  Aucune vente récente pour le moment.
                </div>
              )}
              {recentSales.map((sale, i) => (
                <div key={sale.id} className={`p-3 flex items-center gap-3 ${i < recentSales.length - 1 ? 'border-b border-gray-200' : ''}`}>
                  <div className="w-9 h-9 bg-emerald-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-900 dark:text-white truncate">{sale.partName}</p>
                    <p className="text-[10px] text-gray-400 dark:text-slate-500 dark:text-slate-500">Acheteur #{sale.buyerId.slice(-6).toUpperCase()} • {new Date(sale.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs font-bold text-emerald-400">{formatPrice(sale.price, sale.currency)}</p>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${
                      sale.status === 'delivered' || sale.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
                    }`}>{sale.status === 'delivered' || sale.status === 'completed' ? 'Livrée' : 'En cours'}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Quick Stats — cahier section 6 : déplacées sous « Nouvelles demandes » */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: t('seller.newRequests'), value: openRequests.length, color: 'text-red-600' },
            { label: t('nav.orders'), value: todaySalesCount, color: 'text-emerald-400' },
            { label: t('seller.responses'), value: `${sellerRecord?.responseRate ?? 0}%`, color: 'text-amber-400' },
            { label: 'Note', value: `${rating.toFixed(1)} ★`, color: 'text-blue-400' },
          ].map(stat => (
            <div key={stat.label} className="bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-3 text-center">
              <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-[10px] text-gray-400 dark:text-slate-500 dark:text-slate-500">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Performance */}
        <section className="bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-5">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white dark:text-white mb-4 flex items-center gap-1.5"><BarChart3 className="w-4 h-4" /> {t('seller.performance')}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: t('seller.transactions'), value: String(sellerRecord?.totalTransactions ?? 0), target: '100', pct: Math.min(100, sellerRecord?.totalTransactions ?? 0) },
              { label: t('seller.compliance'), value: `${sellerRecord?.fulfillmentRate ?? 0}%`, target: '95%', pct: sellerRecord?.fulfillmentRate ?? 0 },
              { label: t('seller.responses'), value: `${sellerRecord?.responseRate ?? 0}%`, target: '90%', pct: sellerRecord?.responseRate ?? 0 },
              { label: t('seller.returns'), value: `${sellerRecord?.returnRate ?? 0}%`, target: '<5%', pct: sellerRecord?.returnRate ?? 0 },
            ].map(kpi => (
              <div key={kpi.label}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-gray-400 dark:text-slate-500 dark:text-slate-500">{kpi.label}</span>
                  <span className="text-xs font-semibold text-gray-900 dark:text-white">{kpi.value}</span>
                </div>
                <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-red-600 rounded-full transition-all" style={{ width: `${Math.min(100, kpi.pct)}%` }} />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <BottomNav role="seller" />
    </div>
  );
}
