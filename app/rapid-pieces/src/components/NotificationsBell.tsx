'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Bell, MessageSquare, FileText, Gavel, AlertCircle } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { useOffersForSeller, useOffersForBuyer, useRequests, useNotifications, markNotificationRead } from '@/lib/store';
import { requestTitleLine, formatPrice } from '@/lib/types';

// Cahier section 2 : la cloche ouvre une fenêtre regroupant les notifications par
// catégorie — Contre-offres/Offres + Demandes + Messages côté vendeur,
// Offres + Messages côté acheteur. Cahier V2 §4 : y ajoute les notifications
// système (ex. expiration de demande) écrites par les triggers DB dans la
// table `notifications` — un seul point d'entrée plutôt qu'une 2e cloche.
export default function NotificationsBell({ role }: { role: 'buyer' | 'seller' }) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const { data: sellerOffers } = useOffersForSeller(role === 'seller' ? user?.id : undefined);
  const { data: buyerOffers } = useOffersForBuyer(role === 'buyer' ? user?.id : undefined);
  const { data: allRequests } = useRequests();
  const { data: notifications, refetch: refetchNotifications } = useNotifications(user?.id);

  const counterOffers = sellerOffers.filter((o) => o.status === 'countered' && o.lastActor === 'buyer');
  const sellerPendingOffers = sellerOffers.filter((o) => o.status === 'pending' || (o.status === 'countered' && o.lastActor === 'seller'));
  const newRequests = role === 'seller' ? allRequests.filter((r) => r.status === 'open' && !sellerOffers.some((o) => o.requestId === r.id)) : [];
  const buyerActionable = buyerOffers.filter((o) => o.status === 'pending' || (o.status === 'countered' && o.lastActor === 'seller'));
  const unreadNotifications = notifications.filter((n) => !n.isRead);

  const totalCount = (role === 'seller'
    ? counterOffers.length + newRequests.length
    : buyerActionable.length) + unreadNotifications.length;

  const handleNotificationClick = async (id: string) => {
    await markNotificationRead(id);
    await refetchNotifications();
  };

  return (
    <div className="relative">
      <button onClick={() => setOpen((v) => !v)} className="relative text-gray-400 dark:text-slate-500 hover:text-gray-900 dark:hover:text-white">
        <Bell className="w-5 h-5" />
        {totalCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 text-white text-[9px] rounded-full flex items-center justify-center font-bold">
            {totalCount}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-8 z-50 w-80 max-h-[70vh] overflow-y-auto bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl shadow-xl">
            {role === 'seller' && (
              <>
                <Section title="Contre-offres" icon={<Gavel className="w-3.5 h-3.5" />}>
                  {counterOffers.length === 0 ? <Empty /> : counterOffers.map((o) => (
                    <Link key={o.id} href={`/seller/requests/${o.requestId}`} onClick={() => setOpen(false)} className="block px-4 py-2 text-xs hover:bg-gray-50 dark:hover:bg-slate-700">
                      {o.partName} — {formatPrice(o.price, o.currency)} proposés par l&apos;acheteur
                    </Link>
                  ))}
                </Section>
                <Section title="Offres" icon={<Gavel className="w-3.5 h-3.5" />}>
                  {sellerPendingOffers.length === 0 ? <Empty /> : sellerPendingOffers.map((o) => (
                    <Link key={o.id} href={`/seller/requests/${o.requestId}`} onClick={() => setOpen(false)} className="block px-4 py-2 text-xs hover:bg-gray-50 dark:hover:bg-slate-700">
                      {o.partName} — en attente de l&apos;acheteur
                    </Link>
                  ))}
                </Section>
                <Section title="Demandes" icon={<FileText className="w-3.5 h-3.5" />}>
                  {newRequests.length === 0 ? <Empty /> : newRequests.slice(0, 8).map((r) => (
                    <Link key={r.id} href={`/seller/requests/${r.id}`} onClick={() => setOpen(false)} className="block px-4 py-2 text-xs hover:bg-gray-50 dark:hover:bg-slate-700">
                      {requestTitleLine(r)}
                    </Link>
                  ))}
                </Section>
              </>
            )}
            {role === 'buyer' && (
              <Section title="Offres" icon={<Gavel className="w-3.5 h-3.5" />}>
                {buyerActionable.length === 0 ? <Empty /> : buyerActionable.map((o) => (
                  <Link key={o.id} href={`/offers/${o.requestId}`} onClick={() => setOpen(false)} className="block px-4 py-2 text-xs hover:bg-gray-50 dark:hover:bg-slate-700">
                    {o.partName} — {formatPrice(o.price, o.currency)}
                  </Link>
                ))}
              </Section>
            )}
            <Section title="Expirations" icon={<AlertCircle className="w-3.5 h-3.5" />}>
              {notifications.length === 0 ? <Empty /> : notifications.map((n) => (
                <button
                  key={n.id}
                  onClick={() => handleNotificationClick(n.id)}
                  className={`block w-full text-left px-4 py-2 text-xs hover:bg-gray-50 dark:hover:bg-slate-700 ${n.isRead ? 'text-gray-400 dark:text-slate-500' : 'font-semibold text-gray-900 dark:text-white'}`}
                >
                  {n.message}
                </button>
              ))}
            </Section>
            <Section title="Messages" icon={<MessageSquare className="w-3.5 h-3.5" />}>
              <Link href="/whatsapp-contact" onClick={() => setOpen(false)} className="block px-4 py-2 text-xs hover:bg-gray-50 dark:hover:bg-slate-700">
                Contacter le support (WhatsApp)
              </Link>
            </Section>
          </div>
        </>
      )}
    </div>
  );
}

function Section({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="border-b border-gray-100 dark:border-slate-700 last:border-b-0">
      <div className="px-4 pt-3 pb-1 flex items-center gap-1.5 text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wide">
        {icon} {title}
      </div>
      <div className="pb-1">{children}</div>
    </div>
  );
}

function Empty() {
  return <p className="px-4 py-2 text-xs text-gray-400 dark:text-slate-500">Rien pour l&apos;instant</p>;
}
