'use client';

import Link from 'next/link';
import { useEffect, type ReactNode } from 'react';
import { ArrowLeft, Bell, FileText, Gavel, MessageSquare } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import { useAuth } from '@/lib/auth';
import { useOffersForSeller, useRequests } from '@/lib/store';
import { requestTitleLine, formatPrice } from '@/lib/types';

export default function SellerNotificationsPage() {
  const { user, isLoading } = useAuth();
  const { data: sellerOffers, refetch: refetchOffers } = useOffersForSeller(user?.id);
  const { data: requests, refetch: refetchRequests } = useRequests();

  // useOffersForSeller()/useRequests() se lancent au montage, potentiellement
  // avant que la session soit restaurée (ouverture directe/rechargement) — la
  // requête RLS part alors en anonyme et revient vide.
  useEffect(() => {
    if (!isLoading && user) {
      refetchOffers();
      refetchRequests();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);
  const counterOffers = sellerOffers.filter((offer) => offer.status === 'countered' && offer.lastActor === 'buyer');
  const pendingOffers = sellerOffers.filter((offer) => offer.status === 'pending' || (offer.status === 'countered' && offer.lastActor === 'seller'));
  const newRequests = requests.filter((request) => request.status === 'open' && !sellerOffers.some((offer) => offer.requestId === request.id));

  return (
    <div className="min-h-screen bg-rp-bg pb-24">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/seller/profile" className="text-gray-400 hover:text-gray-900"><ArrowLeft className="w-5 h-5" /></Link>
          <h1 className="text-sm font-bold text-gray-900 flex-1">Notifications vendeur</h1>
          <Bell className="w-4 h-4 text-red-600" />
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-4 space-y-3">
        <NotificationGroup title="Contre-offres" icon={<Gavel className="w-4 h-4" />} count={counterOffers.length}>
          {counterOffers.map((offer) => (
            <Link key={offer.id} href={`/seller/requests/${offer.requestId}`} className="block rounded-xl border border-gray-200 bg-white p-3 text-xs text-gray-700">
              {offer.partName} - {formatPrice(offer.price, offer.currency)} proposes par l&apos;acheteur
            </Link>
          ))}
        </NotificationGroup>
        <NotificationGroup title="Offres en attente" icon={<Gavel className="w-4 h-4" />} count={pendingOffers.length}>
          {pendingOffers.map((offer) => (
            <Link key={offer.id} href={`/seller/requests/${offer.requestId}`} className="block rounded-xl border border-gray-200 bg-white p-3 text-xs text-gray-700">
              {offer.partName} - en attente de reponse
            </Link>
          ))}
        </NotificationGroup>
        <NotificationGroup title="Demandes" icon={<FileText className="w-4 h-4" />} count={newRequests.length}>
          {newRequests.map((request) => (
            <Link key={request.id} href={`/seller/requests/${request.id}`} className="block rounded-xl border border-gray-200 bg-white p-3 text-xs text-gray-700">
              {requestTitleLine(request)}
            </Link>
          ))}
        </NotificationGroup>
        <NotificationGroup title="Messages" icon={<MessageSquare className="w-4 h-4" />} count={1}>
          <Link href="/whatsapp-contact" className="block rounded-xl border border-gray-200 bg-white p-3 text-xs text-gray-700">Support vendeur WhatsApp</Link>
        </NotificationGroup>
      </main>
      <BottomNav role="seller" />
    </div>
  );
}

function NotificationGroup({ title, icon, count, children }: { title: string; icon: ReactNode; count: number; children: ReactNode }) {
  return (
    <section>
      <div className="mb-2 flex items-center gap-2 text-xs font-bold text-gray-900">
        {icon}
        <span>{title}</span>
        <span className="ml-auto rounded-full bg-red-600 px-2 py-0.5 text-[10px] text-white">{count}</span>
      </div>
      <div className="space-y-2">{count === 0 ? <p className="rounded-xl border border-gray-200 bg-white p-3 text-xs text-gray-400">Rien pour l&apos;instant</p> : children}</div>
    </section>
  );
}
