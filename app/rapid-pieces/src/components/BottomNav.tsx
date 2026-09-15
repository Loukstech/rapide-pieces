'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, FileText, ShoppingBag, ShoppingCart, User, Package, BarChart3, Settings, Store, DollarSign, Receipt } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { useRequestDrafts, usePendingPayments, useRequests, expireStaleRequests, expireStaleOffers } from '@/lib/store';

const buyerTabsBase = [
  { href: '/requests/new', label: 'Demander', icon: FileText, isCenter: true, hasBadge: 0, hasAlertDot: false },
  { href: '/cart', label: 'Panier', icon: ShoppingCart, isCenter: false, hasBadge: 0, hasAlertDot: false },
  { href: '/orders', label: 'Commandes', icon: Package, isCenter: false, hasBadge: 0, hasAlertDot: false },
  { href: '/profile', label: 'Profil', icon: User, isCenter: false, hasBadge: 0, hasAlertDot: false },
];

const sellerTabs = [
  { href: '/seller', label: 'Accueil', icon: Home, isCenter: true, hasBadge: 0, hasAlertDot: false },
  { href: '/seller/requests', label: 'Demandes', icon: FileText, isCenter: false, hasBadge: 0, hasAlertDot: false },
  { href: '/seller/orders', label: 'Ventes', icon: ShoppingBag, isCenter: false, hasBadge: 0, hasAlertDot: false },
  { href: '/seller/payments', label: 'Paiements', icon: DollarSign, isCenter: false, hasBadge: 0, hasAlertDot: false },
  { href: '/seller/profile', label: 'Profil', icon: User, isCenter: false, hasBadge: 0, hasAlertDot: false },
];

const adminTabs = [
  { href: '/admin', label: 'Accueil', icon: BarChart3, isCenter: false, hasBadge: 0, hasAlertDot: false },
  { href: '/admin/sellers', label: 'Vendeurs', icon: Store, isCenter: false, hasBadge: 0, hasAlertDot: false },
  { href: '/admin/buyers', label: 'Acheteurs', icon: User, isCenter: false, hasBadge: 0, hasAlertDot: false },
  { href: '/admin/orders', label: 'Ventes', icon: ShoppingBag, isCenter: false, hasBadge: 0, hasAlertDot: false },
  { href: '/admin/requests', label: 'Demandes', icon: FileText, isCenter: false, hasBadge: 0, hasAlertDot: false },
  { href: '/admin/settings', label: 'Config', icon: Settings, isCenter: false, hasBadge: 0, hasAlertDot: false },
];

interface BottomNavProps {
  role?: 'buyer' | 'seller' | 'admin';
}

export default function BottomNav({ role = 'buyer' }: BottomNavProps) {
  const pathname = usePathname();
  const { user } = useAuth();
  // Cahier §8 : badge du panier = nombre de demandes préparées mais pas encore envoyées ;
  // pastille d'alerte = au moins une offre acceptée pas encore payée.
  const { data: drafts } = useRequestDrafts(role === 'buyer' ? user?.id : undefined);
  const { data: pendingPayments } = usePendingPayments(role === 'buyer' ? user?.id : undefined);
  const { data: requests } = useRequests();
  const buyerTabs = buyerTabsBase.map((tab) => tab.href === '/cart'
    ? { ...tab, hasBadge: drafts.length, hasAlertDot: pendingPayments.length > 0 }
    : tab);
  const sellerOpenRequests = requests.filter((request) => request.status === 'open').length;
  const sellerTabsWithData = sellerTabs.map((tab) => tab.href === '/seller/requests'
    ? { ...tab, hasBadge: sellerOpenRequests }
    : tab);
  const tabs = role === 'admin' ? adminTabs : role === 'seller' ? sellerTabsWithData : buyerTabs;

  // Cahier §10 : une demande ouverte depuis plus de 24h sans offre acceptée expire —
  // balayage au mieux (best-effort) à chaque navigation acheteur.
  useEffect(() => {
    if (role === 'buyer' && user?.id) expireStaleRequests(user.id);
  }, [role, user?.id]);

  // Cahier V2 - Point 2 : une offre sans réponse depuis 24h expire, quel que
  // soit le rôle courant (acheteur ou vendeur peuvent tous deux déclencher
  // le balayage best-effort en naviguant).
  useEffect(() => {
    if (user?.id) expireStaleOffers();
  }, [user?.id]);

  // Le tab actif est celui dont le href correspond le plus précisément au
  // chemin courant — sinon un href court comme '/admin' matche (via
  // startsWith) toutes les sous-pages admin en même temps que la vraie page
  // courante, et deux onglets s'affichaient actifs à la fois.
  const activeHref = [...tabs]
    .filter((tab) => pathname === tab.href || pathname.startsWith(tab.href + '/'))
    .sort((a, b) => b.href.length - a.href.length)[0]?.href;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-rp-border z-50 safe-area-inset-bottom">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = tab.href === activeHref;

          if (tab.isCenter) {
            return (
              <Link key={tab.href} href={tab.href} className="flex flex-col items-center -mt-4">
                <div className="w-14 h-14 bg-rp-primary rounded-full flex items-center justify-center shadow-lg">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-[10px] mt-1 font-medium text-rp-primary whitespace-nowrap">{tab.label}</span>
              </Link>
            );
          }
          
          return (
            <Link key={tab.href} href={tab.href} className="flex flex-col items-center relative">
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'text-rp-primary' : 'text-rp-text-muted'}`} />
                {tab.hasBadge > 0 && (
                  <span className="absolute -top-1 -right-2 w-4 h-4 bg-rp-danger text-white text-[9px] rounded-full flex items-center justify-center font-bold">
                    {tab.hasBadge}
                  </span>
                )}
                {tab.hasAlertDot && (
                  <span className="absolute -top-0.5 -left-1.5 w-2.5 h-2.5 bg-red-600 rounded-full border border-white" title="Paiement en attente" />
                )}
              </div>
              <span className={`text-[10px] mt-0.5 whitespace-nowrap ${isActive ? 'text-rp-primary font-semibold' : 'text-rp-text-muted'}`}>
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
