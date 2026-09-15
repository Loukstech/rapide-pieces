'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Star, Shield, Bell, TrendingUp, Award, MapPin, Phone, LogOut, Store, Package, DollarSign, ChevronRight, Settings, HelpCircle, Trophy, Receipt } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import LanguageSelector from '@/components/LanguageSelector';
import { useAuth } from '@/lib/auth';
import { useOrders, useSellers } from '@/lib/store';
import { sellerAccountStatus } from '@/lib/types';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export default function SellerProfilePage() {
  const router = useRouter();
  const { user, isLoading, logout } = useAuth();
  const { t } = useLanguage();
  const { data: sellers } = useSellers();
  const { data: orders } = useOrders();

  const handleLogout = () => {
    logout();
    router.push('/welcome');
  };

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'seller')) router.replace('/login');
  }, [user, isLoading, router]);

  if (isLoading || !user) return <div className="min-h-screen bg-rp-bg flex items-center justify-center"><div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" /></div>;

  const seller = sellers.find((item) => item.id === user.id);
  const sales = orders.filter((order) => order.sellerId === user.id);
  const totalRevenue = sales.reduce((sum, order) => sum + order.price, 0);
  const rating = seller?.rating ?? 0;
  const totalTransactions = seller?.totalTransactions ?? sales.length;
  const fulfillmentRate = seller?.fulfillmentRate ?? 0;
  const responseRate = seller?.responseRate ?? 0;
  const returnRate = seller?.returnRate ?? 0;
  const badge = seller?.badge ?? 'New Seller';
  const badgeTierIndex = Math.max(0, ['New Seller', 'Rapid Seller', 'Verified Seller', 'Premium Seller', 'Top Seller'].indexOf(badge));
  const brands = seller?.brands.length ? seller.brands : ['Non renseigné'];
  const specialties = seller?.specialties.length ? seller.specialties : seller?.categories.length ? seller.categories : ['Non renseigné'];
  const initials = (seller?.name ?? user.name).split(' ').map((part) => part.charAt(0)).join('').slice(0, 2).toUpperCase();
  const joinedAt = seller?.joinDate ? new Date(seller.joinDate).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric', day: 'numeric' }) : 'Non renseigné';
  const joinedAtFull = seller?.joinDate ? new Date(seller.joinDate).toLocaleString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Non renseigné';
  const accountStatus = sellerAccountStatus(seller);

  return (
    <div className="min-h-screen bg-rp-bg">
      {/* Header */}
      <header className="bg-gradient-to-b from-blue-600/20 to-transparent">
        <div className="max-w-2xl mx-auto px-4 pt-8 pb-6">
          <div className="flex items-center gap-3 mb-6">
            <Link href="/seller" className="text-gray-400 dark:text-slate-500 dark:text-slate-500 hover:text-gray-900 dark:text-white"><ArrowLeft className="w-5 h-5" /></Link>
            <h1 className="text-sm font-bold text-gray-900 dark:text-white dark:text-white flex-1">{t('seller.myProfile')}</h1>
            <LanguageSelector />
            <button onClick={handleLogout} className="text-gray-400 dark:text-slate-500 dark:text-slate-500 hover:text-red-600"><LogOut className="w-4 h-4" /></button>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center text-gray-900 dark:text-white text-2xl font-bold shadow-lg shadow-blue-600/30">{initials}</div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white dark:text-white">{seller?.name ?? user.name}</h2>
              <p className="text-xs text-gray-400 dark:text-slate-500 dark:text-slate-500">{seller?.address ?? seller?.location ?? user.location ?? 'Localisation non renseignée'}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] px-2 py-0.5 bg-blue-500/10 text-blue-400 border border-blue-500/30 rounded-full font-medium flex items-center gap-1">
                  <Shield className="w-3 h-3" /> {badge}
                </span>
                <span className="text-[10px] text-gray-400 dark:text-slate-500 dark:text-slate-500">Inscrit le {joinedAtFull}</span>
              </div>
              <p className={`text-[10px] font-semibold mt-1 ${accountStatus.colorClass}`}>{accountStatus.label}</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 space-y-4 pb-24 lg:pb-6">
        {/* Rapid Seller Score */}
        <section className="bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Award className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-bold text-gray-900 dark:text-white dark:text-white">Rapid Seller Score</h3>
          </div>

          <div className="flex items-center gap-4 mb-4">
            <div className="w-20 h-20 bg-gradient-to-br from-amber-400/20 to-amber-500/10 border border-amber-500/30 rounded-full flex items-center justify-center">
              <span className="text-3xl font-extrabold text-gray-900 dark:text-white">{rating.toFixed(1)}</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-1 mb-1">
                {[1,2,3,4,5].map(i => <Star key={i} className={`w-4 h-4 ${i <= Math.round(rating) ? 'fill-amber-400 text-amber-400' : 'fill-amber-400/30 text-amber-400/30'}`} />)}
              </div>
              <p className="text-[10px] text-gray-400 dark:text-slate-500 dark:text-slate-500">Basé sur {totalTransactions} transaction{totalTransactions > 1 ? 's' : ''}</p>
              <span className="text-[9px] px-2 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded-full font-medium flex items-center gap-1"><Trophy className="w-3 h-3" /> {badge}</span>
            </div>
          </div>

          <div className="space-y-2.5">
            {[
              { label: t('seller.compliance'), value: `${fulfillmentRate}%`, pct: fulfillmentRate },
              { label: t('seller.responses'), value: `${responseRate}%`, pct: responseRate },
              { label: t('seller.returns'), value: `${returnRate}%`, pct: Math.max(0, 100 - returnRate) },
              { label: t('seller.stock'), value: seller?.stockLevel ?? 'N/A', pct: seller?.stockLevel === 'Grand' ? 100 : seller?.stockLevel === 'Moyen' ? 65 : seller?.stockLevel === 'Petit' ? 35 : 0 },
              { label: t('seller.transactions'), value: String(totalTransactions), pct: Math.min(100, totalTransactions) },
            ].map(m => (
              <div key={m.label}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[11px] text-gray-400 dark:text-slate-500 dark:text-slate-500">{m.label}</span>
                  <span className="text-[11px] font-semibold text-gray-900 dark:text-white">{m.value}</span>
                </div>
                <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: `${m.pct}%` }} />
                </div>
              </div>
            ))}
          </div>

          {/* Badge Progression — branché sur le vrai badge du vendeur (sellers.badge),
              plus atteint automatiquement selon son historique réel, plutôt qu'un
              palier figé. */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-[10px] text-gray-400 dark:text-slate-500 dark:text-slate-500 mb-2">{t('seller.badgeProgression')}</p>
            <div className="flex items-center gap-1">
              {['New', 'Rapid', 'Verified', 'Premium', 'Top'].map((b, i) => (
                <div key={b} className="flex items-center gap-1 flex-1">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold ${i <= badgeTierIndex ? 'bg-amber-400 text-slate-900' : 'bg-gray-200 text-gray-400 dark:text-slate-500 dark:text-slate-500'}`}>{i + 1}</div>
                  {i < 4 && <div className={`flex-1 h-0.5 ${i < badgeTierIndex ? 'bg-amber-400' : 'bg-gray-200'}`} />}
                </div>
              ))}
            </div>
            <p className="text-[9px] text-gray-400 dark:text-slate-500 dark:text-slate-500 text-center mt-2">{t('seller.currentBadge')}: <strong className="text-amber-400">{badge}</strong></p>
          </div>
        </section>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-3 text-center">
            <p className="text-lg font-bold text-blue-400">{totalTransactions}</p>
            <p className="text-[10px] text-gray-400 dark:text-slate-500 dark:text-slate-500">{t('seller.transactions')}</p>
          </div>
          <div className="bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-3 text-center">
            <p className="text-lg font-bold text-emerald-400">{totalRevenue.toLocaleString('fr-FR')}</p>
            <p className="text-[10px] text-gray-400 dark:text-slate-500 dark:text-slate-500">{t('seller.totalRevenue')}</p>
          </div>
          <div className="bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-3 text-center">
            <p className="text-lg font-bold text-amber-400">{fulfillmentRate}%</p>
            <p className="text-[10px] text-gray-400 dark:text-slate-500 dark:text-slate-500">{t('seller.compliance')}</p>
          </div>
        </div>

        {/* Spécialités */}
        <section className="bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-4">
          <h3 className="text-xs font-bold text-gray-900 dark:text-white dark:text-white mb-2">{t('seller.specialties')}</h3>
          <div className="flex flex-wrap gap-1.5 mb-3">
            {specialties.map(s => (
              <span key={s} className="text-[10px] px-2 py-0.5 bg-blue-500/10 text-blue-400 border border-blue-500/30 rounded-full">{s}</span>
            ))}
          </div>
          <h3 className="text-xs font-bold text-gray-900 dark:text-white dark:text-white mb-2">{t('seller.brands')}</h3>
          <div className="flex flex-wrap gap-1.5">
            {brands.map(b => (
              <span key={b} className="text-[10px] px-2 py-0.5 bg-gray-200 text-gray-600 dark:text-slate-300 dark:text-slate-300 rounded-full">{b}</span>
            ))}
          </div>
        </section>

        {/* Menu */}
        <section className="bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl overflow-hidden">
          {([
            { href: '/seller/notifications', icon: Bell, label: t('seller.notifications'), desc: t('seller.alerts') },
            { href: '/seller/stats', icon: TrendingUp, label: t('seller.statistics'), desc: 'Rapports et analyses' },
            { href: '/seller/profile', icon: MapPin, label: t('seller.store'), desc: 'Informations et localisation' },
            { href: '/seller/invoices', icon: Receipt, label: 'Factures', desc: 'Historique et gestion des factures' },
            { href: '/whatsapp-contact', icon: Phone, label: t('seller.support'), desc: 'Assistance dédiée' },
            { href: '/seller/guide', icon: HelpCircle, label: t('seller.guide'), desc: 'Maximiser vos ventes' },
            { href: '/seller/settings', icon: Settings, label: t('nav.settings'), desc: t('seller.account') },
          ]).map((item, i) => {
            const Icon = item.icon;
            return (
              <Link key={item.label} href={item.href} className={`w-full px-4 py-3.5 flex items-center gap-3 ${i < 5 ? 'border-b border-gray-200' : ''}`}>
                <Icon className="w-4 h-4 text-gray-400 dark:text-slate-500 dark:text-slate-500" />
                <div className="flex-1 text-left">
                  <p className="text-xs font-medium text-gray-900 dark:text-white">{item.label}</p>
                  <p className="text-[10px] text-gray-400 dark:text-slate-500 dark:text-slate-500">{item.desc}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 dark:text-slate-500 dark:text-slate-500" />
              </Link>
            );
          })}
        </section>
      </div>

      <BottomNav role="seller" />
    </div>
  );
}
