'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Users, ShoppingBag, DollarSign, Globe, Shield, Package, Bell, Menu, X, LogOut, TrendingUp, BarChart3, Store, Banknote } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import LanguageSelector from '@/components/LanguageSelector';
import { useAuth } from '@/lib/auth';
import { useOrders, useRequests, useSellers } from '@/lib/store';
import { formatPrice } from '@/lib/types';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export default function AdminDashboard() {
  const router = useRouter();
  const { user, isLoading, logout } = useAuth();
  const { t } = useLanguage();
  const [mobileMenu, setMobileMenu] = useState(false);
  const { data: orders } = useOrders();
  const { data: requests } = useRequests();
  const { data: sellers } = useSellers();

  const navLinks = [
    { href: '/admin', label: t('admin.dashboard') },
    { href: '/admin/sellers', label: t('admin.sellers') },
    { href: '/admin/orders', label: t('admin.transactions') },
    { href: '/admin/requests', label: t('admin.requests') },
    { href: '/admin/settings', label: t('admin.config') },
  ];

  const handleLogout = () => {
    logout();
    router.push('/welcome');
  };

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'admin')) router.replace('/login?role=admin');
  }, [user, isLoading, router]);

  if (isLoading || !user) return <div className="min-h-screen bg-rp-bg flex items-center justify-center"><div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" /></div>;

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthlyOrders = orders.filter((order) => new Date(order.createdAt) >= monthStart);
  const monthlyRequests = requests.filter((request) => new Date(request.createdAt) >= monthStart && request.status !== 'draft');
  const activeRequests = requests.filter((request) => request.status === 'open');
  const completedOrders = orders.filter((order) => order.status === 'completed' || order.status === 'delivered');
  const cancelledOrders = orders.filter((order) => order.status === 'cancelled');
  const verifiedSellers = sellers.filter((seller) => seller.isVerified);
  const uniqueBuyers = new Set([...orders.map((order) => order.buyerId), ...requests.map((request) => request.buyerId)]).size;
  const totalGMV = monthlyOrders.reduce((sum, order) => sum + order.price, 0);
  const averageBasket = orders.length ? orders.reduce((sum, order) => sum + order.price, 0) / orders.length : 0;
  const conversionRate = requests.length ? Math.round((orders.length / requests.filter((request) => request.status !== 'draft').length) * 100) : 0;
  const cancellationRate = orders.length ? Math.round((cancelledOrders.length / orders.length) * 100) : 0;
  const returnRate = sellers.length ? sellers.reduce((sum, seller) => sum + seller.returnRate, 0) / sellers.length : 0;
  const avgOffersPerRequest = requests.length ? requests.reduce((sum, request) => sum + request.responsesCount, 0) / requests.length : 0;
  const nigeriaOrders = orders.filter((order) => order.deliveryType === 'RAPID_NIGERIA').length;
  const usaOrders = orders.filter((order) => order.deliveryType === 'RAPID_USA').length;
  const adminAlerts = activeRequests.filter((request) => request.responsesCount === 0).length + orders.filter((order) => order.escrowStatus === 'held').length;

  const kpiCards = [
    { label: 'GMV mensuel', value: `${(totalGMV / 1000000).toFixed(1)}M`, unit: 'FCFA', icon: DollarSign, color: 'text-emerald-400', bg: 'bg-emerald-500/10', change: `${monthlyOrders.length} ventes` },
    { label: 'Vendeurs actifs', value: verifiedSellers.length.toString(), unit: `/ ${sellers.length}`, icon: Users, color: 'text-blue-400', bg: 'bg-blue-500/10', change: 'verifies' },
    { label: 'Acheteurs actifs', value: uniqueBuyers.toString(), unit: 'comptes', icon: ShoppingBag, color: 'text-purple-400', bg: 'bg-purple-500/10', change: `${orders.length} commandes` },
    { label: 'Demandes/mois', value: monthlyRequests.length.toString(), unit: 'total', icon: Package, color: 'text-red-600', bg: 'bg-red-500/10', change: `${activeRequests.length} ouvertes` },
  ];

  const operationalKPIs = [
    { label: 'Taux de conversion', value: `${conversionRate}%` },
    { label: 'Demandes sans offre', value: activeRequests.filter((request) => request.responsesCount === 0).length.toString() },
    { label: 'Commandes terminees', value: completedOrders.length.toString() },
    { label: 'Annulations', value: `${cancellationRate}%` },
    { label: 'Retour de pièce vendeurs', value: `${returnRate.toFixed(1)}%` },
    { label: 'Panier moyen', value: `${(averageBasket / 1000).toFixed(0)}k` },
  ];

  const sourcingKPIs = [
    { label: 'Nigeria', value: nigeriaOrders.toString(), icon: <Globe className="w-5 h-5" /> },
    { label: 'USA', value: usaOrders.toString(), icon: <Globe className="w-5 h-5" /> },
    { label: 'Offres/demande', value: avgOffersPerRequest.toFixed(1), icon: <BarChart3 className="w-5 h-5" /> },
  ];

  const recentActivity = [
    ...orders.slice(0, 3).map((order) => ({
      id: `order-${order.id}`,
      text: `Commande: ${formatPrice(order.price, order.currency)} - ${order.partName}`,
      time: new Date(order.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }),
      icon: <Banknote className="w-5 h-5" />,
    })),
    ...requests.slice(0, 2).map((request) => ({
      id: `request-${request.id}`,
      text: `Demande: ${request.partName} - ${request.vehicle.brand} ${request.vehicle.model}`,
      time: new Date(request.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }),
      icon: <Store className="w-5 h-5" />,
    })),
  ];

  return (
    <div className="min-h-screen bg-rp-bg">
      {/* Header */}
      <header className="bg-white backdrop-blur-xl border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-3 flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-2">
            <Image src="/logo_rapidePiece.jpeg" alt="RP" width={108} height={36} className="h-9 w-auto object-contain" priority />
            <div>
              <span className="text-sm font-bold text-gray-900 dark:text-white dark:text-white hidden sm:block">{t('admin.dashboard')}</span>
              <span className="text-[10px] text-emerald-400 hidden sm:block">Rapide Pièces</span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map(link => (
              <Link key={link.href} href={link.href}
                className={`px-3 py-2 text-sm rounded-lg transition-colors ${link.href === '/admin' ? 'text-emerald-400 bg-emerald-500/10' : 'text-gray-600 dark:text-slate-300 dark:text-slate-300 hover:text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-slate-700'}`}>
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <LanguageSelector />
            <div className="relative">
              <Bell className="w-5 h-5 text-gray-400 dark:text-slate-500 dark:text-slate-500 hover:text-gray-900 dark:text-white cursor-pointer" />
              {adminAlerts > 0 && <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 bg-red-600 text-white text-[9px] rounded-full flex items-center justify-center font-bold">{adminAlerts}</span>}
            </div>
            <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center text-gray-900 dark:text-white text-xs font-bold hidden sm:flex">AD</div>
            <button onClick={handleLogout} className="p-2 text-gray-400 dark:text-slate-500 dark:text-slate-500 hover:text-red-600"><LogOut className="w-4 h-4" /></button>
            <button onClick={() => setMobileMenu(!mobileMenu)} className="lg:hidden p-2 text-gray-400 dark:text-slate-500 dark:text-slate-500 hover:text-gray-900 dark:text-white">
              {mobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {mobileMenu && (
          <div className="lg:hidden border-t border-gray-200 px-4 py-3 space-y-1 slide-up">
            {navLinks.map(link => (
              <Link key={link.href} href={link.href} onClick={() => setMobileMenu(false)}
                className={`block px-4 py-2.5 text-sm rounded-lg ${link.href === '/admin' ? 'text-emerald-400 bg-emerald-500/10' : 'text-gray-600 dark:text-slate-300 dark:text-slate-300 hover:text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-slate-700'}`}>
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </header>

      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-6 space-y-6 pb-24 lg:pb-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {kpiCards.map(kpi => {
            const Icon = kpi.icon;
            return (
              <div key={kpi.label} className="bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-8 h-8 ${kpi.bg} rounded-lg flex items-center justify-center`}>
                    <Icon className={`w-4 h-4 ${kpi.color}`} />
                  </div>
                  <span className="text-[10px] text-gray-400 dark:text-slate-500 dark:text-slate-500">{kpi.label}</span>
                </div>
                <p className="text-xl font-extrabold text-gray-900 dark:text-white">{kpi.value}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] text-gray-400 dark:text-slate-500 dark:text-slate-500">{kpi.unit}</span>
                  <span className="text-[10px] text-emerald-400 font-medium">{kpi.change}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Operational + Sourcing */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <section className="bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-5">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white dark:text-white mb-4 flex items-center gap-1.5"><TrendingUp className="w-4 h-4" /> {t('admin.performance')}</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {operationalKPIs.map(kpi => (
                <div key={kpi.label} className="bg-gray-100 rounded-xl p-3">
                  <span className="text-[10px] text-gray-400 dark:text-slate-500 dark:text-slate-500 block">{kpi.label}</span>
                  <p className="text-base font-bold text-gray-900 dark:text-white mt-0.5">{kpi.value}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-5">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white dark:text-white mb-4 flex items-center gap-1.5"><Globe className="w-4 h-4" /> {t('admin.internationalSourcing')}</h3>
            <div className="grid grid-cols-3 gap-3">
              {sourcingKPIs.map(kpi => (
                <div key={kpi.label} className="text-center bg-gray-100 rounded-xl p-3">
                  <span className="flex justify-center">{kpi.icon}</span>
                  <p className="text-lg font-bold text-gray-900 dark:text-white dark:text-white mt-1">{kpi.value}</p>
                  <p className="text-[9px] text-gray-400 dark:text-slate-500 dark:text-slate-500">{kpi.label}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Activity + Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <section className="bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl overflow-hidden">
            <div className="px-4 pt-4 pb-2">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white dark:text-white flex items-center gap-1.5"><Bell className="w-4 h-4" /> {t('admin.recentActivity')}</h3>
            </div>
            {recentActivity.map((a, i) => (
              <div key={a.id} className={`px-4 py-3 flex items-center gap-3 ${i < recentActivity.length - 1 ? 'border-b border-gray-200' : ''}`}>
                <span className="flex-shrink-0">{a.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-900 dark:text-white truncate">{a.text}</p>
                  <p className="text-[10px] text-gray-400 dark:text-slate-500 dark:text-slate-500">{a.time}</p>
                </div>
              </div>
            ))}
          </section>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3">
            {[
              { href: '/admin/sellers', icon: Users, label: 'Vendeurs', count: sellers.length.toString(), color: 'text-red-600' },
              { href: '/admin/orders', icon: ShoppingBag, label: 'Transactions', count: orders.length.toString(), color: 'text-emerald-400' },
              { href: '/admin/requests', icon: Package, label: 'Demandes', count: requests.filter((request) => request.status !== 'draft').length.toString(), color: 'text-blue-400' },
              { href: '/admin/settings', icon: Shield, label: 'Configuration', count: 'Plateforme', color: 'text-purple-400' },
            ].map(item => {
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href}
                  className="bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-4 text-center hover:border-gray-300 dark:hover:border-slate-500 transition-colors card-hover">
                  <Icon className={`w-6 h-6 ${item.color} mx-auto mb-2`} />
                  <p className="text-xs font-semibold text-gray-900 dark:text-white">{item.label}</p>
                  <p className="text-[10px] text-gray-400 dark:text-slate-500 dark:text-slate-500 mt-0.5">{item.count}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      <BottomNav role="admin" />
    </div>
  );
}
