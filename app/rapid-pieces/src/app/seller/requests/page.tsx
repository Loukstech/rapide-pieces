'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ChevronRight, Sparkles, Package } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import { useAuth } from '@/lib/auth';
import { useRequests, useOffersForSeller } from '@/lib/store';
import { requestTitleLine, requestSubtitleLine } from '@/lib/types';

export default function SellerRequestsPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [filter, setFilter] = useState<'all' | 'new'>('all');

  const { data: allRequests, refetch: refetchRequests } = useRequests();
  const { data: sellerOffers } = useOffersForSeller(user?.id);

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'seller')) router.replace('/login');
  }, [user, isLoading, router]);

  // useRequests() se lance au montage, potentiellement avant que la session soit
  // restaurée (ouverture directe/rechargement) — la requête RLS part alors en
  // anonyme et revient vide. On relance une fois la session confirmée pour
  // éviter d'afficher "aucune demande" à tort.
  useEffect(() => {
    if (!isLoading && user) refetchRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  if (isLoading || !user) return <div className="min-h-screen bg-rp-bg flex items-center justify-center"><div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" /></div>;

  const openRequests = allRequests.filter((r) => r.status === 'open');
  const filtered = openRequests.filter((r) => (filter === 'new' ? r.responsesCount === 0 : true));
  const myOfferedRequestIds = new Set(sellerOffers.map((o) => o.requestId));

  return (
    <div className="min-h-screen bg-rp-bg">
      {/* Header */}
      <header className="bg-white backdrop-blur-xl border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/seller" className="text-gray-400 dark:text-slate-500 dark:text-slate-500 hover:text-gray-900 dark:text-white"><ArrowLeft className="w-5 h-5" /></Link>
          <h1 className="text-sm font-bold text-gray-900 dark:text-white dark:text-white flex-1">Demandes reçues</h1>
          <span className="w-6 h-6 bg-red-600 text-white text-[10px] rounded-full flex items-center justify-center font-bold">{openRequests.length}</span>
        </div>
        <div className="max-w-2xl mx-auto px-4 pb-3 flex gap-2">
          {[
            { key: 'all' as const, label: 'Toutes' },
            { key: 'new' as const, label: 'Nouvelles', icon: <Sparkles className="w-3 h-3" /> },
          ].map((f: { key: 'all' | 'new'; label: string; icon?: ReactNode }) => (
            <button key={f.key} onClick={() => setFilter(f.key)}
              className={`px-3 py-1.5 rounded-full text-[11px] font-medium transition-all flex items-center gap-1 ${
                filter === f.key ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-400 dark:text-slate-500 dark:text-slate-500 border border-gray-200'
              }`}>{f.icon}{f.label}</button>
          ))}
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-4 space-y-3 pb-24 lg:pb-6">
        {filtered.length === 0 && (
          <div className="text-center py-16 text-sm text-gray-400 dark:text-slate-500">Aucune demande pour le moment.</div>
        )}
        {filtered.map((req) => {
          // Cahier V2 : une demande sur laquelle le vendeur a déjà répondu ne
          // doit plus ressortir comme une nouvelle opportunité — plus de gras,
          // étiquetée "En attente de réponse" plutôt que "PAS D'OFFRE".
          const alreadyOffered = myOfferedRequestIds.has(req.id);
          return (
          <Link key={req.id} href={`/seller/requests/${req.id}`}
            className={`block border rounded-2xl p-4 transition-colors ${
              alreadyOffered
                ? 'bg-white dark:bg-slate-900 border-gray-100 dark:border-slate-800 hover:border-gray-200'
                : 'bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-500'
            }`}>
            <div className="flex items-start gap-3">
              {req.photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={req.photo} alt={req.partName} className="w-14 h-14 rounded-lg object-cover flex-shrink-0 border border-gray-200 dark:border-slate-600" />
              ) : (
                <div className="w-14 h-14 rounded-lg bg-gray-100 dark:bg-slate-700 flex items-center justify-center flex-shrink-0">
                  <Package className="w-5 h-5 text-gray-400 dark:text-slate-500" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h3 className={`text-sm text-gray-900 dark:text-white ${alreadyOffered ? 'font-normal' : 'font-bold'}`}>
                    {requestTitleLine(req)}
                  </h3>
                  {/* Cahier V2 : badge "PAS D'OFFRE" retiré (mal compris par les
                      utilisateurs) — seule l'étiquette "en attente de réponse"
                      reste, uniquement quand elle apporte une info utile. */}
                  {alreadyOffered && (
                    <span className="text-[8px] bg-blue-500/10 text-blue-500 border border-blue-500/30 px-1.5 py-0.5 rounded-full flex-shrink-0 font-bold">EN ATTENTE DE RÉPONSE</span>
                  )}
                </div>
                <p className="text-[10px] text-gray-400 dark:text-slate-500 mt-0.5 leading-snug line-clamp-2">{requestSubtitleLine(req, { showMissing: true })}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400 dark:text-slate-500 flex-shrink-0 mt-1" />
            </div>
          </Link>
          );
        })}
      </div>

      <BottomNav role="seller" />
    </div>
  );
}
